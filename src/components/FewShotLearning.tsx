
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/components/ui/use-toast';
import { Sparkles, Upload, Plus, Check } from 'lucide-react';
import { learnNewSignFromExamples } from '../services/advancedTranslationService';

interface FewShotLearningProps {
  onNewSignLearned?: (word: string) => void;
}

const FewShotLearning: React.FC<FewShotLearningProps> = ({ onNewSignLearned }) => {
  const { toast } = useToast();
  const [word, setWord] = useState('');
  const [examples, setExamples] = useState<string[]>([]);
  const [isLearning, setIsLearning] = useState(false);

  const handleAddExample = () => {
    // In a real app, this would handle file uploads or webcam recording
    const mockUrl = `https://media.giphy.com/media/example-${Date.now()}.gif`;
    setExamples([...examples, mockUrl]);
  };

  const handleLearn = async () => {
    if (!word.trim()) {
      toast({
        title: "Word required",
        description: "Please enter a word to learn",
        variant: "destructive",
      });
      return;
    }

    if (examples.length === 0) {
      toast({
        title: "Examples required",
        description: "Please add at least one example",
        variant: "destructive",
      });
      return;
    }

    setIsLearning(true);
    try {
      const success = await learnNewSignFromExamples(word, examples);
      
      if (success) {
        toast({
          title: "New sign learned!",
          description: `Successfully learned the sign for "${word}"`,
          variant: "default",
        });
        
        if (onNewSignLearned) {
          onNewSignLearned(word);
        }
        
        // Reset form
        setWord('');
        setExamples([]);
      } else {
        toast({
          title: "Learning failed",
          description: "Could not learn the new sign. Please try again with different examples.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error in few-shot learning:", error);
      toast({
        title: "Learning error",
        description: "An unexpected error occurred while learning the new sign",
        variant: "destructive",
      });
    } finally {
      setIsLearning(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Sparkles size={20} className="mr-2 text-purple-500" />
          Few-Shot Sign Learning
        </CardTitle>
        <CardDescription>
          Teach the AI new signs with just a few examples
        </CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <div>
          <label className="text-sm font-medium mb-1 block">Word to learn:</label>
          <Input 
            value={word}
            onChange={(e) => setWord(e.target.value)}
            placeholder="Enter a word..."
            className="w-full"
          />
        </div>
        
        <div>
          <label className="text-sm font-medium mb-1 block">Examples:</label>
          <div className="grid grid-cols-3 gap-2 mb-2">
            {examples.map((example, index) => (
              <div 
                key={index}
                className="aspect-square bg-gray-100 rounded flex items-center justify-center text-xs text-gray-500"
              >
                Example {index + 1}
              </div>
            ))}
            
            <Button 
              variant="outline" 
              size="icon" 
              className="aspect-square flex items-center justify-center border-dashed"
              onClick={handleAddExample}
            >
              <Plus size={16} />
            </Button>
          </div>
          
          <div className="text-xs text-gray-500">
            {examples.length === 0 
              ? "Add examples by clicking the + button" 
              : `${examples.length} example${examples.length !== 1 ? 's' : ''} added`}
          </div>
        </div>
      </CardContent>
      
      <CardFooter>
        <Button 
          className="w-full"
          disabled={isLearning || !word || examples.length === 0}
          onClick={handleLearn}
        >
          {isLearning ? (
            "Learning..."
          ) : (
            <>
              <Sparkles size={16} className="mr-2" />
              Learn New Sign
            </>
          )}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default FewShotLearning;
