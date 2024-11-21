import React, { useState, useCallback, useEffect } from 'react';
import { AnimatePresence } from 'framer-motion';
import { GameControls } from './GameControls';
import { ScoreBoard } from './ScoreBoard';
import { GameGrid } from './GameGrid';
import { TurnIndicator } from './TurnIndicator';
import { GameOverlay } from './GameOverlay';
import { MenuBar } from './MenuBar';
import { HowToPlay } from './HowToPlay';
import { GameMode, GameStatus, Player, Line, Box } from '../types/game';

const GRID_SIZE = 5;
const STORAGE_KEY = 'quizwordz-boxes-tutorial-shown';

export const GameBoard: React.FC = () => {
  const [mode, setMode] = useState<GameMode>('vs-computer');
  const [status, setStatus] = useState<GameStatus>('not-started');
  const [currentPlayer, setCurrentPlayer] = useState<Player>(1);
  const [lines, setLines] = useState<Line[]>([]);
  const [boxes, setBoxes] = useState<Box[]>([]);
  const [scores, setScores] = useState({ player1: 0, player2: 0 });
  const [isComputerTurn, setIsComputerTurn] = useState(false);
  const [isBonus, setIsBonus] = useState(false);
  const [showHowToPlay, setShowHowToPlay] = useState(false);
  const [showPrivacy, setShowPrivacy] = useState(false);

  useEffect(() => {
    const tutorialShown = localStorage.getItem(STORAGE_KEY);
    if (!tutorialShown) {
      setShowHowToPlay(true);
    }
  }, []);

  const handleDontShowAgain = () => {
    localStorage.setItem(STORAGE_KEY, 'true');
    setShowHowToPlay(false);
  };

  const checkForCompletedBoxes = useCallback((
    currentLines: Line[],
    row: number,
    col: number,
    isHorizontal: boolean,
    player: Player
  ): Box[] => {
    const newBoxes: Box[] = [];
    const hasLine = (r: number, c: number, h: boolean) =>
      currentLines.some(l => l.row === r && l.col === c && l.isHorizontal === h);

    if (isHorizontal) {
      // Check box above
      if (row > 0 && 
          hasLine(row - 1, col, true) && // top
          hasLine(row - 1, col, false) && // left
          hasLine(row - 1, col + 1, false)) { // right
        newBoxes.push({ row: row - 1, col, owner: player });
      }
      // Check box below
      if (row < GRID_SIZE - 1 && 
          hasLine(row + 1, col, true) && // bottom
          hasLine(row, col, false) && // left
          hasLine(row, col + 1, false)) { // right
        newBoxes.push({ row, col, owner: player });
      }
    } else {
      // Check box to the left
      if (col > 0 && 
          hasLine(row, col - 1, true) && // top
          hasLine(row, col - 1, false) && // left
          hasLine(row + 1, col - 1, true)) { // bottom
        newBoxes.push({ row, col: col - 1, owner: player });
      }
      // Check box to the right
      if (col < GRID_SIZE - 1 && 
          hasLine(row, col, true) && // top
          hasLine(row + 1, col, true) && // bottom
          hasLine(row, col + 1, false)) { // right
        newBoxes.push({ row, col, owner: player });
      }
    }
    return newBoxes;
  }, []);

  const findBestMove = useCallback(() => {
    // First, look for moves that complete boxes
    for (let row = 0; row < GRID_SIZE; row++) {
      for (let col = 0; col < GRID_SIZE - 1; col++) {
        if (!lines.some(l => l.row === row && l.col === col && l.isHorizontal)) {
          const move = { row, col, isHorizontal: true };
          const testLines = [...lines, { ...move, player: 2 }];
          if (checkForCompletedBoxes(testLines, row, col, true, 2).length > 0) {
            return { row, col, isHorizontal: true };
          }
        }
      }
    }
    for (let row = 0; row < GRID_SIZE - 1; row++) {
      for (let col = 0; col < GRID_SIZE; col++) {
        if (!lines.some(l => l.row === row && l.col === col && !l.isHorizontal)) {
          const move = { row, col, isHorizontal: false };
          const testLines = [...lines, { ...move, player: 2 }];
          if (checkForCompletedBoxes(testLines, row, col, false, 2).length > 0) {
            return { row, col, isHorizontal: false };
          }
        }
      }
    }

    const safeMoves: { row: number; col: number; isHorizontal: boolean }[] = [];
    const riskyMoves: { row: number; col: number; isHorizontal: boolean }[] = [];

    // Check horizontal lines
    for (let row = 0; row < GRID_SIZE; row++) {
      for (let col = 0; col < GRID_SIZE - 1; col++) {
        if (!lines.some(l => l.row === row && l.col === col && l.isHorizontal)) {
          const move = { row, col, isHorizontal: true };
          const testLines = [...lines, { ...move, player: 2 }];
          const wouldGiveBox = checkForCompletedBoxes(testLines, row, col, true, 1).length > 0;
          if (wouldGiveBox) {
            riskyMoves.push(move);
          } else {
            safeMoves.push(move);
          }
        }
      }
    }

    // Check vertical lines
    for (let row = 0; row < GRID_SIZE - 1; row++) {
      for (let col = 0; col < GRID_SIZE; col++) {
        if (!lines.some(l => l.row === row && l.col === col && !l.isHorizontal)) {
          const move = { row, col, isHorizontal: false };
          const testLines = [...lines, { ...move, player: 2 }];
          const wouldGiveBox = checkForCompletedBoxes(testLines, row, col, false, 1).length > 0;
          if (wouldGiveBox) {
            riskyMoves.push(move);
          } else {
            safeMoves.push(move);
          }
        }
      }
    }

    if (safeMoves.length > 0) {
      return safeMoves[Math.floor(Math.random() * safeMoves.length)];
    }
    if (riskyMoves.length > 0) {
      return riskyMoves[Math.floor(Math.random() * riskyMoves.length)];
    }

    return null;
  }, [lines, checkForCompletedBoxes]);

  const makeMove = useCallback((row: number, col: number, isHorizontal: boolean) => {
    if (status !== 'playing' || 
        lines.some(l => l.row === row && l.col === col && l.isHorizontal === isHorizontal)) {
      return;
    }

    // Clear isLastPlayed from all lines
    const updatedLines = lines.map(line => ({ ...line, isLastPlayed: false }));
    
    // Add new line with isLastPlayed set to true
    const newLines = [...updatedLines, { 
      row, 
      col, 
      isHorizontal, 
      player: currentPlayer,
      isLastPlayed: true 
    }];
    
    setLines(newLines);

    // Check for completed boxes
    const completedBoxes = checkForCompletedBoxes(newLines, row, col, isHorizontal, currentPlayer);
    
    if (completedBoxes.length > 0) {
      setIsBonus(true);
      const newBoxes = [...boxes, ...completedBoxes];
      setBoxes(newBoxes);
      
      const newScores = {
        player1: newBoxes.filter(b => b.owner === 1).length,
        player2: newBoxes.filter(b => b.owner === 2).length,
      };
      setScores(newScores);

      // Check if game is finished
      if (newBoxes.length === (GRID_SIZE - 1) * (GRID_SIZE - 1)) {
        setStatus('finished');
        return;
      }

      // Keep the same player's turn when they complete a box
      if (mode === 'vs-computer' && currentPlayer === 2) {
        setTimeout(() => {
          setIsComputerTurn(true);
        }, 750);
      }
    } else {
      setIsBonus(false);
      // Switch players only if no box was completed
      const nextPlayer = currentPlayer === 1 ? 2 : 1;
      setCurrentPlayer(nextPlayer);
      
      if (mode === 'vs-computer' && nextPlayer === 2) {
        setTimeout(() => {
          setIsComputerTurn(true);
        }, 750);
      }
    }
  }, [status, lines, boxes, currentPlayer, mode, checkForCompletedBoxes]);

  useEffect(() => {
    if (status === 'playing' && mode === 'vs-computer' && isComputerTurn && currentPlayer === 2) {
      const computerMove = findBestMove();
      if (computerMove) {
        makeMove(computerMove.row, computerMove.col, computerMove.isHorizontal);
      }
      setIsComputerTurn(false);
    }
  }, [status, mode, isComputerTurn, currentPlayer, findBestMove, makeMove]);

  const handleStart = () => {
    setStatus('playing');
    setCurrentPlayer(1);
    setLines([]);
    setBoxes([]);
    setScores({ player1: 0, player2: 0 });
    setIsComputerTurn(false);
    setIsBonus(false);
  };

  const handleReset = () => {
    setStatus('not-started');
    setCurrentPlayer(1);
    setLines([]);
    setBoxes([]);
    setScores({ player1: 0, player2: 0 });
    setIsComputerTurn(false);
    setIsBonus(false);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <MenuBar 
        onShowHowToPlay={() => setShowHowToPlay(true)}
        onShowPrivacy={() => setShowPrivacy(true)}
      />
      <div className="flex-1 flex flex-col items-center justify-center p-4 mt-8">
        <GameControls
          mode={mode}
          status={status}
          onModeChange={setMode}
          onStart={handleStart}
          onReset={handleReset}
        />
        {status !== 'not-started' && (
          <>
            <ScoreBoard
              mode={mode}
              currentPlayer={currentPlayer}
              scores={scores}
              status={status}
            />
            <TurnIndicator
              mode={mode}
              currentPlayer={currentPlayer}
              isBonus={isBonus}
              status={status}
            />
            <GameGrid
              size={GRID_SIZE}
              lines={lines}
              boxes={boxes}
              status={status}
              onLineClick={makeMove}
            />
          </>
        )}
        {status === 'finished' && (
          <GameOverlay
            mode={mode}
            scores={scores}
            onReset={handleReset}
          />
        )}
      </div>

      <AnimatePresence>
        {showHowToPlay && (
          <HowToPlay
            onClose={() => setShowHowToPlay(false)}
            onDontShowAgain={handleDontShowAgain}
          />
        )}
      </AnimatePresence>

      {showPrivacy && (
        <div className="fixed inset-0 bg-black/75 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-gray-800 rounded-xl p-8 max-w-md w-full mx-4">
            <h2 className="text-2xl font-bold text-white mb-4">Privacy Policy</h2>
            <p className="text-gray-300 mb-6">
              We only store your game preferences locally in your browser. 
              No personal data is collected or shared with third parties.
            </p>
            <button
              onClick={() => setShowPrivacy(false)}
              className="w-full px-6 py-3 bg-emerald-500 text-white font-semibold rounded-lg hover:bg-emerald-600"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};