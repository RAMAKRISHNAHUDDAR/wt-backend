export const generateCoordinatorCode = (club, year) => {
  const MAP = {
    HR_LITERARY: "HRL",
    CDC: "CDC",
    MEDIA: "MED",
    CULTURAL: "CUL",
    WOMEN_EMPOWERMENT: "WEP",
    FINE_ARTS: "FAS"
  };

  return `${MAP[club]}${year}`;
};
