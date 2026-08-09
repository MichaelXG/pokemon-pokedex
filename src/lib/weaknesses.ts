export interface TypeDamageRelations {
  double_damage_from: string[];
  half_damage_from: string[];
  no_damage_from: string[];
}

export function computeWeaknesses(
  defenderTypes: string[],
  chart: Record<string, TypeDamageRelations>
): string[] {
  const attackingTypes = new Set<string>();

  for (const defender of defenderTypes) {
    const relations = chart[defender];
    if (!relations) continue;
    relations.double_damage_from.forEach((t) => attackingTypes.add(t));
    relations.half_damage_from.forEach((t) => attackingTypes.add(t));
    relations.no_damage_from.forEach((t) => attackingTypes.add(t));
  }

  const weaknesses: string[] = [];

  for (const attack of Array.from(attackingTypes)) {
    let multiplier = 1;

    for (const defender of defenderTypes) {
      const relations = chart[defender];
      if (!relations) continue;
      if (relations.no_damage_from.includes(attack)) {
        multiplier = 0;
        break;
      }
      if (relations.double_damage_from.includes(attack)) multiplier *= 2;
      if (relations.half_damage_from.includes(attack)) multiplier *= 0.5;
    }

    if (multiplier >= 2) {
      weaknesses.push(attack);
    }
  }

  return weaknesses.sort();
}
