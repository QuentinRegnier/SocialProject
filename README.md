# SocialProject
## Journal de bord

### Samedi 17 mai 2025
- Création du README, du dossier et initialisation du dépôt git
- Installation d'expo avec la commande :
    ```
    npm install expo  
    ```
- Initialisation du projet expo avec la commande :
    ```
    npm create expo
    ```
- Lancement de la version web/iphone :
    ```
    cd social-project
    npm run web
    npm run ios
    ```
### Dimanche 18 mai 2025
- Création d'une base react-native
- Création d'une NavBar
### Mardi 20 mai 2025
- Création des post (uniquement génération pas création l'utilisateur)
### Jeudi 22 mai 2025
- Ajout du système de like (ui terminer)
- Changement des appels à l'API
- Ajout du refresh des post et de la navbar terminer
- Responsive de la navbar entre SE/11/16Pro terminer
### Vendredi 23 mai 2025
- Système avec expo routeur d'onglet qui ne se recharge pas de façon à rendre plus fluide l'app
- Écran de chargement fluide avec fondu :
```text
[SPLASH]
   ↓ (automatique, via app.json / splash config)
[LOADING SCREEN - index.tsx]
   ↳ Affiche "Mon App"
   ↳ Attend 2.5 secondes minimum (`minDelayPassed`)
   ↳ Vérifie `isConnected`
       ↓
       ├── isConnected === true   → prépare [MAIN]
       └── isConnected === false  → prépare [LOGIN]

       ↓ (montage anticipé en arrière-plan)
[MAIN] ou [LOGIN]
   ↳ Précharge les images distantes avec `Image.prefetch`
   ↳ Attend que le layout soit monté (`onLayout`)
   ↳ Attend que la NavBar soit aussi prête (`onLayout` + image chargée)
   ↳ Une fois tout prêt → `setScreenReady(true)`

       ↓
[_layout.tsx]
   ↳ Surveille `screenReady`
   ↳ Lance le `fade out` de `LoadingScreen`
   ↳ Affiche le contenu final prêt (MAIN + NavBar ou LOGIN)
```              
### Samedi 24 mai 2025 :
- Terminer le loading pour synchroniser le loading également sur la navbar

### Mardi 27 mai 2025 :
- Retirer le chargment des images comme condition du loading
- Ajoute un placeholder au chargement du contenu de `main.tsx`
- Mise en place du cache de l'image de profile **(à tester plus tard puisque le seul moyen de voit si le cache fonctionne est de build l'app)**
- Début de mise en place du cache des informations de l'user sauf qu'actuellement le **json** est dans `assets/data-user` hors on ne peut donc le modifier c'est pourquoi il faudra faire la même chose que pour `profile-image`
### Vendredi 30 mai 2025 :
- Mise en place du chargement asynchrone des posts et des placeholders
- Implémentation du cache expo-image pour les posts
- Mise à jour des placeholders pour les adapter en fonction du post qu'il représente
- Suppréssion de la place que prenait les placeholders ou les posts lorsque `isVisible === false`
- Nettoyage du code en créant des composants qu'on a ensuite importer
### Mercredi 4 juin 2025 :
- Rendre fluide le montage des post lors de l'initialisation de `main.tsx` et dans pour la fonction `refresh`
### Vendredi 6 juin 2025 :
- Ajout de la page `post-image-text.tsx`
- Rendre plus fluide l'annimation de loading princiapale
- Transmettre la page précente lors du click sur post via `NavBar.tsx`
### Mercredi 11 juin 2025 :
- Ajout du liquid glass d'apple pour la navbar
> ❗ pas d'analyse de l'arrière de la navbar donc pas possible sans `expo eject` de rendre dynamique le changement de couleur de la navbar
- Ajout d'icone standardiser pour la navbar
> ❗ pas d'icone standadiser apple il faut pour cela fait une demande à l'api en natif donc avec `expo eject` c'est pourquoi isIOS est toujours faux pour le moment
- Ajout d'un fond flou uniforme pour le header
> ❗ volonté de faire un flou en gradient de plus en plus flou mais disponible qu'après un `expo eject` avec un module natif
- Changement de la police du nom de l'application
- Modification des couleurs de texte des posts
- Alignement du contenu des posts avec le pseudo
- Mis le texte decriptif avant les images
### Jeudi 12 juin 2025 :
- Mis à jour des distributions : 
```
npm install expo@53.0.11 expo-blur@~14.1.5 expo-camera@~16.1.8 expo-image@~2.3.0 expo-linear-gradient@~14.1.5 expo-router@~5.1.0 expo-splash-screen@~0.30.9 expo-symbols@~0.4.5 expo-system-ui@~5.0.8 react-native@0.79.3 react-native-screens@~4.11.1
```
- Redisign totale de la partie caméra sauf du slider de zoom
- Mis à jour vers des icones standardiser SFSYMBOLS et Materials dans `post-image-text.tsx` et `main.tsx`