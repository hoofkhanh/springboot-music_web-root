document.addEventListener('DOMContentLoaded', function(){
	document.getElementById('button-search-all').style.backgroundColor = 'rgba(75, 73, 73, 0.992)';
	
	function returnPageOfIndex(){
		document.getElementById('index').style.display = 'block';
	    document.getElementById('display-all-track').style.display = 'none';
	    document.getElementById('page-of-play-list').style.display = 'none';
	    document.getElementById('page-of-artist').style.display = 'none';
	    document.getElementById('page-of-track').style.display = 'none';
	    document.getElementById('upload-track-by-artist').style.display = 'none';
	    document.getElementById('upload-playlist-by-artist').style.display = 'none';
	    document.getElementById('page-of-search').style.display = 'none';
	}
	
	async function searchArtist(value){
		await fetch('/artist/artists/findArtistByArtistNameInSearch?artistName='+value)
			.then(response => response.json())
			.then(artists => {
				let trackParentDiv = document.getElementById("artist-in-page-of-search");
				let childElements = trackParentDiv.children;
				
				let lengthOfAllDivChildInDisplayAllTrack = document.getElementById('all-artist-in-page-of-search').children.length;
				if(lengthOfAllDivChildInDisplayAllTrack != null){
					
					if(lengthOfAllDivChildInDisplayAllTrack != 1){
						let allTrack = document.getElementById('all-artist-in-page-of-search');
						 for (let i = lengthOfAllDivChildInDisplayAllTrack - 1; i > 0; i--) {
					        allTrack.removeChild(allTrack.children[i]);
					    }
					}	
					
					Array.from(artists).forEach(artist => {
						let newTrackParentDiv = document.createElement("div");
						newTrackParentDiv.classList.add('playlist-artist-track');
						newTrackParentDiv.classList.add('artist');
						newTrackParentDiv.classList.add('search');
						
						for(let i=0; i<= childElements.length-1 ; i++){
							if(i == 0){
								let imageOfTrack = document.createElement("div");
								imageOfTrack.classList.add('image-of-artist-in-playlist-artist-track');
								imageOfTrack.innerHTML = childElements[i].innerHTML;
								imageOfTrack.querySelector("img").src = 'data:image/jpeg;base64,' + artist.image;
								imageOfTrack.querySelector(".hidden-name-of-playlist").textContent = artist.artistName;	
								newTrackParentDiv.appendChild(imageOfTrack)
							}else if(i == 1){
								let infoOfTrack = document.createElement("div");
								infoOfTrack.classList.add('info-artist-in-playlist-artist-track');
								infoOfTrack.innerHTML = childElements[i].innerHTML;
								infoOfTrack.querySelector(".name-of-playlist-artist-track").innerHTML = artist.artistName;
								
								newTrackParentDiv.appendChild(infoOfTrack)
							}else{
								let buttonPlay = document.createElement("a");
								buttonPlay.classList.add('button-play');
								buttonPlay.innerHTML = childElements[i].innerHTML;
								newTrackParentDiv.appendChild(buttonPlay)
							}
						}
						// event click để nghe nhạc
						newTrackParentDiv.querySelector('.button-play')
							.addEventListener('click', (event) => addEventWhenClick(event));
						
						/*click vào button play thì không bị nhảy trang artist*/
						newTrackParentDiv.querySelector('.button-play').addEventListener('click', function(event){
					        event.stopPropagation();
						});
									
						// event click để qua trang track
						newTrackParentDiv.addEventListener('click', () => displayPageOfArtist(artist.artistName, 
							newTrackParentDiv.querySelector('.button-play')));
							
						/*chỉnh cho nút play nếu đang play một bài hát*/
						if(artist.artistName == document.getElementById('valueOfTrack').value){
							newTrackParentDiv.querySelector('.button-play').classList.add('active-playlist');
							if(document.getElementById('icon-play-track').classList.contains('fa-pause')){
								if(newTrackParentDiv.querySelector('i').classList.contains('fa-play')){
									newTrackParentDiv.querySelector('i').classList.remove('fa-play');
									newTrackParentDiv.querySelector('i').classList.add('fa-pause');
								}
							}else{
								if(newTrackParentDiv.querySelector('i').classList.contains('fa-pause')){	
									newTrackParentDiv.querySelector('i').classList.remove('fa-pause');
									newTrackParentDiv.querySelector('i').classList.add('fa-play');
								}
							}
						}
					 	
						document.getElementById('all-artist-in-page-of-search').appendChild(newTrackParentDiv);
					});
				}
			});
	}
	
	async function searchAlbum(value){
		await fetch('/artist/artists/findAllPlaylistByPlaylistTitleInSearch?playlistTitle='+value)
	        .then(response => response.json())
	        .then(playlists => {
				let playlistParentDiv = document.getElementById("album-in-page-of-search");
				let childElements = playlistParentDiv.children;	
				
				let lengthOfAllDivChildInDisplayAllTrack = document.getElementById('all-album-in-page-of-search').children.length;
				if(lengthOfAllDivChildInDisplayAllTrack != null){
					if(lengthOfAllDivChildInDisplayAllTrack != 1){
						let allPlaylist = document.getElementById('all-album-in-page-of-search');
						 for (let i = lengthOfAllDivChildInDisplayAllTrack - 1; i > 0; i--) {
					        allPlaylist.removeChild(allPlaylist.children[i]);
					    }
					}	
						
					Array.from(playlists).forEach(playlist => {
						if(playlist.album == true){
							let newPlaylistParentDiv = document.createElement("div");
							newPlaylistParentDiv.classList.add('playlist-artist-track');
							newPlaylistParentDiv.classList.add('album-or-playlist');
							newPlaylistParentDiv.classList.add('search');
							
							for(let i=0; i<= childElements.length-1 ; i++){
								if(i == 0){
									let imageOfPlaylist = document.createElement("div");
									imageOfPlaylist.classList.add('image-of-playlist-track-in-playlist-artist-track');
									imageOfPlaylist.innerHTML = childElements[i].innerHTML;
									imageOfPlaylist.querySelector("img").src = 'data:image/jpeg;base64,' + playlist.image;
									imageOfPlaylist.querySelector(".hidden-name-of-playlist").textContent = playlist.playlistTitle;	
									newPlaylistParentDiv.appendChild(imageOfPlaylist)
								}else if(i == 1){
									let infoOfPlaylist = document.createElement("div");
									infoOfPlaylist.classList.add('info-artist-in-playlist-artist-track');
									infoOfPlaylist.innerHTML = childElements[i].innerHTML;
									infoOfPlaylist.querySelector(".name-of-playlist-artist-track").innerHTML = playlist.playlistTitle;
									
									let artistOfPlaylist =  infoOfPlaylist.querySelector(".artist-of-playlist-artist-track");
									artistOfPlaylist.querySelector('a').innerHTML = playlist.user.artistName;
									
									newPlaylistParentDiv.appendChild(infoOfPlaylist)
								}else{
									let buttonPlay = document.createElement("a");
									buttonPlay.classList.add('button-play');
									buttonPlay.innerHTML = childElements[i].innerHTML;
									newPlaylistParentDiv.appendChild(buttonPlay)
								}
							}
							newPlaylistParentDiv.querySelector('.button-play')
										.addEventListener('click',  (event) => addEventWhenClick(event));
										
							/*click vào button play thì không bị nhảy trang playlist*/
							newPlaylistParentDiv.querySelector('.button-play').addEventListener('click', function(event){
						        event.stopPropagation();
							});
										
							// event click để qua trang playlist
							newPlaylistParentDiv.addEventListener('click', () => displayPageOfPlaylists(playlist.playlistTitle, 
								newPlaylistParentDiv.querySelector('.button-play')));
								
							/*chỉnh cho nút play nếu đang play một bài hát*/
							if(playlist.playlistTitle == document.getElementById('valueOfTrack').value){
								newPlaylistParentDiv.querySelector('.button-play').classList.add('active-playlist');
								if(document.getElementById('icon-play-track').classList.contains('fa-pause')){
									if(newPlaylistParentDiv.querySelector('i').classList.contains('fa-play')){
										newPlaylistParentDiv.querySelector('i').classList.remove('fa-play');
										newPlaylistParentDiv.querySelector('i').classList.add('fa-pause');
									}
								}else{
									if(newPlaylistParentDiv.querySelector('i').classList.contains('fa-pause')){	
										newPlaylistParentDiv.querySelector('i').classList.remove('fa-pause');
										newPlaylistParentDiv.querySelector('i').classList.add('fa-play');
									}
								}
							}
							
							document.getElementById('all-album-in-page-of-search').appendChild(newPlaylistParentDiv);
						}
						
					});
				}
				
	    	})
	    	.catch(error => console.error('Error fetching artists:', error));
	}
	
	async function searchPlaylist(value){
		await fetch('/artist/artists/findAllPlaylistByPlaylistTitleInSearch?playlistTitle='+value)
	        .then(response => response.json())
	        .then(playlists => {
				let playlistParentDiv = document.getElementById("playlist-in-page-of-search");
				let childElements = playlistParentDiv.children;	
				
				let lengthOfAllDivChildInDisplayAllTrack = document.getElementById('all-playlist-in-page-of-search').children.length;
				if(lengthOfAllDivChildInDisplayAllTrack != null){
					if(lengthOfAllDivChildInDisplayAllTrack != 1){
						let allPlaylist = document.getElementById('all-playlist-in-page-of-search');
						 for (let i = lengthOfAllDivChildInDisplayAllTrack - 1; i > 0; i--) {
					        allPlaylist.removeChild(allPlaylist.children[i]);
					    }
					}	
						
					Array.from(playlists).forEach(playlist => {
						if(playlist.album == false){
							let newPlaylistParentDiv = document.createElement("div");
							newPlaylistParentDiv.classList.add('playlist-artist-track');
							newPlaylistParentDiv.classList.add('album-or-playlist');
							newPlaylistParentDiv.classList.add('search');
							
							for(let i=0; i<= childElements.length-1 ; i++){
								if(i == 0){
									let imageOfPlaylist = document.createElement("div");
									imageOfPlaylist.classList.add('image-of-playlist-track-in-playlist-artist-track');
									imageOfPlaylist.innerHTML = childElements[i].innerHTML;
									imageOfPlaylist.querySelector("img").src = 'data:image/jpeg;base64,' + playlist.image;
									imageOfPlaylist.querySelector(".hidden-name-of-playlist").textContent = playlist.playlistTitle;	
									newPlaylistParentDiv.appendChild(imageOfPlaylist)
								}else if(i == 1){
									let infoOfPlaylist = document.createElement("div");
									infoOfPlaylist.classList.add('info-artist-in-playlist-artist-track');
									infoOfPlaylist.innerHTML = childElements[i].innerHTML;
									infoOfPlaylist.querySelector(".name-of-playlist-artist-track").innerHTML = playlist.playlistTitle;
									
									let artistOfPlaylist =  infoOfPlaylist.querySelector(".artist-of-playlist-artist-track");
									artistOfPlaylist.querySelector('a').innerHTML = playlist.user.artistName;
									
									newPlaylistParentDiv.appendChild(infoOfPlaylist)
								}else{
									let buttonPlay = document.createElement("a");
									buttonPlay.classList.add('button-play');
									buttonPlay.innerHTML = childElements[i].innerHTML;
									newPlaylistParentDiv.appendChild(buttonPlay)
								}
							}
							newPlaylistParentDiv.querySelector('.button-play')
										.addEventListener('click',  (event) => addEventWhenClick(event));
										
							/*click vào button play thì không bị nhảy trang playlist*/
							newPlaylistParentDiv.querySelector('.button-play').addEventListener('click', function(event){
						        event.stopPropagation();
							});
										
							// event click để qua trang playlist
							newPlaylistParentDiv.addEventListener('click', () => displayPageOfPlaylists(playlist.playlistTitle, 
								newPlaylistParentDiv.querySelector('.button-play')));
								
							/*chỉnh cho nút play nếu đang play một bài hát*/
							if(playlist.playlistTitle == document.getElementById('valueOfTrack').value){
								newPlaylistParentDiv.querySelector('.button-play').classList.add('active-playlist');
								if(document.getElementById('icon-play-track').classList.contains('fa-pause')){
									if(newPlaylistParentDiv.querySelector('i').classList.contains('fa-play')){
										newPlaylistParentDiv.querySelector('i').classList.remove('fa-play');
										newPlaylistParentDiv.querySelector('i').classList.add('fa-pause');
									}
								}else{
									if(newPlaylistParentDiv.querySelector('i').classList.contains('fa-pause')){	
										newPlaylistParentDiv.querySelector('i').classList.remove('fa-pause');
										newPlaylistParentDiv.querySelector('i').classList.add('fa-play');
									}
								}
							}
							
							document.getElementById('all-playlist-in-page-of-search').appendChild(newPlaylistParentDiv);
						}
						
					});
				}
				
	    	})
	    	.catch(error => console.error('Error fetching artists:', error));
	}
	
	async function searchTrack(value){
		 await fetch('/artist/artists/findAllTrackByTrackTitleInSearch?trackTitle='+value)
	        .then(response => response.json())
	        .then(tracks => {
				let trackParentDiv = document.getElementById("track-in-page-of-search");
				let childElements = trackParentDiv.children;
				
				let lengthOfAllDivChildInDisplayAllTrack = document.getElementById('all-track-in-page-of-search').children.length;
				if(lengthOfAllDivChildInDisplayAllTrack != null){
					
					if(lengthOfAllDivChildInDisplayAllTrack != 1){
						let allTrack = document.getElementById('all-track-in-page-of-search');
						 for (let i = lengthOfAllDivChildInDisplayAllTrack - 1; i > 0; i--) {
					        allTrack.removeChild(allTrack.children[i]);
					    }
					}	
					
					Array.from(tracks).forEach(track => {
						let newTrackParentDiv = document.createElement("div");
						newTrackParentDiv.classList.add('playlist-artist-track');
						newTrackParentDiv.classList.add('track');
						newTrackParentDiv.classList.add('search');
						
						for(let i=0; i<= childElements.length-1 ; i++){
							if(i == 0){
								let imageOfTrack = document.createElement("div");
								imageOfTrack.classList.add('image-of-playlist-track-in-playlist-artist-track');
								imageOfTrack.innerHTML = childElements[i].innerHTML;
								imageOfTrack.querySelector("img").src = 'data:image/jpeg;base64,' + track.image;
								imageOfTrack.querySelector(".hidden-name-of-playlist").textContent = track.trackTitle;	
								newTrackParentDiv.appendChild(imageOfTrack)
							}else if(i == 1){
								let infoOfTrack = document.createElement("div");
								infoOfTrack.classList.add('info-artist-in-playlist-artist-track');
								infoOfTrack.innerHTML = childElements[i].innerHTML;
								infoOfTrack.querySelector(".name-of-playlist-artist-track").innerHTML = track.trackTitle;
								
								let artistOfTrack =  infoOfTrack.querySelector(".artist-of-playlist-artist-track");
								artistOfTrack.querySelector('a').innerHTML = track.user.artistName;
								if(track.userList.length !=0){
									artistOfTrack.querySelector('a').insertAdjacentHTML('afterend', ',  ');
									
									for(let i=0; i<= track.userList.length -1; i++){
										let aTagNameOfCooperatorArtist =  document.createElement("a");
											aTagNameOfCooperatorArtist.classList.add('artist');
											aTagNameOfCooperatorArtist.innerHTML = track.userList[i].artistName;
											artistOfTrack.appendChild(aTagNameOfCooperatorArtist)
										if(i != track.userList.length -1 ){
											aTagNameOfCooperatorArtist.insertAdjacentHTML('afterend', ',  ');
										}
									}
								}
								
								newTrackParentDiv.appendChild(infoOfTrack)
							}else{
								let buttonPlay = document.createElement("a");
								buttonPlay.classList.add('button-play');
								buttonPlay.innerHTML = childElements[i].innerHTML;
								newTrackParentDiv.appendChild(buttonPlay)
							}
						}
						// event click để nghe nhạc
						newTrackParentDiv.querySelector('.button-play')
							.addEventListener('click', (event) => addEventWhenClick(event));
						
						/*click vào button play thì không bị nhảy trang track*/
						newTrackParentDiv.querySelector('.button-play').addEventListener('click', function(event){
					        event.stopPropagation();
						});
									
						// event click để qua trang track
						newTrackParentDiv.addEventListener('click', () => displayPageOfTrack(track.trackTitle, 
							newTrackParentDiv.querySelector('.button-play')));
							
						/*chỉnh cho nút play nếu đang play một bài hát*/
						if(track.trackTitle == document.getElementById('valueOfTrack').value){
							newTrackParentDiv.querySelector('.button-play').classList.add('active-playlist');
							if(document.getElementById('icon-play-track').classList.contains('fa-pause')){
								if(newTrackParentDiv.querySelector('i').classList.contains('fa-play')){
									newTrackParentDiv.querySelector('i').classList.remove('fa-play');
									newTrackParentDiv.querySelector('i').classList.add('fa-pause');
								}
							}else{
								if(newTrackParentDiv.querySelector('i').classList.contains('fa-pause')){	
									newTrackParentDiv.querySelector('i').classList.remove('fa-pause');
									newTrackParentDiv.querySelector('i').classList.add('fa-play');
								}
							}
						}
					 	
						document.getElementById('all-track-in-page-of-search').appendChild(newTrackParentDiv);
					});
				}
				
	    	})
	    	.catch(error => console.error('Error fetching artists:', error));
	}
	
	window.search = async function search(valueOfInput){
		document.getElementById('page-of-search').style.display = 'block';
		document.getElementById('index').style.display = 'none';
	    document.getElementById('display-all-track').style.display = 'none';
	    document.getElementById('page-of-play-list').style.display = 'none';
	    document.getElementById('page-of-artist').style.display = 'none';
	    document.getElementById('page-of-track').style.display = 'none';
	    document.getElementById('upload-track-by-artist').style.display = 'none';
	    document.getElementById('upload-playlist-by-artist').style.display = 'none';
	    
	    await searchArtist(valueOfInput);
	    
	    await searchAlbum(valueOfInput);
	    
	    await searchPlaylist(valueOfInput);
	    
	    await searchTrack(valueOfInput);
	}
	
	let inputSearch = document.getElementById('input-search-track-album-playlist-artist');
	inputSearch.addEventListener('input', async function(){
		if(inputSearch.value == ''){
			returnPageOfIndex();
		}else {
			await search(inputSearch.value);
		}
	});
	
	function removeTheOtherClass(){
		document.getElementById('button-search-all').style.backgroundColor = 'rgb(34, 33, 33)';
		document.getElementById('button-search-track').style.backgroundColor = 'rgb(34, 33, 33)';
		document.getElementById('button-search-album').style.backgroundColor = 'rgb(34, 33, 33)';
		document.getElementById('button-search-artist').style.backgroundColor = 'rgb(34, 33, 33)';
		document.getElementById('button-search-playlist').style.backgroundColor = 'rgb(34, 33, 33)';
	}
	
	document.getElementById('button-search-all').addEventListener('click', function(){
		document.getElementById('big-all-track-in-page-of-search').style.display = 'block';
		document.getElementById('big-all-album-in-page-of-search').style.display = 'block';
		document.getElementById('big-all-artist-in-page-of-search').style.display = 'block';
		document.getElementById('big-all-playlist-in-page-of-search').style.display = 'block';
		
		removeTheOtherClass();
		document.getElementById('button-search-all').style.backgroundColor = 'rgba(75, 73, 73, 0.992)';
	});
	
	document.getElementById('button-search-track').addEventListener('click', function(){
		document.getElementById('big-all-track-in-page-of-search').style.display = 'block';
		document.getElementById('big-all-album-in-page-of-search').style.display = 'none';
		document.getElementById('big-all-artist-in-page-of-search').style.display = 'none';
		document.getElementById('big-all-playlist-in-page-of-search').style.display = 'none';
		
		removeTheOtherClass();
		document.getElementById('button-search-track').style.backgroundColor = 'rgba(75, 73, 73, 0.992)';
	});
	
	document.getElementById('button-search-artist').addEventListener('click', function(){
		document.getElementById('big-all-track-in-page-of-search').style.display = 'none';
		document.getElementById('big-all-album-in-page-of-search').style.display = 'none';
		document.getElementById('big-all-artist-in-page-of-search').style.display = 'block';
		document.getElementById('big-all-playlist-in-page-of-search').style.display = 'none';
		
		removeTheOtherClass();
		document.getElementById('button-search-artist').style.backgroundColor = 'rgba(75, 73, 73, 0.992)';
	});
	
	document.getElementById('button-search-album').addEventListener('click', function(){
		document.getElementById('big-all-track-in-page-of-search').style.display = 'none';
		document.getElementById('big-all-album-in-page-of-search').style.display = 'block';
		document.getElementById('big-all-artist-in-page-of-search').style.display = 'none';
		document.getElementById('big-all-playlist-in-page-of-search').style.display = 'none';
		
		removeTheOtherClass();
		document.getElementById('button-search-album').style.backgroundColor = 'rgba(75, 73, 73, 0.992)';
	});
	
	document.getElementById('button-search-playlist').addEventListener('click', function(){
		document.getElementById('big-all-track-in-page-of-search').style.display = 'none';
		document.getElementById('big-all-album-in-page-of-search').style.display = 'none';
		document.getElementById('big-all-artist-in-page-of-search').style.display = 'none';
		document.getElementById('big-all-playlist-in-page-of-search').style.display = 'block';
		
		removeTheOtherClass();
		document.getElementById('button-search-playlist').style.backgroundColor = 'rgba(75, 73, 73, 0.992)';
	});
	
});