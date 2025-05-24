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
