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
                // יצירת iframe
                const iframe = document.createElement('iframe');
                iframe.style.position = 'absolute';
                iframe.style.left = '-9999px';
                document.body.appendChild(iframe);

                iframe.onload = function () {
                    setTimeout(() => {
                        html2pdf().from(iframe.contentDocument.body).save(`page_${i + 1}.pdf`);
                        document.body.removeChild(iframe);
                    }, 3000); // זמן טעינה נוסף למניעת בעיות טעינה
                };

                iframe.src = url; // טוען את הדף בתוך iframe
            } catch (error) {
                console.error("שגיאה בהורדת הדף:", error);
            }
        }
    }
}
