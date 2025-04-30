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

// Initial database with common sign language words and letters
const initialSignImages: SignImage[] = [
  // Common words
  { id: 1, word: "hello", imageUrl: "https://media.giphy.com/media/3o7TKNthed4OG7T5Je/giphy.gif" },
  { id: 2, word: "thank", imageUrl: "https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExbmg1MjYwM3J6eTZnam9qYnA0dWZyeHc0ejBkcjB6YTllajRrNWU3ZCZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/KI9oNzQYAI4pRRVpes/giphy.gif" },
  { id: 3, word: "you", imageUrl: "https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExODFobzN6aGFtczRvcnFzdWhlYXdlc3lkZGh3bXQ3ZWM0ZHI3dTFpbiZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/l0ErWnkLjegNB5LlC/giphy.gif" },
  { id: 4, word: "welcome", imageUrl: "https://media.giphy.com/media/l0MYGb1LuF3fyEMA8/giphy.gif" },
  { id: 5, word: "please", imageUrl: "https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExcnpicmdzOHR5aXR1OHl6ZmJ3enNtOTRqaHo1emRpeGc1Z29pdDAzYSZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/cOKjNcXILKIUhtJJcE/giphy.gif" },
  { id: 6, word: "yes", imageUrl: "https://media.giphy.com/media/l4KibWpBGWchSqCRy/giphy.gif" },
  { id: 7, word: "no", imageUrl: "https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExYnl1Z29leGthYjI2eXpsZzZ4YnR5YmtseXZnbXNyNGEyYWg1NGN6NCZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/3o6UB5RrlQuMfZAAAE/giphy.gif" },
  { id: 8, word: "help", imageUrl: "https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExY215aWM3dnhzZWlheGxma3Q1eXZkbWJ3ZjJrZG01d3VvcDJtbjlvNSZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/l0Ex6Sto8QsYcgGsw/giphy.gif" },
  { id: 9, word: "learn", imageUrl: "https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExdDg5MGIxM2VxbTY4dnkwZ2JmNnR6dWE3dzRiaTdweG1kc3VnMDRobCZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/H2GX5Ik1ILy5q9lLQ5/giphy.gif" },
  { id: 10, word: "sign", imageUrl: "https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExZmpsaDV0cG9saGxidTl0anZnbmxndjduNWpwZXVtb2Vvenphd3E2eCZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/l0Iy2hYDgmCjMufS/giphy.gif" },
  { id: 11, word: "this", imageUrl: "https://media.giphy.com/media/Zaej3GIZTzCI8/giphy.gif" },
  { id: 12, word: "is", imageUrl: "https://media.giphy.com/media/3o6UB5RrlQuMfZAAAE/giphy.gif" },
  { id: 13, word: "all", imageUrl: "https://media.giphy.com/media/xUOwGb8GuMRhxZcBuo/giphy.gif" },
  
  // Letters
  { id: 101, word: "a", imageUrl: "https://media.giphy.com/media/l0Ex9pftnvPgw0nPa/giphy.gif" },
  { id: 102, word: "b", imageUrl: "https://media.giphy.com/media/l0Ex50iiL5YA2veIU/giphy.gif" },
  { id: 103, word: "c", imageUrl: "https://media.giphy.com/media/l0ExqbBS5dJKl0BkA/giphy.gif" },
  { id: 104, word: "d", imageUrl: "https://media.giphy.com/media/l0ExrGIzIDo2tinpS/giphy.gif" },
  { id: 105, word: "e", imageUrl: "https://media.giphy.com/media/3o7TKSjRrfIPjeiVyM/giphy.gif" },
  { id: 106, word: "f", imageUrl: "https://media.giphy.com/media/3o7TKSha2xy1xG7Vg4/giphy.gif" },
  { id: 107, word: "g", imageUrl: "https://media.giphy.com/media/l0Exd5orzYyze0nXG/giphy.gif" },
  { id: 108, word: "h", imageUrl: "https://media.giphy.com/media/l0Ex8ovLJRk2lptYI/giphy.gif" },
  { id: 109, word: "i", imageUrl: "https://media.giphy.com/media/3o7TKMcj06XI5i4Qq4/giphy.gif" },
  { id: 110, word: "j", imageUrl: "https://media.giphy.com/media/3o7TKTzQ8IbFUQgrCg/giphy.gif" },
  { id: 111, word: "k", imageUrl: "https://media.giphy.com/media/3o7TKKXa5mtgNvGXrW/giphy.gif" },
  { id: 112, word: "l", imageUrl: "https://media.giphy.com/media/l0ExnJc4U89wwmJGw/giphy.gif" },
  { id: 113, word: "m", imageUrl: "https://media.giphy.com/media/l0ExbKAi99BK1yD72/giphy.gif" },
  { id: 114, word: "n", imageUrl: "https://media.giphy.com/media/l0ExsVbtUnOI94F5m/giphy.gif" },
  { id: 115, word: "o", imageUrl: "https://media.giphy.com/media/l0Ex9KYQ0b8YEYESc/giphy.gif" },
  { id: 116, word: "p", imageUrl: "https://media.giphy.com/media/l0ExeMKsmZfqrQvgk/giphy.gif" },
  { id: 117, word: "q", imageUrl: "https://media.giphy.com/media/26gJAJQ9K6CxTcMU0/giphy.gif" },
  { id: 118, word: "r", imageUrl: "https://media.giphy.com/media/3o7TKJ4LizwHAqJQnm/giphy.gif" },
  { id: 119, word: "s", imageUrl: "https://media.giphy.com/media/l0Ex3ptIwULFUYYLK/giphy.gif" },
  { id: 120, word: "t", imageUrl: "https://media.giphy.com/media/l0ExeiiQ2G0hqxSrS/giphy.gif" },
  { id: 121, word: "u", imageUrl: "https://media.giphy.com/media/l0Exl6oImLCp7lRnO/giphy.gif" },
  { id: 122, word: "v", imageUrl: "https://media.giphy.com/media/l0Ex50m0IBARzZyk8/giphy.gif" },
  { id: 123, word: "w", imageUrl: "https://media.giphy.com/media/l0Ex8t2IaujeYiKDS/giphy.gif" },
  { id: 124, word: "x", imageUrl: "https://media.giphy.com/media/l0ExgGQgOMAWbSjmM/giphy.gif" },
  { id: 125, word: "y", imageUrl: "https://media.giphy.com/media/l0Ex6NBPBZUziw7QI/giphy.gif" },
  { id: 126, word: "z", imageUrl: "https://media.giphy.com/media/l0Ex4nq80fN2VzMpq/giphy.gif" }
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
  
  // If no direct match, return a fallback URL
  return "https://media.giphy.com/media/3o7bu3XilJ5BOiSGic/giphy.gif";
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
      imageUrl: letterImage?.imageUrl || "https://media.giphy.com/media/3o7bu3XilJ5BOiSGic/giphy.gif"
    };
  });
  
  return letterSigns;
};

export const addSignImage = (word: string, imageUrl: string): void => {
  useDatabaseStore.getState().addImage(word, imageUrl);
};
