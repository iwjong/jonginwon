(function(global) {
  'use strict';

  var defaultSettings = {
    elements_selector: '[data-src],[data-bg]',
    container: document,
    threshold: 300,
    data_src: 'src',
    data_srcset: 'srcset',
    data_sizes: 'sizes',
    data_bg: 'bg',
    class_loading: 'loading',
    class_loaded: 'loaded',
    class_error: 'error',
    callback_enter: null,
    callback_load: null,
    callback_error: null,
    callback_set: null,
    callback_finish: null
  };

  function extendSettings(base, overrides) {
    var settings = {};
    var key;

    for (key in base) {
      if (Object.prototype.hasOwnProperty.call(base, key)) {
        settings[key] = base[key];
      }
    }

    for (key in overrides) {
      if (Object.prototype.hasOwnProperty.call(overrides, key)) {
        settings[key] = overrides[key];
      }
    }

    return settings;
  }

  function toArray(input) {
    if (!input) {
      return [];
    }

    if (input.nodeType === 1) {
      return [input];
    }

    return Array.prototype.slice.call(input);
  }

  function getDataAttribute(element, key) {
    return element.getAttribute('data-' + key);
  }

  function setDataAttribute(element, key, value) {
    if (value === null || typeof value === 'undefined') {
      element.removeAttribute('data-' + key);
      return;
    }

    element.setAttribute('data-' + key, value);
  }

  function addClass(element, className) {
    if (!className) {
      return;
    }

    element.classList.add(className);
  }

  function removeClass(element, className) {
    if (!className) {
      return;
    }

    element.classList.remove(className);
  }

  function runCallback(callback, element) {
    if (typeof callback === 'function') {
      callback(element);
    }
  }

  function isProcessed(element) {
    return getDataAttribute(element, 'was-processed') === 'true';
  }

  function markProcessed(element) {
    setDataAttribute(element, 'was-processed', 'true');
  }

  function setAspectState(element, imageUrl, isPortrait, status) {
    addClass(element, '__image__aspect__item');
    removeClass(element, '__image__aspect--pending');
    element.classList.toggle('__image__aspect--portrait', !!isPortrait);
    element.classList.toggle('__image__aspect--landscape', !isPortrait);
    element.dataset.aspectSource = imageUrl;
    element.dataset.aspectReady = status;
  }

  function getObserverOptions(settings) {
    return {
      root: settings.container === document ? null : settings.container,
      rootMargin: settings.threshold + 'px'
    };
  }

  function LazyLoad(options) {
    this._settings = extendSettings(defaultSettings, options || {});
    this._observer = null;
    this._elements = [];
    this._loadingCount = 0;
    this._setObserver();
  }

  LazyLoad.prototype._setObserver = function() {
    if (!('IntersectionObserver' in global)) {
      return;
    }

    this._observer = new IntersectionObserver(this._onIntersection.bind(this), getObserverOptions(this._settings));
  };

  LazyLoad.prototype._onIntersection = function(entries) {
    var instance = this;

    entries.forEach(function(entry) {
      if (entry.isIntersecting || entry.intersectionRatio > 0) {
        instance.load(entry.target);
      }
    });
  };

  LazyLoad.prototype._removeElement = function(element) {
    this._elements = this._elements.filter(function(candidate) {
      return candidate !== element;
    });
  };

  LazyLoad.prototype._finishIfDone = function() {
    if (!this._elements.length && this._loadingCount === 0) {
      runCallback(this._settings.callback_finish);
    }
  };

  LazyLoad.prototype._complete = function(element, wasSuccessful) {
    removeClass(element, this._settings.class_loading);
    addClass(element, wasSuccessful ? this._settings.class_loaded : this._settings.class_error);
    runCallback(wasSuccessful ? this._settings.callback_load : this._settings.callback_error, element);
    this._loadingCount = Math.max(0, this._loadingCount - 1);
    this._finishIfDone();
  };

  LazyLoad.prototype._loadBackground = function(element, imageUrl) {
    var instance = this;
    var preloader = new Image();

    preloader.onload = function() {
      setAspectState(element, imageUrl, preloader.naturalHeight > preloader.naturalWidth, 'true');
      element.style.backgroundImage = 'url("' + imageUrl + '")';
      runCallback(instance._settings.callback_set, element);
      instance._complete(element, true);
    };

    preloader.onerror = function() {
      setAspectState(element, imageUrl, false, 'error');
      instance._complete(element, false);
    };

    preloader.src = imageUrl;
  };

  LazyLoad.prototype._loadElementSource = function(element) {
    var instance = this;
    var settings = instance._settings;
    var imageUrl = getDataAttribute(element, settings.data_bg);

    if (imageUrl) {
      instance._loadingCount += 1;
      instance._loadBackground(element, imageUrl);
      return;
    }

    if (element.tagName === 'IMG') {
      var handleLoad;
      var handleError;

      if (getDataAttribute(element, settings.data_sizes)) {
        element.setAttribute('sizes', getDataAttribute(element, settings.data_sizes));
      }

      if (getDataAttribute(element, settings.data_srcset)) {
        element.setAttribute('srcset', getDataAttribute(element, settings.data_srcset));
      }

      if (getDataAttribute(element, settings.data_src)) {
        instance._loadingCount += 1;

        handleLoad = function() {
          element.removeEventListener('load', handleLoad);
          element.removeEventListener('error', handleError);
          instance._complete(element, true);
        };

        handleError = function() {
          element.removeEventListener('load', handleLoad);
          element.removeEventListener('error', handleError);
          instance._complete(element, false);
        };

        element.addEventListener('load', handleLoad);
        element.addEventListener('error', handleError);

        element.setAttribute('src', getDataAttribute(element, settings.data_src));
        runCallback(settings.callback_set, element);
        return;
      }
    }

    this._complete(element, true);
  };

  LazyLoad.prototype.load = function(element, force) {
    if (!element || (!force && isProcessed(element))) {
      return;
    }

    if (this._observer) {
      this._observer.unobserve(element);
    }

    markProcessed(element);
    this._removeElement(element);
    addClass(element, this._settings.class_loading);
    runCallback(this._settings.callback_enter, element);
    this._loadElementSource(element);
  };

  LazyLoad.prototype.loadAll = function() {
    var instance = this;

    this._elements.slice().forEach(function(element) {
      instance.load(element);
    });
  };

  LazyLoad.prototype.update = function(elements) {
    var instance = this;
    var settings = this._settings;
    var container = settings.container === document ? document : settings.container;
    var candidates = elements ? toArray(elements) : toArray(container.querySelectorAll(settings.elements_selector));

    candidates = candidates.filter(function(element) {
      return !isProcessed(element);
    });

    if (!candidates.length) {
      this._finishIfDone();
      return;
    }

    candidates.forEach(function(element) {
      if (instance._elements.indexOf(element) === -1) {
        instance._elements.push(element);
      }

      if (instance._observer) {
        instance._observer.observe(element);
      } else {
        instance.load(element);
      }
    });
  };

  LazyLoad.prototype.destroy = function() {
    var instance = this;

    if (this._observer) {
      this._elements.forEach(function(element) {
        instance._observer.unobserve(element);
      });
      this._observer.disconnect();
      this._observer = null;
    }

    this._elements = [];
  };

  global.LazyLoad = LazyLoad;

  if (global.lazyLoadOptions) {
    toArray(global.lazyLoadOptions).forEach(function(options) {
      new LazyLoad(options);
    });
  }
})(window);
