'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Search, Mic, X } from 'lucide-react';
import { cn } from '@/lib/utils';

interface SearchInputProps {
  value: string;
  onChange: (value: string) => void;
  onSubmit?: (value: string) => void;
  placeholder?: string;
  className?: string;
  enableVoiceSearch?: boolean;
}

export default function SearchInput({
  value,
  onChange,
  onSubmit,
  placeholder = 'Search parts, tires, batteries...',
  className,
  enableVoiceSearch = true,
}: SearchInputProps) {
  const [isListening, setIsListening] = useState(false);
  const [isSupported, setIsSupported] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);

  useEffect(() => {
    // Check for speech recognition support
    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    setIsSupported(!!SpeechRecognition && enableVoiceSearch);
  }, [enableVoiceSearch]);

  const handleVoiceSearch = async () => {
    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) return;

    const recognition = new SpeechRecognition();
    recognition.lang = 'en-KE';

    recognition.onstart = () => setIsListening(true);
    recognition.onend = () => setIsListening(false);
    recognition.onerror = () => setIsListening(false);

    recognition.onresult = (event: any) => {
      let transcript = '';
      for (let i = event.resultIndex; i < event.results.length; i++) {
        transcript += event.results[i][0].transcript;
      }
      if (transcript) {
        onChange(transcript);
        if (onSubmit) onSubmit(transcript);
      }
    };

    if (isListening) {
      recognition.stop();
    } else {
      recognition.start();
    }
  };

  const handleClear = () => {
    onChange('');
    inputRef.current?.focus();
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (onSubmit) onSubmit(value);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className={cn('relative flex items-center gap-2', className)}
    >
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-road-grey-500 pointer-events-none" />
        <input
          ref={inputRef}
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="w-full py-3 pl-10 pr-10 rounded-lg border border-road-grey-300 bg-white text-sm placeholder-road-grey-500 focus:border-mechanic-blue focus:outline-none focus:ring-1 focus:ring-mechanic-blue transition-colors"
          aria-label="Search parts"
        />
        {value && (
          <button
            type="button"
            onClick={handleClear}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-road-grey-500 hover:text-road-grey-700 p-1 transition-colors"
            aria-label="Clear search"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>

      {isSupported && (
        <button
          type="button"
          onClick={handleVoiceSearch}
          className={cn(
            'flex items-center justify-center h-11 w-11 rounded-lg border transition-all',
            isListening
              ? 'bg-reliable-red text-white border-reliable-red animate-pulse'
              : 'border-road-grey-300 text-road-grey-600 hover:border-mechanic-blue hover:text-mechanic-blue'
          )}
          aria-label={isListening ? 'Stop listening' : 'Start voice search'}
          title={isListening ? 'Listening...' : 'Voice search'}
        >
          <Mic className="h-5 w-5" />
        </button>
      )}
    </form>
  );
}
