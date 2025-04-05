// content.ts
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.font && message.color) {
        document.body.style.fontFamily = message.font;
        document.body.style.color = message.color;

        // Thay đổi màu sắc cho các phần tử khác như tiêu đề
        const headers = document.querySelectorAll('h1, h2, h3');
        headers.forEach((header) => {
            (header as HTMLElement).style.color = message.color;
        });
    }
});