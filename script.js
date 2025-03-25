async function downloadPages() {
    const links = document.getElementById('linksInput').value.trim().split(/\s*\n\s*/);
    if (links.length === 0 || links[0] === "") {
        alert("נא להזין לפחות קישור אחד!");
        return;
    }

    for (let i = 0; i < links.length; i++) {
        const url = links[i].trim();
        if (url) {
            try {
                const response = await fetch(`https://api.pdfcrowd.com/convert/uri/?url=${encodeURIComponent(url)}`);
                const blob = await response.blob();
                const link = document.createElement('a');
                link.href = URL.createObjectURL(blob);
                link.download = `page_${i + 1}.pdf`;
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
            } catch (error) {
                console.error("שגיאה בהורדת הדף:", error);
            }
        }
    }
}
