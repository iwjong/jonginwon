jQuery(function() {
  var $index = jQuery('.main-images-container');
  var dataSource = window.homeImageData;
  var batchSize = 18;
  var homeImageClass = 'home-feed-asset';
  var sentinelClass = 'home-feed-sentinel';
  var lazyLoader = null;
  var sentinel = null;
  var feedObserver = null;
  var scrollFallbackHandler = null;
  var isRendering = false;
  var projectQueues = [];
  var activeProjectIndexes = [];

  if (!$index.length || !Array.isArray(dataSource) || !dataSource.length) {
    return;
  }

  initHomeFeed(dataSource);

  function initHomeFeed(projectData) {
    projectQueues = projectData.map(function(projectImages) {
      return shuffleArray(projectImages.slice());
    });
    activeProjectIndexes = projectQueues
      .map(function(_, index) {
        return index;
      })
      .filter(function(index) {
        return projectQueues[index].length > 0;
      });

    lazyLoader = createLazyLoader();
    renderNextBatch();

    if (hasRemainingImages()) {
      setupLoadMoreObserver();
    }
  }

  function createLazyLoader() {
    if (typeof window.LazyLoad === 'function') {
      return new window.LazyLoad({
        elements_selector: '.' + homeImageClass + '[data-bg]',
        threshold: 700,
        data_bg: 'bg',
        class_loading: 'lazy-asset-loading',
        class_loaded: 'lazy-asset-loaded',
        class_error: 'lazy-asset-error'
      });
    }

    return {
      update: function(elements) {
        normalizeElements(elements).forEach(function(element) {
          var imageUrl = element.getAttribute('data-bg');
          var preloader;

          if (!imageUrl) {
            return;
          }

          preloader = new Image();
          preloader.onload = function() {
            element.classList.add('image-aspect-item');
            element.classList.toggle('image-aspect-portrait', preloader.naturalHeight > preloader.naturalWidth);
            element.classList.toggle('image-aspect-landscape', preloader.naturalHeight <= preloader.naturalWidth);
            element.dataset.aspectReady = 'true';
            element.dataset.aspectSource = imageUrl;
            element.style.backgroundImage = 'url("' + imageUrl + '")';
            element.classList.add('lazy-asset-loaded');
          };
          preloader.onerror = function() {
            element.classList.add('lazy-asset-error');
          };
          preloader.src = imageUrl;
        });
      }
    };
  }

  function setupLoadMoreObserver() {
    sentinel = document.createElement('div');
    sentinel.className = sentinelClass;
    sentinel.setAttribute('aria-hidden', 'true');
    $index[0].appendChild(sentinel);

    if ('IntersectionObserver' in window) {
      feedObserver = new IntersectionObserver(function(entries) {
        entries.forEach(function(entry) {
          if (entry.isIntersecting) {
            renderNextBatch();
          }
        });
      }, {
        root: null,
        rootMargin: '900px 0px'
      });

      feedObserver.observe(sentinel);
      return;
    }

    scrollFallbackHandler = function() {
      if (!sentinel) {
        return;
      }

      if (sentinel.getBoundingClientRect().top - window.innerHeight < 900) {
        renderNextBatch();
      }
    };

    window.addEventListener('scroll', scrollFallbackHandler, {
      passive: true
    });
    window.addEventListener('resize', scrollFallbackHandler);
    scrollFallbackHandler();
  }

  function teardownLoadMoreObserver() {
    if (feedObserver && sentinel) {
      feedObserver.unobserve(sentinel);
      feedObserver.disconnect();
      feedObserver = null;
    }

    if (scrollFallbackHandler) {
      window.removeEventListener('scroll', scrollFallbackHandler);
      window.removeEventListener('resize', scrollFallbackHandler);
      scrollFallbackHandler = null;
    }

    if (sentinel && sentinel.parentNode) {
      sentinel.parentNode.removeChild(sentinel);
    }

    sentinel = null;
  }

  function renderNextBatch() {
    var nextImages;
    var wrapper = document.createElement('div');
    var fragment = document.createDocumentFragment();
    var newElements;

    if (isRendering) {
      return;
    }

    nextImages = getNextBatch(batchSize);

    if (!nextImages.length) {
      teardownLoadMoreObserver();
      return;
    }

    isRendering = true;
    wrapper.innerHTML = buildBatchMarkup(nextImages);
    newElements = normalizeElements(wrapper.querySelectorAll('.' + homeImageClass));

    while (wrapper.firstChild) {
      fragment.appendChild(wrapper.firstChild);
    }

    if (sentinel) {
      $index[0].insertBefore(fragment, sentinel);
    } else {
      $index[0].appendChild(fragment);
    }

    if (lazyLoader) {
      lazyLoader.update(newElements);
    }

    isRendering = false;

    if (!hasRemainingImages()) {
      teardownLoadMoreObserver();
    }
  }

  function getNextBatch(size) {
    var batch = [];
    var cycleIndexes;
    var index;
    var queueIndex;

    compactProjectIndexes();

    while (batch.length < size && activeProjectIndexes.length) {
      cycleIndexes = shuffleArray(activeProjectIndexes.slice());

      for (index = 0; index < cycleIndexes.length && batch.length < size; index += 1) {
        queueIndex = cycleIndexes[index];

        if (!projectQueues[queueIndex].length) {
          continue;
        }

        batch.push(projectQueues[queueIndex].pop());
      }

      compactProjectIndexes();
    }

    return batch;
  }

  function compactProjectIndexes() {
    activeProjectIndexes = activeProjectIndexes.filter(function(index) {
      return projectQueues[index] && projectQueues[index].length > 0;
    });
  }

  function hasRemainingImages() {
    compactProjectIndexes();
    return activeProjectIndexes.length > 0;
  }

  function buildBatchMarkup(images) {
    var markup = '';
    var index;

    for (index = 0; index < images.length; index += 1) {
      markup += buildImageMarkup(images[index]);
    }

    return markup;
  }

  function buildImageMarkup(imageData) {
    var anchorClass = 'section-images-item ' + homeImageClass;

    return [
      "<div class='section-images-item-container'>",
      "<a class='" + anchorClass + "' href='" + escapeAttribute(imageData.link) + "' data-bg='" + escapeAttribute(imageData.image) + "'></a>",
      '</div>'
    ].join('');
  }

  function shuffleArray(arr) {
    var index;
    var randomIndex;
    var temp;

    for (index = arr.length - 1; index > 0; index -= 1) {
      randomIndex = Math.floor(Math.random() * (index + 1));
      temp = arr[index];
      arr[index] = arr[randomIndex];
      arr[randomIndex] = temp;
    }

    return arr;
  }

  function normalizeElements(elements) {
    if (!elements) {
      return [];
    }

    if (elements.nodeType === 1) {
      return [elements];
    }

    return Array.prototype.slice.call(elements);
  }

  function escapeAttribute(value) {
    return String(value || '')
      .replace(/&/g, '&amp;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;');
  }
});
