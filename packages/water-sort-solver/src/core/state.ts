// src/core/state.ts

import { GameState, Move, Tube } from '../types';
import { TUBE_CAPACITY } from '../config/constants';

/**
 * Применяет ход к состоянию и возвращает НОВОЕ состояние (иммутабельно).
 * @param state - Исходное состояние игры.
 * @param move - Ход, который нужно применить.
 * @returns Новое состояние игры после хода.
 */
export function applyMove(state: GameState, move: Move): GameState {
  // 1. Создаем глубокую копию состояния, чтобы не изменять оригинал.
  const newState: GameState = state.map(tube => [...tube]);

  const fromTube: Tube = newState[move.from];
  const toTube: Tube = newState[move.to];

  if (fromTube.length === 0) {
    // На всякий случай, хотя isMoveValid не должен такого допустить.
    return newState;
  }

  const topColor = fromTube[fromTube.length - 1];
  let dropsToMoveCount = 0;

  // 2. Считаем, сколько капель одного цвета сверху в пробирке-источнике.
  for (let i = fromTube.length - 1; i >= 0; i--) {
    if (fromTube[i] === topColor) {
      dropsToMoveCount++;
    } else {
      break;
    }
  }

  // 3. Определяем, сколько капель мы можем перелить.
  // Это либо все капли одного цвета сверху, либо столько, сколько поместится.
  const availableSpace = TUBE_CAPACITY - toTube.length;
  const actualMoveCount = Math.min(dropsToMoveCount, availableSpace);

  // 4. Переливаем капли из одной пробирки в другую.
  for (let i = 0; i < actualMoveCount; i++) {
    const drop = fromTube.pop()!; // Убираем сверху из источника
    toTube.push(drop);           // Добавляем сверху в приемник
  }

  return newState;
}