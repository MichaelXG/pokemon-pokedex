import { describe, expect, it } from "vitest";

import { cardsPerRow } from "@/utils/globalUtils";

describe("cardsPerRow", () => {
  it("coloca pelo menos 1 card", () => {
    expect(cardsPerRow(0)).toBe(1);
    expect(cardsPerRow(80)).toBe(1);
  });

  it("calcula quantos cards cabem na largura", () => {
    expect(cardsPerRow(1148, 156, 16)).toBe(6);
    expect(cardsPerRow(360, 156, 16)).toBe(2);
    expect(cardsPerRow(1920, 156, 16)).toBe(11);
  });
});
