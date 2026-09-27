"""Optimize uploaded image assets or inventory a media directory."""

import argparse
import sys
from pathlib import Path
from PIL import Image, ImageEnhance


def process_image(file_path, asset_type):
    if not file_path.is_file():
        raise FileNotFoundError(f"Media file not found: {file_path}")

    if asset_type == "video":
        print(f"[Python Engine] Video media queued for processing pipeline: {file_path}")
        return

    if asset_type not in ("background", "logo"):
        print("[Python Engine] File uploaded without specialized transformation requirement.")
        return

    with Image.open(file_path) as source:
        image_format = source.format
        if image_format not in ("JPEG", "PNG", "WEBP"):
            raise ValueError(f"Unsupported image format: {image_format or 'unknown'}")

        if asset_type == "background":
            image = ImageEnhance.Brightness(source).enhance(0.7)
        else:
            image = source.copy()
            image.thumbnail((300, 300))

    if image_format == "JPEG":
        if image.mode not in ("RGB", "L"):
            image = image.convert("RGB")
        image.save(file_path, format=image_format, quality=85, optimize=True)
    elif image_format == "WEBP":
        image.save(file_path, format=image_format, quality=85, method=6)
    else:
        image.save(file_path, format=image_format, optimize=True)

    description = "Background image successfully processed" if asset_type == "background" else "Logo graphic optimized"
    print(f"[Python Engine] {description}: {file_path}")


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("input", type=Path, help="Media file or directory to inspect")
    parser.add_argument("asset_type", nargs="?", choices=("logo", "background", "video", "general"), default="general")
    args = parser.parse_args()

    if not args.input.exists():
        parser.error(f"input path does not exist: {args.input}")

    if args.input.is_file():
        try:
            process_image(args.input, args.asset_type)
        except (OSError, ValueError) as error:
            print(f"[Python Pipeline Error] {error}", file=sys.stderr)
            return 1
        return 0

    if not args.input.is_dir():
        parser.error(f"input path is not a regular file or directory: {args.input}")

    files = sorted(path for path in args.input.rglob("*") if path.is_file())
    for path in files:
        print(f"asset_type={args.asset_type}\t{path.relative_to(args.input)}\t{path.stat().st_size} bytes")
    print(f"Found {len(files)} file(s).")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
