# Aide à la Paternité

[![Licence](https://img.shields.io/badge/Licence-MIT-blue.svg)](LICENSE)
[![Build](https://img.shields.io/badge/build-passing-brightgreen.svg)]()

## Objectif du projet

Ce projet vise à fournir une plateforme d'aide et d'informations pour les futurs et jeunes pères, afin de les accompagner dans leur parcours de paternité. L'application propose un guide étape par étape, des conseils culinaires, et un espace de notes personnelles.

## Fonctionnalités

- **Guide de paternité** : Parcours complet du désir d'enfant aux premières années
- **Conseils culinaires** : Guide nutritionnel pour accompagner la grossesse
- **Notes personnelles** : Espace privé pour noter ses pensées et questions
- **Authentification** : Système de connexion sécurisé avec Firebase
- **Interface responsive** : Design moderne et adaptatif

## Technologies utilisées

- **React 19** avec Vite
- **Tailwind CSS** pour le styling
- **Firebase** pour l'authentification et la base de données
- **Phosphor Icons** pour les icônes
- **ESLint** pour la qualité du code

## Installation

```bash
# Cloner le dépôt
git clone <url-du-depot>
cd aide-paternite

# Installer les dépendances
npm install
```

## Configuration

1. Copiez le fichier `.env.example` vers `.env`
2. Configurez vos variables d'environnement Firebase :

```env
VITE_FIREBASE_API_KEY=your_api_key_here
VITE_FIREBASE_AUTH_DOMAIN=your_project_id.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project_id.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
VITE_FIREBASE_MEASUREMENT_ID=your_measurement_id
VITE_APP_ID=aide-paternite
```

## Lancement du projet

```bash
# Mode développement
npm run dev

# Build de production
npm run build

# Prévisualisation du build
npm run preview

# Linting
npm run lint

# Formatage du code
npm run format
```

## Structure du projet

```
src/
├── components/          # Composants React
│   └── FirebaseTest.jsx
├── services/           # Services (Firebase, etc.)
│   └── firebase.js
├── App.jsx            # Composant principal
├── main.jsx           # Point d'entrée
└── index.css          # Styles globaux avec Tailwind
```

## Améliorations récentes

- ✅ Correction des conflits CSS entre les styles globaux et Tailwind
- ✅ Optimisation du bundle avec code splitting
- ✅ Implémentation du lazy loading pour les composants
- ✅ Configuration PostCSS correcte pour Tailwind CSS
- ✅ Suppression des styles CSS redondants
- ✅ Amélioration de la structure du projet

## Contribution

1. Forkez le dépôt
2. Créez une branche (`git checkout -b feature/ma-nouvelle-fonctionnalite`)
3. Commitez vos modifications (`git commit -am 'Ajout d'une nouvelle fonctionnalité'`)
4. Poussez la branche (`git push origin feature/ma-nouvelle-fonctionnalite`)
5. Ouvrez une Pull Request

## Licence

Ce projet est sous licence MIT. Voir le fichier [LICENSE](LICENSE) pour plus d'informations.
