jQuery(document).ready(function(){
  var $slidesContainer = jQuery('.__slides__project__container');
  var $slideImage = $slidesContainer.find('.__slides__project__img__item');
  var $mainProjectContainer = jQuery('.__main__project__container');
  var galleryItems = [];
  var currentSlideIndex = 0;
  var aboutBackLinkStorageKey = 'inwon:last-project-page';
  var footerTopButtonHtml = '<button type="button" class="__footer__scroll__top" aria-label="Back to top"><span class="__footer__scroll__top__arrow" aria-hidden="true">↑</span><span class="__footer__scroll__top__label">Top</span></button>';
  var imageAspectSelector = [
    '.__section__images__left__img',
    '.__section__images__center__img',
    '.__section__images__right__img',
    '.__section__about__img__item',
    '.__section__about__img__item-vertical',
    '.__main__project__img__item',
    '.__main__project__img__item-vert',
    '.__footer__project__left__img',
    '.__footer__project__right__img'
  ].join(', ');
  imageAspectSelector += ', .__article__news__img__item, .__article__news__img__item-vertical, .__slides__project__img__item';

  function isAboutPage() {
    return jQuery('body').hasClass('__body-about');
  }

  function normalizePageLabel(text) {
    return jQuery.trim(String(text || '').replace(/\s+/g, ' '));
  }

  function getCurrentProjectPageData() {
    var $projectTitleLabel = jQuery('.__main__project__text__title__item__label').first();

    if (isAboutPage() || !$projectTitleLabel.length) {
      return null;
    }

    return {
      type: 'project',
      label: normalizePageLabel($projectTitleLabel.text()),
      url: window.location.href
    };
  }

  function rememberLastProjectPage() {
    var pageData = getCurrentProjectPageData();

    try {
      if (pageData) {
        sessionStorage.setItem(aboutBackLinkStorageKey, JSON.stringify(pageData));
      }
    } catch (error) {}
  }

  function initAboutBackLink() {
    var $backLink = jQuery('[data-about-back-link]');
    var $backLabel = jQuery('[data-about-back-label]');
    var pageData = null;
    var fallbackUrl;
    var fallbackLabel;

    if (!isAboutPage() || !$backLink.length || !$backLabel.length) {
      return;
    }

    fallbackUrl = $backLink.attr('data-about-back-default-href') || '../projects/23-telfair-childrens-art-museum/index.html';
    fallbackLabel = $backLink.attr('data-about-back-default-label') || 'Telfair Children\'s Art Museum';

    try {
      pageData = JSON.parse(sessionStorage.getItem(aboutBackLinkStorageKey) || 'null');
    } catch (error) {}

    if (!pageData || pageData.type !== 'project' || !pageData.url || !pageData.label) {
      pageData = {
        type: 'project',
        url: fallbackUrl,
        label: fallbackLabel
      };
    }

    $backLink.attr('href', pageData.url);
    $backLink.attr('aria-label', 'Return to ' + pageData.label);
    $backLabel.text(pageData.label);
  }

  function getProjectImages() {
    return jQuery('.__main__project__img__item');
  }

  function getNavHeight() {
    var $nav = jQuery('.__nav__container-images, .__nav__container-home, .__nav__container').first();

    if ($nav.length) {
      return $nav.outerHeight();
    }

    return 0;
  }

  function isGalleryOpen() {
    return $slidesContainer.length && $slidesContainer.css('display') == 'block';
  }

  function buildGalleryItems() {
    galleryItems = [];

    getProjectImages().each(function() {
      var imageUrl = jQuery(this).css('background-image');

      if (imageUrl && imageUrl !== 'none') {
        galleryItems.push({
          element: this,
          imageUrl: imageUrl
        });
      }
    });
  }

  function getGalleryIndex(clickedElement) {
    for (var i = 0; i < galleryItems.length; i += 1) {
      if (galleryItems[i].element === clickedElement) {
        return i;
      }
    }

    return -1;
  }

  function renderSlide(index) {
    if (!$slideImage.length || !galleryItems.length) {
      return;
    }

    currentSlideIndex = index;

    $slideImage
      .css('background-image', galleryItems[currentSlideIndex].imageUrl)
      .attr('data-index', currentSlideIndex);
  }

  function openGallery(clickedElement) {
    if (_checkSize() != "desktop" || !$slidesContainer.length) {
      return;
    }

    buildGalleryItems();

    currentSlideIndex = getGalleryIndex(clickedElement);

    if (currentSlideIndex < 0) {
      return;
    }

    renderSlide(currentSlideIndex);
    $slidesContainer.css('display', 'block');
    window.scrollTo(0, 48);
    $mainProjectContainer.addClass('__main__project__container__hidden');
  }

  function closeGallery() {
    var $exitImage;

    if (!isGalleryOpen()) {
      return;
    }

    $exitImage = galleryItems[currentSlideIndex] ? jQuery(galleryItems[currentSlideIndex].element) : jQuery();

    $mainProjectContainer.removeClass('__main__project__container__hidden');
    $slidesContainer.css('display', 'none');

    if ($exitImage.length) {
      window.scrollTo(0, Math.max(0, parseInt($exitImage.offset().top, 10) - getNavHeight()));
    }
  }

  function showNextSlide() {
    if (!isGalleryOpen() || galleryItems.length < 2) {
      return;
    }

    renderSlide((currentSlideIndex + 1) % galleryItems.length);
  }

  function showPreviousSlide() {
    if (!isGalleryOpen() || galleryItems.length < 2) {
      return;
    }

    renderSlide((currentSlideIndex - 1 + galleryItems.length) % galleryItems.length);
  }

  function scrollToTop() {
    if ('scrollBehavior' in document.documentElement.style) {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    } else {
      window.scrollTo(0, 0);
    }
  }

  function initFooterTopButton() {
    jQuery('.__footer__project__comment__container').each(function() {
      jQuery(this).empty().append(footerTopButtonHtml);
    });
  }

  function extractBackgroundImageUrl(element) {
    var backgroundImage = jQuery(element).css('background-image');
    var matches;

    if (!backgroundImage || backgroundImage === 'none') {
      return '';
    }

    matches = /url\((['"]?)(.*?)\1\)/.exec(backgroundImage);

    if (!matches || !matches[2]) {
      return '';
    }

    return matches[2];
  }

  function setAspectClass(element, isPortrait) {
    jQuery(element)
      .removeClass('__image__aspect--pending')
      .toggleClass('__image__aspect--portrait', isPortrait)
      .toggleClass('__image__aspect--landscape', !isPortrait);
  }

  function applyImageAspect(element) {
    var imageUrl = extractBackgroundImageUrl(element);
    var imageLoader;

    if (!imageUrl || element.dataset.aspectReady === 'true') {
      return;
    }

    element.dataset.aspectReady = 'loading';
    jQuery(element).addClass('__image__aspect__item __image__aspect--pending');

    imageLoader = new Image();
    imageLoader.onload = function() {
      setAspectClass(element, imageLoader.naturalHeight > imageLoader.naturalWidth);
      element.dataset.aspectReady = 'true';
    };
    imageLoader.onerror = function() {
      setAspectClass(element, false);
      element.dataset.aspectReady = 'error';
    };
    imageLoader.src = imageUrl;
  }

  function applyImageAspectSystem(rootNode) {
    var root = rootNode || document;

    jQuery(root).find(imageAspectSelector).each(function() {
      applyImageAspect(this);
    });

    if (root.matches && root.matches(imageAspectSelector)) {
      applyImageAspect(root);
    }
  }

  function initImageAspectObserver() {
    if (!window.MutationObserver) {
      return;
    }

    new MutationObserver(function(mutations) {
      mutations.forEach(function(mutation) {
        mutation.addedNodes.forEach(function(node) {
          if (node.nodeType === 1) {
            applyImageAspectSystem(node);
          }
        });
      });
    }).observe(document.body, {
      childList: true,
      subtree: true
    });
  }

  getProjectImages().on('click', function() {
    openGallery(this);
  });

  jQuery('.__slides__project__img__item, .__slides__project__group__icons__next').on('click', function() {
    showNextSlide();
  });

  jQuery('.__slides__project__group__icons__prev').on('click', function() {
    showPreviousSlide();
  });

  jQuery('.__slides__project__group__icons__close').on('click keyup', function(e) {
    if (e.type == 'click' || e.key == 'Enter' || e.key == ' ' || e.keyCode == 13 || e.keyCode == 32) {
      closeGallery();
    }
  });

  jQuery(".__main__project__text__title").click(function(){
    window.scrollTo(0 , 0);
  });

  jQuery(document).keyup(function(e) {
    if (e.keyCode == 27 || e.key == 'Escape') {
      closeGallery();
    }
  });

  jQuery(document).on('click', '.__footer__scroll__top', function(e) {
    e.preventDefault();
    scrollToTop();
  });

  initAboutBackLink();
  rememberLastProjectPage();
  jQuery(window).on('pageshow', function() {
    rememberLastProjectPage();
  });
  initFooterTopButton();
  applyImageAspectSystem(document);
  initImageAspectObserver();
});

function _checkSize(){
  var mobileTest = jQuery(".__mobile__test").css("text-align")
  switch (mobileTest){
    case "left":
      return "mobile"
      break
    case "center":
      return "tablet"
      break
    case "right":
      return "desktop"
      break
  }
}
function _mobileIconToggle (_className){
  if(_className.css('display') == 'table-cell'){
    _className.css('display', 'none')
  }else{
    _className.css('display', 'table-cell')
  }
}
document.addEventListener('gesturestart', function (e) {
    e.preventDefault();
});

