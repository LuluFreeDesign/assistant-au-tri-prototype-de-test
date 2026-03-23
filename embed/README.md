# Scripts d'intégration iframe - Assistant au Tri

Ce dossier contient les scripts et exemples pour intégrer l'Assistant au Tri dans vos sites web.

## Utilisation rapide

**Option simple** — le conteneur est créé automatiquement :

```html
<script
  src="https://lulufreedesign.github.io/assistant-au-tri-prototype-de-test/embed/embed.js"
  data-env="neutre"
></script>
```

**Avec conteneur personnalisé** — créez un div avec l'ID souhaité :

```html
<div id="mon-container"></div>

<script
  src="https://lulufreedesign.github.io/assistant-au-tri-prototype-de-test/embed/embed.js"
  data-env="neutre"
  data-container="mon-container"
></script>
```

## Paramètres

### `data-env` (obligatoire)
L'environnement cible. Valeurs possibles :
- `neutre` - Environnement générique (par défaut)
- `collectivite` - Environnement collectivités
- `ecommerce` - Environnement e-commerçants
- `media` - Environnement médias

### `data-container` (optionnel)
L'ID du conteneur HTML où l'iframe sera insérée. Si non spécifié, un conteneur sera créé automatiquement avec l'ID `assistant-container`. Par défaut : `assistant-container`

### `data-width` (optionnel)
La largeur de l'iframe. Par défaut : `100%`

### `data-height` (optionnel)
La hauteur de l'iframe. Par défaut : `600px`

## Exemples complets

### Collectivités (simple)
```html
<script
  src="https://lulufreedesign.github.io/assistant-au-tri-prototype-de-test/embed/embed.js"
  data-env="collectivite"
></script>
```

### E-commerçants (simple)
```html
<script
  src="https://lulufreedesign.github.io/assistant-au-tri-prototype-de-test/embed/embed.js"
  data-env="ecommerce"
></script>
```

### Médias (simple)
```html
<script
  src="https://lulufreedesign.github.io/assistant-au-tri-prototype-de-test/embed/embed.js"
  data-env="media"
></script>
```

### Avec conteneur personnalisé et dimensions custom
```html
<div id="mon-assistant" style="max-width: 1200px; margin: 2rem auto;"></div>

<script
  src="https://lulufreedesign.github.io/assistant-au-tri-prototype-de-test/embed/embed.js"
  data-env="collectivite"
  data-container="mon-assistant"
  data-width="100%"
  data-height="800px"
></script>
```

## Fichiers d'exemple

Des fichiers HTML d'exemple sont disponibles pour tester chaque environnement :

- `example-neutre.html` - Exemple générique
- `example-collectivite.html` - Exemple collectivités
- `example-ecommerce.html` - Exemple e-commerçants
- `example-media.html` - Exemple médias

## Personnalisation

### Dimensions
Adaptez les dimensions à votre besoin :
```html
<script
  src="https://lulufreedesign.github.io/assistant-au-tri-prototype-de-test/embed/embed.js"
  data-env="collectivite"
  data-width="800px"
  data-height="500px"
></script>
```

### Responsive avec max-width
Pour limiter la largeur sur les grands écrans :
```html
<div id="mon-assistant" style="max-width: 800px;"></div>

<script
  src="https://lulufreedesign.github.io/assistant-au-tri-prototype-de-test/embed/embed.js"
  data-env="collectivite"
  data-container="mon-assistant"
  data-width="100%"
  data-height="600px"
></script>
```

## Compatibilité

Le script fonctionne sur tous les navigateurs modernes qui supportent :
- ES6 (classes, arrow functions)
- `currentScript` et `dataset`
- Les iframes

## Support

Pour tout problème ou question, veuillez contacter l'équipe de développement.
