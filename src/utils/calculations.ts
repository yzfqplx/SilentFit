/**
 * Estimates the 1-repetition maximum (1RM) using the Brzycki formula.
 * @param weight The weight lifted.
 * @param reps The number of repetitions performed.
 * @returns The estimated 1RM.
 */
export const calculate1RM = (weight: number, reps: number): number => {
  if (reps < 1 || reps > 36) {
    return weight; // The formula is most accurate for reps between 1 and 10.
  }
  return weight / (1.0278 - 0.0278 * reps);
};
