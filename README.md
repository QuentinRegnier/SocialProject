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
    [SPLASH] 
        ↓ (automatique, via Expo config)
    [LOADING SCREEN - index.tsx]
        ↳ Affiche "Mon App"
        ↳ Attends 2.5s (minDelay)
        ↳ Vérifie isConnected
            ↓
            ↳ Si isConnected === true → préparer [MAIN]
            ↳ Sinon                  → préparer [LOGIN]

            ↓ (montage en arrière-plan)
    [MAIN] ou [LOGIN]
        ↳ Préchargement des images (Image.prefetch)
        ↳ Attente du layout complet (onLayout)
        ↳ Attente de la `NavBar` (préchargée + onLayout)
        ↳ Une fois tout prêt → setScreenReady(true)
        ↓
    [_layout.tsx]
        ↳ Attend screenReady === true
        ↳ Lance animation de fondu (fade out de loading)
        ↳ Affiche entièrement [MAIN + NavBar] ou [LOGIN]
                