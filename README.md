# 🚑 ResQ - Plateforme de Dispatching d'Ambulances

Une solution moderne de dispatching d'ambulances développée avec React, TypeScript et Vite. Cette application permet aux opérateurs de régulation de gérer efficacement la flotte d'ambulances et les incidents d'urgence grâce à une visualisation cartographique en temps réel.

---

## ✨ Fonctionnalités

### 🗺️ Cartographie Interactive
- Visualisation en temps réel de la position des ambulances
- Marqueurs d'incidents avec code couleur selon la gravité
- Popups d'information détaillées
- Filtres d'affichage dynamiques
- Zoom et centrage automatique

### 🚨 Gestion des Incidents
- Création d'incidents avec formulaire validé
- Assignation automatique de l'ambulance la plus proche
- Calcul de distance et ETA (temps d'arrivée estimé)
- Suivi en temps réel des interventions
- Mise à jour des statuts

### 📊 Dashboard & Monitoring
- KPIs en temps réel (ambulances disponibles, incidents actifs)
- Graphiques de performance
- Historique des interventions
- Flux d'activité

### 🚗 Gestion de Flotte
- Vue tabulaire de tous les véhicules
- Gestion des statuts (En service, Maintenance, Pause)
- Informations sur l'équipement et l'équipage

---

## 🛠️ Stack Technique

| Technologie | Version | Usage |
|------------|---------|-------|
| **React** | 19.2.0 | Framework UI |
| **TypeScript** | 5.9.3 | Typage statique |
| **Vite** | 7.2.4 | Build tool & dev server |
| **Redux Toolkit** | 2.11.0 | State management |
| **TanStack Query** | 5.90.11 | Server state & caching |
| **React Router** | 7.9.6 | Routing |
| **React-Leaflet** | 5.0.0 | Cartographie interactive |
| **Tailwind CSS** | 4.1.17 | Styling |
| **React Hook Form** | 7.66.1 | Gestion de formulaires |
| **Zod** | 4.1.13 | Validation de schémas |
| **Recharts** | 3.5.0 | Graphiques |
| **Lucide React** | 0.555.0 | Icônes |
| **JSON Server** | 1.0.0-beta.3 | Mock API |

---

## 🚀 Installation et Démarrage

### Prérequis

- Node.js 18+
- npm ou yarn

### Installation

```bash
# Cloner le projet
cd resq

# Installer les dépendances
npm install

# Copier le fichier .env
cp .env.example .env
```

### Lancement

```bash
# Option 1 : Lancer frontend et backend séparément
npm run dev          # Frontend sur http://localhost:5173
npm run server       # API sur http://localhost:5000

# Option 2 : Lancer les deux simultanément
npm run dev:all
```

### Autres commandes

```bash
npm run build        # Build de production
npm run preview      # Prévisualiser le build
npm run lint         # Linter le code
```

---

## 📁 Structure du Projet

```
resq/
├── src/
│   ├── components/          # Composants React
│   │   ├── ui/             # Composants UI réutilisables
│   │   ├── map/            # Composants cartographiques
│   │   ├── dashboard/      # Composants du tableau de bord
│   │   ├── fleet/          # Gestion de flotte
│   │   ├── incidents/      # Gestion d'incidents
│   │   └── layout/         # Layout & navigation
│   ├── pages/              # Pages de l'application
│   ├── services/
│   │   ├── api/           # Configuration API
│   │   └── utils/         # Utilitaires (distance, formatage)
│   ├── store/              # Redux Toolkit
│   │   ├── slices/        # Redux slices
│   │   └── selectors/     # Sélecteurs
│   ├── hooks/              # Custom hooks
│   ├── types/              # Types TypeScript
│   ├── lib/                # Bibliothèques utilitaires
│   └── assets/             # Ressources statiques
├── db.json                 # Base de données JSON Server
├── tailwind.config.js      # Configuration Tailwind
├── DEVELOPMENT_GUIDE.md    # Guide de développement
└── PROJECT_STATUS.md       # Suivi de progression
```

---

## 📊 Modèle de Données

### Ambulance

```typescript
interface Ambulance {
  id: string;
  vehicleNumber: string;        // Ex: "AMB-101"
  licensePlate: string;          // Ex: "AB-123-CD"
  status: AmbulanceStatus;       // AVAILABLE, BUSY, MAINTENANCE, OFFLINE
  currentLocation: Coordinates;
  heading?: number;              // Direction en degrés (0-360)
  baseStation: string;
  equipment: Equipment[];
  crew: CrewMember[];
  lastUpdate: string;
}
```

### Incident

```typescript
interface Incident {
  id: string;
  title: string;
  description: string;
  severity: IncidentSeverity;    // LOW, MEDIUM, HIGH, CRITICAL
  status: IncidentStatus;        // PENDING, ASSIGNED, IN_PROGRESS, COMPLETED
  location: Address;
  patient: Patient;
  assignedAmbulanceId?: string;
  createdAt: string;
  estimatedArrivalTime?: string;
  distance?: number;
  reportedBy: string;
}
```

Voir [src/types/index.ts](src/types/index.ts) pour le modèle complet.

---

## 🗺️ Routes de l'Application

| Route | Page | Description |
|-------|------|-------------|
| `/` | Dashboard | Vue d'ensemble avec KPIs et statistiques |
| `/map` | Carte de Dispatch | Interface opérationnelle principale |
| `/fleet` | Gestion de Flotte | Administration des véhicules |
| `/incidents` | Historique | Journal des interventions passées |

---

## 🔌 API Endpoints (JSON Server)

| Méthode | Endpoint | Description |
|---------|----------|-------------|
| `GET` | `/ambulances` | Liste toutes les ambulances |
| `GET` | `/ambulances/:id` | Détails d'une ambulance |
| `POST` | `/ambulances` | Créer une ambulance |
| `PUT` | `/ambulances/:id` | Modifier une ambulance |
| `DELETE` | `/ambulances/:id` | Supprimer une ambulance |
| `GET` | `/incidents` | Liste tous les incidents |
| `GET` | `/incidents/:id` | Détails d'un incident |
| `POST` | `/incidents` | Créer un incident |
| `PUT` | `/incidents/:id` | Modifier un incident |
| `DELETE` | `/incidents/:id` | Supprimer un incident |
| `GET` | `/activityLogs` | Journal d'activité |

### Exemples de requêtes

```bash
# Récupérer toutes les ambulances disponibles
GET http://localhost:5000/ambulances?status=AVAILABLE

# Récupérer les incidents critiques en attente
GET http://localhost:5000/incidents?severity=CRITICAL&status=PENDING

# Trier les incidents par date de création
GET http://localhost:5000/incidents?_sort=createdAt&_order=desc
```

---

## 🎨 Design System

### Couleurs Principales

- **Primary** : Bleu (`#3b82f6`) - Actions principales
- **Danger** : Rouge (`#ef4444`) - Incidents critiques
- **Warning** : Orange (`#f59e0b`) - Alertes
- **Success** : Vert (`#22c55e`) - Statuts positifs

### Statuts

| Statut Ambulance | Couleur | Icône |
|------------------|---------|-------|
| AVAILABLE | Vert | 🟢 |
| BUSY | Rouge | 🔴 |
| MAINTENANCE | Gris | ⚙️ |
| OFFLINE | Slate | ⚫ |

| Gravité Incident | Couleur | Badge |
|------------------|---------|-------|
| LOW | Vert | ℹ️ |
| MEDIUM | Jaune | ⚠️ |
| HIGH | Orange | ⚠️ |
| CRITICAL | Rouge | 🚨 |

---

## 🎯 User Stories Implémentées

### Régulateur

- ✅ Voir la position de toutes les ambulances sur une carte
- ✅ Créer un nouvel incident avec formulaire validé
- ✅ Assigner l'ambulance la plus proche automatiquement
- ✅ Filtrer les ambulances par statut
- ✅ Modifier le statut d'une ambulance
- ✅ Visualiser l'historique des incidents
- ✅ Recevoir des notifications pour incidents critiques

### Chef de Parc

- ✅ Voir l'état complet de la flotte
- ✅ Ajouter ou retirer un véhicule
- ✅ Gérer l'état des équipements

---

## 🧰 Utilitaires Fournis

### Calcul de Distance (`src/services/utils/distance.ts`)

```typescript
// Formule de Haversine pour calculer la distance entre deux points
calculateDistance(coord1, coord2) → number (km)

// Estime le temps d'arrivée (vitesse moyenne 60 km/h)
calculateETA(distanceKm) → number (minutes)

// Trouve l'ambulance disponible la plus proche
findNearestAmbulance(incidentCoords, ambulances) → { ambulanceId, distance }

// Formate une distance pour affichage
formatDistance(distanceKm) → string
```

### Formatage (`src/services/utils/formatting.ts`)

```typescript
// Formater les dates
formatDate(isoDate, includeTime) → string
timeAgo(isoDate) → string

// Formater les numéros de téléphone marocains
formatPhoneNumber(phoneNumber) → string

// Obtenir les couleurs selon statuts
getSeverityColor(severity) → string (classes Tailwind)
getAmbulanceStatusColor(status) → string
getIncidentStatusColor(status) → string

// Obtenir les labels français
getSeverityLabel(severity) → string
getAmbulanceStatusLabel(status) → string
getIncidentStatusLabel(status) → string
```

---

## 📚 Documentation

- **Guide de développement complet** : [DEVELOPMENT_GUIDE.md](DEVELOPMENT_GUIDE.md)
- **Suivi de progression** : [PROJECT_STATUS.md](PROJECT_STATUS.md)
- **Types TypeScript** : [src/types/index.ts](src/types/index.ts)

---

## 🔐 Variables d'Environnement

Créer un fichier `.env` à la racine (voir `.env.example`) :

```env
# API Configuration
VITE_API_BASE_URL=http://localhost:5000

# Map Configuration
VITE_MAP_DEFAULT_CENTER_LAT=33.5731
VITE_MAP_DEFAULT_CENTER_LNG=-7.5898
VITE_MAP_DEFAULT_ZOOM=13

# Application Settings
VITE_APP_NAME=ResQ
VITE_APP_VERSION=1.0.0
VITE_ENABLE_DEVTOOLS=true
```

---

## 🎯 État d'Avancement

**Phase actuelle** : Phase 2 - Infrastructure (20%)

- ✅ Phase 1 : Configuration de Base (100%)
- 🔄 Phase 2 : Infrastructure (20%)
- ⏳ Phase 3 : Interface Utilisateur (0%)
- ⏳ Phase 4 : Fonctionnalités Avancées (0%)
- ⏳ Phase 5 : Optimisation & Tests (0%)

Voir [PROJECT_STATUS.md](PROJECT_STATUS.md) pour le détail complet.

---

## 🤝 Contribution

Ce projet suit les bonnes pratiques suivantes :

- **TypeScript strict** : Pas de `any`
- **Composants fonctionnels** : Hooks uniquement
- **Redux Toolkit** : State management normalisé
- **TanStack Query** : Pour toutes les requêtes API
- **Tailwind CSS** : Styling cohérent et responsive

---

## 📝 Licence

Ce projet est développé dans le cadre d'un cahier des charges académique.

---

## 🆘 Support et Contact

Pour toute question ou assistance :

- Consulter le [Guide de Développement](DEVELOPMENT_GUIDE.md)
- Vérifier l'[État du Projet](PROJECT_STATUS.md)
- Examiner les exemples dans `db.json`

---

**Dernière mise à jour** : 26 novembre 2025
**Version** : 1.0.0 (Phase 1 complétée)
