// Content script to inject and manage the reading ruler
interface RulerConfig {
  ruler: boolean;
  height: number;
  opacity: number;
  color: string;
}

// Create ruler element
let ruler: HTMLDivElement | null = null;

function createRuler() {
  if (ruler) return;
  ruler = document.createElement('div');
  ruler.style.position = 'fixed';
  ruler.style.left = '0';
  ruler.style.width = '100%';
  ruler.style.zIndex = '9999';
  ruler.style.pointerEvents = 'none';
  document.body.appendChild(ruler);
}

// Update ruler styles based on config
function updateRuler(config: RulerConfig) {
  if (!ruler) createRuler();
  if (ruler) {
    ruler.style.display = config.ruler ? 'block' : 'none';
    ruler.style.height = `${config.height}px`;
    ruler.style.opacity = `${config.opacity / 100}`;
    ruler.style.backgroundColor = config.color;
  }
}

// Move ruler with mouse
document.addEventListener('mousemove', (e) => {
  if (ruler && ruler.style.display !== 'none') {
    ruler.style.top = `${e.clientY - ruler.offsetHeight / 2}px`;
  }
});

// Listen for messages from popup
chrome.runtime.onMessage.addListener((message) => {
  if (message.type === 'UPDATE_RULER') {
    updateRuler(message.config);
  }
});

// Initialize ruler
createRuler();
updateRuler({
  ruler: true,
  height: 20,
  opacity: 30,
  color: '#d9d9d9',
});