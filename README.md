# L'assistant au tri, au réemploi et à la réparation

**Prototype d'un widget iframe intégrable** permettant aux usagers de trouver des solutions pour prolonger la vie de leurs objets, faire des économies et réduire leurs déchets.

Ce prototype est développé dans le cadre du service numérique public [Que faire de mes objets et déchets ?](https://quefairedemesdechets.ademe.fr), opéré par l'[ADEME](https://www.ademe.fr) (Agence de la transition écologique).

---

## Pourquoi ce prototype ?

Le site *Que faire de mes objets et déchets ?* accompagne chaque année plus de 1,5 million d'usagers dans leurs gestes de tri, de réemploi et de réparation. Aujourd'hui, cette aide n'est accessible que sur le site lui-même.

**L'objectif de ce prototype** est d'explorer la faisabilité d'un **widget iframe léger et autonome**, intégrable directement sur les sites de collectivités, médias, services publics et autres partenaires. L'usager pourrait ainsi accéder aux recommandations et solutions sans quitter le site qu'il consulte.

Ce prototype permet de :
- **Valider le parcours utilisateur** en 3 étapes (recherche → territoire → fiche résultat)
- **Tester le rendu visuel** dans un format contraint (iframe, responsive)
- **Évaluer la pertinence des données** affichées (consignes, comptages, carte)
- **Recueillir des retours** avant un éventuel développement en production

## Ce que fait le prototype

### Étape 1 — Recherche d'un objet ou déchet
L'usager recherche un objet parmi 15 catégories (petit électroménager, meubles, vêtements, médicaments…) via une barre de recherche avec autocomplétion, des catégories illustrées ou une liste de recherches populaires.

### Étape 2 — Sélection du territoire
L'usager saisit une adresse ou une commune grâce à l'autocomplétion de l'[API Adresse](https://adresse.data.gouv.fr). Les statistiques nationales pour la catégorie choisie s'affichent en temps réel.

### Étape 3 — Fiche résultat
La fiche affiche :
- **L'info-tri** : un visuel synthétique des consignes de tri pour l'objet
- **Les recommandations** : des accordéons détaillant les actions possibles (donner, réparer, déposer…) avec le nombre de solutions estimées à proximité
- **La carte des lieux** : une carte interactive des points de collecte, réemploi et réparation à proximité (widget [LVAO](https://lvao.ademe.fr))
- **Les solutions complémentaires** : liens vers les services à domicile et solutions en ligne disponibles sur le site Que Faire

## Stack technique

| Composant | Choix |
|---|---|
| **Frontend** | HTML, CSS, JS vanilla — aucun framework |
| **Design system** | [DSFR](https://www.systeme-de-design.gouv.fr) (Système de Design de l'État) |
| **Typographie** | Marianne (police officielle de l'État) |
| **API adresse** | [api-adresse.data.gouv.fr](https://adresse.data.gouv.fr) |
| **Carte** | Widget [LVAO / Longue vie aux objets](https://lvao.ademe.fr) |
| **Données** | Consignes ADEME + comptages issus de [data.gouv.fr](https://www.data.gouv.fr) (375 249 acteurs) |

**Choix d'architecture :** tout est contenu dans un seul fichier `index.html` (données incluses) pour garantir le fonctionnement **sans serveur** — le fichier peut être ouvert directement dans un navigateur.

## Structure du projet

```
├── index.html                    # Application complète (HTML + CSS + JS + données)
├── README.md
├── scripts/
│   └── generate-counts.py        # Script de régénération des comptages depuis le CSV ADEME
└── src/
    ├── assets/
    │   ├── bouilloire.svg         # Icônes des catégories
    │   ├── canapetextile.svg
    │   ├── medicaments.svg
    │   ├── poireau.svg
    │   ├── logos.svg              # Logos République Française / ADEME
    │   └── info-tri/              # 16 visuels info-tri (SVG)
    ├── css/
    │   └── fonts.css              # Déclaration de la police Marianne
    ├── data/
    │   ├── consignes.json         # Consignes de tri par catégorie (référence)
    │   └── counts.json            # Comptages nationaux par catégorie (référence)
    └── fonts/                     # Police Marianne (woff2)
```

> Les fichiers JSON dans `src/data/` servent de **référence**. Les données sont dupliquées en inline dans `index.html` pour permettre le fonctionnement sans serveur.

## Utilisation

### Ouvrir directement
Ouvrir `index.html` dans un navigateur. Aucune installation requise.

### Avec un serveur local (optionnel)
```bash
python3 -m http.server 8090
# → http://localhost:8090
```

### Intégration en iframe
```html
<iframe
  src="https://votre-hebergement.fr/assistant-tri/index.html"
  width="100%"
  height="800"
  frameborder="0"
  title="Assistant au tri, au réemploi et à la réparation"
></iframe>
```

## Données

### Sources
- **Consignes de tri** : [quefairedemesdechets.ademe.fr](https://quefairedemesdechets.ademe.fr)
- **Acteurs de l'économie circulaire** : [data.gouv.fr](https://www.data.gouv.fr/fr/datasets/longue-vie-aux-objets-annuaire-des-acteurs-du-reemploi-de-la-reparation-et-du-don/) (CSV, 375 249 acteurs)

### Régénérer les comptages
```bash
python3 scripts/generate-counts.py /chemin/vers/acteurs.csv
```

### Catégories couvertes
Petit électroménager · Médicaments · Meubles · Déchets alimentaires · CD/DVD/VHS · Chaussures · Marteau · Seringue avec aiguille · Trottinette électrique · Vêtements · Livres · Poêles et casseroles · Sapin de Noël · Brique alimentaire · Gros électroménager

## Limites du prototype

- **Les comptages locaux sont estimés** : le nombre de solutions affichées à proximité est une approximation proportionnelle à partir des données nationales, pas un calcul géographique réel.
- **La carte est générique** : le widget LVAO affiché est le même pour toutes les fiches, sans filtrage par catégorie d'objet.
- **Les solutions à domicile et en ligne** renvoient vers le site Que Faire : seuls les lieux sont consultables dans le widget.
- **15 catégories** : le site Que Faire couvre plusieurs centaines de fiches ; ce prototype en couvre 15 représentatives.

## Licence

Prototype développé dans le cadre d'un service public numérique de l'ADEME.
