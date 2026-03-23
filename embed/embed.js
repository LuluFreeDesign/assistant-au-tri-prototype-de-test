/**
 * Assistant au Tri - Script d'intégration iframe
 *
 * Usage (avec conteneur personnalisé) :
 * <div id="my-container"></div>
 * <script
 *   src="https://lulufreedesign.github.io/assistant-au-tri-prototype-de-test/embed/embed.js"
 *   data-env="collectivite"
 *   data-container="my-container"
 * ></script>
 *
 * Usage simple (conteneur créé automatiquement) :
 * <script
 *   src="https://lulufreedesign.github.io/assistant-au-tri-prototype-de-test/embed/embed.js"
 *   data-env="collectivite"
 * ></script>
 */

(function() {
  // Configuration par défaut
  const config = {
    env: 'neutre',
    container: 'assistant-container',
    width: '100%',
    height: '600px'
  };

  // Récupérer les attributs data du script
  const script = document.currentScript;
  if (script) {
    if (script.dataset.env) config.env = script.dataset.env;
    if (script.dataset.container) config.container = script.dataset.container;
    if (script.dataset.width) config.width = script.dataset.width;
    if (script.dataset.height) config.height = script.dataset.height;
  }

  // Valider l'environnement
  const validEnvs = ['neutre', 'collectivite', 'ecommerce', 'media'];
  if (!validEnvs.includes(config.env)) {
    console.error(`[Assistant au Tri] Environnement invalide: ${config.env}. Doit être l'un de: ${validEnvs.join(', ')}`);
    return;
  }

  // Attendre que le DOM soit prêt
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initIframe);
  } else {
    initIframe();
  }

  function initIframe() {
    let container = document.getElementById(config.container);

    // Si le conteneur n'existe pas, le créer automatiquement
    if (!container) {
      container = document.createElement('div');
      container.id = config.container;
      document.body.appendChild(container);
    }

    // Construire l'URL de la démo
    const baseUrl = 'https://lulufreedesign.github.io/assistant-au-tri-prototype-de-test/demo';
    const iframeUrl = `${baseUrl}/${config.env}.html`;

    // Créer l'iframe
    const iframe = document.createElement('iframe');
    iframe.src = iframeUrl;
    iframe.style.width = config.width;
    iframe.style.height = config.height;
    iframe.style.border = 'none';
    iframe.style.borderRadius = '4px';
    iframe.title = `Assistant au Tri - Environnement ${config.env}`;
    iframe.allow = 'geolocation';

    container.appendChild(iframe);
  }
})();
