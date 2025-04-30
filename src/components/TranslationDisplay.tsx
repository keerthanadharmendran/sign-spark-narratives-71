
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';

interface TranslationDisplayProps {
  result: {
    words: {
      text: string;
      imageUrl: string;
    }[];
  };
  mode: 'word' | 'paragraph';
}

export const TranslationDisplay: React.FC<TranslationDisplayProps> = ({ result, mode }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Translation Results</CardTitle>
      </CardHeader>
      <Separator />
      <CardContent className="p-6">
        <div className="flex flex-wrap gap-6 justify-center">
          {result.words.map((word, index) => (
            <div key={index} className="flex flex-col items-center">
              <div className="w-32 h-32 flex items-center justify-center overflow-hidden rounded-lg bg-white shadow-md">
                <img 
                  src={word.imageUrl} 
                  alt={`Sign for "${word.text}"`}
                  className="max-w-full max-h-full object-contain"
                  loading="lazy"
                />
              </div>
              <p className="mt-2 text-center font-medium">{word.text}</p>
            </div>
          ))}
        </div>
        
        {mode === 'paragraph' && result.words.length > 0 && (
          <div className="mt-8">
            <h3 className="text-lg font-medium mb-2">Original Text:</h3>
            <p className="text-muted-foreground">
              {result.words.map(word => word.text).join(' ')}
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
