#!/bin/bash

# Exit on error
set -e

if ! command -v ebook-convert &> /dev/null; then
    echo "Error: ebook-convert not found. Please install Calibre first." >&2
    exit 1
fi

if [ -z "$1" ]; then
    echo "Error: No input file specified" >&2
    exit 1
fi

filename="$1"
output_file="${filename%.*}.pdf"

if [ ! -f "$filename" ]; then
    echo "Error: Input file '$filename' does not exist" >&2
    exit 1
fi

# Run conversion with verbose output
ebook-convert "$filename" "$output_file" --verbose

# Verify the output file exists and has size greater than 0
if [ ! -f "$output_file" ] || [ ! -s "$output_file" ]; then
    echo "Error: PDF conversion failed or produced empty file" >&2
    exit 1
fi

echo "Successfully converted to: $output_file"