jQuery(document).ready(function(){

  let _index = jQuery('.__main__images__container');

  if(_index.length){
    reqListener(_obj);
  }

  function reqListener (_getACF) {

    let arr_projects = _getACF.map(function(projects) {
      return shuffleArray(projects.slice());
    });
    let arr_images = [];

    while (arr_projects.some(function(projects) { return projects.length > 0; })){
      shuffleArray(arr_projects);

      for (var projects of arr_projects){
        if (projects.length > 0){
          arr_images.push(projects.pop());
        }
      }
    }

    html_output(arr_images.splice(0,18));

    setTimeout(function(){
      jQuery(window).on('scroll', function() {
         if(jQuery(window).scrollTop() + jQuery(window).height() > jQuery(document).height() - 100) {
           if(arr_images.length > 0){
             html_output(arr_images.splice(0,18));
           }
         }
      });
    },50);


  }

  function shuffleArray(arr){
    for (let i = arr.length - 1; i > 0; i -= 1) {
      let randomIndex = Math.floor(Math.random() * (i + 1));
      let temp = arr[i];
      arr[i] = arr[randomIndex];
      arr[randomIndex] = temp;
    }

    return arr;
  }

  function html_output(newArray){
    let _output = "";
    let _nextColumn = "left";

    for (var __image of newArray){
      if ( _nextColumn == 'left'){
      _output += `<div class='__section__images__wrapper cf '>`;
      _output += `<div class='__section__images__left__container'>`;
      _output += `<a class='__section__images__left__img' href='${__image.link}' style='background-image:url(${__image.image})' ></a>`;
      _output += `</div>`;
      _nextColumn = 'center';
      }
      else if ( _nextColumn == 'center' ){
      _output += `<div class='__section__images__center__container'>`;
      _output += `<a class='__section__images__center__img' href='${__image.link}' style='background-image:url(${__image.image})' ></a>`;
      _output += `</div>`;
      _nextColumn = 'right';
      }
      else if ( _nextColumn == 'right' ){
      _output += `<div class='__section__images__right__container'>`;
      _output += `<a class='__section__images__right__img' href='${__image.link}' style='background-image:url( ${__image.image} )' ></a>`;
      _output += `</div>`;
      _output += `</div>`;
      _nextColumn = 'left';
      }
    }

    if (_nextColumn != 'left') {
      _output += `</div>`;
    }

    _index[0].insertAdjacentHTML('beforeend', _output);
  }



})
