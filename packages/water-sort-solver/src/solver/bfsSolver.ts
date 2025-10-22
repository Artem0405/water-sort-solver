// src/solver/bfsSolver.ts

import { GameState, Solution, Move } from '../types';
import { isGameSolved, getPossibleMoves } from '../core/gameLogic';
import { applyMove } from '../core/state';
import { getCanonicalStateKey } from '../utils/getCanonicalStateKey';

/**
 * Находит решение головоломки с помощью алгоритма поиска в ширину (BFS).
 * Гарантирует нахождение кратчайшего пути по количеству ходов.
 * @param initialState - Начальное состояние головоломки.
 * @returns Массив ходов (решение) или null, если решение не найдено.
 */
export function solve(initialState: GameState): Solution | null {
  // Очередь для состояний, которые нужно посетить.
  // В ней хранятся пары: [состояние, путь_который_к_нему_привел]
  const queue: [GameState, Solution][] = [[initialState, []]];

  // Set для хранения хешей уже посещенных состояний, чтобы не ходить по кругу.
  const visited = new Set<string>();
  visited.add(getCanonicalStateKey(initialState));

  // Ограничитель, чтобы предотвратить бесконечный цикл на нерешаемых задачах
  let iterations = 0;
  const maxIterations = 200000; // Подбери значение, если будет слишком долго

  while (queue.length > 0) {
    iterations++;
    if (iterations > maxIterations) {
      console.error("Превышен лимит итераций. Возможно, задача не имеет решения или слишком сложна.");
      return null;
    }

    // Берем первый элемент из очереди (принцип FIFO для BFS)
    const [currentState, currentPath] = queue.shift()!;

    // Проверяем, не достигли ли мы цели
    if (isGameSolved(currentState)) {
      return currentPath; // Победа! Возвращаем путь, который привел сюда.
    }

    // Генерируем все возможные ходы из текущего состояния
    const possibleMoves = getPossibleMoves(currentState);

    // Пробуем каждый возможный ход
    for (const move of possibleMoves) {
      const newState = applyMove(currentState, move);
      const newStateKey = getCanonicalStateKey(newState);

      // Если мы еще не были в таком состоянии...
      if (!visited.has(newStateKey)) {
        // ...то запоминаем его и добавляем в очередь на рассмотрение.
        visited.add(newStateKey);
        const newPath = [...currentPath, move];
        queue.push([newState, newPath]); // Добавляем в конец очереди
      }
    }
  }

  // Если очередь опустела, а решение не найдено, значит, его не существует.
  return null;
}