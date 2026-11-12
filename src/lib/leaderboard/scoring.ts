/**
 * Rumus skor tiap game untuk leaderboard. Dihitung dari keadaan game yang sudah ada,
 * supaya kode game hanya perlu memanggil fungsi ini di layar hasil.
 * Batas maksimumnya dicatat di src/lib/leaderboard/games.ts.
 */

/** Racik Masakan Jawa: 10 per bahan benar, 50 per masakan selesai, plus sisa detik kalau semua masakan selesai. */
export function scoreRacikMasakan(input: {
  recipeIngredientCounts: number[];
  completedRecipes: number;
  ingredientsInCurrentRecipe: number;
  timeLeft: number;
}): number {
  const { recipeIngredientCounts, completedRecipes, ingredientsInCurrentRecipe, timeLeft } = input;
  const allDone = recipeIngredientCounts.length > 0 && completedRecipes >= recipeIngredientCounts.length;
  const ingredientsFromCompleted = recipeIngredientCounts.slice(0, completedRecipes).reduce((sum, n) => sum + n, 0);
  const correctIngredients = ingredientsFromCompleted + (allDone ? 0 : ingredientsInCurrentRecipe);
  return correctIngredients * 10 + completedRecipes * 50 + (allDone ? Math.max(0, timeLeft) : 0);
}

/** Dari Kota Mana?: 100 per masakan ditemukan, plus 5 x sisa detik kalau semuanya ditemukan. */
export function scoreDariKotaMana(input: { found: number; total: number; timeLeft: number }): number {
  const allFound = input.total > 0 && input.found >= input.total;
  return input.found * 100 + (allFound ? Math.max(0, input.timeLeft) * 5 : 0);
}

/** Kenali Masakanmu: 100 per jawaban benar, plus total sisa detik saat menjawab benar. */
export function scoreKenaliMasakan(input: { correct: number; speedBonus: number }): number {
  return input.correct * 100 + Math.max(0, input.speedBonus);
}
