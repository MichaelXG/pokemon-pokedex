import { describe, expect, it } from "vitest";

import { getGenderDistribution } from "./gender";

describe("getGenderDistribution", () => {
  it("marca -1 como sem gênero", () => {
    expect(getGenderDistribution(-1)).toEqual({
      male: "Genderless",
      female: "Genderless",
    });
  });

  it("trata 0 como 100% macho", () => {
    expect(getGenderDistribution(0)).toEqual({
      male: "100%",
      female: "0%",
    });
  });

  it("trata 8 como 100% fêmea", () => {
    expect(getGenderDistribution(8)).toEqual({
      male: "0%",
      female: "100%",
    });
  });

  it("calcula 1/8 como 12.5% fêmea", () => {
    expect(getGenderDistribution(1)).toEqual({
      male: "87.5%",
      female: "12.5%",
    });
  });

  it("calcula 4/8 como 50/50", () => {
    expect(getGenderDistribution(4)).toEqual({
      male: "50%",
      female: "50%",
    });
  });
});
