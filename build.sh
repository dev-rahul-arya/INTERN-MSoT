#!/bin/bash

rm -rf dist
mkdir dist

# Copy homepage
cp index.html dist/index.html

# Build each project
for dir in project1 project2 project3
do
  echo "Building $dir"
  cd $dir
  npm install
  npm run build
  cd ..

  mkdir -p dist/$dir
  cp -r $dir/dist/* dist/$dir/
done
