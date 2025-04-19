// function changeTheme(textColor: string, backgroundColor: string): void {
//     // Thay đổi màu nền của toàn bộ trang
//     document.body.style.backgroundColor = backgroundColor;

//     // Chọn tất cả các phần tử trên trang
//     const allElements = document.querySelectorAll('*');

//     // Thay đổi màu chữ của tất cả các phần tử
//     allElements.forEach(element => {
//         (element as HTMLElement).style.color = textColor;
//     });
// }

// const applyColorsToDOM = (textColor: string, backgroundColor: string) => {
//     const allElements = document.querySelectorAll('*');
//     allElements.forEach((element: Element) => {
//         (element as HTMLElement).style.color = textColor;
//         (element as HTMLElement).style.backgroundColor = backgroundColor;
//     });
// };

// // Lắng nghe tin nhắn từ popup
// chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
//     if (request.action === "changeColors") {
//         applyColorsToDOM(request.textColor, request.backgroundColor);
//     }
// });

chrome.runtime.onMessage.addListener(
    (request, sender, sendResponse) => {
        if (request.action === 'applyColors') {
            // const { textColor, backgroundColor } = request.colors;
            const textColor = request.textColor || '#000000'; // Default text color
            const backgroundColor = request.backgroundColor || '#ffffff'; // Default background color
            applyColorsToDOM(textColor, backgroundColor);
        } else if (request.action === 'applyStoredColors') {
            chrome.storage.local.get(['textColor', 'backgroundColor'], (result) => {
const storedTextColor = result.textColor || '#000000';
const storedBackgroundColor = result.backgroundColor || '#ffffff';
                applyColorsToDOM(storedTextColor, storedBackgroundColor);
            });
        }
    }
);

const applyColorsToDOM = (textColor: string, backgroundColor: string) => {
    const allElements = document.querySelectorAll('*');
    allElements.forEach((element: Element) => {
        (element as HTMLElement).style.color = textColor;
        (element as HTMLElement).style.backgroundColor = backgroundColor;
    });
};

// Apply stored colors when content script is loaded
chrome.runtime.sendMessage({ action: 'getStoredColors' });

chrome.storage.local.get(['textColor', 'backgroundColor'], (result) => {
    const storedTextColor = result.textColor || '#000000';
    const storedBackgroundColor = result.backgroundColor || '#ffffff';
    applyColorsToDOM(storedTextColor, storedBackgroundColor);
});