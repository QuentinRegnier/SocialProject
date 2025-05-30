export function getText(id: number, language: string): string {
  const fr = [
    "Il y a moins d'1h",
    "Il y a {0} h"
  ];
  if (language === "fr") return fr[id];
  return "";
}