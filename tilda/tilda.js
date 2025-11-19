
  (function () {
    const blockedCss = [
      'tilda-grid-3.0.min.css',
      'tilda-blocks-page93322206.min.css'
    ];

    function shouldRemove(href) {
      return blockedCss.some(name => href.includes(name));
    }

    function cleanExisting() {
      document.querySelectorAll('link[rel="stylesheet"]').forEach(function (link) {
        const href = link.getAttribute('href') || '';
        if (shouldRemove(href)) {
          link.parentNode.removeChild(link);
        }
      });
    }

    // 1. Убираем уже существующие <link>
    document.addEventListener('DOMContentLoaded', cleanExisting);

    // 2. Следим за новыми <link>, которые могут появляться
    const observer = new MutationObserver(function (mutations) {
      mutations.forEach(function (mutation) {
        mutation.addedNodes.forEach(function (node) {
          if (node.tagName === 'LINK' && node.rel === 'stylesheet') {
            const href = node.getAttribute('href') || '';
            if (shouldRemove(href)) {
              node.parentNode.removeChild(node);
            }
          }
        });
      });
    });

    observer.observe(document.documentElement, {
      childList: true,
      subtree: true
    });
  })();
