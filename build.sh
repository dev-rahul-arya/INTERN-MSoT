#!/bin/bash
set -e

echo "Starting global build..."

rm -rf dist
mkdir dist

# Copy homepage if it exists
if [ -f "index.html" ]; then
  cp index.html dist/index.html
fi

# Loop through all folders
for dir in */ ; do
  # Only build folders that contain a package.json
  if [ -f "$dir/package.json" ]; then
    echo "Building $dir"

    cd "$dir"

    npm install --no-audit --no-fund
    npm run build

    cd ..

    mkdir -p "dist/$dir"
    cp -r "$dir/dist/"* "dist/$dir"
  fi
done

echo "Build finished successfully."
