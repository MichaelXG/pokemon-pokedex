export const DEFAULT_LIMIT = 6;
export const MIN_CARD_WIDTH = 156;
export const MAX_PAGE_SIZE = 48;
export const GRID_GAP = 16;

export function cardsPerRow(
  width: number,
  minCardWidth = MIN_CARD_WIDTH,
  gap = GRID_GAP
) {
  if (width <= 0) return 1;
  return Math.max(1, Math.min(MAX_PAGE_SIZE, Math.floor((width + gap) / (minCardWidth + gap))));
}

export const MALE_IMAGE = "/icons/male.svg";
export const FEMALE_IMAGE = "/icons/female.svg";

export const formatId = (id: number | undefined | null) => {
  if (id === undefined || id === null) {
    return "0000";
  }
  return id.toString().padStart(4, "0");
};

export const formatName = (name: string | undefined) => {
  if (!name) {
    return "";
  }
  return name
    .split(/[-\s]+/)
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
};
