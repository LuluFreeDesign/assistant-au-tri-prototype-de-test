# Comportement de la carte — MVP

Note fonctionnelle à destination du développement. Décrit **ce que la carte doit faire**, et les pièges à connaître avant d'y toucher.

Tout le code concerné est dans `mvp/index.html`.

---

## L'idée en une phrase

La carte affiche **au maximum 20 lieux**, choisis en fonction de **ce que l'usager voit à l'écran**, et se met à jour **toute seule** quand il arrête de bouger la carte.

## 1. La recherche initiale

L'usager saisit une **adresse ou une commune** — les deux fonctionnent — et choisit un geste (réparer, donner…).

On affiche les **20 lieux les plus proches** de ce point, du plus proche au plus loin, dans un rayon de 20 km. La carte se cadre automatiquement sur ces lieux.

## 2. Le rafraîchissement pendant l'exploration

Dès que l'usager déplace ou zoome la carte :

- **Rien ne bouge pendant le geste.** On attend **1 seconde d'immobilité**. Chaque nouveau mouvement remet le compteur à zéro : un long glissement ne déclenche donc qu'une seule recherche, à la fin.
- On cherche les lieux **dans le rectangle visible**, et seulement là.
- **La carte ne se recentre jamais** pendant l'exploration : c'est l'usager qui pilote.
- **L'adresse saisie ne change pas.** Explorer la carte n'est pas une nouvelle recherche d'adresse.

## 3. La règle des 20 points

Toujours 20 maximum, mais le comportement dépend de ce que contient la zone :

- **Peu de lieux** (moins de 1 000 dans la zone) : on les a **tous**. S'il n'y en a que 2 dans la rue, on affiche 2. S'il y en a 18 dans le quartier, on affiche 18. Aucune approximation.
- **Beaucoup de lieux** : il faut en choisir 20. On les **répartit sur la zone visible** plutôt que de les entasser au centre — la vue est découpée en une grille de 20 cases, chaque case ne cédant qu'un lieu (le plus proche du centre).

## 4. Les points sont collés à leur lieu

C'est la règle qui rend la carte stable, et la plus facile à casser par mégarde.

> Un repère déjà affiché **garde sa place tant que son lieu reste visible à l'écran**.

- **Je dézoome** → mes points ne bougent pas (leur lieu est toujours en vue).
- **Je glisse et le lieu sort de l'écran** → le repère est abandonné, et sa place se libère pour de nouveaux lieux de la zone où j'arrive.
- **Je reviens sur la zone** → l'ancien lieu **peut** revenir, sans garantie : s'il y a plus de 20 candidats, la jauge tranche et un autre peut lui être préféré.

Les repères conservés sont prioritaires sur les nouveaux : ce sont eux qui gardent leur place, les places restantes étant comblées par répartition.

## 5. Le garde-fou du dézoom

**Au-delà du niveau départemental** (zone visible ≥ 60 km dans sa plus grande dimension), la carte n'affiche **aucun lieu** et affiche à la place :

> Zoomez sur la carte et faites-la défiler, ou cherchez une nouvelle adresse pour voir apparaître des points.

**Pourquoi :** au-delà de 1 000 lieux dans la zone, l'API ne renvoie qu'un échantillon. Les repères affichés à ces échelles semblaient posés au hasard. Aucune requête n'est envoyée au-delà du seuil.

**Important :** la sélection est **masquée, pas effacée**. En rezoomant à peu près au niveau précédent, l'usager retrouve **les mêmes repères** qu'avant son dézoom. En revanche, s'il rezoome ailleurs, les anciens ne le suivent pas.

On teste la **plus grande** des deux dimensions (largeur ou hauteur) : sur un écran étroit et haut, tester la seule largeur laisserait passer 80 km de hauteur sans déclencher le message.

## 6. Le repère rouge

Le repère rouge, c'est **l'usager**, pas un lieu.

- Il apparaît **seulement si une adresse précise** a été saisie.
- Il **n'apparaît pas pour une commune** (« Lyon » n'est pas un point, c'est une zone).
- Il **n'est jamais filtré** par la zone visible, et reste affiché même au-delà du seuil de dézoom.

---

## ⚠️ Le piège à connaître avant de toucher aux requêtes

**Ne remets jamais le paramètre `q` dans l'appel à l'API ADEME.**

C'est tentant : `q=vetement` filtrerait les lieux côté serveur, donc moins de données à télécharger. Mais `q` est une recherche plein texte, et elle fait **trier les résultats par pertinence au lieu de la distance**. Le tri par distance devient alors faux, silencieusement.

C'était le bug d'origine : à Paris, 5 507 lieux correspondent dans les 50 km. On en récupérait 300 « les plus pertinents », puis on triait ces 300-là par distance. Les « 20 plus proches » étaient en réalité les plus proches d'un échantillon quasi arbitraire.

Sans `q`, l'API trie **nativement par distance** (`_geo_dist`), et les 20 premiers sont les vrais 20 plus proches.

**Conséquence :** le filtre par geste se fait **côté client**, dans le navigateur. Ce n'est pas un choix de confort — les champs `donner`, `trier`, `revendre` sont marqués `index: false` chez l'ADEME, ils sont donc **impossibles à filtrer côté serveur**. Seul `reparer` est indexé.

## Comment les requêtes sont construites

| Situation | Requête | Tri renvoyé par l'API |
|---|---|---|
| Recherche initiale (adresse/commune) | `geo_distance=lon,lat,20000` | par distance croissante |
| Rafraîchissement d'une zone | `bbox=ouest,sud,est,nord` | non trié — échantillon réparti sur la zone |

`size=1000` dans les deux cas : c'est le **plafond accepté par l'API** (au-delà, la requête est refusée).

## Limites connues

- **Plafond de 1 000 résultats par requête.** Sur une zone dense, on travaille donc sur un échantillon, pas sur la totalité. Sans effet dès que la zone contient moins de 1 000 lieux — c'est-à-dire dans la quasi-totalité des usages réels. À Paris, les données redeviennent exhaustives vers 2 km de largeur visible ; en zone rurale, vers 40 km.
- **Aucun message en cas d'erreur API.** Si l'appel échoue, les repères précédents restent affichés et l'erreur ne part qu'en console. **C'est le premier point à améliorer** pour rendre le tout solide — le bandeau est déjà pilotable par message (`setMapBanner`), une ligne suffirait.
- **Le cache est plafonné à 12 zones** (LRU). Ne pas le retirer : chaque zone explorée pèse jusqu'à 1 000 enregistrements, sans plafond la mémoire enfle à chaque déplacement.
- **Une réponse lente ne peut pas écraser une plus récente** (garde par jeton de séquence). Si tu ajoutes des appels, conserve ce mécanisme.
- **Les bornes sont bornées** avant l'envoi : au dézoom maximal, MapLibre renvoie des coordonnées hors limites que l'API traduit par une erreur (latitude) ou par 0 résultat silencieux (longitude).

## Points d'entrée dans le code

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
