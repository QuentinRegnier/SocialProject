import * as FileSystem from 'expo-file-system';

const documentDirectory = FileSystem.documentDirectory || '';

/**
 * Vérifie si un fichier existe dans le système de fichiers local
 * @param name Nom du fichier (ex: "data.json")
 * @returns boolean
 */
export async function searchFileSystem(name: string): Promise<string | null> {
  const fileUri = documentDirectory + name;
  const fileInfo = await FileSystem.getInfoAsync(fileUri);
  return fileInfo.exists ? fileUri : null;
}

/**
 * Récupère le contenu d’un fichier JSON local
 * @param name Nom du fichier
 * @returns string | null
 */
export async function fetchFileSystem(name: string): Promise<string | null> {
  const fileUri = documentDirectory + name;
  const exists = await searchFileSystem(name);
  if (!exists) return null;

  try {
    const content = await FileSystem.readAsStringAsync(fileUri);
    return content;
  } catch (error) {
    console.warn(`Erreur lecture fichier ${name} :`, error);
    return null;
  }
}

/**
 * Sauvegarde un fichier localement, soit depuis une URL distante, soit depuis des données JSON
 * @param name Nom du fichier (ex: "profile.json" ou "image.jpg")
 * @param url Optionnel : URL d’un fichier à télécharger
 * @param data Optionnel : Données JSON à écrire
 * @returns boolean (succès)
 */
export async function setFileSystem(name: string, url?: string, data?: any): Promise<boolean> {
  const fileUri = documentDirectory + name;

  try {
    if (url) {
      const downloadResumable = FileSystem.createDownloadResumable(url, fileUri);
      const result = await downloadResumable.downloadAsync();
      return !!result?.uri;
    } else if (data !== undefined) {
      const json = JSON.stringify(data);
      await FileSystem.writeAsStringAsync(fileUri, json);
      return true;
    } else {
      console.warn('Ni URL ni données fournies pour setFileSystem');
      return false;
    }
  } catch (error) {
    console.warn(`Erreur d'enregistrement fichier ${name} :`, error);
    return false;
  }
}