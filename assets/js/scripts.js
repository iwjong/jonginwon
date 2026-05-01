jQuery(document).ready(function(){
  var $slidesContainer = jQuery('.slides-project-container');
  var $slideGrouping = $slidesContainer.find('.slides-project-grouping').first();
  var $slideImage = jQuery();
  var $slidePrev = jQuery();
  var $slideMain = jQuery();
  var $slideNext = jQuery();
  var $mainProjectContainer = jQuery('.main-project-container');
  var galleryItems = [];
  var currentSlideIndex = 0;
  var aboutBackLinkStorageKey = 'inwon:last-project-page';
  var footerTopButtonHtml = '<button type="button" class="footer-scroll-top" aria-label="Back to top"><span class="footer-scroll-top-arrow" aria-hidden="true">↑</span><span class="footer-scroll-top-label">Top</span></button>';
  var footerYearStart = 1996;
  var imageAspectSelector = [
    '.section-about-img-item',
    '.main-project-img-item',
    '.footer-project-left-img',
    '.footer-project-right-img'
  ].join(', ');
  imageAspectSelector += ', .slides-project-img-item';

  function isAboutPage() {
    return jQuery('body').hasClass('body-about');
  }

  function normalizePageLabel(text) {
    return jQuery.trim(String(text || '').replace(/\s+/g, ' '));
  }

  function getCurrentProjectPageData() {
    var $projectTitleLabel = jQuery('.main-project-text-title-item-label').first();

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
    return jQuery('.main-project-img-item');
  }

  function getNavHeight() {
    var $nav = jQuery('.nav-container-images').first();

    if ($nav.length) {
      return $nav.outerHeight();
    }

    return 0;
  }

  function getPrimaryScrollTarget() {
    var $homeFeed = jQuery('body.body-images .main-images-container').first();
    var feedElement;
    var feedStyles;

    if ($homeFeed.length) {
      feedElement = $homeFeed[0];
      feedStyles = window.getComputedStyle ? window.getComputedStyle(feedElement) : null;

      if (feedStyles && (feedStyles.overflowY === 'auto' || feedStyles.overflowY === 'scroll') && feedElement.scrollHeight > feedElement.clientHeight) {
        return feedElement;
      }
    }

    return window;
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

  function ensureGalleryLayout() {
    var $existingSlide;

    if (!$slideGrouping.length) {
      return;
    }

    $slidesContainer.addClass('slides-project-container-vertical');

    $existingSlide = $slideGrouping.find('.slides-project-img-item').first();

    if (!$existingSlide.length) {
      $existingSlide = jQuery('<div class="slides-project-img-item"></div>');
      $slideGrouping.prepend($existingSlide);
    }

    $existingSlide
      .attr('data-gallery-role', 'main')
      .addClass('slides-project-img-item-main')
      .removeClass('slides-project-img-item-prev slides-project-img-item-next');

    if (!$slideGrouping.find('[data-gallery-role="prev"]').length) {
      $existingSlide.before('<div class="slides-project-img-item slides-project-img-item-prev" data-gallery-role="prev"></div>');
    }

    if (!$slideGrouping.find('[data-gallery-role="next"]').length) {
      $existingSlide.after('<div class="slides-project-img-item slides-project-img-item-next" data-gallery-role="next"></div>');
    }

    $slidePrev = $slideGrouping.find('[data-gallery-role="prev"]').first();
    $slideMain = $slideGrouping.find('[data-gallery-role="main"]').first();
    $slideNext = $slideGrouping.find('[data-gallery-role="next"]').first();
    $slideImage = $slideGrouping.find('.slides-project-img-item');

    $slidesContainer.find('.slides-project-counter').remove();
  }

  function renderSlide(index) {
    var itemCount = galleryItems.length;
    var previousIndex;
    var nextIndex;

    if (!$slideMain.length || !itemCount) {
      return;
    }

    currentSlideIndex = (index + itemCount) % itemCount;
    previousIndex = (currentSlideIndex - 1 + itemCount) % itemCount;
    nextIndex = (currentSlideIndex + 1) % itemCount;

    $slideMain
      .css('background-image', galleryItems[currentSlideIndex].imageUrl)
      .attr('data-index', currentSlideIndex)
      .attr('aria-label', 'Selected image ' + (currentSlideIndex + 1) + ' of ' + itemCount);

    if ($slidePrev.length) {
      $slidePrev
        .css('background-image', galleryItems[previousIndex].imageUrl)
        .attr('data-index', previousIndex)
        .attr('aria-label', 'Previous image ' + (previousIndex + 1) + ' of ' + itemCount);
    }

    if ($slideNext.length) {
      $slideNext
        .css('background-image', galleryItems[nextIndex].imageUrl)
        .attr('data-index', nextIndex)
        .attr('aria-label', 'Next image ' + (nextIndex + 1) + ' of ' + itemCount);
    }

    $slideImage.each(function() {
      applyImageAspect(this);
    });
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
    jQuery('body').addClass('is-gallery-open');
    window.scrollTo(0, 48);
    $mainProjectContainer.addClass('main-project-container-hidden');
  }

  function closeGallery() {
    var $exitImage;

    if (!isGalleryOpen()) {
      return;
    }

    $exitImage = galleryItems[currentSlideIndex] ? jQuery(galleryItems[currentSlideIndex].element) : jQuery();

    jQuery('body').removeClass('is-gallery-open');
    $mainProjectContainer.removeClass('main-project-container-hidden');
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
    var scrollTarget = getPrimaryScrollTarget();

    if (scrollTarget !== window) {
      if (typeof scrollTarget.scrollTo === 'function' && 'scrollBehavior' in document.documentElement.style) {
        scrollTarget.scrollTo({
          top: 0,
          behavior: 'smooth'
        });
      } else {
        scrollTarget.scrollTop = 0;
      }

      return;
    }

    if ('scrollBehavior' in document.documentElement.style) {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    } else {
      window.scrollTo(0, 0);
    }
  }

  function initFooterMeta() {
    var isHomePage = jQuery('body').hasClass('body-images');
    var currentYear = new Date().getFullYear();
    var footerYearText = footerYearStart + ' - ' + currentYear;

    jQuery('.footer-project-comment-container').each(function() {
      var $container = jQuery(this);

      $container.empty();

      if (isHomePage) {
        $container.append('<em>' + footerYearText + '</em>');
      } else {
        $container.append(footerTopButtonHtml);
      }
    });
  }

  function extractBackgroundImageUrl(element) {
    var backgroundImage = jQuery(element).css('background-image');
    var fallbackImage = element.getAttribute('data-bg') || element.getAttribute('data-image') || '';
    var matches;

    if (!backgroundImage || backgroundImage === 'none') {
      return fallbackImage;
    }

    matches = /url\((['"]?)(.*?)\1\)/.exec(backgroundImage);

    if (!matches || !matches[2]) {
      return fallbackImage;
    }

    return matches[2];
  }

  function setAspectClass(element, isPortrait) {
    jQuery(element)
      .removeClass('image-aspect-pending')
      .toggleClass('image-aspect-portrait', isPortrait)
      .toggleClass('image-aspect-landscape', !isPortrait);
  }

  function applyImageAspect(element) {
    var imageUrl = extractBackgroundImageUrl(element);
    var imageLoader;
    var currentAspectSource = element.dataset.aspectSource || '';

    if (!imageUrl) {
      return;
    }

    if ((element.dataset.aspectReady === 'true' || element.dataset.aspectReady === 'loading') && currentAspectSource === imageUrl) {
      return;
    }

    element.dataset.aspectSource = imageUrl;
    element.dataset.aspectReady = 'loading';
    jQuery(element).addClass('image-aspect-item image-aspect-pending');

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

  window.applyImageAspectSystem = applyImageAspectSystem;

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

  $slidesContainer.on('click', '.slides-project-img-item', function(e) {
    var role = this.getAttribute('data-gallery-role');

    e.preventDefault();
    e.stopPropagation();

    if (!isGalleryOpen()) {
      return;
    }

    if (role === 'prev') {
      showPreviousSlide();
      return;
    }

    if (role === 'next') {
      showNextSlide();
      return;
    }
  });

  $slidesContainer.on('click', function(e) {
    if (!isGalleryOpen()) {
      return;
    }

    if (jQuery(e.target).closest('.slides-project-img-item').length) {
      return;
    }

    closeGallery();
  });

  $slidesContainer.on('wheel', function(e) {
    var originalEvent;

    if (!isGalleryOpen()) {
      return;
    }

    originalEvent = e.originalEvent || {};

    if (!originalEvent.deltaY) {
      return;
    }

    e.preventDefault();

    if (originalEvent.deltaY > 0) {
      showNextSlide();
    } else {
      showPreviousSlide();
    }
  });

  jQuery('.slides-project-group-icons-close').on('click keyup', function(e) {
    if (e.type == 'click' || e.key == 'Enter' || e.key == ' ' || e.keyCode == 13 || e.keyCode == 32) {
      closeGallery();
    }
  });

  jQuery(".main-project-text-title").click(function(){
    window.scrollTo(0 , 0);
  });

  jQuery(document).keyup(function(e) {
    if (e.keyCode == 27 || e.key == 'Escape') {
      closeGallery();
      return;
    }

    if (!isGalleryOpen()) {
      return;
    }

    if (e.keyCode == 40 || e.key == 'ArrowDown' || e.keyCode == 39 || e.key == 'ArrowRight') {
      showNextSlide();
      return;
    }

    if (e.keyCode == 38 || e.key == 'ArrowUp' || e.keyCode == 37 || e.key == 'ArrowLeft') {
      showPreviousSlide();
    }
  });

  jQuery(document).on('click', '.footer-scroll-top', function(e) {
    e.preventDefault();
    scrollToTop();
  });

  initAboutBackLink();
  ensureGalleryLayout();
  rememberLastProjectPage();
  jQuery(window).on('pageshow', function() {
    rememberLastProjectPage();
  });
  initFooterMeta();
  applyImageAspectSystem(document);
  initImageAspectObserver();
});

function _checkSize(){
  var mobileTest = jQuery(".mobile-test").css("text-align")
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
