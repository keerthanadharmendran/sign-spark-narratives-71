
import React from 'react';

interface SignAvatarProps {
  poseData?: number[][];
  isPlaying: boolean;
  word: string;
}

const SignAvatar: React.FC<SignAvatarProps> = ({ poseData, isPlaying, word }) => {
  return (
    <div className="w-full h-64 border rounded-lg overflow-hidden shadow-sm bg-gradient-to-b from-blue-50 to-blue-100 flex flex-col items-center justify-center">
      <div className="text-center p-4">
        <div className="w-32 h-32 mx-auto mb-4 rounded-full bg-blue-100 border border-blue-200 flex items-center justify-center">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            className="w-16 h-16 text-blue-500"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <circle cx="12" cy="8" r="5" />
            <path d="M3 21v-2a7 7 0 0 1 14 0v2" />
          </svg>
        </div>
        <p className="text-sm text-gray-600">
          {isPlaying ? 'Animating sign for' : 'Sign for'} "{word}"
        </p>
        <p className="text-xs text-gray-500 mt-2">
          {poseData ? `${poseData.length} animation frames available` : 'No 3D data available'}
        </p>
      </div>
      <div className="absolute bottom-2 left-0 right-0 text-center text-xs text-gray-600 bg-white/70 py-1">
        Avatar representation for "{word}"
      </div>
    </div>
  );
};

export default SignAvatar;
