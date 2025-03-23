const express = require('express');
const puppeteer = require('puppeteer');
const fs = require('fs');
const archiver = require('archiver');
const path = require('path');

const app = express();
app.use(express.json());
app.use(express.static('public'));

app.post('/download', async (req, res) => {
    const { links, format } = req.body;
    const browser = await puppeteer.launch({ headless: true });
    const page = await browser.newPage();

    let zipPath = path.join(__dirname, 'downloads', 'pages.zip');
    let output = fs.createWriteStream(zipPath);
    let archive = archiver('zip');
    archive.pipe(output);

    for (let i = 0; i < links.length; i++) {
        let url = links[i].trim();
        if (!url.startsWith('http')) url = 'https://' + url;

        await page.goto(url, { waitUntil: 'networkidle2' });

        let scrollHeight = await page.evaluate(() => document.body.scrollHeight);
        await page.evaluate(`window.scrollTo(0, ${scrollHeight})`);
        await page.waitForTimeout(2000); 

        let filePath = path.join(__dirname, 'downloads', `page_${i}.${format}`);
        if (format === 'pdf') {
            await page.pdf({ path: filePath, format: 'A4' });
        } else {
            let content = await page.content();
            fs.writeFileSync(filePath, content);
        }
        archive.file(filePath, { name: `page_${i}.${format}` });
    }

    await browser.close();
    archive.finalize();
    output.on('close', () => res.download(zipPath));
});

app.listen(3000, () => console.log('Server running on port 3000'));
