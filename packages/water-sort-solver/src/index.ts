// src/index.ts

import { puzzles } from './config/puzzles';
import { solve } from './solver/bfsSolver';
import { Solution } from './types';

function main() {
  console.log('--- Water Sort Puzzle Solver ---');
  console.log('================================');

  // Выбираем, какой пазл решать. Легко переключиться на puzzles.simple для теста.
  const puzzleToSolve = puzzles.example;
  // const puzzleToSolve = puzzles.simple;

  console.log('Initial state:', JSON.stringify(puzzleToSolve));
  console.log('\nSolving...');

  const startTime = Date.now();
  const solution: Solution | null = solve(puzzleToSolve);
  const endTime = Date.now();

  const durationInSeconds = (endTime - startTime) / 1000;

  console.log('================================');

  if (solution) {
    console.log(`✅ Solution found in ${durationInSeconds.toFixed(2)} seconds!`);
    console.log(`Total moves: ${solution.length}`);

    // Форматируем вывод решения в виде (from, to), как в задании
    const formattedSolution = solution.map(move => `(${move.from}, ${move.to})`).join(' ');
    console.log('\nSteps:');
    console.log(formattedSolution);
  } else {
    console.log(`❌ No solution found after ${durationInSeconds.toFixed(2)} seconds.`);
  }
}

// Запускаем основную функцию
main();