
import React, { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Mic, MicOff, Globe } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { SUPPORTED_LANGUAGES } from '../services/languageService';

interface SpeechRecognizerProps {
  onTranscript: (transcript: string) => void;
  isListening: boolean;
  setIsListening: (isListening: boolean) => void;
}

export const SpeechRecognizer: React.FC<SpeechRecognizerProps> = ({ 
  onTranscript, 
  isListening,
  setIsListening
}) => {
  const { toast } = useToast();
  const [recognition, setRecognition] = useState<SpeechRecognition | null>(null);
  const [speechLanguage, setSpeechLanguage] = useState<string>(SUPPORTED_LANGUAGES.ENGLISH);
  
  // Reference to store current language to access in callbacks
  const speechLanguageRef = useRef(speechLanguage);
  
  // Update ref when state changes
  useEffect(() => {
    speechLanguageRef.current = speechLanguage;
  }, [speechLanguage]);

  useEffect(() => {
    if ('SpeechRecognition' in window || 'webkitSpeechRecognition' in window) {
      // Create speech recognition instance
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      const recognitionInstance = new SpeechRecognition();
      
      recognitionInstance.continuous = true;
      recognitionInstance.interimResults = true;
      
      // Set initial language
      recognitionInstance.lang = getLanguageCode(speechLanguage);

      recognitionInstance.onresult = (event) => {
        const transcript = Array.from(event.results)
          .map(result => result[0])
          .map(result => result.transcript)
          .join('');
        
        // For Tamil language input, preserve the original text
        // This ensures we don't lose Tamil characters when passing to language detection
        if (speechLanguageRef.current === SUPPORTED_LANGUAGES.TAMIL) {
          console.log("Preserving Tamil transcript:", transcript);
        }
        
        onTranscript(transcript);
      };

      recognitionInstance.onerror = (event) => {
        console.error('Speech recognition error', event.error);
        setIsListening(false);
        toast({
          title: "Speech Recognition Error",
          description: `Error: ${event.error}. Please try again.`,
          variant: "destructive",
        });
      };

      recognitionInstance.onend = () => {
        if (isListening) {
          // Update language before restarting
          recognitionInstance.lang = getLanguageCode(speechLanguageRef.current);
          recognitionInstance.start();
        } else {
          setIsListening(false);
        }
      };

      setRecognition(recognitionInstance);
    }

    return () => {
      if (recognition) {
        recognition.stop();
      }
    };
  }, []);

  // Get the appropriate language code for speech recognition
  const getLanguageCode = (language: string): string => {
    const languageCodes: { [key: string]: string } = {
      en: 'en-US',
      ta: 'ta-IN'
    };
    
    return languageCodes[language] || 'en-US';
  };

  const toggleListening = () => {
    if (!recognition) {
      toast({
        title: "Speech Recognition Not Available",
        description: "Your browser doesn't support speech recognition.",
        variant: "destructive",
      });
      return;
    }

    try {
      if (isListening) {
        recognition.stop();
        setIsListening(false);
      } else {
        // Update language before starting
        recognition.lang = getLanguageCode(speechLanguage);
        recognition.start();
        setIsListening(true);
        toast({
          title: "Listening...",
          description: `Speak now in ${speechLanguage === 'ta' ? 'Tamil' : 'English'}. Click the microphone again to stop.`,
        });
      }
    } catch (error) {
      console.error('Speech recognition error:', error);
      toast({
        title: "Speech Recognition Error",
        description: "There was an error starting speech recognition. Please try again.",
        variant: "destructive",
      });
      setIsListening(false);
    }
  };

  const handleLanguageChange = (value: string) => {
    setSpeechLanguage(value);
    
    // If currently listening, restart recognition with new language
    if (recognition && isListening) {
      recognition.stop();
      setTimeout(() => {
        if (recognition) {
          recognition.lang = getLanguageCode(value);
          recognition.start();
        }
      }, 100);
    }
    
    toast({
      title: "Language Changed",
      description: `Speech recognition set to ${value === 'ta' ? 'Tamil' : 'English'}`,
    });
  };

  return (
    <div className="flex items-center gap-2">
      <Select value={speechLanguage} onValueChange={handleLanguageChange}>
        <SelectTrigger className="w-[100px]">
          <SelectValue placeholder="Language" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="en">English</SelectItem>
          <SelectItem value="ta">Tamil</SelectItem>
        </SelectContent>
      </Select>
      
      <Button
        variant="outline"
        size="icon"
        className="rounded-full"
        onClick={toggleListening}
        type="button"
      >
        {isListening ? <MicOff size={18} className="text-red-500" /> : <Mic size={18} />}
      </Button>
    </div>
  );
};
