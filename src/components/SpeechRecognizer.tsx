
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Mic, MicOff } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

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

  useEffect(() => {
    if ('SpeechRecognition' in window || 'webkitSpeechRecognition' in window) {
      // Create speech recognition instance
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      const recognitionInstance = new SpeechRecognition();
      
      recognitionInstance.continuous = true;
      recognitionInstance.interimResults = true;
      recognitionInstance.lang = 'en-US';

      recognitionInstance.onresult = (event) => {
        const transcript = Array.from(event.results)
          .map(result => result[0])
          .map(result => result.transcript)
          .join('');
        
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
        recognition.start();
        setIsListening(true);
        toast({
          title: "Listening...",
          description: "Speak now. Click the microphone again to stop.",
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

  return (
    <Button
      variant="outline"
      size="icon"
      className="absolute right-2 bottom-2 rounded-full"
      onClick={toggleListening}
      type="button"
    >
      {isListening ? <MicOff size={18} className="text-red-500" /> : <Mic size={18} />}
    </Button>
  );
};
