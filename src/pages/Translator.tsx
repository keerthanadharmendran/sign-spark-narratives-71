
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../services/authService';
import { translateText, translateParagraph } from '../services/translationService';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { useToast } from '@/components/ui/use-toast';
import { ArrowRight, LogIn, Translate, User } from 'lucide-react';
import { TranslationDisplay } from '@/components/TranslationDisplay';

const Translator: React.FC = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated, logout } = useAuthStore();
  const { toast } = useToast();
  
  const [inputText, setInputText] = useState('');
  const [translationMode, setTranslationMode] = useState<'word' | 'paragraph'>('word');
  const [isTranslating, setIsTranslating] = useState(false);
  const [translationResult, setTranslationResult] = useState<{
    words: { text: string; imageUrl: string }[];
  } | null>(null);

  const handleTranslate = async () => {
    if (!inputText.trim()) {
      toast({
        title: "Empty input",
        description: "Please enter some text to translate.",
        variant: "destructive",
      });
      return;
    }

    setIsTranslating(true);
    try {
      const result = translationMode === 'word' 
        ? await translateText(inputText)
        : await translateParagraph(inputText);
      
      setTranslationResult(result);
    } catch (error) {
      toast({
        title: "Translation failed",
        description: "An error occurred during translation. Please try again.",
        variant: "destructive",
      });
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
            <h2 className="text-3xl font-bold mb-2">Sign Language Translator</h2>
            <p className="text-muted-foreground">
              Enter text below to translate into American Sign Language (ASL)
            </p>
          </section>

          <Card>
            <CardContent className="p-6">
              <Tabs defaultValue="word" onValueChange={(v) => setTranslationMode(v as 'word' | 'paragraph')}>
                <TabsList className="grid grid-cols-2 mb-6">
                  <TabsTrigger value="word">Word Translation</TabsTrigger>
                  <TabsTrigger value="paragraph">Paragraph Translation</TabsTrigger>
                </TabsList>
                
                <TabsContent value="word">
                  <div className="space-y-4">
                    <Textarea 
                      placeholder="Enter a word or short phrase to translate..." 
                      className="min-h-[100px]"
                      value={inputText}
                      onChange={(e) => setInputText(e.target.value)}
                    />
                    
                    <Button 
                      onClick={handleTranslate} 
                      disabled={isTranslating}
                      className="w-full"
                    >
                      {isTranslating ? "Translating..." : (
                        <span className="flex items-center justify-center gap-2">
                          <Translate size={16} /> Translate to Sign Language <ArrowRight size={16} />
                        </span>
                      )}
                    </Button>
                  </div>
                </TabsContent>
                
                <TabsContent value="paragraph">
                  <div className="space-y-4">
                    <Textarea 
                      placeholder="Enter a paragraph to translate..." 
                      className="min-h-[150px]"
                      value={inputText}
                      onChange={(e) => setInputText(e.target.value)}
                    />
                    
                    <Button 
                      onClick={handleTranslate} 
                      disabled={isTranslating}
                      className="w-full"
                    >
                      {isTranslating ? "Translating..." : (
                        <span className="flex items-center justify-center gap-2">
                          <Translate size={16} /> Translate to Sign Language <ArrowRight size={16} />
                        </span>
                      )}
                    </Button>
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>

          {translationResult && (
            <TranslationDisplay result={translationResult} mode={translationMode} />
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
