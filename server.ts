import express, { Request, Response } from 'express'
import multer from 'multer'
import { exec } from 'child_process'
import path from 'path'
import fs from 'fs'

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

app.post('/convert', upload.single('epubFile'), (req: Request, res: Response) => {
	if (!req.file) {
		return res.status(400).json({ error: 'No file uploaded.' })
	}

	const filePath = req.file.path
	const fileName = req.file.filename
	const baseName = path.basename(fileName, path.extname(fileName))
	const bashScriptPath = path.join(__dirname, 'convert.sh')

	const command = `bash "${bashScriptPath}" "${filePath}"`

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

			// Check if the error message indicates Calibre is not installed
			if (stderr.includes('ebook-convert not found')) {
				return res
					.status(500)
					.json({ error: 'Calibre is not installed. Please install Calibre first.' })
			}

			return res.status(500).json({ error: `Conversion failed: ${stderr || error.message}` })
		}

		const pdfPath = path.join(UPLOAD_FOLDER, `${baseName}.pdf`)

		// Verify the PDF exists and is not empty
		try {
			const stats = fs.statSync(pdfPath)
			if (stats.size === 0) {
				fs.unlinkSync(pdfPath)
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

		res.download(pdfPath, `${baseName}.pdf`, (err) => {
			if (err) {
				console.error('Download error:', err)
				res.status(500).json({ error: 'Error downloading file.' })
			} else {
				// Optional: Clean up the files after download
				fs.unlinkSync(filePath)
				fs.unlinkSync(pdfPath)
			}
		})
	})
})

app.listen(port, () => {
	console.log(`Server running at http://localhost:${port}`)
})
