document.addEventListener('DOMContentLoaded', function() {
	
	async function clickToNameArtistInDataOtherTrackAndAlbumAndGoToSearch(nameArtist){
	    let name = nameArtist;
		await search(name);
		document.getElementById('button-search-all').click();
		Array.from(document.getElementById('all-artist-in-page-of-search').children).forEach((element, index) => {
			if(index >0 ){
				let nameInSearch = element.querySelector('.name-of-playlist-artist-track').textContent;
				if(nameInSearch == name){
					element.click();
				}
			}
		});
   }
	
  	// bấm vào nút nhạc của bạn
    let aTagUploadFile = document.getElementById('a-your-track');
    aTagUploadFile.addEventListener('click', window.yourTracks = async function(){
		document.getElementById('display-all-track').style.display = 'block';
	    document.getElementById('upload-track-by-artist').style.display = 'none';
	    document.getElementById('upload-playlist-by-artist').style.display = 'none';
	    document.getElementById('page-of-track').style.display = 'none';
        document.getElementById('page-of-artist').style.display = 'none';
        document.getElementById('page-of-play-list').style.display = 'none';
        document.getElementById('index').style.display = 'none';
        document.getElementById('page-of-search').style.display = 'none';
        document.getElementById('page-of-lyrics').style.display = 'none';
        
        document.getElementById('input-search-track-album-playlist-artist').value='';
             
        await fetch('/artist/tracks')
	        .then(response => response.json())
	        .then(tracks => {
				let trackParentDiv = document.getElementById("track-in-your-track");
				let childElements = trackParentDiv.children;
				
				let lengthOfAllDivChildInDisplayAllTrack = document.getElementById('all-track').children.length;
				if(lengthOfAllDivChildInDisplayAllTrack != null){
					
					if(lengthOfAllDivChildInDisplayAllTrack != 1){
						let allTrack = document.getElementById('all-track');
						 for (let i = lengthOfAllDivChildInDisplayAllTrack - 1; i > 0; i--) {
					        allTrack.removeChild(allTrack.children[i]);
					    }
					}	
					
					Array.from(tracks).forEach(track => {
						let newTrackParentDiv = document.createElement("div");
						newTrackParentDiv.classList.add('playlist-artist-track');
						newTrackParentDiv.classList.add('track');
						
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
								artistOfTrack.querySelector('a').addEventListener('click', function(event){
									event.stopPropagation();
									clickToNameArtistInDataOtherTrackAndAlbumAndGoToSearch(track.user.artistName);
								});
								if(track.userList.length !=0){
									artistOfTrack.querySelector('a').insertAdjacentHTML('afterend', ',  ');
									
									for(let i=0; i<= track.userList.length -1; i++){
										let aTagNameOfCooperatorArtist =  document.createElement("a");
											aTagNameOfCooperatorArtist.classList.add('artist');
											aTagNameOfCooperatorArtist.innerHTML = track.userList[i].artistName;
											aTagNameOfCooperatorArtist.addEventListener('click', function(event){
												event.stopPropagation();
												clickToNameArtistInDataOtherTrackAndAlbumAndGoToSearch(track.userList[i].artistName);
											});
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
					 	
						document.getElementById('all-track').appendChild(newTrackParentDiv);
					});
				}
				
	            document.getElementById("title-of-track-display-all-track").innerHTML = "Nhạc của bạn";
	    	})
	    	.catch(error => console.error('Error fetching artists:', error));
	
		 await fetch('/artist/playlists')
	        .then(response => response.json())
	        .then(playlists => {
				let playlistParentDiv = document.getElementById("album-in-your-track");
				let childElements = playlistParentDiv.children;	
				
				let lengthOfAllDivChildInDisplayAllTrack = document.getElementById('all-playlist').children.length;
				if(lengthOfAllDivChildInDisplayAllTrack != null){
					if(lengthOfAllDivChildInDisplayAllTrack != 1){
						let allPlaylist = document.getElementById('all-playlist');
						 for (let i = lengthOfAllDivChildInDisplayAllTrack - 1; i > 0; i--) {
					        allPlaylist.removeChild(allPlaylist.children[i]);
					    }
					}	
						
					Array.from(playlists).forEach(playlist => {
						if(playlist.album == true){
							let newPlaylistParentDiv = document.createElement("div");
							newPlaylistParentDiv.classList.add('playlist-artist-track');
							newPlaylistParentDiv.classList.add('album-or-playlist');
							
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
									artistOfPlaylist.querySelector('a').addEventListener('click', function(event){
										event.stopPropagation();
										clickToNameArtistInDataOtherTrackAndAlbumAndGoToSearch(playlist.user.artistName);
									});
									
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
							
							document.getElementById('all-playlist').appendChild(newPlaylistParentDiv);
						}
					});
				}
				
	            document.getElementById("title-of-album-display-all-track").innerHTML = "Album của bạn";
	    	})
	    	.catch(error => console.error('Error fetching artists:', error));
	    	
	    	await fetch('/artist/playlists')
	        .then(response => response.json())
	        .then(playlists => {
				
				let playlistParentDiv = document.getElementById("playlist-in-your-track");
				let childElements = playlistParentDiv.children;	
				
				let lengthOfAllDivChildInDisplayAllTrack = document.getElementById('all-playlist-in-display-of-track').children.length;
				if(lengthOfAllDivChildInDisplayAllTrack != null){
					if(lengthOfAllDivChildInDisplayAllTrack != 1){
						let allPlaylist = document.getElementById('all-playlist-in-display-of-track');
						 for (let i = lengthOfAllDivChildInDisplayAllTrack - 1; i > 0; i--) {
					        allPlaylist.removeChild(allPlaylist.children[i]);
					    }
					}	
						
					Array.from(playlists).forEach(playlist => {
					
						if(playlist.album == false){
							let newPlaylistParentDiv = document.createElement("div");
							newPlaylistParentDiv.classList.add('playlist-artist-track');
							newPlaylistParentDiv.classList.add('album-or-playlist');
							
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
									artistOfPlaylist.querySelector('a').addEventListener('click', function(event){
										event.stopPropagation();
										clickToNameArtistInDataOtherTrackAndAlbumAndGoToSearch(playlist.user.artistName);
									});
									
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
							
							document.getElementById('all-playlist-in-display-of-track').appendChild(newPlaylistParentDiv);
						}
						
					});
				}
				
	            document.getElementById("title-of-playlist-display-all-track").innerHTML = "Danh sách phát của bạn";
	    	})
	    	.catch(error => console.error('Error fetching artists:', error));
	    	

	});

});