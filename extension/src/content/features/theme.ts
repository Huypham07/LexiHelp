import browser from "webextension-polyfill";
import { getTextColorByHex, getBackgroundColor } from "@/utils/color";
import { splitIntoPseudoSyllables } from "@/utils/word";
// Changing text and background color

let isColorCodingEnabled = false;
browser.runtime.onMessage.addListener(
  (
    request: { action: string; textColor: string; backgroundColor: string; colorCodingEnabled: boolean },
    sendResponse
  ) => {
    if (request.action === "applyColors") {
      // const { textColor, backgroundColor } = request.colors;
      const textColor = request.textColor || ""; // Default text color
      const backgroundColor = request.backgroundColor || ""; // Default background color
      applyColorsToDOM(textColor, backgroundColor);

      if (isColorCodingEnabled) {
        // Tắt đi để xóa các span cũ
        toggleColorCoding(false);
        toggleColorCoding(true);
        // Bật lại để tạo span mới với màu từ bộ màu color coding
        // setTimeout(() => toggleColorCoding, 50);
      }
    } else if (request.action === "setColorCoding") {
      isColorCodingEnabled = request.colorCodingEnabled;
      toggleColorCoding(request.colorCodingEnabled);
    }
  }
);

const applyColorsToDOM = (textColor: string, backgroundColor: string) => {
  // Add a fullscreen overlay to ensure the entire page gets the background color
  let overlay = document.getElementById("theme-extension-overlay");
  if (!overlay) {
    overlay = document.createElement("div");
    overlay.id = "theme-extension-overlay";
    document.body.appendChild(overlay);
  }
  
  // Style the overlay to cover the entire page
  overlay.style.position = "fixed";
  overlay.style.top = "0";
  overlay.style.left = "0";
  overlay.style.width = "100vw";
  overlay.style.height = "100vh";
  overlay.style.backgroundColor = backgroundColor;
  overlay.style.zIndex = "-9999"; // Behind all content
  overlay.style.pointerEvents = "none"; // Don't block interactions
  
  // Apply styles to the html and body elements
  document.documentElement.style.setProperty("background-color", backgroundColor, "important");
  document.body.style.setProperty("background-color", backgroundColor, "important");
  document.body.style.setProperty("color", textColor, "important");
  
  // Apply a CSS class to the body for more control
  const styleId = "theme-extension-styles";
  let styleElement = document.getElementById(styleId) as HTMLStyleElement;
  
  if (!styleElement) {
    styleElement = document.createElement("style");
    styleElement.id = styleId;
    document.head.appendChild(styleElement);
  }
  
  // Use CSS to override background colors more aggressively
  styleElement.textContent = `
    html, body {
      background-color: ${backgroundColor} !important;
      color: ${textColor} !important;
    }

    /* Override common elements that might have their own background */
    div, section, article, aside, nav, header, footer, main {
      background-color: ${backgroundColor} !important;
      color: ${textColor} !important;
    }
    
    /* Ensure text elements get the proper color */
    p, span, h1, h2, h3, h4, h5, h6, li, a, button, input, textarea, label, th, td {
      background-color: ${backgroundColor} !important;
      color: ${textColor} !important;
    }
  `;
};

// Color coding for dyslexia
const colorPalette = [
  "#A0C4FF", // Màu xanh dương nhạt
  "#678CB1", // Màu xanh dương-xám,
  "#FFB29B", // Màu cam nhạt
];


// Map để lưu trữ node văn bản gốc và nội dung gốc của nó
const originalTextNodes = new Map<Text, string>();

// Hàm để xác định màu cho một âm tiết dựa trên phonetic mapping
function getColorForSyllable(syllable: string, position: number): string {
  // Sử dụng vị trí của âm tiết để xác định màu, giúp tạo mẫu xen kẽ
  return colorPalette[position % colorPalette.length];
}

// Hàm tô màu một node văn bản dựa trên các nhóm phonetic
function colorizeTextNode(node: Text) {
  const text: string = node.nodeValue || "";
  const wordsAndSpaces = text.split(/(\s+)/);
  const fragment = document.createDocumentFragment();
  
  wordsAndSpaces.forEach((part: string) => {
    if (part.match(/^\s+$/)) {
      // Preserve whitespace
      fragment.appendChild(document.createTextNode(part));
    } else if (part.length > 0) {
      const isWord = /[a-zA-Z0-9]/.test(part);
      
      if (isWord) {
        // Split word into syllables
        const syllables = splitIntoPseudoSyllables(part);
        
        // Apply alternating colors to syllables
        syllables.forEach((syllable, index) => {
          const span = document.createElement("span");
          span.textContent = syllable;
          
          // Simple alternating color scheme
          const colorIndex = index % colorPalette.length;
          span.style.setProperty("color", colorPalette[colorIndex], "important");
          span.classList.add("dyslexia-color-syllable");
          fragment.appendChild(span);
        });
      } else {
        // Preserve punctuation and other non-word characters
        fragment.appendChild(document.createTextNode(part));
      }
    }
  });

  // Store original node and text
  originalTextNodes.set(node, text);
  
  // Replace original node with the colored fragment
  node.parentNode?.replaceChild(fragment, node);
}

// Hàm khôi phục văn bản gốc từ các span đã tạo
function restoreTextNode(node: Node) {
  // Tìm node văn bản gốc trong map dựa trên node hiện tại (có thể là parent của spans)
  // Cách khôi phục này hiệu quả hơn khi duyệt lại DOM
  if (node.nodeType === Node.ELEMENT_NODE) {
    const element = node as Element;
    const spans = element.querySelectorAll("span.dyslexia-color-syllable");

    if (spans.length > 0) {
      spans.forEach((span) => {
        const parent = span.parentNode;
        if (parent) {
          // Lấy toàn bộ nội dung text gốc từ span
          const textContent = span.textContent || "";
          // Tạo text node mới với nội dung gốc
          const textNode = document.createTextNode(textContent);
          // Thay thế span bằng text node
          parent.replaceChild(textNode, span);
          // Xóa span khỏi DOM
          span.remove();
          parent.normalize(); // Gom các text node liền kề
        }
      });
    }
  } else if (node.nodeType === Node.TEXT_NODE) {
    // Trường hợp node là text node gốc đã được khôi phục trước đó
    // hoặc là text node chưa bao giờ được xử lý
    // Không làm gì trong hàm khôi phục này
  }
}

// Duyệt qua các node trong cây DOM
function traverseAndProcess(node: Node, enable: boolean) {
  // Tránh xử lý các thẻ script, style, iframe, vv.
  if (node.nodeType === Node.ELEMENT_NODE) {
    const element = node as Element;
    if (
      element.tagName === "SCRIPT" ||
      element.tagName === "STYLE" ||
      element.tagName === "IFRAME" ||
      element.tagName === "CANVAS" ||
      element.tagName === "NOSCRIPT"
    ) {
      return; // Bỏ qua các thẻ này
    }

    if (!enable) {
      // Nếu tắt, thử khôi phục các span trong element này trước
      restoreTextNode(node);
    }
  }

  if (node.nodeType === Node.TEXT_NODE && node.nodeValue && node.nodeValue.trim().length > 0) {
    // Đảm bảo text node không phải là con của các span đã tạo bởi extension
    if (
      (node.parentNode && (node.parentNode as Element).tagName !== "SPAN") ||
      !(node.parentNode as Element).classList.contains("dyslexia-color-syllable")
    ) {
      if (enable) {
        colorizeTextNode(node as Text);
      }
    }
  } else {
    // Duyệt qua các node con
    // Sao chép danh sách con để tránh lỗi khi thay đổi DOM trong lúc duyệt
    const children = Array.from(node.childNodes);
    for (const child of children) {
      traverseAndProcess(child, enable);
    }
  }
}

// Hàm chính để bật/tắt mã màu
function toggleColorCoding(enable: boolean) {
  if (enable) {
    // Color code all text nodes
    traverseAndProcess(document.body, true);
    
    // Add subtle enhancement style
    let enhancementStyle = document.getElementById("dyslexia-enhancement-style");
    if (!enhancementStyle) {
      enhancementStyle = document.createElement("style");
      enhancementStyle.id = "dyslexia-enhancement-style";
      enhancementStyle.textContent = `
        .dyslexia-color-syllable {
          transition: all 0.2s ease-in-out;
          display: inline-block;
        }
        .dyslexia-color-syllable:hover {
          transform: scale(1.05);
          font-weight: bold;
        }
      `;
      document.head.appendChild(enhancementStyle);
    }
  } else {
    // When disabling, restore all text nodes
    traverseAndProcess(document.body, false);
    
    // Remove enhancement style
    const enhancementStyle = document.getElementById("dyslexia-enhancement-style");
    if (enhancementStyle) {
      enhancementStyle.remove();
    }

    // Final cleanup of any remaining nodes
    originalTextNodes.forEach((originalText, textNode) => {
      if (textNode.parentNode) {
        try {
          const newNode = document.createTextNode(originalText);
          textNode.parentNode.replaceChild(newNode, textNode);
        } catch (e) {
          console.error("Error during text node restoration:", e);
        }
      }
    });
    originalTextNodes.clear();
  }
}

export async function applyThemeToTab(tabId: number, enabled: boolean, theme?: string) {
  console.log("applyThemeToTab", tabId, enabled, theme);
  const storage = await browser.storage.local.get(["theme", "textColor", "backgroundColor", "colorCodingEnabled"]);
  isColorCodingEnabled = storage.colorCodingEnabled as boolean;

  const currentTheme = theme || storage.theme;
  const textColor = getTextColorByHex(currentTheme as string);
  const backgroundColor = getBackgroundColor(currentTheme as string);

  if (!enabled) {
    await browser.scripting.executeScript({
      target: { tabId },
      func: () => {
        // Remove the overlay if it exists
        const overlay = document.getElementById("theme-extension-overlay");
        if (overlay) {
          overlay.remove();
        }
        
        // Remove the style element
        const styleElement = document.getElementById("theme-extension-styles");
        if (styleElement) {
          styleElement.remove();
        }
        
        // Remove the enhancement style
        const enhancementStyle = document.getElementById("dyslexia-enhancement-style");
        if (enhancementStyle) {
          enhancementStyle.remove();
        }
        
        // Reset the entire page's styles
        document.documentElement.style.removeProperty("background-color");
        document.body.style.removeProperty("background-color");
        document.body.style.removeProperty("color");
        
        // Reset any element-specific overrides
        document.querySelectorAll("*").forEach((el) => {
          if (el instanceof HTMLElement) {
            el.style.removeProperty("color");
            el.style.removeProperty("background-color");
          }
        });
      },
    });
  } else {
    await browser.tabs.sendMessage(tabId, {
      action: "applyColors",
      textColor,
      backgroundColor,
    });
  }

  // Lưu nếu có theme mới
  if (theme) {
    await browser.storage.local.set({
      textColor,
      backgroundColor,
      theme,
    });
  }
}

export async function applyColorCodingToTab(tabId: number, colorCodingEnabled: boolean) {
  await browser.tabs.sendMessage(tabId, {
    action: "setColorCoding",
    colorCodingEnabled,
  });
}