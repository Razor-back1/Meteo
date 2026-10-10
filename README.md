# Météo Leuze

App de la station météo personnelle **IGHEZE29** (Weather Underground) : conditions en direct,
prévisions, METAR, courbes sur 30 jours et historique (jour, mois, année, période).

**Utiliser l'app** : https://razor-back1.github.io/Meteo/ — sur iPhone, ouvrir dans Safari →
Partager → « Sur l'écran d'accueil ».

## Archive

Chaque nuit, la tâche GitHub Actions `Archive météo` (`.github/workflows/meteo-archive.yml`) lit la
journée terminée de la station et l'enregistre dans `data/` :

- `data/days/AAAA/AAAA-MM-JJ.json` : toutes les mesures d'une journée ;
- `data/AAAA.json` : un résumé par jour pour l'année ;
- `data/index.json` : période couverte, années disponibles.

Elle a besoin du secret `WU_KEY` (clé API Weather Underground) dans Settings → Secrets and variables → Actions.

Historique : l'app vivait dans le dossier `/meteo` du dépôt Potager jusqu'au 10 octobre 2026.
