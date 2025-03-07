import express, { Request, Response } from 'express'
import multer from 'multer'
import { exec } from 'child_process'
import path from 'path'
import fs from 'fs'
import os from 'os'

const app = express()
const port = 3000

// Serve static files from the root directory
app.use(express.static(path.join(__dirname)))

// Serve the main page
app.get('/', (_: Request, res: Response) => {
	res.sendFile(path.join(__dirname, 'index.html'))
})

const UPLOAD_FOLDER = 'uploads'
fs.mkdirSync(UPLOAD_FOLDER, { recursive: true })

const storage = multer.diskStorage({
	destination: (_, __, cb) => {
		cb(null, UPLOAD_FOLDER)
	},
	filename: (_, file, cb) => {
		cb(null, file.originalname)
	}
})

const upload = multer({ storage: storage })

// Get platform-specific command to check for ebook-convert
const getEbookConvertCheckCommand = () => {
	const platform = os.platform()
	switch (platform) {
		case 'win32':
			return 'where ebook-convert'
		default: // darwin, linux, etc.
			return 'which ebook-convert'
	}
}

// Get platform-specific command to convert epub to pdf
const getConversionCommand = (inputPath: string, outputPath: string) => {
	const escapedInputPath = inputPath.replace(/"/g, '\\"')
	const escapedOutputPath = outputPath.replace(/"/g, '\\"')

	const platform = os.platform()
	if (platform === 'win32') {
		// Windows
		return `ebook-convert "${escapedInputPath}" "${escapedOutputPath}" --verbose`
	} else {
		// macOS, Linux
		return `ebook-convert "${escapedInputPath}" "${escapedOutputPath}" --verbose`
	}
}

app.post('/convert', upload.single('epubFile'), (req: Request, res: Response) => {
	if (!req.file) {
		return res.status(400).json({ error: 'No file uploaded.' })
	}

	const filePath = req.file.path
	const fileName = req.file.filename
	const baseName = path.basename(fileName, path.extname(fileName))
	const outputPath = path.join(UPLOAD_FOLDER, `${baseName}.pdf`)

	// First check if ebook-convert is available
	exec(getEbookConvertCheckCommand(), (checkError) => {
		if (checkError) {
			console.error(`Calibre check error: ${checkError.message}`)
			try {
				fs.unlinkSync(filePath)
			} catch (e) {
				console.error('Error cleaning up input file:', e)
			}
			return res
				.status(500)
				.json({ error: 'Calibre is not installed or not in PATH. Please install Calibre first.' })
		}

		// If ebook-convert is available, proceed with conversion
		const command = getConversionCommand(filePath, outputPath)

		exec(command, (error, stdout, stderr) => {
			if (error) {
				console.error(`Conversion error: ${error.message}`)
				console.error(`Standard error output: ${stderr}`)
				console.error(`Standard output: ${stdout}`)

				// Clean up the input file
				try {
					fs.unlinkSync(filePath)
				} catch (e) {
					console.error('Error cleaning up input file:', e)
				}

				return res.status(500).json({ error: `Conversion failed: ${stderr || error.message}` })
			}

			// Verify the PDF exists and is not empty
			try {
				const stats = fs.statSync(outputPath)
				if (stats.size === 0) {
					fs.unlinkSync(outputPath)
					fs.unlinkSync(filePath)
					return res.status(500).json({ error: 'Conversion failed: Generated PDF is empty' })
				}
			} catch (err) {
				console.error('Error checking PDF:', err)
				try {
					fs.unlinkSync(filePath)
				} catch (e) {
					console.error('Error cleaning up input file:', e)
				}
				return res.status(500).json({ error: 'Conversion failed: PDF was not generated' })
			}

			res.download(outputPath, `${baseName}.pdf`, (err) => {
				if (err) {
					console.error('Download error:', err)
					res.status(500).json({ error: 'Error downloading file.' })
				} else {
					// Clean up files after download
					try {
						fs.unlinkSync(filePath)
						fs.unlinkSync(outputPath)
					} catch (e) {
						console.error('Error cleaning up files:', e)
					}
				}
			})
		})
	})
})

app.listen(port, () => {
	console.log(`Server running at http://localhost:${port}`)
})
