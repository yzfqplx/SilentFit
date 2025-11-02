import type { TrainingRecord } from '../types/data';

/**
 * Generates a recommendation for the next workout based on the last workout.
 * @param lastWorkout The last training record for a specific exercise.
 * @returns A recommendation for the next workout, or null if no recommendation can be made.
 */
export const generateRecommendation = (lastWorkout: TrainingRecord | null): Partial<TrainingRecord> | null => {
  if (!lastWorkout) {
    return null;
  }

  // Simple progressive overload: if the last workout was completed, suggest a small weight increase.
  if (lastWorkout.completed) {
    return {
      weightKg: lastWorkout.weightKg + 2.5,
      sets: lastWorkout.sets,
      reps: lastWorkout.reps,
    };
  }

  return null;
};
