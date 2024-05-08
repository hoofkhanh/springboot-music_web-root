document.addEventListener('DOMContentLoaded', function(){
	
	window.getLyrics = function getLyrics(){
		let trackTitle = document.getElementById('display-name-of-track').textContent;
		
		Array.from(document.getElementsByClassName('active-music')).forEach(div => {
			trackTitle = div.querySelector('.name-of-track-in-page-playlist').textContent;
		});
		
		if(trackTitle != null && trackTitle != ''){
			fetch('/artist/tracks/getLyrics?trackTitle='+trackTitle)
				.then(response => response.text())
				.then(lyrics => {
					console.log(lyrics)
					Array.from(document.getElementById('page-of-lyrics').querySelector('.display-lyrics').children).forEach(element => {
						document.getElementById('page-of-lyrics').querySelector('.display-lyrics').removeChild(element);
					});
					
					Array.from(lyrics.split('\n')).forEach((line, index) => {
						let lengthOfLyrics = lyrics.split('\n').length;
						if(lengthOfLyrics > 1){
							if(index < lengthOfLyrics -2 && index < lengthOfLyrics-1){
								let p =document.createElement('p');
								p.textContent = line;
								document.getElementById('page-of-lyrics').querySelector('.display-lyrics').appendChild(p);
							}
						}else{
							let p =document.createElement('p');
							p.textContent = line;
							document.getElementById('page-of-lyrics').querySelector('.display-lyrics').appendChild(p);
						}
						
						
					});
					
				});
		}
	}
	

	
	let lyrics = document.getElementById('icon-lyrics');
	lyrics.addEventListener('click', function(){
	
		document.getElementById('page-of-lyrics').style.display = 'block';
		document.getElementById('display-all-track').style.display = 'none';
		document.getElementById('upload-track-by-artist').style.display = 'none';
		document.getElementById('upload-playlist-by-artist').style.display = 'none';
		document.getElementById('page-of-track').style.display = 'none';
		document.getElementById('page-of-artist').style.display = 'none';
		document.getElementById('page-of-play-list').style.display = 'none';
		document.getElementById('index').style.display = 'none';
		document.getElementById('page-of-search').style.display = 'none';

		getLyrics();
		
	});
	
	
});