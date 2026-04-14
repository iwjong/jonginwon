jQuery(document).ready(function(){

  let _index = document.body.querySelector('.__main__images__container')

  if(_index){
    reqListener(_obj)
  }

  function reqListener (_getACF) {

    let arr_projects = _getACF
    arr_projects.sort( () => Math.random() - 0.5).pop()

    let arr_images = []

    while (arr_projects.flat().length > 0){
      for (var projects of arr_projects){
        if (projects.length > 0){
          let image_pop = projects.sort( () => Math.random() - 0.5).pop()
          arr_images.push(image_pop)
        }
      }
    }

    html_output(arr_images.splice(0,18))

    setTimeout(function(){
      jQuery(window).scroll(function() {
         if(jQuery(window).scrollTop() + jQuery(window).height() > jQuery(document).height() - 100) {
           if(arr_images.length > 0){
             html_output(arr_images.splice(0,18))
           }
         }
      });
    },50)


  }

  function html_output(newArray){
    let _output = "";
    let _nextColumn = "left"
    for (var __image of newArray){
      if ( _nextColumn == 'left'){
      _output += `<div class='__section__images__wrapper cf '>`
      _output += `<div class='__section__images__left__container'>`
      _output += `<a class='__section__images__left__img' href='${__image.link}' style='background-image:url(${__image.image})' ></a>`
      _output += `</div>`
      _nextColumn = 'center'
      }
      else if ( _nextColumn == 'center' ){
      _output += `<div class='__section__images__center__container'>`
      _output += `<a class='__section__images__center__img' href='${__image.link}' style='background-image:url(${__image.image})' ></a>`
      _output += `</div>`
      _nextColumn = 'right'
      }
      else if ( _nextColumn == 'right' ){
      _output += `<div class='__section__images__right__container'>`
      _output += `<a class='__section__images__right__img' href='${__image.link}' style='background-image:url( ${__image.image} )' ></a>`
      _output += `</div>`
      _output += `</div>`
      _nextColumn = 'left'
      }
    }
    document.body.querySelector('main').innerHTML  += _output
  }



})