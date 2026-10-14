/*
 * Script d'intégration de l'assistant au tri (MVP).
 *
 * Côté intégrateur, aucun réglage : il suffit d'ajouter
 *   <div data-assistant-tri></div>
 *   <script src="https://…/mvp/integration.js"></script>
 *
 * Le script crée l'iframe, ajuste sa hauteur à son contenu et, à chaque
 * changement d'étape, ramène l'usager en haut de l'assistant en tenant compte
 * des éléments fixes de la page hôte (header fixe, sticky, barre qui se déploie…).
 */
(function () {
  // URL du MVP déduite de l'emplacement de ce script (même dossier)
  var scriptSrc = document.currentScript && document.currentScript.src;
  var appUrl = new URL('index.html', scriptSrc || window.location.href).href;

  // Marge visuelle entre le bas du header hôte et le haut de l'assistant
  var MARGE = 16;
  // Nombre max de corrections successives (le header peut changer de taille pendant le scroll)
  var MAX_PASSES = 3;

  // Hauteur occupée en haut de l'écran par des éléments fixes ou sticky de la page hôte.
  // On sonde quelques points sur la première ligne de pixels et on remonte les ancêtres
  // de chaque élément trouvé pour repérer ceux en position fixed / sticky.
  function hauteurRecouverte(iframe) {
    var largeur = window.innerWidth;
    var bas = 0;
    var vus = [];
    [0.1, 0.5, 0.9].forEach(function (ratio) {
      var pile = document.elementsFromPoint(Math.round(largeur * ratio), 1);
      pile.forEach(function (el) {
        for (var n = el; n && n !== document.body && n !== document.documentElement; n = n.parentElement) {
          if (vus.indexOf(n) !== -1) break;
          vus.push(n);
          if (n === iframe || n.contains(iframe)) break;
          var pos = getComputedStyle(n).position;
          if (pos === 'fixed' || pos === 'sticky') {
            var r = n.getBoundingClientRect();
            if (r.top <= 1 && r.bottom > bas) bas = r.bottom;
          }
        }
      });
    });
    return bas;
  }

  // Attend la fin du scroll (scrollend n'existe pas partout : on surveille scrollY)
  function apresScroll(cb) {
    var dernier = window.scrollY;
    var stable = 0;
    var timer = setInterval(function () {
      if (window.scrollY === dernier) {
        stable++;
        // ~300 ms d'immobilité : laisse aussi le temps aux transitions du header hôte
        if (stable >= 6) { clearInterval(timer); cb(); }
      } else {
        stable = 0;
        dernier = window.scrollY;
      }
    }, 50);
  }

  function ramenerEnHaut(iframe, passe) {
    passe = passe || 1;
    var recouvert = hauteurRecouverte(iframe);
    var top = iframe.getBoundingClientRect().top;
    var cible = recouvert + MARGE;

    // Haut de l'assistant déjà visible sous le header : rien à faire
    if (passe === 1 && top >= recouvert && top <= window.innerHeight * 0.4) return;
    // Corrections suivantes : on s'arrête quand l'écart est négligeable
    if (passe > 1 && Math.abs(top - cible) <= 2) return;

    window.scrollTo({ top: window.scrollY + top - cible, behavior: 'smooth' });
    if (passe < MAX_PASSES) {
      apresScroll(function () { ramenerEnHaut(iframe, passe + 1); });
    }
  }

  function monter(conteneur) {
    var iframe = document.createElement('iframe');
    iframe.src = appUrl;
    iframe.title = 'Assistant au tri, au réemploi et à la réparation';
    iframe.setAttribute('allow', 'geolocation');
    iframe.style.cssText = 'width:100%;height:400px;border:none;display:block;';
    conteneur.appendChild(iframe);

    window.addEventListener('message', function (e) {
      if (e.source !== iframe.contentWindow || !e.data) return;
      if (e.data.type === 'assistant-tri-resize') {
        iframe.style.height = e.data.height + 'px';
      }
      if (e.data.type === 'assistant-tri-scroll-to-top') {
        ramenerEnHaut(iframe);
      }
    });
  }

  function init() {
    document.querySelectorAll('[data-assistant-tri]').forEach(function (conteneur) {
      if (conteneur.dataset.assistantTriMonte) return;
      conteneur.dataset.assistantTriMonte = '1';
      monter(conteneur);
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
