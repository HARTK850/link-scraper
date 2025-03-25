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
                const response = await fetch(url);
                const text = await response.text();
                const parser = new DOMParser();
                const doc = parser.parseFromString(text, 'text/html');

                const content = doc.documentElement.innerHTML;
                const tempElement = document.createElement('div');
                tempElement.innerHTML = content;

                html2pdf().from(tempElement).save(`page_${i + 1}.pdf`);
            } catch (error) {
                console.error("שגיאה בהורדת הדף:", error);
            }
        }
    }
}
