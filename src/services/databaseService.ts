
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

// Initial database with common sign language words
const initialSignImages: SignImage[] = [
  { id: 1, word: "hello", imageUrl: "/signs/hello.gif" },
  { id: 2, word: "thank", imageUrl: "/signs/thank.gif" },
  { id: 3, word: "you", imageUrl: "/signs/you.gif" },
  { id: 4, word: "welcome", imageUrl: "/signs/welcome.gif" },
  { id: 5, word: "please", imageUrl: "/signs/please.gif" },
  { id: 6, word: "yes", imageUrl: "/signs/yes.gif" },
  { id: 7, word: "no", imageUrl: "/signs/no.gif" },
  { id: 8, word: "help", imageUrl: "/signs/help.gif" },
  { id: 9, word: "learn", imageUrl: "/signs/learn.gif" },
  { id: 10, word: "sign", imageUrl: "/signs/sign.gif" },
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

// Export helper functions
export const getSignImageUrl = (word: string): string => {
  const image = useDatabaseStore.getState().getImageForWord(word);
  return image?.imageUrl || "/signs/not-found.gif";
};

export const addSignImage = (word: string, imageUrl: string): void => {
  useDatabaseStore.getState().addImage(word, imageUrl);
};
