const express = require("express");
const puppeteer = require("puppeteer");
const bodyParser = require("body-parser");
const cors = require("cors");
const fs = require("fs");
const path = require("path");

const app = express();
const PORT = 3000;

app.use(cors());
app.use(bodyParser.json());
app.use(express.static("public")); // נשתמש בתקייה public כדי לאפשר גישה לקבצים

app.post("/download", async (req, res) => {
    const { links, format } = req.body;

    if (!links || links.length === 0) {
        return res.status(400).json({ error: "לא הוזנו קישורים" });
    }

    const browser = await puppeteer.launch();
    const page = await browser.newPage();

    const downloads = [];

    for (let i = 0; i < links.length; i++) {
        const url = links[i];
        const filename = `download_${i}.${format === "pdf" ? "pdf" : "html"}`;
        const filepath = path.join(__dirname, "public", filename);

        try {
            await page.goto(url, { waitUntil: "networkidle2" });

            // גלילה עד הסוף
            await autoScroll(page);

            if (format === "pdf") {
                await page.pdf({ path: filepath, format: "A4" });
            } else {
                const content = await page.content();
                fs.writeFileSync(filepath, content);
            }

            downloads.push(`/${filename}`);
        } catch (error) {
            console.error("שגיאה בטעינת הדף:", url, error);
        }
    }

    await browser.close();
    res.json({ downloads });
});

// פונקציה לגלילה עד תחתית הדף
async function autoScroll(page) {
    await page.evaluate(async () => {
        await new Promise((resolve) => {
            let totalHeight = 0;
            const distance = 100;
            const timer = setInterval(() => {
                const scrollHeight = document.body.scrollHeight;
                window.scrollBy(0, distance);
                totalHeight += distance;

                if (totalHeight >= scrollHeight) {
                    clearInterval(timer);
                    resolve();
                }
            }, 200);
        });
    });
}

app.listen(PORT, () => {
    console.log(`השרת רץ בכתובת: http://localhost:${PORT}`);
});
