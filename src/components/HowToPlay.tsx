import React from 'react';
import { motion } from 'framer-motion';
import { X } from 'lucide-react';

interface HowToPlayProps {
  onClose: () => void;
  onDontShowAgain: () => void;
}

export const HowToPlay: React.FC<HowToPlayProps> = ({ onClose, onDontShowAgain }) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/75 backdrop-blur-sm flex items-center justify-center z-50"
    >
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.8, opacity: 0 }}
        className="bg-gray-800 rounded-xl p-8 max-w-md w-full mx-4 relative"
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-white"
        >
          <X size={24} />
        </button>

        <h2 className="text-2xl font-bold text-white mb-6">How to Play</h2>
        
        <div className="space-y-4 text-gray-300">
          <p>1. Take turns connecting dots with lines.</p>
          <p>2. When you complete a box, it's captured in your color and you get a bonus turn!</p>
          <p>3. The player with the most boxes when the grid is full wins.</p>
          
          <div className="mt-8 space-y-2">
            <p className="text-sm text-emerald-400">🟢 Player 1: Green boxes</p>
            <p className="text-sm text-blue-400">🔵 Player 2/Computer: Blue boxes</p>
          </div>
        </div>

        <div className="mt-8 space-y-4">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={onClose}
            className="w-full px-6 py-3 bg-emerald-500 text-white font-semibold rounded-lg hover:bg-emerald-600"
          >
            Got it!
          </motion.button>
          
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={onDontShowAgain}
            className="w-full px-6 py-3 bg-gray-700 text-gray-300 font-semibold rounded-lg hover:bg-gray-600"
          >
            Don't show again
          </motion.button>
        </div>
      </motion.div>
    </motion.div>
  );
};