
import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../services/authService';
import { translateToSignLanguage } from '../services/translationService';
import { translateWithTransformer } from '../services/advancedTranslationService';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/components/ui/use-toast';
import { ArrowRight, LogIn, Languages, Brain, Sparkles } from 'lucide-react';
import { TranslationDisplay } from '@/components/TranslationDisplay';
import { SpeechRecognizer } from '@/components/SpeechRecognizer';

const Translator: React.FC = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated, logout } = useAuthStore();
  const { toast } = useToast();
  
  const [inputText, setInputText] = useState('');
  const [isTranslating, setIsTranslating] = useState(false);
  const [translationResult, setTranslationResult] = useState<{
    words: { text: string; imageUrl: string; poseData?: number[][] }[];
    originalText?: string;
    translatedGrammar?: string;
  } | null>(null);
  const [isListening, setIsListening] = useState(false);
  const [useAdvancedModel, setUseAdvancedModel] = useState(true);

  const handleSpeechInput = (transcript: string) => {
    setInputText(transcript);
    // Auto-translate when speech input is received
    if (transcript.trim()) {
      handleTranslate(transcript);
    }
  };

  const handleTranslate = async (text?: string) => {
    const textToTranslate = text || inputText;
    
    if (!textToTranslate.trim()) {
      toast({
        title: "Empty input",
        description: "Please enter some text or speak to translate.",
        variant: "destructive",
      });
      return;
    }

    setIsTranslating(true);
    try {
      console.log("Translating text:", textToTranslate);
      console.log("Using advanced model:", useAdvancedModel);
      
      let result;
      
      if (useAdvancedModel) {
        // Use the advanced transformer-based translation
        result = await translateWithTransformer(textToTranslate);
        toast({
          title: "AI Translation Complete",
          description: "Translation performed using transformer-based neural model",
          variant: "default",
        });
      } else {
        // Use the basic translation as fallback
        const basicResult = await translateToSignLanguage(textToTranslate);
        result = {
          words: basicResult.words,
          originalText: textToTranslate,
        };
      }
      
      setTranslationResult(result);
      
      // Log the results to debug image display issues
      console.log("Translation result:", result);
    } catch (error) {
      toast({
        title: "Translation failed",
        description: "An error occurred during translation. Falling back to basic translation.",
        variant: "destructive",
      });
      console.error("Translation error:", error);
      
      // Fallback to basic translation
      try {
        const fallbackResult = await translateToSignLanguage(textToTranslate);
        setTranslationResult({
          words: fallbackResult.words,
          originalText: textToTranslate
        });
      } catch (fallbackError) {
        console.error("Fallback translation also failed:", fallbackError);
      }
    } finally {
      setIsTranslating(false);
    }
  };

  return (
    <div className="min-h-screen gradient-bg">
      <header className="bg-white/80 backdrop-blur-sm border-b border-gray-200 sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <h1 className="text-2xl font-bold text-primary">Sign Sync</h1>
          </div>
          
          <div className="flex items-center space-x-4">
            {isAuthenticated ? (
              <div className="flex items-center space-x-4">
                <span className="text-sm text-muted-foreground hidden md:inline-block">
                  Welcome, {user?.name}
                </span>
                <Button variant="outline" size="sm" onClick={() => logout()}>
                  Logout
                </Button>
              </div>
            ) : (
              <Button size="sm" onClick={() => navigate('/login')}>
                <LogIn size={16} className="mr-2" /> Login
              </Button>
            )}
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto space-y-8">
          <section className="text-center">
            <h2 className="text-3xl font-bold mb-2">
              <span className="flex items-center justify-center">
                <Sparkles className="mr-2 text-blue-500" size={24} />
                Advanced Sign Language Translator
              </span>
            </h2>
            <p className="text-muted-foreground">
              Speak or enter text to translate into American Sign Language (ASL)
            </p>
          </section>

          <Card className="bg-white shadow-lg">
            <CardContent className="p-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center space-x-2">
                    <Switch 
                      checked={useAdvancedModel} 
                      onCheckedChange={setUseAdvancedModel}
                      id="advanced-model"
                    />
                    <label 
                      htmlFor="advanced-model" 
                      className="text-sm font-medium flex items-center cursor-pointer"
                    >
                      <Brain size={16} className="mr-1 text-purple-500" />
                      Use Advanced AI Model
                    </label>
                  </div>
                  <div className="text-xs text-blue-500 bg-blue-50 px-2 py-1 rounded-full">
                    {useAdvancedModel ? "Transformer + Avatar" : "Basic Translation"}
                  </div>
                </div>
                
                <div className="relative">
                  <Textarea 
                    placeholder="Enter text or click the microphone to speak..." 
                    className="min-h-[100px] pr-12"
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                  />
                  <SpeechRecognizer 
                    onTranscript={handleSpeechInput} 
                    isListening={isListening} 
                    setIsListening={setIsListening} 
                  />
                </div>
                
                <Button 
                  onClick={() => handleTranslate()}
                  disabled={isTranslating}
                  className="w-full bg-primary"
                >
                  {isTranslating ? "Translating..." : (
                    <span className="flex items-center justify-center gap-2">
                      <Languages size={16} /> Translate to Sign Language <ArrowRight size={16} />
                    </span>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>

          {translationResult && (
            <TranslationDisplay result={translationResult} />
          )}
        </div>
      </main>

      <footer className="border-t border-gray-200 mt-12">
        <div className="container mx-auto px-4 py-6 text-center text-sm text-muted-foreground">
          <p>© {new Date().getFullYear()} Sign Sync. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default Translator;
