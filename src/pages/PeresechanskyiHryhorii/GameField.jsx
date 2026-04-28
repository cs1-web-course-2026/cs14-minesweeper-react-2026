import React from 'react';
import Cell from './Cell';
import styles from './index.module.css';

const GameField = ({ board, onOpen, onFlag }) => (
  <div className={styles.field}>
    {board.map((row, r) => 
      row.map((cell, c) => (
        <Cell 
          key={`${r}-${c}`} 
          r={r} c={c} 
          cell={cell} 
          onOpen={onOpen} 
          onFlag={onFlag} 
        />
      ))
    )}
  </div>
);

export default GameField;