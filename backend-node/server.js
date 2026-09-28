const crypto = require('node:crypto');
const { execFile } = require('node:child_process');
const fs = require('node:fs/promises');
const path = require('node:path');
const cors = require('cors');
const express = require('express');
const multer = require('multer');

const app = express();
const port = Number(process.env.PORT) || 5000;
const projectDirectory = path.resolve(__dirname, '..');
const frontendDirectory = path.join(projectDirectory, 'frontend');
const pythonProcessorPath = path.join(projectDirectory, 'media-processor-python', 'processor.py');
const javaLoggerPath = path.join(projectDirectory, 'core-audit-java', 'AuditLogger.java');
const uploadDirectory = process.env.UPLOAD_DIRECTORY
  ? path.resolve(process.env.UPLOAD_DIRECTORY)
  : path.join(projectDirectory, 'uploads');
const assetStatePath = path.join(uploadDirectory, '.asset-state.json');
const maxUploadBytes = 25 * 1024 * 1024;
const allowedCorsOrigins = new Set((process.env.CORS_ORIGINS || '').split(',').map((origin) => origin.trim()).filter(Boolean));

const allowedExtensions = {
  logo: new Set(['.jpg', '.jpeg', '.png', '.webp']),
  background: new Set(['.jpg', '.jpeg', '.png', '.webp']),
  video: new Set(['.mp4', '.webm']),
};
const mimeTypes = {
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.png': 'image/png',
  '.webp': 'image/webp',
  '.mp4': 'video/mp4',
  '.webm': 'video/webm',
};

const storage = multer.diskStorage({
  destination(_request, _file, callback) {
    callback(null, uploadDirectory);
  },
  filename(_request, file, callback) {
    callback(null, `${crypto.randomUUID()}${path.extname(file.originalname).toLowerCase()}`);
  },
});

const mediaUpload = multer({
  storage,
  limits: { fileSize: maxUploadBytes, files: 1 },
  fileFilter(request, file, callback) {
    const assetType = request.body.assetType;
    const extension = path.extname(file.originalname).toLowerCase();
    const supportedExtensions = allowedExtensions[assetType];

    if (!supportedExtensions || !supportedExtensions.has(extension) || mimeTypes[extension] !== file.mimetype) {
      callback(Object.assign(new Error('Choose a supported image or video for the selected asset type.'), { statusCode: 400 }));
      return;
    }

    callback(null, true);
  },
});

function requireCmsKey(request, response, next) {
  const configuredKey = process.env.CMS_API_KEY;
  if (!configuredKey) {
    response.status(503).json({ success: false, error: 'CMS uploads are not configured on this server.' });
    return;
  }

  const providedKey = Buffer.from(request.get('x-cms-key') || '');
  const expectedKey = Buffer.from(configuredKey);
  if (providedKey.length !== expectedKey.length || !crypto.timingSafeEqual(providedKey, expectedKey)) {
    response.status(401).json({ success: false, error: 'The CMS access key is not valid.' });
    return;
  }

  next();
}

function runPipeline(command, args, label, options = {}) {
  execFile(command, args, { timeout: 60_000, maxBuffer: 64 * 1024, ...options }, (error, stdout, stderr) => {
    const standardOutput = stdout || '';
    const standardError = stderr || '';
    if (error) {
      console.error(`${label} failed: ${error.message}`);
      if (standardError.trim()) console.error(standardError.trim());
      return;
    }

    if (standardOutput.trim()) console.log(`${label}: ${standardOutput.trim()}`);
    if (standardError.trim()) console.warn(`${label} warning: ${standardError.trim()}`);
  });
}

async function readAssetState() {
  try {
    return JSON.parse(await fs.readFile(assetStatePath, 'utf8'));
  } catch (error) {
    if (error.code === 'ENOENT') return {};
    throw error;
  }
}

app.use('/api', cors({
  origin(origin, callback) {
    callback(null, !origin || allowedCorsOrigins.has(origin));
  },
  allowedHeaders: ['Content-Type', 'x-cms-key'],
  methods: ['GET', 'POST', 'OPTIONS'],
}));

app.get('/api/foundation/status', (_request, response) => {
  response.json({
    organizationName: 'Babira Ndeda Foundation',
    regNumber: 'SOCF-MOT7BE',
    governingAct: 'Societies Act (Cap. 108), Section 10',
    registrationDate: '2025-10-14',
    status: 'Active & Verified',
    jurisdiction: 'Vihiga County, Kenya',
  });
});

app.get('/api/documents/certificate', (_request, response, next) => {
  const certificatePath = path.join(__dirname, 'public', 'docs', 'certificate_SOCF-MOT7BE.pdf');
  response.sendFile(certificatePath, (error) => {
    if (!error) return;
    if (response.headersSent) return next(error);
    if (error.code === 'ENOENT') {
      response.status(404).json({ error: 'Certificate document unavailable' });
      return;
    }
    next(error);
  });
});

app.get('/api/health', (_request, response) => {
  response.json({ status: 'ok', service: 'babira-foundation-api' });
});

app.get('/api/assets', async (_request, response, next) => {
  try {
    response.json(await readAssetState());
  } catch (error) {
    next(error);
  }
});

app.post('/api/upload', requireCmsKey, mediaUpload.single('mediaFile'), async (request, response, next) => {
  if (!request.file) {
    response.status(400).json({ success: false, error: 'Select a file to upload.' });
    return;
  }

  try {
    const assets = await readAssetState();
    const asset = {
      filePath: `/uploads/${request.file.filename}`,
      originalName: path.basename(request.file.originalname),
      updatedAt: new Date().toISOString(),
    };
    if (request.body.assetType === 'background') delete assets.video;
    if (request.body.assetType === 'video') delete assets.background;
    assets[request.body.assetType] = asset;
    await fs.writeFile(assetStatePath, JSON.stringify(assets, null, 2));

    runPipeline('python3', [pythonProcessorPath, request.file.path, request.body.assetType], 'Python media pipeline');
    runPipeline('java', [javaLoggerPath, 'MEDIA_UPLOAD', request.body.assetType, request.file.filename], 'Java audit logger', { cwd: __dirname });

    response.status(202).json({
      success: true,
      message: 'Asset uploaded and activated; processing and audit have started.',
      assetType: request.body.assetType,
      ...asset,
    });
  } catch (error) {
    await fs.unlink(request.file.path).catch(() => {});
    next(error);
  }
});

app.use('/uploads', express.static(uploadDirectory, {
  dotfiles: 'deny',
  index: false,
  setHeaders(response) {
    response.setHeader('X-Content-Type-Options', 'nosniff');
  },
}));
app.use(express.static(frontendDirectory));

app.use((error, _request, response, _next) => {
  if (response.headersSent) return;
  const isUploadLimit = error instanceof multer.MulterError && error.code === 'LIMIT_FILE_SIZE';
  const statusCode = isUploadLimit ? 413 : error.statusCode || 500;
  response.status(statusCode).json({
    success: false,
    error: isUploadLimit ? 'Files must be 25 MB or smaller.' : statusCode === 500 ? 'The request could not be completed.' : error.message,
  });
});

fs.mkdir(uploadDirectory, { recursive: true }).then(() => {
  app.listen(port, () => {
    console.log(`Babira Foundation site and API listening on port ${port}`);
  });
}).catch((error) => {
  console.error('Could not prepare media storage:', error);
  process.exitCode = 1;
});
