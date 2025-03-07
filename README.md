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
4. Verify installation by opening Terminal and typing `ebook-convert --version`

#### Linux

1. For Debian/Ubuntu-based distributions:

   ```
   sudo apt-get update
   sudo apt-get install calibre
   ```

2. For Fedora:

   ```
   sudo dnf install calibre
   ```

3. For other distributions, follow the [Linux installation instructions](https://calibre-ebook.com/download_linux)
4. Verify installation by opening Terminal and typing `ebook-convert --version`

## Setting Up the Application

1. Clone or download this repository
2. Make sure you have Node.js (v14 or higher) installed
3. Install the dependencies:

Using npm:

```
npm install
```

Using pnpm:

```
pnpm install
```

## Running the Application

1. Start the server:

Using npm:

```
npm start
```

Using pnpm:

```
pnpm start
```

2. Open your web browser and navigate to:

```
http://localhost:3000
```

3. Upload an EPUB file using the provided form
4. The application will convert the file to PDF and automatically initiate a download

## Development

To run the application in development mode with automatic reloading:

Using npm:

```
npm run dev
```

Using pnpm:

```
pnpm dev
```

## Troubleshooting

### Calibre Installation Issues

- **Windows**: Make sure the Calibre installation directory is in your system PATH

  - Check by running `where ebook-convert` in Command Prompt
  - If not found, add the Calibre installation directory (typically `C:\Program Files\Calibre2`) to your PATH

- **macOS**: If `ebook-convert` command is not found:

  ```
  sudo ln -s /Applications/calibre.app/Contents/MacOS/ebook-convert /usr/local/bin/
  ```

- **Linux**: If you installed Calibre using a package manager and the command is not found, try installing it from the official website instead

### Conversion Issues

- If you encounter conversion errors, check the Calibre console for more detailed error messages
- Make sure your EPUB file is valid and not corrupted
- For large files, the conversion may take longer

## License

This project is open-source and available under the MIT License.
