import React, { useState } from 'react';
import './App.css';

/*
PUBLIC_INTERFACE
App: Main component rendering an interactive minimalistic Tic Tac Toe game.
- Interactive board
- Player turn indicator
- Win/draw detection
- Restart button
- Score tracking
- Centered, minimalistic layout, light theme, custom color variables
*/
const BOARD_SIZE = 3;

const PLAYER_X = 'X';
const PLAYER_O = 'O';

const defaultScores = { X: 0, O: 0 };

function calculateWinner(squares) {
  // Returns 'X', 'O' or null if no winner
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    // columns
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    // diagonals
    [0, 4, 8],
    [2, 4, 6],
  ];
  for (let line of lines) {
    const [a, b, c] = line;
    if (
      squares[a] &&
      squares[a] === squares[b] &&
      squares[a] === squares[c]
    ) {
      return squares[a];
    }
  }
  return null;
}

function isDraw(squares) {
  return squares.every(Boolean) && !calculateWinner(squares);
}

// PUBLIC_INTERFACE
function App() {
  // Game state
  const [squares, setSquares] = useState(Array(BOARD_SIZE * BOARD_SIZE).fill(null));
  const [xIsNext, setXIsNext] = useState(true);
  const [scores, setScores] = useState(defaultScores);
  const [gameResult, setGameResult] = useState(null); // 'X', 'O', or 'draw'

  function currentPlayer() {
    return xIsNext ? PLAYER_X : PLAYER_O;
  }

  function handleSquareClick(idx) {
    if (squares[idx] || gameResult) return;

    const nextSquares = squares.slice();
    nextSquares[idx] = currentPlayer();
    const winner = calculateWinner(nextSquares);
    const draw = isDraw(nextSquares);

    setSquares(nextSquares);

    if (winner) {
      setGameResult(winner);
      setScores((prev) => ({
        ...prev,
        [winner]: prev[winner] + 1,
      }));
    } else if (draw) {
      setGameResult('draw');
    } else {
      setXIsNext((prev) => !prev);
    }
  }

  // PUBLIC_INTERFACE
  function handleRestart() {
    setSquares(Array(BOARD_SIZE * BOARD_SIZE).fill(null));
    setGameResult(null);
    setXIsNext(prev => (gameResult === 'draw' ? !prev : prev)); // Alternate starting player after a draw
  }

  // Color CSS vars: --accent: #ffeb3b; --primary: #314f6d; --secondary: #5e1c1c
  // Used below via inline style or custom classes.

  return (
    <div className="ttt-root">
      {/* Player and Score Info */}
      <div className="ttt-player-info">
        <div className="ttt-title">
          <span className="ttt-logo" aria-label="Tic Tac Toe" style={{ color: 'var(--accent)' }}>◻️</span>
          <span style={{color:'var(--primary)'}}>Tic Tac Toe</span>
        </div>
        <div className="ttt-scoreboard">
          <span className={`ttt-score ttt-x ${currentPlayer() === PLAYER_X && !gameResult ? 'ttt-active' : ''}`}>
            X&nbsp;({scores.X})
          </span>
          <span className="ttt-divider">:</span>
          <span className={`ttt-score ttt-o ${currentPlayer() === PLAYER_O && !gameResult ? 'ttt-active' : ''}`}>
            O&nbsp;({scores.O})
          </span>
        </div>
        <div className="ttt-turn-indicator">
          {gameResult === 'draw' && <span style={{color:'var(--secondary)'}}>It's a draw.</span>}
          {gameResult === PLAYER_X && <span style={{color:'var(--primary)'}}>Player X wins!</span>}
          {gameResult === PLAYER_O && <span style={{color:'var(--secondary)'}}>Player O wins!</span>}
          {!gameResult && (
            <span>
              <span style={{color:currentPlayer()===PLAYER_X ? 'var(--primary)' : 'var(--secondary)'}}>Player {currentPlayer()}'s turn</span>
            </span>
          )}
        </div>
      </div>

      {/* Game Board */}
      <div className="ttt-board-container">
        <Board
          squares={squares}
          onSquareClick={handleSquareClick}
          disabled={!!gameResult}
        />
      </div>

      {/* Controls */}
      <div className="ttt-controls">
        <button className="ttt-btn ttt-btn-restart" onClick={handleRestart}>
          Restart Game
        </button>
      </div>
    </div>
  );
}

// PUBLIC_INTERFACE
function Board({ squares, onSquareClick, disabled }) {
  // Renders the tic tac toe board, 3x3
  return (
    <div className="ttt-board" role="grid" aria-label="Tic Tac Toe Board">
      {squares.map((val, i) => (
        <Square
          key={i}
          value={val}
          onClick={() => onSquareClick(i)}
          disabled={disabled || Boolean(val)}
        />
      ))}
    </div>
  );
}

// PUBLIC_INTERFACE
function Square({ value, onClick, disabled }) {
  return (
    <button 
      className={`ttt-square${disabled ? " ttt-square-disabled" : ""}${value === "X" ? " is-x" : value === "O" ? " is-o" : ""}`}
      onClick={onClick}
      disabled={disabled}
      aria-label={value ? `cell ${value}` : "empty cell"}
      tabIndex="0"
    >
      {value}
    </button>
  );
}

export default App;
