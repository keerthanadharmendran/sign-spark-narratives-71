
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
  { id: 1, word: "hello", imageUrl: "https://media0.giphy.com/media/v1.Y2lkPTc5MGI3NjExcW5oazVtcXF2dW5memdlODVzMGg0MWRiNTh0a2RyZHh6Ym8xYTVqYSZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/vBULbuCExwMdCMZQDT/giphy.gif" },
  { id: 2, word: "thank", imageUrl: "https://media.giphy.com/media/hg1hnmXaiDqe6nkJdt/giphy.gif" },
  { id: 3, word: "you", imageUrl: "https://media.giphy.com/media/n8YyMMsbc3aPmKtzuJ/giphy.gif" },
  { id: 4, word: "welcome", imageUrl: "https://media.giphy.com/media/cHuuIrEoSXeYXStcgw/giphy.gif" },
  { id: 5, word: "please", imageUrl: "https://media1.giphy.com/media/v1.Y2lkPTc5MGI3NjExNXM2bjZscTl2cHVzNzhmem12cmRtNHg0cGo1bmc0YWRkdmp0dGJzMyZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/VeJF4iCuQNXinhyaDB/giphy.gif" },
  { id: 6, word: "yes", imageUrl: "https://media1.giphy.com/media/v1.Y2lkPTc5MGI3NjExNWdlbnV1NWp6YnNxMG8ycW1meXc5dHl1dDc1dnJjdzB3cXJ4Znk5OSZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/dkD3V4SGttMaLtPhVQ/giphy.gif" },
  { id: 7, word: "no", imageUrl: "https://media4.giphy.com/media/v1.Y2lkPTc5MGI3NjExZGxrbjV0Z3Bja3Exd2tidmt1dGJldm5yajloZ2h1ZHV0dm1hYXpjYSZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/T1TwUWHEYF3HxL3Yj1/giphy.gif" },
  { id: 8, word: "help", imageUrl: "https://media2.giphy.com/media/v1.Y2lkPTc5MGI3NjExZ3BpYWJjdXM1eDUzYmYyNHNkNGYwaGh2Ynl5bnNua28yeDJ1NG92MSZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/vQeT6CCQXH4f9QQ1dm/giphy.gif" },
  { id: 9, word: "learn", imageUrl: "https://media4.giphy.com/media/v1.Y2lkPTc5MGI3NjExbWU1ejZsejhqczNvNjFrMjZ3ZDV5NTk4aDdwcGNuZDVyZzEyMXBrOCZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/JOlV80bJS8lifznj9r/giphy.gif" },
  { id: 10, word: "sign", imageUrl: "https://media1.giphy.com/media/v1.Y2lkPTc5MGI3NjExeDVkOGlkczI3NmdrMmo0N3liYzlocHdreW1qZGJlcTg1cDM1Zm10YiZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/dLfpi83TD3fn1N0XWn/giphy.gif" },
  { id: 11, word: "this", imageUrl: "https://media3.giphy.com/media/v1.Y2lkPTc5MGI3NjExMjh2NWEzcm94N3JhNDA2ODNnd2F3ZTU5cDBkaTN3aDZoaDZyYnR3aiZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/wfrJ9Ka1ekozqWW7Tr/giphy.gif" },
  { id: 12, word: "is", imageUrl: "https://media.giphy.com/media/3mD5cFXEF0n277FvXw/giphy.gif" },
  { id: 13, word: "all", imageUrl: "https://media.giphy.com/media/WuRQdjzhA0hrXz3lzL/giphy.gif" },
  { id: 14, word: "want", imageUrl: "https://media2.giphy.com/media/v1.Y2lkPTc5MGI3NjExMmp1amhxYTdrMjFxYTN5aWE3YmEycWFiYXNscnlsd3VwZ2RtM2VoayZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/lIVjW7eKT1jjw2Hdrh/giphy.gif" },
  { id: 15, word: "need", imageUrl: "https://media0.giphy.com/media/v1.Y2lkPTc5MGI3NjExYmtja2J0enE3eHE1czdydTBxNmo2Y211cWNuZXdiYjZwcnpmZTR3YiZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/fhN87xuqqsayZy08Rx/giphy.gif" },
  { id: 16, word: "good", imageUrl: "https://media0.giphy.com/media/v1.Y2lkPTc5MGI3NjExYmtja2J0enE3eHE1czdydTBxNmo2Y211cWNuZXdiYjZwcnpmZTR3YiZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/fhN87xuqqsayZy08Rx/giphy.gif" },
  { id: 17, word: "bad", imageUrl: "https://media.giphy.com/media/RNhxYDMJhS3UqDJem9/giphy.gif" },
  { id: 18, word: "sorry", imageUrl: "https://media4.giphy.com/media/v1.Y2lkPTc5MGI3NjExcXdnMGc2dG9udnZ2NDJzMGpvOWJiOGNvcWYyYnduN212ZGNjczNydiZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/rRCrCP5RGUEXeNpzU7/giphy.gif" },
  { id: 19, word: "love", imageUrl: "https://media1.giphy.com/media/v1.Y2lkPTc5MGI3NjExY2NpaWk2dDFxdms2MnltM3NiaXdxOWJsOXh6d3k5cThvdGpybDR6eiZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/hee8Adm7xvfBMqMv6t/giphy.gif" },
  { id: 20, word: "home", imageUrl: "https://media4.giphy.com/media/v1.Y2lkPTc5MGI3NjExcXRsa3RzZHd3cGhjeHBjMHByb3luYmRnMHRzOHJicnVjdGg0YXg5ZyZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/hz6DCaRidDKKXz5qHk/giphy.gif" },
  { id: 21, word: "after", imageUrl: "https://media1.giphy.com/media/v1.Y2lkPTc5MGI3NjExbmd1N3Z1NmZ0OHllMXUxaHhjd2pjMHFqOW12dzBxemRuOXNybTN5eSZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/qpwrBfUnOzzjFfnGCW/giphy.gif"},
  { id: 22, word: "again", imageUrl: "https://media1.giphy.com/media/v1.Y2lkPTc5MGI3NjExZmhodzhjMm8xcjc0OWliZjE3a2Fqcm51NWlwODl3bjg2MzNvZGp2bSZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/Pix2bqJxs48pFWqux0/giphy.gif"},
  { id: 23, word: "against", imageUrl: "https://media3.giphy.com/media/v1.Y2lkPTc5MGI3NjExbjUyN214dHBhdWF0NHdlaDVyenA2bGpudzV2eDBqN2dzOGs3MWU0NiZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/P4C2A1lv6HT2wSWB9I/giphy.gif"},
  { id: 24, word: "age", imageUrl: "https://media4.giphy.com/media/v1.Y2lkPTc5MGI3NjExM214NzhneXRrcnMzc3R4Yzlucm9wbWswaXhwZmtpaWNzdzhzbHNwYyZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/xm03TGv6h0oXEtD788/giphy.gif"},
  { id: 25, word: "thanks", imageUrl: "https://media.giphy.com/media/6hEPIRJImKhyvyCB8e/giphy.gif"},
  { id: 26, word: "alone", imageUrl: "https://media2.giphy.com/media/v1.Y2lkPTc5MGI3NjExMGZzZ290dXl2YzFzMnBhMjh2c2d1czE5ZGFhc2NiaWllNXh5YnI1cyZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/B6Ht4STvJu91rcRajP/giphy.gif"},
  { id: 27, word: "also", imageUrl: "https://media4.giphy.com/media/v1.Y2lkPTc5MGI3NjExY3lhbHdudXJ4ODl0d3Y2NDAydG9sMDdwMWJjNnRxcnJjbWNsaHFmbyZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/Af9YDjUvH2IGlwX42W/giphy.gif"},
  { id: 28, word: "and", imageUrl: "https://media2.giphy.com/media/v1.Y2lkPTc5MGI3NjExZ2U5dnU2YW5pcWt1NW54ZHk2emg1NXpvc2Y5dzN4OWdnbTQxcWlwcSZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/cZMAN91iMLkddIIjjY/giphy.gif"},
  { id: 29, word: "ask", imageUrl: "https://media1.giphy.com/media/v1.Y2lkPTc5MGI3NjExZGoxZjMxdHVibTVzemRxcHhxenIxZjhyMGQzanFqdTd3MzNpOTZqNSZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/J5Up7OtfaC06FxkLlc/giphy.gif"},
  { id: 30, word: "at", imageUrl: "https://media4.giphy.com/media/v1.Y2lkPTc5MGI3NjExNXd6bWpzd2NvNnFoYW9mc2o5aHJob3lxOGp3MmZ3OGhzOXA3Y2Z3aiZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/GOjf2BIltlK92yhUDa/giphy.gif"},
  { id: 31, word: "be", imageUrl: "https://media0.giphy.com/media/v1.Y2lkPTc5MGI3NjExMHA0dGgwa3pyanNmOTB5eHExbjAybGxnZTNtb3ZhN3c0cGc3aTAyMSZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/EbklBaH299q4WyEBEH/giphy.gif"},
  { id: 32, word: "beautiful", imageUrl: "https://media1.giphy.com/media/v1.Y2lkPTc5MGI3NjExZTFsNjJxOTFwcjA5b2swOXdicTJyaXJkcmN2NzY5Mmk3ODBsYmx4bCZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/c8gyETIo6fHn1Qiba0/giphy.gif"},
  { id: 33, word: "before", imageUrl: "https://media2.giphy.com/media/v1.Y2lkPTc5MGI3NjExNXMwNmUydnppMTZvZzZhZHZxc3EwNzEzam5kNXFlZnYxM3preGlscyZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/Sb3OPRVdddO2WmiUYd/giphy.gif"},
  { id: 34, word: "under", imageUrl: "https://media.giphy.com/media/wfrJ9Ka1ekozqWW7Tr/giphy.gif"},
  { id: 35, word: "im", imageUrl: "https://media3.giphy.com/media/v1.Y2lkPTc5MGI3NjExODhsNDE5Y21hZTZ4YmwxYTRqejh2aXg1ZzgzYWlic2F1Nzk1dWJ5aCZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/WfrjEIeCnxGRlnLXX6/giphy.gif"},
  { id: 36, word: "i am", imageUrl: "https://media3.giphy.com/media/v1.Y2lkPTc5MGI3NjExODhsNDE5Y21hZTZ4YmwxYTRqejh2aXg1ZzgzYWlic2F1Nzk1dWJ5aCZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/WfrjEIeCnxGRlnLXX6/giphy.gif"},
  { id: 37, word: "someone", imageUrl: "https://media.giphy.com/media/zE2YBQQRgS8abUI3Ab/giphy.gif"},
  { id: 38, word: "everybody", imageUrl: "https://media.giphy.com/media/kImes55NK7FuIYU0u2/giphy.gif"},
  { id: 39, word: "anybody", imageUrl: "https://media.giphy.com/media/k0rYtPZ2pHPO5aZRvW/giphy.gif"},
  { id: 40, word: "across", imageUrl: "https://media3.giphy.com/media/v1.Y2lkPTc5MGI3NjExa2Z1OTlmNmZleXZ5eTBmZGNiY3VkY2VpZTNqMXB5bGIwd3Jta216cSZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/HnYOqC8oIlGRGpwYXX/giphy.gif"},
  { id: 41, word: "afternoon", imageUrl: "https://media3.giphy.com/media/v1.Y2lkPTc5MGI3NjExOTloamhxMTA0aDFzN3Q0ejM2MmtjODdxMnBsOXc5OGlna283aWd6ZSZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/Gb2noeH16Hbj4LJadY/giphy.gif"},
  { id: 42, word: "animals", imageUrl: "https://media3.giphy.com/media/v1.Y2lkPTc5MGI3NjExeWFidDRoOGRoYzNmc29jYTNydzMwMmF2ajk5c2l5a2FkMmRmMGo5dyZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/3F2GwOUGeIDQPVPUtP/giphy.gif"},
  { id: 43, word: "are", imageUrl: "https://media4.giphy.com/media/v1.Y2lkPTc5MGI3NjExc2tjb2duazF0dTdlZnBtdmtzZWNubjZwdDllcWtoZ2hub2hocmEyeCZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/wqd8EbfuQIg8Xw8ahZ/giphy.gif"},
  { id: 44, word: "artificial", imageUrl: "https://media3.giphy.com/media/v1.Y2lkPTc5MGI3NjExazI0ZjN1emg5cTF2ZHY5MzhyZDYyZ2ZoNWVzNTJkZmNueXd5Zm9kbCZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/3STypy6f5DA5JvtZkc/giphy.gif"},
  { id: 45, word: "bed", imageUrl: "https://media2.giphy.com/media/v1.Y2lkPTc5MGI3NjExYWpsa3Z5ZWl4YmhqamVyM3VjYjVyaGx2emJsa3NydjF1MmRwbWltciZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/LJG3cWVQP5NwFWO3Fs/giphy.gif"},
  { id: 46, word: "because", imageUrl: "https://media.giphy.com/media/NotL1fnOU0cdimkGqY/giphy.gif"},
  { id: 47, word: "breakfast", imageUrl: "https://media1.giphy.com/media/v1.Y2lkPTc5MGI3NjExNmswMGdsY2tsbXR5YTM3aTE0ZndwbDN4M2tsZnkwZjFwYmczaDB6MSZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/JTij6inJMeD7NIl10p/giphy.gif"},
  { id: 48, word: "bodies", imageUrl: "https://media4.giphy.com/media/v1.Y2lkPTc5MGI3NjExbmExcGNzdXdleGF3b3JqNWhnZ243Z2VycThvNzBsZWNuNGN6cnF5OCZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/82nDvndZpHbvkbEsjO/giphy.gif"},
  { id: 49, word: "balanced", imageUrl: "https://media4.giphy.com/media/v1.Y2lkPTc5MGI3NjExdHUxc2U5bWpyazFjZWZvcXVxbXhieWZjejNweG04Njh0enYzempkOSZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/qs3NLVTkcFP5q6mTCt/giphy.gif"},
  { id: 50, word: "care", imageUrl: "https://media2.giphy.com/media/v1.Y2lkPTc5MGI3NjExaXowMDU0Y3BlaGZ1Y2s3aW5rdDVkajFjYXk0NDF3ZXNoZDlkbzQ4MCZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/003kf8NlncvJLXbb2L/giphy.gif"},
  { id: 51, word: "cat", imageUrl: "https://media4.giphy.com/media/v1.Y2lkPTc5MGI3NjExaGl6Mm1kOGt3ODN5NGxxaWVyOXNnMnZ6NzBqNGc3NGcxM3Vpd294biZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/CHL6MCVU6lBsU5MukX/giphy.gif"},
  { id: 52, word: "changed", imageUrl: "https://media2.giphy.com/media/v1.Y2lkPTc5MGI3NjExaDF6ejN4eDA4NnZrbXYxNzN4em0wOXRsd254NnoyaWw3MnM3ZjczbCZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/pPkpvBm1HfZp0u6RpZ/giphy.gif"},
  { id: 53, word: "change", imageUrl: "https://media2.giphy.com/media/v1.Y2lkPTc5MGI3NjExaDF6ejN4eDA4NnZrbXYxNzN4em0wOXRsd254NnoyaWw3MnM3ZjczbCZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/pPkpvBm1HfZp0u6RpZ/giphy.gif"},
  { id: 54, word: "clean", imageUrl: "https://media0.giphy.com/media/v1.Y2lkPTc5MGI3NjExNnZvamo2M2Y5aWlkZXhqamRkZDhxNTkybnMzdTJhNGd5N2FxaGFxdyZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/BoiIILtHgLKrn6ARXm/giphy.gif"},
  { id: 55, word: "communicate", imageUrl: "https://media2.giphy.com/media/v1.Y2lkPTc5MGI3NjExZnkzaG1uaTczZzB4Yml5aDJhcTlidjE5b2k5ZTRzZjk4dHdlcjVxYyZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/1355t5rNeQByR78Efu/giphy.gif"},
  { id: 56, word: "complex", imageUrl: "https://media2.giphy.com/media/v1.Y2lkPTc5MGI3NjExOTFhdWh1NGQ5bXd0Y3BnMDY0Y21nbGlqajhpYm93eHM1eHJxNGIxbCZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/fe99prjNZmbebYeVkp/giphy.gif"},
  { id: 57, word: "convenient", imageUrl: "https://media1.giphy.com/media/v1.Y2lkPTc5MGI3NjExYW9ta254dmY2eGZuODJxcnc0bDYxMm1wM2Z5cjVjMnNxdDF1dzN0ZyZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/zpbJ7Frho9XicRB8JP/giphy.gif"},
  { id: 58, word: "cows", imageUrl: "https://media2.giphy.com/media/v1.Y2lkPTc5MGI3NjExYWZ4ODZkNzVzYmJwbXk3bDFhMzFoeXVzem5xZGp0OGFyemk0Mm92NiZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/YxXqNz4OBu2bkE4aoF/giphy.gif"},
  { id: 59, word: "culture", imageUrl: "https://media3.giphy.com/media/v1.Y2lkPTc5MGI3NjExMXNhemYzM2tjd2llM3R2cjhzNnpma240amhwM3A2NjdnejFoeHBkYyZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/iuTxmz9ANycr7RLeyx/giphy.gif"},
  { id: 60, word: "day", imageUrl: "https://media3.giphy.com/media/v1.Y2lkPTc5MGI3NjExanVsOWlrdmE4Z21jNnEycTFzYWFpeHZuZTMzeGI0cWd3bnVkajQ4MCZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/8RH3wZSnHqifHLCrrO/giphy.gif"},
  { id: 61, word: "dinner", imageUrl: "https://media3.giphy.com/media/v1.Y2lkPTc5MGI3NjExZjduYXlnZnB0emw0M2VjeGs0dnJlbXozd3psZTIzdmF1a3BweGdsNSZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/pGDKHpv4AsN9ctzg1T/giphy.gif"},
  { id: 62, word: "diet", imageUrl: "https://media3.giphy.com/media/v1.Y2lkPTc5MGI3NjExM3d5eW01ZjltazVzcWc1cHY1ZmFjZzdueDhncWZlYTAza3V0ODlsMiZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/fqXVsEM2yJ5As3VRoQ/giphy.gif"},
  { id: 63, word: "diverse", imageUrl: "https://media3.giphy.com/media/v1.Y2lkPTc5MGI3NjExeHJpMW04N2h3MDhhOWF3c3NhMGc2d2tpbHBrOWprcXljN2k0azh1NiZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/g5BFJImWMqVIihbTsV/giphy.gif"},
  { id: 64, word: "dogs", imageUrl: "https://media1.giphy.com/media/v1.Y2lkPTc5MGI3NjExNnNrcHp1ZzY5bzRxY2I2Nzlrc2k4aHN4aTRleWU3cXJsM2dkaTBmbiZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/DWfsZCaZymwlAf7APV/giphy.gif"},
  { id: 65, word: "done", imageUrl: "https://media1.giphy.com/media/v1.Y2lkPTc5MGI3NjExYW9pYjhsdDBkZ2E4MDZhMDNoemJwbmhkcW5qZGR2b3owcnF6NG5rZyZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/vYsZ2MCSVdocAjq5Zw/giphy.gif"},
  { id: 66, word: "eat", imageUrl: "https://media0.giphy.com/media/v1.Y2lkPTc5MGI3NjExMHNreDR2cXBib2VxanhoaHFreHBpeWo2bnEybXYydXE0bHR4ZGN5dyZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/nLzfqeLn4GXzIPomuX/giphy.gif"},
  { id: 67, word: "eggs", imageUrl: "https://media0.giphy.com/media/v1.Y2lkPTc5MGI3NjExb2tiMHNkaThkcjV3aWh3dThvNXY2Znl1OG5xNWlsYWpmbDBsc3ZtbSZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/SdnAIhX7OFfo98qoQq/giphy.gif"},
  { id: 68, word: "enjoy", imageUrl: "https://media4.giphy.com/media/v1.Y2lkPTc5MGI3NjExNHN2ZjFoaG04YnZhOTZ1c2h2NjFyb2piY3VkbmtiaG0yNDluaTY4cyZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/ToAgNbO6MNh019X4Xt/giphy.gif"},
  { id: 69, word: "enough", imageUrl: "https://media2.giphy.com/media/v1.Y2lkPTc5MGI3NjExdnNzNnI5ZTFzd28xdGdxdTloNG82eTdqemN0NDRtbTFpY3c2a3dtaSZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/qCFiZUb9PlS2wDALA5/giphy.gif"},
  { id: 70, word: "evening", imageUrl: "https://media2.giphy.com/media/v1.Y2lkPTc5MGI3NjExbmZwdHVldGt2ZzltNDRmNTQyNGttMXl3em0yNnFqenhseWNha3BwYSZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/WTgtbHfPQwEm2NhRyK/giphy.gif"},
  { id: 71, word: "every", imageUrl: "https://media2.giphy.com/media/v1.Y2lkPTc5MGI3NjExdTVyYTMweDYzb3A4OTUzeTJtejhmb3NyYW9uaW02Z2VtMXVlNTE2aCZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/mRx0C51pbWHpVSqDW7/giphy.gif"},
  { id: 72, word: "exercise", imageUrl: "https://media3.giphy.com/media/v1.Y2lkPTc5MGI3NjExcHlraTRoaXFvZzV3YmxjOW8wODFjOWRlejk3MmZxeDIxdDhlaG1vYSZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/UvCK2lD7Np5lWO0JTV/giphy.gif"},
  { id: 73, word: "experience", imageUrl: "https://media2.giphy.com/media/v1.Y2lkPTc5MGI3NjExYjJkZHBvMm90MW42MnI2M2ZweHk4ZXhia3Nyc29qbHAxNmE3amNkZSZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/ny9w66HZs4hQ8fm51Y/giphy.gif"},

 
  
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
  { id: 110, word: "j", imageUrl: "https://media3.giphy.com/media/v1.Y2lkPTc5MGI3NjExZmgwaHVnMDR5dGFlM3d2bm93bDYxNzB5bDlqZDFoeTBseTR4cDZzeSZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/3VEouB9gIsJxtojmQD/giphy.gif" },
  { id: 111, word: "k", imageUrl: "https://media1.giphy.com/media/v1.Y2lkPTc5MGI3NjExMjJrcTV6cmVvN2toczc2NWM1aTB0YjVybGR1cGs1dGo3MW11ajdjcSZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/7kRBXBDAHh1Kd1upm8/giphy.gif" },
  { id: 112, word: "l", imageUrl: "https://media4.giphy.com/media/v1.Y2lkPTc5MGI3NjExejQyeWlyYmVkdmo5cGY2ZnhrNmszMDNtb3R3dm9jZm4yNjA1bzRpYSZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/lxDlbfZZuOjtoUhpoZ/giphy.gif" },
  { id: 113, word: "m", imageUrl: "https://media0.giphy.com/media/v1.Y2lkPTc5MGI3NjExNWxsaTRwazV5ZzA3MzN5dXNpenhlMWJ2bWphbWVrZzhweHBzdWVhbiZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/RNl7EkE4ZWMT6vesN4/giphy.gif" },
  { id: 114, word: "n", imageUrl: "https://media0.giphy.com/media/v1.Y2lkPTc5MGI3NjExZzhmZDk2dmk0N3h6N3NkZzJmMzNvaTdnb290ZmF4bHNlcjFmZ25xbSZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/PrtmMQbknXa1WJscd5/giphy.gif" },
  { id: 115, word: "o", imageUrl: "https://media0.giphy.com/media/v1.Y2lkPTc5MGI3NjExbHY5dWliNDAzNnd6djlkeHU1ZXJvcWhsbW1hOTk5MG9qbnQ3bWtncSZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/enOBjbqWDjI01fov9Y/giphy.gif" },
  { id: 116, word: "p", imageUrl: "https://media4.giphy.com/media/v1.Y2lkPTc5MGI3NjExcnUyNmQ3YTJrYTR0cTNiOTBzam5wNW8wYTdtcnFrZTc5NXJhazZlNSZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/dvZpZT4VGwsiB0FKON/giphy.gif" },
  { id: 117, word: "q", imageUrl: "https://media1.giphy.com/media/v1.Y2lkPTc5MGI3NjExNzR5MG9qbHZsMHN5cW5peWNoYjZhYmR0ZG1iZjY3eHU4NTVvMHF0cCZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/1xiBZUQZFPO2oPHbsa/giphy.gif" },
  { id: 118, word: "r", imageUrl: "https://media2.giphy.com/media/v1.Y2lkPTc5MGI3NjExY3VsbDJpYjVoZ2xhcHNxbzQxYnIxbWkxbWxxd2N2dmFieHpyYTBndCZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/ulpM8EiAax6j2aB2uE/giphy.gif" },
  { id: 119, word: "s", imageUrl: "https://media4.giphy.com/media/v1.Y2lkPTc5MGI3NjExcjRtbTRwbWI0cDhoNDBlZWxja3V5dGo1cnpsaDJicWU5ODY2dDEzaCZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/TFB3a29spvVaafxCv7/giphy.gif" },
  { id: 120, word: "t", imageUrl: "https://media0.giphy.com/media/v1.Y2lkPTc5MGI3NjExcjl4OGRkd3cyZnhucnBxN2w3eDBrYmtoNGd4NWNmc3ZzeXE4NHpiZyZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/9OwmQz9oDfaFK0IfQe/giphy.gif" },
  { id: 121, word: "u", imageUrl: "https://media0.giphy.com/media/v1.Y2lkPTc5MGI3NjExbHhtdDUzbXU2YTh4MDR5YTY0azkyNzUwMnNmcDhsNjB4dzVzbTFycSZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/GXXyhtPM6rEURnxn8j/giphy.gif" },
  { id: 122, word: "v", imageUrl: "https://media2.giphy.com/media/v1.Y2lkPTc5MGI3NjExemhjcTdlNmlvbTRjbWdxZDB1b2ZlYzVteDkzdjZlMDJxMjZ2NjZ4biZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/Bl523yhJoyEt7ChzpJ/giphy.gif" },
  { id: 123, word: "w", imageUrl: "https://media2.giphy.com/media/v1.Y2lkPTc5MGI3NjExeHE2cjFmMmhqa3RoNHpoNTU4OWRhend1eTA5dXcxMjl0bnF2dWc2YyZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/Q6pOUnSqCILxHhEIqJ/giphy.gif" },
  { id: 124, word: "x", imageUrl: "https://media0.giphy.com/media/v1.Y2lkPTc5MGI3NjExZTRicjBzMGU1N3Bmemp1aWQxYXYyYmxwYzkybTJlOWppdHZ6dHh0MyZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/UpBcWSPBx9ukvVUlWO/giphy.gif" },
  { id: 125, word: "y", imageUrl: "https://media2.giphy.com/media/v1.Y2lkPTc5MGI3NjExMTkwYXNqYzRrZG9wMWdqZGJrcWRzdjA3ZHQyNWcxbDMxbHQ1cjhjOCZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/7zzydpedtH089ZQrEi/giphy.gif" },
  { id: 126, word: "z", imageUrl: "https://media4.giphy.com/media/v1.Y2lkPTc5MGI3NjExbjczYW5xYWt3bGRma3RhNHFmZWNnMXVsOTJybTU1Y2c3eHEzM2h2ZCZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/bi1tZ7pi9bHauguDnL/giphy.gif" }
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

