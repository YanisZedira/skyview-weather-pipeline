# 🌍 SkyView - Global Weather & Air Quality Monitoring

[![Pipeline Status](https://img.shields.io/badge/Pipeline-Active-success)](https://cloud.google.com)
[![Dashboard](https://img.shields.io/badge/Dashboard-Looker%20Studio-blue)](https://lookerstudio.google.com)
[![License](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

> Système complet de surveillance météorologique et de qualité de l'air à l'échelle mondiale, avec pipeline ETL automatisée, dashboard analytique et application grand public.

![SkyView Architecture](architecture/architecture_diagram.png)

---

## 🎯 Problématique

Chaque jour, **4 millions de personnes** respirent un air dangereux pour leur santé (OMS). Pourtant, les données météo et de qualité de l'air restent :
- **Fragmentées** entre des dizaines de sources
- **Éphémères** sans historisation exploitable
- **Déconnectées** de toute analyse décisionnelle

**SkyView résout ce problème.**

---

## 💡 Notre Solution

SkyView est un écosystème data complet composé de 3 briques :

| Composant | Description |
|-----------|-------------|
| **🔄 Pipeline ETL** | Collecte automatique quotidienne à 12h (22 villes, 6 continents) |
| **📊 Dashboard** | Tableau de bord Looker Studio connecté en temps réel |
| **📱 Application** | MeteoWow - Application météo grand public |

---


### Technologies utilisées

| Service | Rôle |
|---------|------|
| **Cloud Scheduler** | Orchestration (déclenchement quotidien) |
| **Cloud Function** | ETL Python (Extract, Transform, Load) |
| **BigQuery** | Data Warehouse (stockage analytique) |
| **Looker Studio** | Visualisation & Dashboard |
| **OpenWeatherMap API** | Source données météo |
| **OpenAQ API** | Source données qualité de l'air |

---

## 🌍 Couverture Géographique

### 22 villes sur 6 continents

| Continent | Villes |
|-----------|--------|
| Europe | Paris, Londres, Berlin |
| Amérique du Nord | New York, Los Angeles, Toronto |
| Amérique du Sud | São Paulo, Buenos Aires, Lima |
| Afrique | Lagos, Le Caire, Johannesburg, Alger, Oran, Khenchela |
| Asie | Tokyo, Shanghai, Mumbai, Djeddah |
| Océanie | Sydney, Melbourne, Auckland |

---


---

## 🚀 Déploiement

### Prérequis
- Compte Google Cloud Platform
- Clé API OpenWeatherMap
- Python 3.11+

### 1. Déployer la Cloud Function

```bash
cd pipeline/cloud_function
gcloud functions deploy collect-weather-daily \
  --runtime python311 \
  --trigger-http \
  --allow-unauthenticated \
  --region europe-west1
