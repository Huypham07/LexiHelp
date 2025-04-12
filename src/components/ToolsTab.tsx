import { Volume2 } from "lucide-react";
import { Slider } from "./ui/slider";
import { Label } from "./ui/label";
import { Switch } from "./ui/switch";
import { Button } from "./ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { useEffect, useState } from "react";
import browser from "webextension-polyfill"
import { isFirefox } from "../utils/browserDetection";
import React from "react";

interface ToolsTabProps {
  ttsHighlight: boolean;
  setTtsHighlight: (value: boolean) => void;
}

const TOP_VOICES = [
  'en-US-AndrewNeural',
  'en-US-AriaNeural',
  'en-US-AvaNeural',
  'en-US-ChristopherNeural',
  'en-US-SteffanNeural',
  'en-IE-ConnorNeural',
  'en-GB-RyanNeural',
  'en-GB-SoniaNeural',
  'en-AU-NatashaNeural',
  'en-AU-WilliamNeural',
];

const ToolsTab: React.FC<ToolsTabProps> = ({ ttsHighlight, setTtsHighlight }) => {
  // voice states
  // const voices = TOP_VOICES;
  const [selectedVoice, setSelectedVoice] = useState<string>('en-US-ChristopherNeural');
  const [speed, setSpeed] = useState<number>(1.0);
  const [pitch, setPitch] = useState<number>(1.0);
  const [volume, setVolume] = useState<number>(5.0);

  // others tools states
  const [fullscreenStyles, setFullscreenStyles] = useState<boolean>(true);
  const [removeDistractions, setRemoveDistractions] = useState<boolean>(false);
  
  // useEffect 
  useEffect(() => {
    // Load saved settings
    browser.storage.sync.get(['voice', 'speed', 'pitch', 'volume']).then((result) => {
      if (result.voiceName) {
        setSelectedVoice(result.voiceName as string);
      }
      if (result.speed) {
        setSpeed(result.speed as number);
      }
      if (result.pitch) {
        setPitch(result.pitch as number);
      }
      if (result.volume) {
        setVolume(result.volume as number);
      }
    });
  }, []);

  const handleVoiceChange = (voice: string) => {
    setSelectedVoice(voice);
    browser.storage.sync.set({ voiceName: voice });
  }

  const handleSpeedChange = (newSpeed: number) => {
    setSpeed(newSpeed);
    browser.storage.sync.set({ speed: newSpeed });
  }

  const handlePitchChange = (newPitch: number) => {
    setPitch(newPitch);
    browser.storage.sync.set({ pitch: newPitch });
  }

  const handleVolumeChange = (newVolume: number) => {
    setVolume(newVolume);
    browser.storage.sync.set({ volume: newVolume });
  }

  const handlePlayClick = async () => {
    try {
      const tabs = await browser.tabs.query({ active: true, currentWindow: true });
      const tab = tabs[0];
      if (!tab?.id) {
        console.error('No active tab found');
        return;
      }

      const injectionResults = await browser.scripting.executeScript({
        target: { tabId: tab.id },
        func: () => document.body.innerText,
      });

      for (const frameResult of injectionResults) {
        const pageContent = frameResult.result as string;
        if (!pageContent || !pageContent.trim()) {
          console.warn('The page content is empty.');
          continue;
        }

        if (isFirefox()) {
          // inject postMessage in page context
          await browser.scripting.executeScript({
            target: { tabId: tab.id },
            func: (text) => {
              window.postMessage({ action: 'triggerTTS', text }, '*');
            },
            args: [pageContent],
          });
        } else {
          // send message to content script
          await browser.tabs.sendMessage(tab.id, {
            action: 'readText',
            text: pageContent,
          });
        }
      }
    } catch (error) {
      console.error('Error sending TTS message:', error);
    }
  };

  return (
    <div className="space-y-5">
      <div className="space-y-2">
        <div className="form-row">
          <Label htmlFor="styles-all" className="text-gray-600">
            Apply styles for fullscreen reading
          </Label>
          <Switch className="cursor-pointer" defaultChecked={fullscreenStyles} onCheckedChange={setFullscreenStyles}/>
        </div>
        <p className="text-gray-500 text-sm">Ctrl + click to apply for target paragraph</p>
      </div>

      <div className="space-y-2">
        <div className="form-row">
          <Label htmlFor="remove-distraction" className="text-gray-600">
            Remove Distractions
          </Label>
          <Switch className="cursor-pointer" defaultChecked={removeDistractions} onCheckedChange={setRemoveDistractions}/>
        </div>
        <p className="text-gray-500 text-sm">Hide images, ads, and other distracting elements</p>
      </div>

      <div className="space-y-3">
        <div className="form-row">
          <Label htmlFor="voice" className="text-gray-600">
            Voice
          </Label>
          <Select defaultValue={selectedVoice} onValueChange={handleVoiceChange}>
            <SelectTrigger id="voice" className="min-w-40">
              <SelectValue placeholder="Select voice" />
            </SelectTrigger>
            <SelectContent className="max-h-60 overflow-y-auto">
              {TOP_VOICES.map((voice) => (
                <SelectItem key={voice} value={voice}>
                  {voice}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="space-y-3">
        <div className="form-row">
          <Label htmlFor="tts-highlight" className="text-gray-600">
            Text-to-Speech Highlight
          </Label>
          <Switch className="cursor-pointer" checked={ttsHighlight} onCheckedChange={setTtsHighlight} />
        </div>
      </div>

      <div className="space-y-3">
        <div className="form-row">
          <Label htmlFor="volume" className="text-gray-600">
            Volume
          </Label>
        </div>
        <Slider id="volume" min={0} max={10} step={1} defaultValue={[volume]} onValueCommit={(values) => handleVolumeChange(values[0])} />
      </div>

      <div className="space-y-3">
        <div className="form-row">
          <Label htmlFor="speech-rate" className="text-gray-600">
            Speech Rate
          </Label>
        </div>
        <Slider id="speech-rate" min={0.5} max={2} step={0.1} defaultValue={[speed]} onValueCommit={(values) => handleSpeedChange(values[0])} />
      </div>

      <div className="space-y-3">
        <div className="form-row">
          <Label htmlFor="speech-pitch" className="text-gray-600">
            Speech Pitch
          </Label>
        </div>
        <Slider id="speech-pitch" min={0.5} max={2} step={0.1} defaultValue={[pitch]} onValueCommit={(values) => handlePitchChange(values[0])}/>
      </div>

      <div className="pt-2 space-y-3">
        <div className="form-row">
          <p className="text-gray-500 text-sm">Read preview text aloud</p>
          <Button variant="outline" size={"sm"} className="text-blue-600" onClick={handlePlayClick}>
            <Volume2 className="btn-icon" />
            Speak
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ToolsTab;
