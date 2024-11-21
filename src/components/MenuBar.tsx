import React, { useState } from 'react';
import { Menu, X, Share2, HelpCircle, Shield } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface MenuBarProps {
  onShowHowToPlay: () => void;
  onShowPrivacy: () => void;
}

export const MenuBar: React.FC<MenuBarProps> = ({ onShowHowToPlay, onShowPrivacy }) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'QuizWordz Boxes',
          text: 'Check out this fun dots and boxes game!',
          url: window.location.href
        });
      } catch (error) {
        console.log('Error sharing:', error);
      }
    }
  };

  const MenuItem: React.FC<{
    icon: React.ReactNode;
    text: string;
    onClick: () => void;
  }> = ({ icon, text, onClick }) => (
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={onClick}
      className="flex items-center gap-3 w-full px-4 py-3 text-left hover:bg-gray-700/50 rounded-lg"
    >
      {icon}
      <span>{text}</span>
    </motion.button>
  );

  return (
    <div className="fixed top-0 left-0 right-0 z-50 bg-gray-900/95 backdrop-blur-sm">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-white">QuizWordz Boxes</h1>
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => setIsOpen(!isOpen)}
          className="p-2 text-white hover:bg-gray-700/50 rounded-lg"
        >
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </motion.button>
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed top-16 right-0 bottom-0 w-64 bg-gray-800 border-l border-gray-700 shadow-lg"
          >
            <div className="p-4">
              <div className="flex flex-col gap-2 text-white">
                <MenuItem
                  icon={<HelpCircle size={20} />}
                  text="How to Play"
                  onClick={() => {
                    onShowHowToPlay();
                    setIsOpen(false);
                  }}
                />
                <MenuItem
                  icon={<Shield size={20} />}
                  text="Privacy"
                  onClick={() => {
                    onShowPrivacy();
                    setIsOpen(false);
                  }}
                />
                <MenuItem
                  icon={<Share2 size={20} />}
                  text="Share"
                  onClick={() => {
                    handleShare();
                    setIsOpen(false);
                  }}
                />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};