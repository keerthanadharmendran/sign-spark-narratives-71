
// Mock database service until connected to a real database
import { create } from 'zustand';

type SignImage = {
  id: number;
  word: string;
  imageUrl: string;
};

// In a real implementation, this would connect to Supabase or another backend
interface DatabaseState {
  signImages: SignImage[];
  getImageForWord: (word: string) => SignImage | undefined;
  addImage: (word: string, imageUrl: string) => void;
}

// Initial database with actual sign language GIFs
const initialSignImages: SignImage[] = [
  // Common words with proper ASL GIFs
  { id: 1, word: "hello", imageUrl: "https://media2.giphy.com/media/v1.Y2lkPTc5MGI3NjExMnYwYWY2ejkzaTVwa3FpNGJ3MTBzbXd5cWppbHQ2MjlrZGd0Y2ZtdiZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/eVJGS7xYo3uQrHoC8M/giphy.gif" },
  { id: 2, word: "thank", imageUrl: "https://media.giphy.com/media/26gsjCZpPolPr3sBy/giphy.gif" },
  { id: 3, word: "you", imageUrl: "https://media.giphy.com/media/3o7TKGMZYdvtZ7HGLU/giphy.gif" },
  { id: 4, word: "welcome", imageUrl: "https://media.giphy.com/media/3o7TKGy6TBUPrjtQLC/giphy.gif" },
  { id: 5, word: "please", imageUrl: "https://media.giphy.com/media/l0MYtGKBls06gLzGM/giphy.gif" },
  { id: 6, word: "yes", imageUrl: "https://media.giphy.com/media/l0MYrJWMsrDFKm624/giphy.gif" },
  { id: 7, word: "no", imageUrl: "https://media.giphy.com/media/l0NgQONPoEj6edayI/giphy.gif" },
  { id: 8, word: "help", imageUrl: "https://media.giphy.com/media/xT9DPQVSlOWbfMceQw/giphy.gif" },
  { id: 9, word: "learn", imageUrl: "https://media.giphy.com/media/l0MYtMJ10xBZdHG1O/giphy.gif" },
  { id: 10, word: "sign", imageUrl: "https://media.giphy.com/media/l0MYOwS2rK95JZDzi/giphy.gif" },
  { id: 11, word: "this", imageUrl: "https://media.giphy.com/media/l0MYOSKXcJCrEdCBW/giphy.gif" },
  { id: 12, word: "is", imageUrl: "https://media.giphy.com/media/l0MYOKCyshk5fj9m0/giphy.gif" },
  { id: 13, word: "all", imageUrl: "https://media.giphy.com/media/3o7TKJbhvtt2mI7O4U/giphy.gif" },
  { id: 14, word: "want", imageUrl: "https://media.giphy.com/media/l0MYAhbT2fCOhvW1i/giphy.gif" },
  { id: 15, word: "need", imageUrl: "https://media.giphy.com/media/3o7TKBTQqUwTSNvP9e/giphy.gif" },
  { id: 16, word: "good", imageUrl: "https://media.giphy.com/media/l0MYAPaBkXpgbGd7W/giphy.gif" },
  { id: 17, word: "bad", imageUrl: "https://media.giphy.com/media/3o7TKEP6YngkCKFofC/giphy.gif" },
  { id: 18, word: "sorry", imageUrl: "https://media.giphy.com/media/l0MYQwJ25FLEVXq6I/giphy.gif" },
  { id: 19, word: "love", imageUrl: "https://media.giphy.com/media/3o7TKNw3vaIb3Cm3Ty/giphy.gif" },
  { id: 20, word: "home", imageUrl: "https://media.giphy.com/media/3o7TKAlcPD5WPAxP9u/giphy.gif" },
  
  // ASL Alphabet GIFs - actual fingerspelling
  { id: 101, word: "a", imageUrl: "https://media.giphy.com/media/L2lyvnGokZIpt9W6I2/giphy.gif" },
  { id: 102, word: "b", imageUrl: "https://media.giphy.com/media/XCxcmEjt0Zoq40yZq9/giphy.gif" },
  { id: 103, word: "c", imageUrl: "https://media.giphy.com/media/gKIwl0XiU3Uncdg2lj/giphy.gif" },
  { id: 104, word: "d", imageUrl: "https://media.giphy.com/media/ej1QQG9xHMGZ8PrVHp/giphy.gif" },
  { id: 105, word: "e", imageUrl: "https://media.giphy.com/media/j0vJQeC2vr6UYlsS3s/giphy.gif" },
  { id: 106, word: "f", imageUrl: "https://media.giphy.com/media/KGtzsf3jZDO4CaXhor/giphy.gif" },
  { id: 107, word: "g", imageUrl: "https://media.giphy.com/media/SuEYMgiFCxXb9etYDD/giphy.gif" },
  { id: 108, word: "h", imageUrl: "https://media.giphy.com/media/H1zJW43iAoOnbUELJe/giphy.gif" },
  { id: 109, word: "i", imageUrl: "https://media.giphy.com/media/elB74ho1MzVZQzRBsH/giphy.gif" },
  { id: 110, word: "j", imageUrl: "https://media.giphy.com/media/KznoYL3aihSGpQrbFx/giphy.gif" },
  { id: 111, word: "k", imageUrl: "https://media.giphy.com/media/lroh3nfHQ78XezkHkh/giphy.gif" },
  { id: 112, word: "l", imageUrl: "https://media.giphy.com/media/Q7YFT6lHgYnpK5tAp5/giphy.gif" },
  { id: 113, word: "m", imageUrl: "https://media.giphy.com/media/j5zwMfZnd0w8YQRaDM/giphy.gif" },
  { id: 114, word: "n", imageUrl: "https://media.giphy.com/media/Q8IYD1QtPGsj8GX9l1/giphy.gif" },
  { id: 115, word: "o", imageUrl: "https://media.giphy.com/media/XGhiMXmZhS0mcTSpEM/giphy.gif" },
  { id: 116, word: "p", imageUrl: "https://media.giphy.com/media/d7Sv6F8VKxJN2rLGRl/giphy.gif" },
  { id: 117, word: "q", imageUrl: "https://media.giphy.com/media/W3H6kP4tZRzjy1eqgd/giphy.gif" },
  { id: 118, word: "r", imageUrl: "https://media.giphy.com/media/RlZOqRgLMRnJ4WxfQT/giphy.gif" },
  { id: 119, word: "s", imageUrl: "https://media.giphy.com/media/kHs1VdRnpwV2MTa09P/giphy.gif" },
  { id: 120, word: "t", imageUrl: "https://media.giphy.com/media/SRrOobiSQ0Ykl47jMO/giphy.gif" },
  { id: 121, word: "u", imageUrl: "https://media.giphy.com/media/kfd43bo3Z8A5ZewNYm/giphy.gif" },
  { id: 122, word: "v", imageUrl: "https://media.giphy.com/media/RIYorQyXGhh45bpc6D/giphy.gif" },
  { id: 123, word: "w", imageUrl: "https://media.giphy.com/media/J0C3ALiRY8yX3dhHfz/giphy.gif" },
  { id: 124, word: "x", imageUrl: "https://media.giphy.com/media/igrQeYhUkm127Z3Hlu/giphy.gif" },
  { id: 125, word: "y", imageUrl: "https://media.giphy.com/media/MeOZ8RZ4Z8hxnKGhna/giphy.gif" },
  { id: 126, word: "z", imageUrl: "https://media.giphy.com/media/ieAUR74GtUsL4NJGHr/giphy.gif" }
];

export const useDatabaseStore = create<DatabaseState>((set, get) => ({
  signImages: initialSignImages,
  
  getImageForWord: (word: string) => {
    return get().signImages.find(image => image.word.toLowerCase() === word.toLowerCase());
  },
  
  addImage: (word: string, imageUrl: string) => {
    const newId = Math.max(...get().signImages.map(image => image.id)) + 1;
    set(state => ({
      signImages: [...state.signImages, { id: newId, word, imageUrl }]
    }));
  }
}));

// Helper function to get sign image URL with letter-by-letter fallback
export const getSignImageUrl = (word: string): string => {
  const db = useDatabaseStore.getState();
  const image = db.getImageForWord(word);
  
  if (image) {
    return image.imageUrl;
  }
  
  // If no direct match, return a fallback URL for "not found"
  return "/signs/not-found.gif";
};

// Function to get sign images for individual letters if word not found
export const getSignImagesForWord = (word: string): { text: string; imageUrl: string }[] => {
  const db = useDatabaseStore.getState();
  const wordImage = db.getImageForWord(word);
  
  if (wordImage) {
    // If we have a sign for the whole word, use it
    return [{ text: word, imageUrl: wordImage.imageUrl }];
  }
  
  // Otherwise, split into individual letters and get signs for each
  const letters = word.toLowerCase().split('');
  const letterSigns = letters.map(letter => {
    const letterImage = db.getImageForWord(letter);
    return {
      text: letter,
      imageUrl: letterImage?.imageUrl || "/signs/not-found.gif"
    };
  });
  
  return letterSigns;
};

export const addSignImage = (word: string, imageUrl: string): void => {
  useDatabaseStore.getState().addImage(word, imageUrl);
};

