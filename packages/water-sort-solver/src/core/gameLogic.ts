// src/core/gameLogic.ts

import { GameState, Tube, Move } from '../types';
import { TUBE_CAPACITY } from '../config/constants';

/**
 * Проверяет, является ли ОДНА пробирка "решенной"
 * (т.е. либо пустая, либо все цвета в ней одинаковые).
 */
export function isTubeSolved(tube: Tube): boolean {
  if (tube.length === 0) {
    return true;
  }
  const firstColor = tube[0];
  return tube.every(color => color === firstColor);
}

/**
 * Проверяет, решена ли вся головоломка (все пробирки решены).
 */
export function isGameSolved(state: GameState): boolean {
  return state.every(isTubeSolved);
}

/**
 * Проверяет, является ли ход валидным согласно всем правилам.
 */
export function isMoveValid(state: GameState, move: Move): boolean {
  const fromTube = state[move.from];
  const toTube = state[move.to];

  if (fromTube.length === 0) {
    return false;
  }

  if (toTube.length === TUBE_CAPACITY) {
    return false;
  }

  if (move.from === move.to) {
    return false;
  }

  // --- УДАЛЕНА НЕПРАВИЛЬНАЯ ОПТИМИЗАЦИЯ ---

  const topColorFrom = fromTube[fromTube.length - 1];

  if (toTube.length > 0) {
    const topColorTo = toTube[toTube.length - 1];
    if (topColorFrom !== topColorTo) {
      return false;
    }
  }

  return true;
}

/**
 * Генерирует массив всех возможных валидных ходов из текущего состояния.
 */
export function getPossibleMoves(state: GameState): Move[] {
  const moves: Move[] = [];
  const tubeCount = state.length;

  for (let from = 0; from < tubeCount; from++) {
    for (let to = 0; to < tubeCount; to++) {
      if (isMoveValid(state, { from, to })) {
        moves.push({ from, to });
      }
    }
  }

  return moves;
}