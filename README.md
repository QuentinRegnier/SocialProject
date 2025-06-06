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
