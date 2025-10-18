export const CATEGORY_OPTIONS = [
  { value: "", label: "Select a category" },
  { value: "Food", label: "Food" },
  { value: "Politics", label: "Politics" },
  { value: "Travel", label: "Travel" },
  { value: "Inspiration", label: "Inspiration" },
  { value: "News", label: "News" },
  { value: "Food & Recipes", label: "Food & Recipes" },
  { value: "Photo & Design", label: "Photo & Design" },
  { value: "Productivity", label: "Productivity" },
] as const;

export type CategoryOption = (typeof CATEGORY_OPTIONS)[number];
