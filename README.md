# EPUB to PDF Converter

A simple web application that converts EPUB files to PDF format using Calibre's conversion tools.

## Prerequisites

Before using this application, you need to have Calibre installed on your system as the conversion relies on Calibre's `ebook-convert` command-line tool.

### Installing Calibre

#### Windows

1. Download Calibre from the [official website](https://calibre-ebook.com/download_windows)
2. Run the installer and follow the installation instructions
3. Make sure to add Calibre to your system PATH during installation (usually selected by default)
4. Verify installation by opening Command Prompt and typing `ebook-convert --version`

#### macOS

1. Download Calibre from the [official website](https://calibre-ebook.com/download_osx)
2. Install the application by dragging it to your Applications folder
3. The installer should automatically create the necessary symlinks for command-line tools
4. Alternatively, you can use Homebrew:

   ```bash
   brew install calibre
   ```

5. Verify installation by opening Terminal and typing `ebook-convert --version`

#### Linux

1. For Debian/Ubuntu-based distributions:

   ```bash
   sudo apt-get update
   sudo apt-get install calibre
   ```

2. For Fedora:

   ```bash
   sudo dnf install calibre
   ```

3. For other distributions, follow the [Linux installation instructions](https://calibre-ebook.com/download_linux)
4. Verify installation by opening Terminal and typing `ebook-convert --version`

## Setting Up the Application

1. Clone or download this repository
2. Make sure you have Node.js (v14 or higher) installed
3. Install the dependencies using pnpm:

   ```bash
   pnpm install
   ```
