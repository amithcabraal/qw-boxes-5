import React from 'react';
import { motion } from 'framer-motion';
import { GameMode, Player } from '../types/game';
import { Monitor, User, ArrowRight } from 'lucide-react';

interface TurnIndicatorProps {
  mode: GameMode;
  currentPlayer: Player;
  isBonus: boolean;
  status: 'not-started' | 'playing' | 'finished';
}

export const TurnIndicator: React.FC<TurnIndicatorProps> = ({
  mode,
  currentPlayer,
  isBonus,
  status,
}) => {
  if (status !== 'playing') return null;

  const player2Label = mode === 'vs-computer' ? 'Computer' : 'Player 2';
  const currentPlayerLabel = currentPlayer === 1 ? 'Player 1' : player2Label;
  const PlayerIcon = currentPlayer === 1 ? User : (mode === 'vs-computer' ? Monitor : User);
  const iconColor = currentPlayer === 1 ? 'text-emerald-500' : 'text-blue-400';
  const bgColor = currentPlayer === 1 ? 'bg-emerald-900/50' : 'bg-blue-900/50';

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="mb-6 text-center"
    >
      <motion.div
        animate={{ scale: [1, 1.05, 1] }}
        transition={{ repeat: Infinity, duration: 2 }}
        className={`inline-flex items-center gap-3 px-6 py-3 rounded-xl ${bgColor}`}
      >
        <PlayerIcon size={24} className={iconColor} />
        <div className="flex flex-col items-start">
          <div className="flex items-center gap-2">
            <span className="text-lg font-bold text-white">
              {currentPlayerLabel}'s Turn
            </span>
            {isBonus && (
              <span className="px-2 py-1 text-sm font-semibold text-yellow-300 bg-yellow-900/50 rounded-md">
                Bonus Turn!
              </span>
            )}
          </div>
          <span className="text-sm text-gray-300">
            {isBonus ? "Complete another box to keep playing!" : "Connect dots to make boxes"}
          </span>
        </div>
      </motion.div>
    </motion.div>
  );
};