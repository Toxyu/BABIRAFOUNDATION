# BABIRAFOUNDATION

Empowering Youth. Advancing Education. Promoting Community Health.

## Project structure

- `frontend/` contains the static foundation website.
- `backend-node/` serves the site, authenticates CMS uploads, and orchestrates media processing and audit logging.
- `media-processor-python/` optimizes uploaded images with Pillow and inventories media directories.
- `core-audit-java/` appends media upload events to `system_audit.log`.
- `.github/workflows/` contains the GitHub Pages deployment and media checks.

## Run locally

Install the image processor dependency with `python3 -m pip install -r media-processor-python/requirements.txt`.

Start the site and API with `cd backend-node && CMS_API_KEY='replace-with-a-long-random-key' npm start`. Open `http://localhost:5000`; the health endpoint is at `/api/health`. Set the same key in the CMS portal to upload media. Uploaded assets are stored in the ignored `uploads/` directory by default. Python 3 and Java 11 or newer are required for the upload processing and audit hooks.

For a separate frontend origin, set `CORS_ORIGINS` to a comma-separated list of allowed origins. The default same-origin setup does not require CORS configuration.

Optimize an image with `python media-processor-python/processor.py <file> <logo|background>`, queue a video with `python media-processor-python/processor.py <file> video`, or inventory a directory with `python media-processor-python/processor.py <directory>`.

Compile and run the audit logger with `javac core-audit-java/AuditLogger.java && java -cp core-audit-java AuditLogger`.

## Public website

The static website is published from `frontend/` at https://toxyu.github.io/BABIRAFOUNDATION/ by the GitHub Actions workflow. CMS uploads use Supabase Storage and Auth directly, so the static site does not require the Node server to upload assets. GitHub Pages does not run the Node.js, Python, or Java services; those pipelines remain available for a separately hosted backend.

To configure the CMS, run or rerun `supabase/setup.sql` in the Supabase SQL Editor to create the public media bucket, integer-keyed overview record, and blog tables with row-level security. Existing CLI-managed databases can apply migrations with `npx supabase link --project-ref nwhspxhnjutotzyztzfg` followed by `npx supabase db push`; CLI authentication and the database password are required. Then create/invite an admin user in Supabase Auth and disable public sign-ups. Admins can update the overview, write and publish stories, and upload media. Visitors can read the overview, published stories, and media; content writes require an authenticated user. Configure the Supabase Auth site URL and allowed redirect URLs for `https://toxyu.github.io/BABIRAFOUNDATION/`.
