import { describe, expect, it } from "vitest";

import { computeWeaknesses } from "./weaknesses";

describe("computeWeaknesses", () => {
  it("usa double_damage_from, não o campo ofensivo", () => {
    const chart = {
      fire: {
        double_damage_from: ["water", "ground", "rock"],
        half_damage_from: ["fire", "grass", "ice", "bug", "steel", "fairy"],
        no_damage_from: [],
      },
    };

    expect(computeWeaknesses(["fire"], chart)).toEqual([
      "ground",
      "rock",
      "water",
    ]);
  });

  it("combina tipos e remove imunidades", () => {
    const chart = {
      normal: {
        double_damage_from: ["fighting"],
        half_damage_from: [],
        no_damage_from: ["ghost"],
      },
      flying: {
        double_damage_from: ["electric", "ice", "rock"],
        half_damage_from: ["fighting", "bug", "grass"],
        no_damage_from: ["ground"],
      },
    };

    expect(computeWeaknesses(["normal", "flying"], chart)).toEqual([
      "electric",
      "ice",
      "rock",
    ]);
  });
});
