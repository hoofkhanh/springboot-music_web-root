document.addEventListener('DOMContentLoaded', function(){
  document.getElementById('i-search-libary').addEventListener('click', function(){
    let input = document.getElementById('input-search-libary');
    let computedStyle = window.getComputedStyle(input);
    if(computedStyle.opacity == 0){
      input.style.opacity = '1';
      input.style.pointerEvents = 'all';
      input.style.width = '100%';
      input.style.transition = 'opacity 2s, width 2s'; 
    }else{
      input.style.opacity = '0';
      input.style.width = '0%';
      input.style.pointerEvents = 'none';
      input.style.transition = 'opacity 2s, width 2s';
    }
  });
  
  document.getElementById('i-search-track-album-playlist-artist').addEventListener('click', function(){
    let input = document.getElementById('input-search-track-album-playlist-artist');
    let computedStyle = window.getComputedStyle(input);
    if(computedStyle.opacity == 0){
      input.style.opacity = '1';
      input.style.pointerEvents = 'all';
      input.style.width = '90%';
      input.style.transition = 'opacity 2s, width 2s'; 
    }else{
      input.style.opacity = '0';
      input.style.width = '0%';
      input.style.pointerEvents = 'none';
      input.style.transition = 'opacity 2s, width 2s';
    }
  });
});