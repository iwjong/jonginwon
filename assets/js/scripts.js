jQuery(document).ready(function(){

jQuery('.__main__project__img__item').click(function(){
  if (_checkSize() == "desktop"){

    jQuery('.__slides__project__group__icons__close').on("click keyup", function(e){
        if(jQuery('.__slides__project__container').css('display')   == 'block'){
          jQuery('.__main__project__container').removeClass('__main__project__container__hidden')
          jQuery('.__slides__project__container').css('display','none')
          var exitImageIndex = jQuery('.__slides__project__img__item').attr('data-index');
          jQuery('.__main__project__container').removeClass('__main__project__container__hidden')
          jQuery('.__slides__project__container').css('display','none');
          var exitOffsetHeight = jQuery(".__main__project__img__item[data-index=" + exitImageIndex + "]").offset()['top']
          var exitObjectHeight = jQuery(".__main__project__img__item[data-index=" + exitImageIndex + "]")[0].offsetHeight
          var exitOffsetHeightNum = parseInt(exitOffsetHeight);
          var exitObjectHeightNum = parseInt(exitObjectHeight);
          var navHeight = jQuery('.__nav__container')[0].offsetHeight
          scrollTo(0, exitOffsetHeightNum - navHeight );
        }
    })
    if(jQuery('.__slides__project__container').css('display')   == 'none'){

      var allImages = jQuery('.__main__project__img__item')
      var indexStart = allImages.index(jQuery(this))
      var arrayURL = allImages.map(function(){return jQuery(this).css("background-image")})
          arrayURL = arrayURL.filter(function(n,i){ return i !== 'none' });
      var arraySize = arrayURL.length
      var indexAdd = 0
      var currentURL = arrayURL[indexStart + indexAdd]
      var currentIndex = jQuery(this).attr('data-index');
      jQuery('.__slides__project__container').css('display','block')
      jQuery('.__slides__project__container').find('.__slides__project__img__item').css('background-image', currentURL).attr('data-index',currentIndex);
      window.scrollTo(0, 48 )
      jQuery('.__main__project__container').addClass('__main__project__container__hidden')

      jQuery('.__slides__project__img__item,.__slides__project__group__icons__next').click(function(){
        if(indexAdd + indexStart < arraySize-1){
          indexAdd += 1;
        }else{
          indexStart = 0;
          indexAdd = 0;
        }
        jQuery('.__slides__project__container').find('.__slides__project__img__item').css('background-image',  arrayURL[indexStart + indexAdd] )
        jQuery('.__slides__project__img__item').attr('data-index',   indexStart + indexAdd )
      })

      jQuery('.__slides__project__group__icons__prev').click(function(){
        if(indexAdd + indexStart > 0){
          indexAdd -= 1;
        }else{
          indexStart = arraySize-1;
          indexAdd = 0;
        }
        jQuery('.__slides__project__container').find('.__slides__project__img__item').css('background-image',   arrayURL[indexStart + indexAdd])
        jQuery('.__slides__project__img__item').attr('data-index',   indexStart + indexAdd )

      })
    }
  }
})

jQuery(".__main__project__text__title").click(function(e){
  window.scrollTo(0 , 0)
});

jQuery(document).keyup(function(e) {
     if (e.keyCode == 27) {
       if(jQuery('.__slides__project__container').css('display')   == 'block'){
        var exitImageIndex = jQuery('.__slides__project__img__item').attr('data-index');
        jQuery('.__main__project__container').removeClass('__main__project__container__hidden')
        jQuery('.__slides__project__container').css('display','none');
        var exitOffsetHeight = jQuery(".__main__project__img__item[data-index=" + exitImageIndex + "]").offset()['top']
        var exitObjectHeight = jQuery(".__main__project__img__item[data-index=" + exitImageIndex + "]")[0].offsetHeight
        var exitOffsetHeightNum = parseInt(exitOffsetHeight);
        var exitObjectHeightNum = parseInt(exitObjectHeight);
        var navHeight = jQuery('.__nav__container')[0].offsetHeight
        scrollTo(0, exitOffsetHeightNum - navHeight );
       }
    }
});

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
  if(_className.css('display' == 'table-cell')){
    _className.css('display' == 'none')
  }else{
    _className.css('display' == 'table-cell')
  }
}
document.addEventListener('gesturestart', function (e) {
    e.preventDefault();
});
