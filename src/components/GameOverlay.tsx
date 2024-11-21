import React from 'react';
import { motion } from 'framer-motion';
import { Trophy } from 'lucide-react';
import { GameMode } from '../types/game';

interface GameOverlayProps {
  mode: GameMode;
  scores: {
    player1: number;
    player2: number;
  };
  onReset: () => void;
}

export const GameOverlay: React.FC<GameOverlayProps> = ({ mode, scores, onReset }) => {
  const player2Label = mode === 'vs-computer' ? 'Computer' : 'Player 2';
  const winner = scores.player1 > scores.player2 ? 'Player 1' :
                scores.player1 < scores.player2 ? player2Label : null;
  
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="fixed inset-0 bg-black/75 backdrop-blur-sm flex items-center justify-center z-40"
    >
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="bg-gray-800 rounded-xl p-8 max-w-md w-full mx-4 text-center shadow-2xl"
      >
        <div className="mb-6">
          {winner ? (
            <>
              <Trophy className="w-16 h-16 text-yellow-400 mx-auto mb-4" />
              <h2 className="text-3xl font-bold text-white mb-2">
                {winner} Wins!
              </h2>
            </>
          ) : (
            <>
              <div className="w-16 h-16 text-gray-400 mx-auto mb-4 flex items-center justify-center">
                <span className="text-4xl">🤝</span>
              </div>
              <h2 className="text-3xl font-bold text-white mb-2">
                It's a Tie!
              </h2>
            </>
          )}
          <p className="text-gray-400 text-lg">
            Final Score: {scores.player1} - {scores.player2}
          </p>
        </div>
        
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={onReset}
          className="px-6 py-3 text-lg font-semibold text-white bg-emerald-500 rounded-lg shadow-lg hover:bg-emerald-600 transition-colors w-full"
        >
          Play Again
        </motion.button>
      </motion.div>
    </motion.div>
  );
};