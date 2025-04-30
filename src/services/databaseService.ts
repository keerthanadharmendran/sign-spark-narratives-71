
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
  { id: 13, word: "all", imageUrl: "https://media.giphy.com/media/WuRQdjzhA0hrXz3lzL/giphy.gif" },
  { id: 14, word: "want", imageUrl: "https://media.giphy.com/media/l0MYAhbT2fCOhvW1i/giphy.gif" },
  { id: 15, word: "need", imageUrl: "https://media.giphy.com/media/3o7TKBTQqUwTSNvP9e/giphy.gif" },
  { id: 16, word: "good", imageUrl: "https://media.giphy.com/media/l0MYAPaBkXpgbGd7W/giphy.gif" },
  { id: 17, word: "bad", imageUrl: "https://media.giphy.com/media/3o7TKEP6YngkCKFofC/giphy.gif" },
  { id: 18, word: "sorry", imageUrl: "https://media.giphy.com/media/l0MYQwJ25FLEVXq6I/giphy.gif" },
  { id: 19, word: "love", imageUrl: "https://media.giphy.com/media/3o7TKNw3vaIb3Cm3Ty/giphy.gif" },
  { id: 20, word: "home", imageUrl: "https://media.giphy.com/media/3o7TKAlcPD5WPAxP9u/giphy.gif" },
  { id: 21, word: "after", imageUrl: "https://media1.giphy.com/media/v1.Y2lkPTc5MGI3NjExbmd1N3Z1NmZ0OHllMXUxaHhjd2pjMHFqOW12dzBxemRuOXNybTN5eSZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/qpwrBfUnOzzjFfnGCW/giphy.gif"},
  { id: 22, word: "again", imageUrl: "https://media1.giphy.com/media/v1.Y2lkPTc5MGI3NjExZmhodzhjMm8xcjc0OWliZjE3a2Fqcm51NWlwODl3bjg2MzNvZGp2bSZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/Pix2bqJxs48pFWqux0/giphy.gif"},
  { id: 23, word: "against", imageUrl: "https://media3.giphy.com/media/v1.Y2lkPTc5MGI3NjExbjUyN214dHBhdWF0NHdlaDVyenA2bGpudzV2eDBqN2dzOGs3MWU0NiZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/P4C2A1lv6HT2wSWB9I/giphy.gif"},
  { id: 24, word: "age", imageUrl: "https://media4.giphy.com/media/v1.Y2lkPTc5MGI3NjExM214NzhneXRrcnMzc3R4Yzlucm9wbWswaXhwZmtpaWNzdzhzbHNwYyZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/xm03TGv6h0oXEtD788/giphy.gif"},
  { id: 25, word: "i", imageUrl: ""},
  { id: 26, word: "alone", imageUrl: "https://media2.giphy.com/media/v1.Y2lkPTc5MGI3NjExMGZzZ290dXl2YzFzMnBhMjh2c2d1czE5ZGFhc2NiaWllNXh5YnI1cyZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/B6Ht4STvJu91rcRajP/giphy.gif"},
  { id: 27, word: "also", imageUrl: "https://media4.giphy.com/media/v1.Y2lkPTc5MGI3NjExY3lhbHdudXJ4ODl0d3Y2NDAydG9sMDdwMWJjNnRxcnJjbWNsaHFmbyZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/Af9YDjUvH2IGlwX42W/giphy.gif"},
  { id: 28, word: "and", imageUrl: "https://media2.giphy.com/media/v1.Y2lkPTc5MGI3NjExZ2U5dnU2YW5pcWt1NW54ZHk2emg1NXpvc2Y5dzN4OWdnbTQxcWlwcSZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/cZMAN91iMLkddIIjjY/giphy.gif"},
  { id: 29, word: "ask", imageUrl: "https://media1.giphy.com/media/v1.Y2lkPTc5MGI3NjExZGoxZjMxdHVibTVzemRxcHhxenIxZjhyMGQzanFqdTd3MzNpOTZqNSZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/J5Up7OtfaC06FxkLlc/giphy.gif"},
  { id: 30, word: "at", imageUrl: "https://media4.giphy.com/media/v1.Y2lkPTc5MGI3NjExNXd6bWpzd2NvNnFoYW9mc2o5aHJob3lxOGp3MmZ3OGhzOXA3Y2Z3aiZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/GOjf2BIltlK92yhUDa/giphy.gif"},
  { id: 31, word: "be", imageUrl: "https://media0.giphy.com/media/v1.Y2lkPTc5MGI3NjExMHA0dGgwa3pyanNmOTB5eHExbjAybGxnZTNtb3ZhN3c0cGc3aTAyMSZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/EbklBaH299q4WyEBEH/giphy.gif"},
  { id: 32, word: "beautiful", imageUrl: "https://media1.giphy.com/media/v1.Y2lkPTc5MGI3NjExZTFsNjJxOTFwcjA5b2swOXdicTJyaXJkcmN2NzY5Mmk3ODBsYmx4bCZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/c8gyETIo6fHn1Qiba0/giphy.gif"},
  { id: 33, word: "before", imageUrl: "https://media2.giphy.com/media/v1.Y2lkPTc5MGI3NjExNXMwNmUydnppMTZvZzZhZHZxc3EwNzEzam5kNXFlZnYxM3preGlscyZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/Sb3OPRVdddO2WmiUYd/giphy.gif"},
  { id: 34, word: "i", imageUrl: ""},
  { id: 35, word: "im", imageUrl: "https://media3.giphy.com/media/v1.Y2lkPTc5MGI3NjExODhsNDE5Y21hZTZ4YmwxYTRqejh2aXg1ZzgzYWlic2F1Nzk1dWJ5aCZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/WfrjEIeCnxGRlnLXX6/giphy.gif"},
  { id: 36, word: "i am", imageUrl: "https://media3.giphy.com/media/v1.Y2lkPTc5MGI3NjExODhsNDE5Y21hZTZ4YmwxYTRqejh2aXg1ZzgzYWlic2F1Nzk1dWJ5aCZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/WfrjEIeCnxGRlnLXX6/giphy.gif"},
  { id: 34, word: "i", imageUrl: ""},
  { id: 34, word: "i", imageUrl: ""},
  { id: 34, word: "i", imageUrl: ""},
  { id: 34, word: "i", imageUrl: ""},
  { id: 34, word: "i", imageUrl: ""},
  { id: 34, word: "i", imageUrl: ""},
  { id: 34, word: "i", imageUrl: ""},

  
  // ASL Alphabet GIFs - actual fingerspelling
  { id: 101, word: "a", imageUrl: "https://media3.giphy.com/media/v1.Y2lkPTc5MGI3NjExZWZqbjMyczNnNDN3ZDBvbWl1NG53cmx3ZmNjb3QxbGZiam12bW01YiZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/MFW0qBvG5zJx8CYuTO/giphy.gif" },
  { id: 102, word: "b", imageUrl: "https://media3.giphy.com/media/v1.Y2lkPTc5MGI3NjExb2s0OGRvMWI2Z3gxeGQ1NnkzdnNmanJ5aWY4a29uNWIxNHF0cWVjMyZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/2DuoguwK8FqkcqwMN7/giphy.gif" },
  { id: 103, word: "c", imageUrl: "https://media0.giphy.com/media/v1.Y2lkPTc5MGI3NjExczBpZG4xbWVuM3Nxb3c2ZzNxNnE3NXlzdjdpem1jemhsdjlwa3BzdSZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/1BdW0OHcVLWIY8fIxn/giphy.gif" },
  { id: 104, word: "d", imageUrl: "https://media2.giphy.com/media/v1.Y2lkPTc5MGI3NjExb20yenpyZjZteXgwN3dzbWdrZmxpZnc0b2txeXdncmRpZTYyMGE0dCZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/nssZVUGGPp3BXlAMyT/giphy.gif" },
  { id: 105, word: "e", imageUrl: "https://media1.giphy.com/media/v1.Y2lkPTc5MGI3NjExajJpbjd0ZDV6Y3k1Yzl4M3Z4OXRtdjhwNXByZjJ2a2owNWVncDFvMCZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/cDRUTaHTvh8f2vxMX4/giphy.gif" },
  { id: 106, word: "f", imageUrl: "https://media3.giphy.com/media/v1.Y2lkPTc5MGI3NjExMXE4NXYzYTdsNzZtdng3a3UzZ2RveXFsaWhuaGM0MHd2N2xqMDlibCZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/OQKdAYVvirLGWPcLk5/giphy.gif" },
  { id: 107, word: "g", imageUrl: "https://media2.giphy.com/media/v1.Y2lkPTc5MGI3NjExN3l1YW5hbTVnbDl4c2QzcHgyamZ1c2V1bmoyemUzOW04am9hZ3J1eSZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/5m2G33ylWSc3QKA5WK/giphy.gif" },
  { id: 108, word: "h", imageUrl: "https://media2.giphy.com/media/v1.Y2lkPTc5MGI3NjExYXl0OHY3ODZkOXN1cTV6MW1iczY1a3czc293ZGU0b2hodXZ3NnExdyZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/3JPPJNvPEVetj4DN69/giphy.gif" },
  { id: 109, word: "i", imageUrl: "https://media2.giphy.com/media/v1.Y2lkPTc5MGI3NjExbGJsbWs4bms3ZXhxdnpoZ215NDZ3MGRlcnIwNHl1ajVyNnRoM2p0MSZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/un8KUN4qGQn8TCLq9c/giphy.gif" },
  { id: 110, word: "j", imageUrl: "https://media.giphy.com/media/KznoYL3aihSGpQrbFx/giphy.gif" },
  { id: 111, word: "k", imageUrl: "https://media.giphy.com/media/lroh3nfHQ78XezkHkh/giphy.gif" },
  { id: 112, word: "l", imageUrl: "https://media.giphy.com/media/Q7YFT6lHgYnpK5tAp5/giphy.gif" },
  { id: 113, word: "m", imageUrl: "https://media.giphy.com/media/j5zwMfZnd0w8YQRaDM/giphy.gif" },
  { id: 114, word: "n", imageUrl: "https://media0.giphy.com/media/v1.Y2lkPTc5MGI3NjExZzhmZDk2dmk0N3h6N3NkZzJmMzNvaTdnb290ZmF4bHNlcjFmZ25xbSZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/PrtmMQbknXa1WJscd5/giphy.gif" },
  { id: 115, word: "o", imageUrl: "https://media.giphy.com/media/XGhiMXmZhS0mcTSpEM/giphy.gif" },
  { id: 116, word: "p", imageUrl: "https://media.giphy.com/media/d7Sv6F8VKxJN2rLGRl/giphy.gif" },
  { id: 117, word: "q", imageUrl: "https://media.giphy.com/media/W3H6kP4tZRzjy1eqgd/giphy.gif" },
  { id: 118, word: "r", imageUrl: "https://media.giphy.com/media/RlZOqRgLMRnJ4WxfQT/giphy.gif" },
  { id: 119, word: "s", imageUrl: "https://media.giphy.com/media/kHs1VdRnpwV2MTa09P/giphy.gif" },
  { id: 120, word: "t", imageUrl: "https://media0.giphy.com/media/v1.Y2lkPTc5MGI3NjExcjl4OGRkd3cyZnhucnBxN2w3eDBrYmtoNGd4NWNmc3ZzeXE4NHpiZyZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/9OwmQz9oDfaFK0IfQe/giphy.gif" },
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

