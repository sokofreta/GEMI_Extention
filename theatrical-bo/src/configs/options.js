export const scrapeTypeOptions = [
  { value: "actors", label: "Actors" },
  { value: "venues", label: "Venues" },
  { value: "business", label: "business" },
];

export const rangeOptions = Array.from({ length: 1000 }, (_, index) => {
  const start = index * 100;
  const end = start + 100;
  return { start, end };
});

export const urlOptions = [
  { value: "ordino", label: "Ordino" },
  { value: "businessportal", label: "businessportal" },
];
