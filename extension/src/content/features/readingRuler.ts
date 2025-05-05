import { RulerMessage } from "@/background/background";
import browser from "webextension-polyfill";

// Content script to inject and manage the reading ruler
export interface RulerConfig {
  ruler: boolean;
  rulerHeight: number;
  rulerOpacity: number;
  rulerColor: string;
}

// Create ruler element
let ruler: HTMLDivElement | null = null;

function createRuler() {
  if (ruler) return;
  ruler = document.createElement("div");
  ruler.style.position = "fixed";
  ruler.style.left = "0";
  ruler.style.width = "100%";
  ruler.style.zIndex = "9999";
  ruler.style.pointerEvents = "none";
  document.body.appendChild(ruler);
}

// Update ruler styles based on config
function updateRuler(config: RulerConfig) {
  if (!ruler) createRuler();
  if (ruler) {
    ruler.style.display = config.ruler ? "block" : "none";
    ruler.style.height = `${config.rulerHeight}px`;
    ruler.style.opacity = `${config.rulerOpacity / 100}`;
    ruler.style.backgroundColor = config.rulerColor;
  }
}

// Move ruler with mouse
document.addEventListener("mousemove", (e) => {
  if (ruler && ruler.style.display !== "none") {
    ruler.style.top = `${e.clientY - ruler.offsetHeight / 2}px`;
  }
});

// Listen for messages from popup
browser.runtime.onMessage.addListener((message: RulerMessage) => {
    if (message.action === "updateRuler") {
    updateRuler(message.config);
  }
});
