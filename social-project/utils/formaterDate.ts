import { getText } from '../utils/getText';

export function formaterDate(dateString: string): string {
  const moisNoms = [
    'janvier', 'février', 'mars', 'avril', 'mai', 'juin',
    'juillet', 'août', 'septembre', 'octobre', 'novembre', 'décembre'
  ];

  const [datePart, timePart] = dateString.split(' ');
  const [jour, mois, annee] = datePart.split('-').map(Number);
  const [heure, minute] = timePart.split(':').map(Number);
  const dateEntree = new Date(annee, mois - 1, jour, heure, minute);

  const maintenant = new Date();
  const differenceMs = maintenant.getTime() - dateEntree.getTime();
  const differenceHeures = Math.floor(differenceMs / (1000 * 60 * 60));

  if (differenceHeures < 1) {
    return getText(0, "fr");
  } else if (differenceHeures < 24) {
    return getText(1, "fr").replace("{0}", differenceHeures.toString());
  } else {
    return `${jour} ${moisNoms[mois - 1]} ${annee}`;
  }
}