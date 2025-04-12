import { circlePause, circleStop, circlePlay } from '../lib/svgs';

let shadowRoot: ShadowRoot | null = null;
let panel: HTMLDivElement | null = null;

export async function createControlPanel(isLoading = true) {
	const shadowHost = document.createElement('div');
	shadowHost.id = 'tts-control-panel-host';
	shadowHost.style.position = 'fixed';
	shadowHost.style.bottom = '20px';
	shadowHost.style.right = '20px';
	shadowHost.style.zIndex = '2147483647';

	document.documentElement.appendChild(shadowHost);

	shadowRoot = shadowHost.attachShadow({ mode: 'open' });

	// Create <style> element
	const style = document.createElement('style');
	style.textContent = `
		.flex-center {
			display: flex;
			align-items: center;
			justify-content: center;
			gap: 1rem;
		}

		.tts-controls {
			background: var(--etts-bg-primary, #fff);
			color: var(--etts-text-primary, #000);
			border: 1px solid var(--etts-border-color, #ddd);
			border-radius: 8px;
			padding: 15px;
			box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
			min-width: 200px;
			transition: all 0.2s;
		}

		.tts-button {
			background: var(--etts-button-bg, #007bff);
			color: var(--etts-button-text, #fff);
			border: none;
			border-radius: 4px;
			padding: 8px 16px;
			cursor: pointer;
			display: flex;
			align-items: center;
			justify-content: center;
			gap: 8px;
		}

		.tts-button.red {
			background: #dc3545;
		}

		.loading-spinner {
			border: 2px solid #f3f3f3;
			border-top: 2px solid #007bff;
			border-radius: 50%;
			width: 20px;
			height: 20px;
			animation: spin 1s linear infinite;
		}

		@keyframes spin {
			0% { transform: rotate(0deg); }
			100% { transform: rotate(360deg); }
		}
	`;

	// Create panel container
	panel = document.createElement('div');
	panel.className = 'tts-controls';

	shadowRoot.appendChild(style);
	shadowRoot.appendChild(panel);

	updatePanelContent(isLoading);

	console.log('Control panel with Shadow DOM created:', panel);
	return panel;
}

export function updatePanelContent(isLoading: boolean) {
	if (!panel) return;

	if (isLoading) {
		panel.innerHTML = `
			<div class="flex-center loading-container">
				<span>Generating audio...</span>
				<div class="loading-spinner"></div>
			</div>
		`;
	} else {
		panel.innerHTML = `
			<div class="flex-center">
				<button id="tts-pause" class="tts-button">
					${circlePause}
					<span>Pause</span>
				</button>
				<button id="tts-stop" class="tts-button red">
					${circleStop}
					<span>Stop</span>
				</button>
			</div>
		`;

		const pauseButton = panel.querySelector('#tts-pause');
		const stopButton = panel.querySelector('#tts-stop');

		if (pauseButton) {
			pauseButton.addEventListener('click', () => {
				window.togglePause?.();
			});
		}

		if (stopButton) {
			stopButton.addEventListener('click', () => {
				window.stopPlayback?.();
			});
		}
	}
}

export enum StateControlPanel {
	PAUSED = 'paused',
	RESUMED = 'resumed',
	PLAYING = 'playing',
}

export function updatePlayPauseButton(state: StateControlPanel) {
	if (!shadowRoot) return;
	const pauseButton = shadowRoot.querySelector('#tts-pause');
	if (!pauseButton) return;

	pauseButton.innerHTML = `
		${state === StateControlPanel.PAUSED ? circlePause : circlePlay}
		<span>${state === StateControlPanel.PAUSED ? 'Pause' : state === StateControlPanel.RESUMED ? 'Resume' : 'Play'}</span>
	`;
}
