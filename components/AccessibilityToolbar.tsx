import React from 'react';
import { AccessibilityState } from '../types';

interface Props {
  settings: AccessibilityState;
  onUpdate: (settings: AccessibilityState) => void;
}

export const AccessibilityToolbar: React.FC<Props> = ({ settings, onUpdate }) => {
  const toggleContrast = () => {
    onUpdate({ ...settings, highContrast: !settings.highContrast });
  };

  const toggleAudio = () => {
    onUpdate({ ...settings, audioEnabled: !settings.audioEnabled });
  };

  const toggleScreenReader = () => {
      onUpdate({ ...settings, screenReaderEnabled: !settings.screenReaderEnabled });
  };

  const setFontSize = (size: 'small' | 'normal' | 'large') => {
    onUpdate({ ...settings, fontSize: size });
  };

  return (
    <div className="fixed top-4 right-4 z-50 flex items-center gap-2 bg-white/90 backdrop-blur-sm p-2 rounded-full shadow-lg border border-gray-200 transition-all">
      {/* Font Size Controls */}
      <div className="flex items-center gap-1 border-r border-gray-300 pr-2">
        <button
          onClick={() => setFontSize('small')}
          className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm transition-colors ${
            settings.fontSize === 'small' ? 'bg-medical-blue text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
          aria-label="Small font size"
        >
          A-
        </button>
        <button
          onClick={() => setFontSize('normal')}
          className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-base transition-colors ${
            settings.fontSize === 'normal' ? 'bg-medical-blue text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
          aria-label="Normal font size"
        >
          A
        </button>
        <button
          onClick={() => setFontSize('large')}
          className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-lg transition-colors ${
            settings.fontSize === 'large' ? 'bg-medical-blue text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
          aria-label="Large font size"
        >
          A+
        </button>
      </div>

      {/* High Contrast */}
      <button
        onClick={toggleContrast}
        className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors ${
          settings.highContrast ? 'bg-yellow-400 text-black border-2 border-black' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
        }`}
        aria-label="Toggle High Contrast"
        title="High Contrast Mode"
      >
        <i className="fas fa-palette text-lg"></i>
      </button>

      {/* Audio Toggle (Descriptions) */}
      <button
        onClick={toggleAudio}
        className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors ${
          settings.audioEnabled ? 'bg-success text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
        }`}
        aria-label="Toggle Audio Assistance"
        title="Audio Assistance"
      >
        <i className={`fas ${settings.audioEnabled ? 'fa-volume-up' : 'fa-volume-mute'} text-lg`}></i>
      </button>

      {/* Screen Reader Toggle */}
      <button
        onClick={toggleScreenReader}
        className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors ${
          settings.screenReaderEnabled ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
        }`}
        aria-label={settings.screenReaderEnabled ? "Disable Screen Reader" : "Enable Screen Reader"}
        title="Screen Reader"
      >
        <i className="fas fa-blind text-lg"></i>
      </button>

      {/* Language */}
      <div className="relative border-l border-gray-300 pl-2">
        <select 
          className="appearance-none bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold py-2 pl-3 pr-8 rounded-full focus:outline-none focus:ring-2 focus:ring-medical-blue"
          value={settings.language}
          onChange={(e) => onUpdate({...settings, language: e.target.value})}
        >
          <option value="EN">🇺🇸 EN</option>
          <option value="ES">🇪🇸 ES</option>
          <option value="TL">🇵🇭 TL</option>
          <option value="ZH">🇨🇳 ZH</option>
        </select>
        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
          <i className="fas fa-chevron-down text-xs"></i>
        </div>
      </div>
    </div>
  );
};
