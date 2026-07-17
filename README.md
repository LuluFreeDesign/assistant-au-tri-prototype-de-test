# L'assistant au tri, au réemploi et à la réparation

**Prototype d'un widget iframe intégrable** permettant aux usagers de trouver des solutions pour prolonger la vie de leurs objets, faire des économies et réduire leurs déchets.

Ce prototype est développé dans le cadre du service numérique public [Que faire de mes objets et déchets ?](https://quefairedemesdechets.ademe.fr), opéré par l'[ADEME](https://www.ademe.fr) (Agence de la transition écologique).

---

## Pourquoi ce prototype ?

Le site *Que faire de mes objets et déchets ?* accompagne chaque année plus de 1,5 million d'usagers dans leurs gestes de tri, de réemploi et de réparation. Aujourd'hui, cette aide n'est accessible que sur le site lui-même.

**L'objectif** est d'explorer la faisabilité d'un **widget iframe léger et autonome**, intégrable directement sur les sites de collectivités, médias, services publics et autres partenaires. L'usager accéderait ainsi aux recommandations et solutions sans quitter le site qu'il consulte.

## Deux versions coexistent

Le dépôt contient **deux applications distinctes**, chacune autonome dans un seul fichier HTML.

| Version | Fichier | URL | Rôle |
|---|---|---|---|
| **MVP** | `mvp/index.html` | [/mvp/](https://lulufreedesign.github.io/assistant-au-tri-prototype-de-test/mvp/) | Version épurée, resserrée sur le parcours essentiel. **C'est la version de référence.** |
| **Proto de test** | `index.html` | [/](https://lulufreedesign.github.io/assistant-au-tri-prototype-de-test/) | Bac à sable historique, avec toutes les fonctionnalités explorées. Conservé comme filet de sécurité. |

Le MVP a été construit écran par écran d'après les specs « Découpage Assistant V2 ». Le proto de test **reste intact** : il sert de référence sur ce qui a été essayé (filtres, bascule liste/carte, comptages, géolocalisation…).

---

# Le MVP

## Le parcours en 4 écrans

### 1. Accueil
L'usager choisit un objet dans une liste déroulante (18 objets) et saisit une **adresse ou une commune** via l'autocomplétion de l'[API Adresse](https://adresse.data.gouv.fr). L'adresse est obligatoire pour continuer.

### 2. Fiche objet
Les gestes possibles pour cet objet (réparer, donner, revendre, déposer…) sont présentés en cards, chacune avec sa consigne. L'usager choisit un geste et lance la recherche.

### 3. Solutions — la carte
Une carte plein écran affiche les lieux correspondant au geste choisi, autour de l'adresse saisie. C'est l'écran le plus riche en règles métier : voir **Comportement de la carte** ci-dessous.

### 4. Fiche lieu
Le détail d'un lieu : coordonnées, horaires, gestes acceptés (pastilles), et le tag Bonus Réparation le cas échéant.

## Comportement de la carte

> **L'idée en une phrase** : la carte affiche **au maximum 20 lieux**, choisis selon **ce que l'usager voit à l'écran**, et se met à jour **toute seule** quand il arrête de bouger la carte.

### La recherche initiale
Adresse **ou** commune, les deux fonctionnent. On affiche les **20 lieux les plus proches** du point saisi, du plus proche au plus loin, dans un rayon de 20 km. La carte se cadre automatiquement dessus.

### Le rafraîchissement pendant l'exploration
- **Rien ne bouge pendant le geste.** On attend **1 seconde d'immobilité** — chaque mouvement remet le compteur à zéro, donc un long glissement ne déclenche qu'une seule recherche, à la fin.
- On cherche les lieux **dans le rectangle visible**, et seulement là.
- **La carte ne se recentre jamais** pendant l'exploration, et **l'adresse saisie ne change pas** : explorer n'est pas une nouvelle recherche.

### La jauge de 20
- **Moins de 1 000 lieux dans la zone** → on les a **tous**. 2 lieux dans la rue → 2 affichés. 18 dans le quartier → 18 affichés. Aucune approximation.
- **Au-delà** → il faut choisir. Les 20 sont **répartis sur la zone visible** (grille de 20 cases, chaque case ne cédant qu'un lieu) plutôt qu'entassés au centre.

### Les points sont collés à leur lieu
C'est la règle qui rend la carte stable :

> Un repère déjà affiché **garde sa place tant que son lieu reste visible à l'écran**.

- **Je dézoome** → mes points ne bougent pas.
- **Je glisse et le lieu sort de l'écran** → le repère est abandonné, sa place se libère pour la zone où j'arrive.
- **Je reviens** → l'ancien lieu **peut** revenir, sans garantie : au-delà de 20 candidats, la jauge tranche.

### Le garde-fou du dézoom
Au-delà du **niveau départemental** (zone visible ≥ 60 km dans sa plus grande dimension), aucun lieu n'est affiché, au profit d'un message :

> Zoomez sur la carte et faites-la défiler, ou cherchez une nouvelle adresse pour voir apparaître des points.

**Pourquoi :** au-delà de 1 000 lieux dans la zone, l'API ne renvoie qu'un échantillon — les repères y semblaient posés au hasard. Aucune requête n'est envoyée au-delà du seuil.

**La sélection est masquée, pas effacée** : en rezoomant au niveau précédent, l'usager retrouve **les mêmes repères** qu'avant son dézoom. S'il rezoome ailleurs, les anciens ne le suivent pas.

### Le repère rouge
C'est **l'usager**, pas un lieu. Il n'apparaît que pour une **adresse précise** (jamais pour une commune, qui est une zone et non un point), n'est jamais filtré par la vue, et reste affiché même au-delà du seuil de dézoom.

## ⚠️ Le piège des requêtes ADEME

**Ne jamais remettre le paramètre `q` dans l'appel à l'API.**

C'est tentant : `q=vetement` filtrerait côté serveur, donc moins de données. Mais `q` est une recherche plein texte : elle fait **trier par pertinence au lieu de la distance**, et le tri par distance devient faux **silencieusement**.

C'était le bug d'origine : à Paris, 5 507 lieux correspondent dans les 50 km. On en récupérait 300 « les plus pertinents », puis on triait ces 300-là par distance — les « 20 plus proches » étaient en fait les plus proches d'un échantillon quasi arbitraire.

Sans `q`, l'API trie **nativement par distance** (`_geo_dist`) : les 20 premiers sont les vrais 20 plus proches.

**Conséquence :** le filtre par geste se fait **côté client**. Ce n'est pas un choix de confort — les champs `donner`, `trier`, `revendre` sont marqués `index: false` chez l'ADEME, donc **impossibles à filtrer côté serveur**. Seul `reparer` est indexé.

### Comment les requêtes sont construites

| Situation | Requête | Tri renvoyé |
|---|---|---|
| Recherche initiale | `geo_distance=lon,lat,20000` | par distance croissante |
| Rafraîchissement d'une zone | `bbox=ouest,sud,est,nord` | non trié — échantillon réparti sur la zone |

`size=1000` dans les deux cas : c'est le **plafond accepté par l'API**.

### Points d'entrée dans le code

| Rôle | Fonction |
|---|---|
| Recherche initiale | `goToSolutions` |
| Rafraîchissement d'une zone | `refreshMapZone` |
| Attente de 1 s d'immobilité | `scheduleMapZoneRefresh` |
| Choix des repères (persistance + répartition) | `selectActeursForView` |
| Répartition sur la grille | `spreadOverView` |
| Seuil de dézoom | `isZoneTropVaste`, `MAP_ZONE_MAX_KM` |
| Filtre par geste (client) | `filterActeursByGeste` |
| Bandeau de message | `setMapBanner` |

---

# Le proto de test (racine)

Version historique, conservée **intacte**. Parcours en 3 étapes (recherche → territoire → fiche résultat), avec les fonctionnalités explorées puis écartées du MVP : filtres (Bonus / ESS / Répar'Acteurs), bascule liste/carte, comptages estimés, géolocalisation, info-tri, confirmation avant ouverture de liens externes.

Sa carte s'appuie sur des **iframes QFDMO** filtrées par catégorie, là où le MVP interroge directement l'API ADEME.

---

## Stack technique

| Composant | Choix |
|---|---|
| **Frontend** | HTML, CSS, JS vanilla — aucun framework, aucun bundler |
| **Design system** | [DSFR](https://www.systeme-de-design.gouv.fr) (Système de Design de l'État) |
| **Typographie** | Public Sans (chargée depuis Google Fonts) |
| **API adresse** | [api-adresse.data.gouv.fr](https://adresse.data.gouv.fr) — autocomplétion communes et adresses |
| **API acteurs** | [data.ademe.fr](https://data.ademe.fr) (data-fair) — interrogée en direct par le MVP |
| **Carte (MVP)** | [MapLibre GL](https://maplibre.org) + [Carte Facile](https://github.com/betagouv/carte-facile), via unpkg |
| **Carte (proto)** | Iframes QFDMO spécifiques par objet |

**Choix d'architecture :** chaque version tient dans **un seul fichier HTML** (CSS, JS et données inclus), pour garantir le fonctionnement **sans serveur** — le fichier s'ouvre directement dans un navigateur.

## Structure du projet

```
├── index.html                    # Proto de test — application complète
├── README.md
├── CLAUDE.md                     # Consignes pour l'assistant IA
├── mvp/
│   └── index.html                # MVP — application complète (version de référence)
├── demo/
│   └── neutre.html               # Démo d'intégration en iframe (faux site « fauxsite.fr »)
├── scripts/
│   ├── generate-counts.py        # Régénère les comptages nationaux depuis le CSV ADEME
│   └── generate-acteurs-44.py    # Extrait les acteurs de Loire-Atlantique (jeu de test)
└── src/
    ├── assets/
    │   ├── bouilloire.svg         # Icônes des catégories
    │   ├── canapetextile.svg
    │   ├── medicaments.svg
    │   ├── poireau.svg
    │   ├── fond-carte.png
    │   ├── icons/                 # Logos ESS, bloc marque Que Faire
    │   └── info-tri/              # Visuels info-tri (SVG)
    ├── css/
    │   └── fonts.css              # ⚠️ Hérité, plus référencé (voir ci-dessous)
    ├── data/
    │   ├── consignes.json         # Consignes de tri par objet (référence)
    │   ├── counts.json            # Comptages nationaux par objet (référence)
    │   └── acteurs-loire-atlantique.json
    └── fonts/                     # ⚠️ Police Marianne (woff2) — hérité, plus utilisée
```

> **Fichiers hérités** : `src/css/fonts.css` et `src/fonts/` (Marianne) ne sont **référencés par aucune page**. Les deux applications utilisent Public Sans via Google Fonts. À supprimer si l'on confirme l'abandon de Marianne.

> Les JSON de `src/data/` servent de **référence**. Les données sont dupliquées en inline dans les fichiers HTML pour permettre le fonctionnement sans serveur.

## Utilisation

### Ouvrir directement
Ouvrir `mvp/index.html` (ou `index.html`) dans un navigateur. Aucune installation requise.

### Avec un serveur local
```bash
python3 -m http.server 8090
# MVP           → http://localhost:8090/mvp/
# Proto de test → http://localhost:8090/
```

### Intégration en iframe

Le widget intègre un mécanisme d'auto-resize : il envoie sa hauteur au parent via `postMessage`, supprimant le besoin de définir une hauteur fixe.

```html
<iframe
  id="assistant-tri"
  src="https://votre-hebergement.fr/assistant-tri/mvp/index.html"
  width="100%"
  style="height: 400px; border: none;"
  title="Assistant au tri, au réemploi et à la réparation"
></iframe>
<script>
  var iframe = document.getElementById('assistant-tri');
  window.addEventListener('message', function(e) {
    if (!e.data) return;
    // Auto-resize : ajuste la hauteur de l'iframe à son contenu
    if (e.data.type === 'assistant-tri-resize') {
      iframe.style.height = e.data.height + 'px';
    }
    // Scroll en haut de l'iframe lors d'une transition d'étape
    if (e.data.type === 'assistant-tri-scroll-to-top') {
      iframe.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
</script>
```

## Environnements de test

Déployés automatiquement sur **GitHub Pages** à chaque merge sur `main`.

| Page | URL |
|---|---|
| **MVP** | [/mvp/](https://lulufreedesign.github.io/assistant-au-tri-prototype-de-test/mvp/) |
| **Proto de test** | [/](https://lulufreedesign.github.io/assistant-au-tri-prototype-de-test/) |
| **Démo d'intégration** | [demo/neutre.html](https://lulufreedesign.github.io/assistant-au-tri-prototype-de-test/demo/neutre.html) |

## Données

### Sources
- **Consignes de tri** : [quefairedemesdechets.ademe.fr](https://quefairedemesdechets.ademe.fr)
- **Acteurs de l'économie circulaire** : [data.gouv.fr](https://www.data.gouv.fr/fr/datasets/longue-vie-aux-objets-annuaire-des-acteurs-du-reemploi-de-la-reparation-et-du-don/) — 375 249 acteurs. Le MVP interroge l'API en direct ; les comptages du proto viennent du CSV.

### Régénérer les comptages
```bash
python3 scripts/generate-counts.py /chemin/vers/acteurs.csv
```

### Objets couverts (18)
Petit électroménager · Médicaments · Meubles · Déchets alimentaires · CD/DVD/VHS · Chaussures · Marteau · Seringue avec aiguille · Trottinette électrique · Vêtements · Livres · Poêles et casseroles · Sapin de Noël · Brique alimentaire · Gros électroménager · Emballages · Téléphone mobile

## Limites connues

### Sur la carte du MVP
- **Plafond de 1 000 résultats par requête** (limite de l'API). Sur une zone dense, on travaille sur un échantillon. Sans effet dès que la zone contient moins de 1 000 lieux — la quasi-totalité des usages réels. À Paris, les données redeviennent exhaustives vers 2 km de largeur visible ; en zone rurale, vers 40 km.
- **Aucun message en cas d'erreur API** : si l'appel échoue, les repères précédents restent affichés et l'erreur ne part qu'en console. **Premier point à améliorer** — le bandeau est déjà pilotable par message (`setMapBanner`).
- **Cache plafonné à 12 zones** (LRU). Ne pas le retirer : chaque zone explorée pèse jusqu'à 1 000 enregistrements, sans plafond la mémoire enfle à chaque déplacement.
- Une réponse lente ne peut pas écraser une plus récente (garde par jeton de séquence) : conserver ce mécanisme si l'on ajoute des appels.

### Sur le périmètre
- **18 objets** : le site Que Faire couvre plusieurs centaines de fiches ; ces prototypes en couvrent 18 représentatifs.
- **Les comptages du proto de test sont estimés** : approximation proportionnelle depuis les données nationales, pas un calcul géographique réel. Le MVP, lui, ne les affiche plus.
- **Les solutions à domicile et en ligne** renvoient vers le site Que Faire.
- **Code mort** : le proto de test contient des fonctions et du CSS hérités de fonctionnalités écartées (filtres, bascule liste/carte).

## Licence

Prototype développé dans le cadre d'un service public numérique de l'ADEME.
