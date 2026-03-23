# Scripts d'intégration iframe - Assistant au Tri

Ce dossier contient les scripts et exemples pour intégrer l'Assistant au Tri dans vos sites web.

## Utilisation rapide

Ajoutez simplement ce script dans votre page HTML :

```html
<script
  src="https://lulufreedesign.github.io/assistant-au-tri-prototype-de-test/embed/embed.js"
  data-env="neutre"
  data-container="assistant-container"
  data-width="100%"
  data-height="600px"
></script>
```

Et créez un conteneur pour l'iframe :

```html
<div id="assistant-container"></div>
```

## Paramètres

### `data-env` (obligatoire)
L'environnement cible. Valeurs possibles :
- `neutre` - Environnement générique (par défaut)
- `collectivite` - Environnement collectivités
- `ecommerce` - Environnement e-commerçants
- `media` - Environnement médias

### `data-container` (obligatoire)
L'ID du conteneur HTML où l'iframe sera insérée.

### `data-width` (optionnel)
La largeur de l'iframe. Par défaut : `100%`

### `data-height` (optionnel)
La hauteur de l'iframe. Par défaut : `600px`

## Exemples complets

### Collectivités
```html
<div id="assistant-container"></div>

<script
  src="https://lulufreedesign.github.io/assistant-au-tri-prototype-de-test/embed/embed.js"
  data-env="collectivite"
  data-container="assistant-container"
  data-width="100%"
  data-height="600px"
></script>
```

### E-commerçants
```html
<div id="assistant-container"></div>

<script
  src="https://lulufreedesign.github.io/assistant-au-tri-prototype-de-test/embed/embed.js"
  data-env="ecommerce"
  data-container="assistant-container"
  data-width="100%"
  data-height="600px"
></script>
```

### Médias
```html
<div id="assistant-container"></div>

<script
  src="https://lulufreedesign.github.io/assistant-au-tri-prototype-de-test/embed/embed.js"
  data-env="media"
  data-container="assistant-container"
  data-width="100%"
  data-height="600px"
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
  src="..."
  data-width="800px"
  data-height="500px"
></script>
```

### Responsive
Pour un design responsive :
```html
<div id="assistant-container" style="max-width: 1200px; margin: 0 auto;"></div>

<script
  src="..."
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
