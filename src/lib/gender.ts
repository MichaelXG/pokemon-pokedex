export interface GenderDistribution {
  male: string;
  female: string;
}

/**
 * gender_rate na PokéAPI: chance de ser fêmea em oitavos, ou -1 sem gênero.
 * 0 = 100% macho · 8 = 100% fêmea
 */
export function getGenderDistribution(genderRate: number): GenderDistribution {
  if (genderRate === -1) {
    return { male: "Genderless", female: "Genderless" };
  }

  if (!Number.isFinite(genderRate) || genderRate < 0 || genderRate > 8) {
    return { male: "Unknown", female: "Unknown" };
  }

  const femaleRatio = (genderRate / 8) * 100;
  const maleRatio = 100 - femaleRatio;

  const format = (value: number) =>
    Number.isInteger(value) ? `${value}%` : `${value.toFixed(1)}%`;

  return {
    male: format(maleRatio),
    female: format(femaleRatio),
  };
}
