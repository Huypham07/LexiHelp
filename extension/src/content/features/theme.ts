import browser from "webextension-polyfill";
import { getTextColorByHex, getBackgroundColor } from "@/utils/utils";
// Changing text and background color
browser.runtime.onMessage.addListener(
  (
    request: { action: string; textColor: string; backgroundColor: string; enable: boolean; enabled: boolean },
    sendResponse
  ) => {
    if (request.action === "applyColors") {
      // const { textColor, backgroundColor } = request.colors;
      const textColor = request.textColor || ""; // Default text color
      const backgroundColor = request.backgroundColor || ""; // Default background color
      applyColorsToDOM(textColor, backgroundColor);
    } else if (request.action === "setColorCoding") {
      toggleColorCoding(request.enabled);
    }
  }
);

const applyColorsToDOM = (textColor: string, backgroundColor: string) => {
  const textElements = document.querySelectorAll("p, span, h1, h2, h3, h4, h5, h6, li, a");
  textElements.forEach((element: Element) => {
    const htmlElement = element as HTMLElement;
    // Kiểm tra nếu phần tử có nội dung văn bản
    if (htmlElement.innerText.trim().length > 0) {
      htmlElement.style.backgroundColor = backgroundColor; // Chỉ thay đổi màu nền
      htmlElement.style.color = textColor; // Thay đổi màu chữs
    }
  });
};

// Color coding for dyslexia

// Bộ màu gợi ý (có thể thay đổi)
// Sử dụng các màu dịu, tương phản vừa phải
const colorPalette: string[] = [
  "#1f78b4", // Blue
  "#ff7f00", // Orange
  "#33a02c", // Green
  "#e31a1c", // Red (dùng cẩn thận, tránh cạnh xanh lá)
];

const colorPalette1: string[] = [
  "#FFEB3B", // Yellow
  "#FF5722", // Deep Orange
  "#2196F3", // Blue
  "#9C27B0", // Purple
];

// Hợp với nền sáng, tệ với nền tối
const colorPalette2: string[] = [
  "#424242", // Dark Gray
  "#5e35b1", // Dark Purple
  "#d84315", // Orange Red
  "#00897b", // Teal
];

const colorPalette5: string[] = [
  "fffacd", // Lemon Chiffon
  "4682b4", // Dark Slate Blue
  "ffddee", // Lavender Blush
  "d2b48c", // Tan
];

const colorPalette3 = [
  "#4fc3f7", // blue
  "#81c784", // green
  "#ba68c8", // purple
  "#fff176", // yellow
  "#e57373", // red
  "#ffB74d", // orange
  "#f48fb1", // pink
];

// Hợp nền tối
const colorPalette4 = [
  // "#2979ff", // hot blue
  // "#f57c00", // orange
  // "#388e3C", // green
  // "#c2185b", // pinkXanh dương đậm: #005566
  "#F28C38", // Cam
  "#AB47BC", // Tím
  "#66BB6A", // Xanh lá
  "#455A64", // Xám đen
];

// Map để lưu trữ node văn bản gốc và nội dung gốc của nó
const originalTextNodes = new Map<Text, string>();

function getPseudoSyllables(text: string): string[] {
  const vowels = "aeiouy";
  const digraphs = [
    "th",
    "wh",
    "qu",
    "sp",
    "st",
    "tr",
    "bl",
    "cl",
    "fl",
    "pl",
    "sl",
    "br",
    "cr",
    "dr",
    "fr",
    "gr",
    "pr",
    "sw",
    "tw",
  ];

  const syllables: string[] = [];
  let i = 0;

  while (i < text.length) {
    // // Ưu tiên kiểm tra digraph trước
    // const pair = text.substring(i, i + 2).toLowerCase();
    // if (digraphs.includes(pair)) {
    //     syllables.push(text.substring(i, i + 2));
    //     i += 2;
    //     continue;
    // }

    // Nếu là nguyên âm
    if (vowels.includes(text[i].toLowerCase())) {
      let syllable = text[i];
      i++;

      // Nếu tiếp tục là nguyên âm thì đây là nguyên âm đôi
      if (i < text.length && vowels.includes(text[i].toLowerCase())) {
        syllable += text[i];
        i++;
      }

      if (digraphs.includes(text.substring(i, i + 2).toLowerCase())) {
        syllables.push(syllable); // Ngừng gom nếu gặp digraph (không gom vào âm tiết)
        continue;
      }

      // Gom thêm phụ âm sau nếu có
      while (i < text.length && !vowels.includes(text[i].toLowerCase())) {
        if (i + 1 < text.length && vowels.includes(text[i + 1].toLowerCase())) {
          // Nếu gặp nguyên âm tiếp theo, dừng gom
          break;
        }

        // Nếu gặp phụ âm đơn, gom thêm
        syllable += text[i];
        i++;

        if (digraphs.includes(text.substring(i, i + 2).toLowerCase())) {
          break; // Ngừng gom nếu gặp digraph (không gom vào âm tiết)
        }
      }

      syllables.push(syllable);
    } else {
      // Nếu là phụ âm, gom tới khi gặp nguyên âm
      let syllable = text[i];
      i++;

      while (i < text.length && !vowels.includes(text[i].toLowerCase())) {
        syllable += text[i];
        i++;
      }

      // Nếu nguyên âm đến ngay sau, gom luôn
      if (i < text.length && vowels.includes(text[i].toLowerCase())) {
        syllable += text[i];
        i++;
        // Nếu tiếp tục là nguyên âm thì đây là nguyên âm đôi
        if (i < text.length && vowels.includes(text[i].toLowerCase())) {
          syllable += text[i];
          i++;
        }
      }

      if (digraphs.includes(text.substring(i, i + 2).toLowerCase())) {
        syllables.push(syllable); // Ngừng gom nếu gặp digraph (không gom vào âm tiết)
        continue;
      }

      // Gom thêm phụ âm tiếp theo nếu có
      while (i < text.length && !vowels.includes(text[i].toLowerCase())) {
        if (i + 1 < text.length && vowels.includes(text[i + 1].toLowerCase())) {
          // Nếu gặp nguyên âm tiếp theo, dừng gom
          break;
        }

        syllable += text[i];
        i++;

        if (digraphs.includes(text.substring(i, i + 2).toLowerCase())) {
          break; // Ngừng gom nếu gặp digraph (không gom vào âm tiết)
        }
      }

      syllables.push(syllable);
    }
  }

  return syllables;
}

// Hàm tô màu các "âm tiết" trong một node văn bản
function colorizeTextNode(node: Text) {
  const text: string = node.nodeValue || "";
  // Tách từ nhưng giữ lại khoảng trắng bằng regex
  const wordsAndSpaces = text.split(/(\s+)/);
  const fragment = document.createDocumentFragment();
  let colorIndex = 0;

  wordsAndSpaces.forEach((part: string) => {
    if (part.match(/^\s+$/)) {
      // Nếu là khoảng trắng, thêm text node khoảng trắng
      fragment.appendChild(document.createTextNode(part));
    } else if (part.length > 0) {
      // Nếu là từ, chia và tô màu
      const pseudoSyllables = getPseudoSyllables(part);

      pseudoSyllables.forEach((syllable) => {
        const span = document.createElement("span");
        span.textContent = syllable;
        span.style.color = colorPalette4[colorIndex % colorPalette4.length];
        // Thêm class để dễ nhận diện khi tắt
        span.classList.add("dyslexia-color-syllable");
        colorIndex++; // Chuyển sang màu tiếp theo

        fragment.appendChild(span);
      });
    }
  });

  // Lưu trữ node gốc trước khi thay thế
  originalTextNodes.set(node, text);
  // Thay thế node văn bản gốc bằng fragment đã được tô màu
  node.parentNode?.replaceChild(fragment, node);

  //Lưu thông tin vào storage
  browser.storage.local.set({ proccessedText: text });
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
        // Chỉ tô màu nếu chưa được lưu trữ (chưa được xử lý lần nào)
        if (!originalTextNodes.has(node as Text)) {
          colorizeTextNode(node as Text);
        }
      }
      // Khôi phục được xử lý ở nhánh ELEMENT_NODE hoặc sau khi duyệt
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
    // Duyệt toàn bộ body để tìm text node và tô màu
    traverseAndProcess(document.body, true);
  } else {
    // Khi tắt, duyệt lại toàn bộ body để tìm các span đã tạo và khôi phục
    // Cách khôi phục bằng cách duyệt lại và gọi restoreTextNode trên ELEMENT_NODE parent
    traverseAndProcess(document.body, false);

    // Sau khi duyệt, kiểm tra lại map để xử lý các text node gốc còn sót lại
    // (trường hợp parent node bị loại bỏ hoặc logic khôi phục không tới)
    originalTextNodes.forEach((originalText, textNode) => {
      if (textNode.parentNode) {
        // Tạo text node mới và thay thế parent của node gốc (nếu còn tồn tại)
        try {
          const newNode = document.createTextNode(originalText);
          // Tìm vị trí của node gốc trong danh sách con của parent
          const children = Array.from(textNode.parentNode.childNodes);
          const index = children.indexOf(textNode);

          if (index !== -1) {
            textNode.parentNode.replaceChild(newNode, textNode);
          } else {
            // Nếu không tìm thấy node gốc trong danh sách con, chỉ thay thế
            // (có thể parent đã thay đổi)
            // Cách này có thể sai nếu node gốc không còn liên quan đến parent hiện tại
            textNode.parentNode.replaceChild(newNode, textNode);
          }
        } catch (e) {
          console.error("Error during final restore:", e);
          // Fallback: chỉ in nội dung gốc ra console
          console.log("Could not restore node with text:", originalText, "Parent:", textNode.parentNode);
        }
      } else {
        console.log("Original text node detached from DOM:", originalText);
      }
    });
    originalTextNodes.clear(); // Xóa hết sau khi khôi phục
  }
}

// Có thể thêm MutationObserver để xử lý nội dung được tải động sau khi trang tải xong
// Tuy nhiên, việc này làm phức tạp code hơn nhiều và cần xử lý cẩn thận để tránh vòng lặp vô hạn
// hoặc hiệu suất kém trên các trang web phức tạp.

export async function applyThemeToTab(tabId: number, enabled: boolean, theme?: string) {
  const storage = await browser.storage.local.get(["theme", "textColor", "backgroundColor", "colorCodingEnabled"]);
  const colorCodingEnabled = storage.colorCodingEnabled;

  const currentTheme = theme || storage.theme;
  const textColor = getTextColorByHex(currentTheme as string);
  const backgroundColor = getBackgroundColor(currentTheme as string);

  if (!enabled || currentTheme === "default") {
    await browser.scripting.executeScript({
      target: { tabId },
      func: () => {
        document.body.style.backgroundColor = "";
        document.body.style.color = "";
        document.querySelectorAll("*").forEach((el) => {
          if (el instanceof HTMLElement && !el.classList.contains("dyslexia-color-syllable")) {
            el.style.backgroundColor = "";
            el.style.color = "";
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

    // Nếu đang bật color coding, gửi lại sau applyColors để đảm bảo màu syllable giữ nguyên
    if (colorCodingEnabled && enabled) {
      await browser.tabs.sendMessage(tabId, {
        action: "setColorCoding",
        enabled: true,
      });
    }
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

export async function applyColorCodingToTab(tabId: number, enabled: boolean) {
  await browser.tabs.sendMessage(tabId, {
    action: "setColorCoding",
    enabled,
  });
}
