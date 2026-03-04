# CLAUDE.md — Consignes pour l'assistant IA

## Processus de travail

- **Ne jamais commit, créer de PR ou merger** sans demande explicite de l'utilisateur.
- **Toujours proposer une idée avant de la réaliser.** Ne pas implémenter de choix de conception ou d'UX de sa propre initiative : décrire l'approche envisagée et attendre validation.
- Rédiger les messages de commit et descriptions de PR **en français**.

## Architecture du projet

- **Fichier unique** : toute l'application (HTML, CSS, JS, données) est contenue dans `index.html`. Il n'y a aucun framework ni bundler.
- Le fichier doit pouvoir s'ouvrir **directement dans un navigateur**, sans serveur.
- Les fichiers JSON dans `src/data/` sont des **fichiers de référence**. Les données sont dupliquées en inline dans `index.html`.
- Pour tester avec un serveur local : `python3 -m http.server 8090`.

## Design system — DSFR

- Le prototype respecte scrupuleusement le **[DSFR](https://www.systeme-de-design.gouv.fr)** (Système de Design de l'État).
- Utiliser les composants DSFR tels que documentés (accordéons, tags, cards, etc.) sans les réinterpréter.
- Référence storybook : https://www.systeme-de-design.gouv.fr/v1.14/storybook/
- Typographie : **Marianne** (police officielle de l'État).
- Variables CSS DSFR à privilégier (`var(--background-action-low-blue-france)`, `var(--text-default)`, etc.) plutôt que des valeurs en dur.

## Conventions CSS / JS

- Pas de framework CSS ni JS : tout est en **vanilla**.
- Les styles sont déclarés dans une balise `<style>` à l'intérieur de `index.html`.
- Le JavaScript est déclaré dans une balise `<script>` à la fin de `index.html`.
- Nommage CSS : préfixe par section (`.search-*`, `.fiche-*`, `.territory-*`).

## Données et API

- **API Adresse** : `https://api-adresse.data.gouv.fr` — autocomplétion des communes et adresses.
- **Cartes** : iframes QFDMO (`https://quefairedemesdechets.ademe.fr/carte/...`) avec pré-remplissage de l'adresse via le paramètre `?adresse=`.
- **Comptages** : estimations nationales issues du CSV ADEME (375 249 acteurs), régénérables via `python3 scripts/generate-counts.py`.

## Structure des fiches

Chaque fiche objet/déchet est définie dans le tableau `CONSIGNES` en JS et contient :
- `id`, `nom`, `keywords` (synonymes pour la recherche)
- `infoTri` (nom du SVG info-tri)
- `accordeons` (titre, icône, consigne, condition)
- `carteIframeSrc` (URL de la carte QFDMO filtrée, avec `sc_id`)
- `url` (lien vers la fiche complète sur quefairedemesdechets.ademe.fr)

## Langue

- L'interface, les commentaires dans le code et les échanges sont en **français**.
