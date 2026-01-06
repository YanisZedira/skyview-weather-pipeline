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

## 🏗️ Architecture
