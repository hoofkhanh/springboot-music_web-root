document.addEventListener('DOMContentLoaded', function(){
	
	document.getElementById('href-delete-all-currentTrack').addEventListener('click', function deleteAllListeningHistory(){
		fetch('/artist/listeningHistory/deleteAll')
			.then(response => response.json())
			.then(listeningHistory => {
				if(document.getElementById('href-display-all-currentTrack').textContent == 'Hiện tất cả'){
					getAllListeningHistory(listeningHistory, 4);
				}else{
					getAllListeningHistory(listeningHistory, 1000000000);
				}
			});
	});
	
	document.getElementById('href-delete-all-searchTrack').addEventListener('click', function deleteAllSearchHistory(){
		fetch('/artist/searchHistory/deleteAll')
			.then(response => response.json())
			.then(searchHistory => {
				if(document.getElementById('href-display-all-searchTrack').textContent == 'Hiện tất cả'){
					getAllSearchHistory(searchHistory, 4);
				}else{
					getAllSearchHistory(searchHistory, 1000000000);
				}
			});
	});
	
  async function deleteListeningHistory(event){
		let nameTrackOrPlaylistOrArtist = event.target.parentNode.parentNode.parentNode.querySelector('.name-of-playlist-artist-track').textContent;
		
		let url = '';
		if(event.target.parentNode.parentNode.parentNode.classList.contains('track')){
			url = '/artist/listeningHistory/delete?trackTitle='+nameTrackOrPlaylistOrArtist;
		}else if(event.target.parentNode.parentNode.parentNode.classList.contains('album-or-playlist')){
			url = '/artist/listeningHistory/delete?playlistTitle='+nameTrackOrPlaylistOrArtist;
		}else {
			url = '/artist/listeningHistory/delete?artistName='+nameTrackOrPlaylistOrArtist;
		}
		
		await fetch(url)
			.then(response => response.json())
			.then(listeningHistory => {
				if(document.getElementById('href-display-all-currentTrack').textContent == 'Hiện tất cả'){
					getAllListeningHistory(listeningHistory, 4);
				}else{
					getAllListeningHistory(listeningHistory, 1000000000);
				}
			});
	}

	function getAllListeningHistory(listeningHistory, quantity) {
		if( document.getElementById('recently-playlist').children.length != 3){
			let allTrack = document.getElementById('recently-playlist');
			 for (let i = document.getElementById('recently-playlist').children.length - 1; i > 2; i--) {
		        allTrack.removeChild(allTrack.children[i]);
		    }
		}	
		
		Array.from(listeningHistory).forEach((history, index) => {
			if(history.track != null && index <=quantity ){
				
				let trackParentDiv = document.getElementById("track-in-recently-playlist");
				let childElements = trackParentDiv.children;
				
				let lengthOfAllDivChildInDisplayAllTrack = document.getElementById('recently-playlist').children.length;
				if(lengthOfAllDivChildInDisplayAllTrack != null){
					
					let newTrackParentDiv = document.createElement("div");
					newTrackParentDiv.classList.add('playlist-artist-track');
					newTrackParentDiv.classList.add('track');
					
					for(let i=0; i<= childElements.length-1 ; i++){
						if(i == 0){
							let imageOfTrack = document.createElement("div");
							imageOfTrack.classList.add('image-of-playlist-track-in-playlist-artist-track');
							imageOfTrack.innerHTML = childElements[i].innerHTML;
							imageOfTrack.querySelector("img").src = 'data:image/jpeg;base64,' + history.track.image;
							imageOfTrack.querySelector(".hidden-name-of-playlist").textContent = history.track.trackTitle;	
							newTrackParentDiv.appendChild(imageOfTrack)
						}else if(i == 1){
							let infoOfTrack = document.createElement("div");
							infoOfTrack.classList.add('info-artist-in-playlist-artist-track');
							infoOfTrack.innerHTML = childElements[i].innerHTML;
							infoOfTrack.querySelector(".name-of-playlist-artist-track").innerHTML = history.track.trackTitle;
							
							let artistOfTrack =  infoOfTrack.querySelector(".artist-of-playlist-artist-track");
							artistOfTrack.querySelector('a').innerHTML = history.track.user.artistName;
							if(history.track.userList.length !=0){
								artistOfTrack.querySelector('a').insertAdjacentHTML('afterend', ',  ');
								
								for(let i=0; i<= history.track.userList.length -1; i++){
									let aTagNameOfCooperatorArtist =  document.createElement("a");
										aTagNameOfCooperatorArtist.classList.add('artist');
										aTagNameOfCooperatorArtist.innerHTML = history.track.userList[i].artistName;
										artistOfTrack.appendChild(aTagNameOfCooperatorArtist)
									if(i != history.track.userList.length -1 ){
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
					newTrackParentDiv.addEventListener('click', () => displayPageOfTrack(history.track.trackTitle, 
						newTrackParentDiv.querySelector('.button-play')));
						
					/*Nhấn nút xóa bài trong lịch sử nghe không bị nhảy qua trang track*/
					newTrackParentDiv.querySelector('.icon-delete a').addEventListener('click', function(event){
				        event.stopPropagation();
				        deleteListeningHistory(event);
					});
						
					/*chỉnh cho nút play nếu đang play một bài hát*/
					if(history.track.trackTitle == document.getElementById('valueOfTrack').value){
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
				 	
					document.getElementById('recently-playlist').appendChild(newTrackParentDiv);
					
				}
			}else if(history.playlist != null  && index <=quantity){
				let playlistParentDiv = document.getElementById("playlist-in-recently-playlist");
				let childElements = playlistParentDiv.children;	
				
				let lengthOfAllDivChildInDisplayAllTrack = document.getElementById('recently-playlist').children.length;
				if(lengthOfAllDivChildInDisplayAllTrack != null){
					
					let newPlaylistParentDiv = document.createElement("div");
					newPlaylistParentDiv.classList.add('playlist-artist-track');
					newPlaylistParentDiv.classList.add('album-or-playlist');
					
					for(let i=0; i<= childElements.length-1 ; i++){
							if(i == 0){
								let imageOfPlaylist = document.createElement("div");
								imageOfPlaylist.classList.add('image-of-playlist-track-in-playlist-artist-track');
								imageOfPlaylist.innerHTML = childElements[i].innerHTML;
								imageOfPlaylist.querySelector("img").src = 'data:image/jpeg;base64,' + history.playlist.image;
								imageOfPlaylist.querySelector(".hidden-name-of-playlist").textContent = history.playlist.playlistTitle;	
								newPlaylistParentDiv.appendChild(imageOfPlaylist)
							}else if(i == 1){
								let infoOfPlaylist = document.createElement("div");
								infoOfPlaylist.classList.add('info-artist-in-playlist-artist-track');
								infoOfPlaylist.innerHTML = childElements[i].innerHTML;
								infoOfPlaylist.querySelector(".name-of-playlist-artist-track").innerHTML = history.playlist.playlistTitle;
								
								let artistOfPlaylist =  infoOfPlaylist.querySelector(".artist-of-playlist-artist-track");
								
								artistOfPlaylist.querySelector('a').innerHTML = history.playlist.user.artistName;
								
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
						newPlaylistParentDiv.addEventListener('click', () => displayPageOfPlaylists(history.playlist.playlistTitle, 
							newPlaylistParentDiv.querySelector('.button-play')));
							
						/*Nhấn nút xóa bài trong lịch sử nghe không bị nhảy qua trang track*/
						newPlaylistParentDiv.querySelector('.icon-delete a').addEventListener('click', function(event){
					        event.stopPropagation();
					        deleteListeningHistory(event);
						});
							
						/*chỉnh cho nút play nếu đang play một bài hát*/
						if(history.playlist.playlistTitle == document.getElementById('valueOfTrack').value){
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
						
						document.getElementById('recently-playlist').appendChild(newPlaylistParentDiv);
						
				}
			}else if(history.user && index <=quantity){
			
				let trackParentDiv = document.getElementById("artist-in-recently-playlist");
				let childElements = trackParentDiv.children;
				let lengthOfAllDivChildInDisplayAllTrack = document.getElementById('recently-playlist').children.length;
				if(lengthOfAllDivChildInDisplayAllTrack != null){
				
					let newTrackParentDiv = document.createElement("div");
					newTrackParentDiv.classList.add('playlist-artist-track');
					newTrackParentDiv.classList.add('artist');

					for(let i=0; i<= childElements.length-1 ; i++){
						if(i == 0){
							let imageOfTrack = document.createElement("div");
							imageOfTrack.classList.add('image-of-artist-in-playlist-artist-track');
							imageOfTrack.innerHTML = childElements[i].innerHTML;
							imageOfTrack.querySelector("img").src = 'data:image/jpeg;base64,' + history.user.image;
							imageOfTrack.querySelector(".hidden-name-of-playlist").textContent = history.user.artistName;	
							newTrackParentDiv.appendChild(imageOfTrack)
						}else if(i == 1){
							let infoOfTrack = document.createElement("div");
							infoOfTrack.classList.add('info-artist-in-playlist-artist-track');
							infoOfTrack.innerHTML = childElements[i].innerHTML;
							infoOfTrack.querySelector(".name-of-playlist-artist-track").innerHTML = history.user.artistName;
							
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
					newTrackParentDiv.addEventListener('click', () => displayPageOfArtist(history.user.artistName, 
						newTrackParentDiv.querySelector('.button-play')));
						
					/*Nhấn nút xóa bài trong lịch sử nghe không bị nhảy qua trang track*/
					newTrackParentDiv.querySelector('.icon-delete a').addEventListener('click', function(event){
				        event.stopPropagation();
				        deleteListeningHistory(event);
					});
						
					/*chỉnh cho nút play nếu đang play một bài hát*/
					if(history.user.artistName == document.getElementById('valueOfTrack').value){
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
				 	
					document.getElementById('recently-playlist').appendChild(newTrackParentDiv);
				}
			}
		});
	}
	
	async function deleteSearchHistory(event){
		let nameTrackOrPlaylistOrArtist = event.target.parentNode.parentNode.parentNode.querySelector('.name-of-playlist-artist-track').textContent;
		
		let url = '';
		if(event.target.parentNode.parentNode.parentNode.classList.contains('track')){
			url = '/artist/searchHistory/delete?trackTitle='+nameTrackOrPlaylistOrArtist;
		}else if(event.target.parentNode.parentNode.parentNode.classList.contains('album-or-playlist')){
			url = '/artist/searchHistory/delete?playlistTitle='+nameTrackOrPlaylistOrArtist;
		}else {
			url = '/artist/searchHistory/delete?artistName='+nameTrackOrPlaylistOrArtist;
		}
		
		await fetch(url)
			.then(response => response.json())
			.then(searchHistory => {
				if(document.getElementById('href-display-all-searchTrack').textContent == 'Hiện tất cả'){
					getAllSearchHistory(searchHistory, 4);
				}else{
					getAllSearchHistory(searchHistory, 1000000000);
				}
			});
	}
	
	function getAllSearchHistory(searchHistory, quantity) {
		if( document.getElementById('search-playlist').children.length != 3){
			let allTrack = document.getElementById('search-playlist');
			 for (let i = document.getElementById('search-playlist').children.length - 1; i > 2; i--) {
		        allTrack.removeChild(allTrack.children[i]);
		    }
		}	
		
		Array.from(searchHistory).forEach((history, index) => {
			if(history.track != null && index <=quantity ){
				
				let trackParentDiv = document.getElementById("track-in-search-playlist");
				let childElements = trackParentDiv.children;
				
				let lengthOfAllDivChildInDisplayAllTrack = document.getElementById('search-playlist').children.length;
				if(lengthOfAllDivChildInDisplayAllTrack != null){
					
					let newTrackParentDiv = document.createElement("div");
					newTrackParentDiv.classList.add('playlist-artist-track');
					newTrackParentDiv.classList.add('track');
					
					for(let i=0; i<= childElements.length-1 ; i++){
						if(i == 0){
							let imageOfTrack = document.createElement("div");
							imageOfTrack.classList.add('image-of-playlist-track-in-playlist-artist-track');
							imageOfTrack.innerHTML = childElements[i].innerHTML;
							imageOfTrack.querySelector("img").src = 'data:image/jpeg;base64,' + history.track.image;
							imageOfTrack.querySelector(".hidden-name-of-playlist").textContent = history.track.trackTitle;	
							newTrackParentDiv.appendChild(imageOfTrack)
						}else if(i == 1){
							let infoOfTrack = document.createElement("div");
							infoOfTrack.classList.add('info-artist-in-playlist-artist-track');
							infoOfTrack.innerHTML = childElements[i].innerHTML;
							infoOfTrack.querySelector(".name-of-playlist-artist-track").innerHTML = history.track.trackTitle;
							
							let artistOfTrack =  infoOfTrack.querySelector(".artist-of-playlist-artist-track");
							artistOfTrack.querySelector('a').innerHTML = history.track.user.artistName;
							if(history.track.userList.length !=0){
								artistOfTrack.querySelector('a').insertAdjacentHTML('afterend', ',  ');
								
								for(let i=0; i<= history.track.userList.length -1; i++){
									let aTagNameOfCooperatorArtist =  document.createElement("a");
										aTagNameOfCooperatorArtist.classList.add('artist');
										aTagNameOfCooperatorArtist.innerHTML = history.track.userList[i].artistName;
										artistOfTrack.appendChild(aTagNameOfCooperatorArtist)
									if(i != history.track.userList.length -1 ){
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
					newTrackParentDiv.addEventListener('click', () => displayPageOfTrack(history.track.trackTitle, 
						newTrackParentDiv.querySelector('.button-play')));
						
					/*Nhấn nút xóa bài trong lịch sử nghe không bị nhảy qua trang track*/
					newTrackParentDiv.querySelector('.icon-delete-in-search a').addEventListener('click', function(event){
				        event.stopPropagation();
				        deleteSearchHistory(event);
					});
						
					/*chỉnh cho nút play nếu đang play một bài hát*/
					if(history.track.trackTitle == document.getElementById('valueOfTrack').value){
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
				 	
					document.getElementById('search-playlist').appendChild(newTrackParentDiv);
					
				}
			}else if(history.playlist != null  && index <=quantity){
				let playlistParentDiv = document.getElementById("playlist-in-search-playlist");
				let childElements = playlistParentDiv.children;	
				
				let lengthOfAllDivChildInDisplayAllTrack = document.getElementById('search-playlist').children.length;
				if(lengthOfAllDivChildInDisplayAllTrack != null){
					
					let newPlaylistParentDiv = document.createElement("div");
					newPlaylistParentDiv.classList.add('playlist-artist-track');
					newPlaylistParentDiv.classList.add('album-or-playlist');
					
					for(let i=0; i<= childElements.length-1 ; i++){
							if(i == 0){
								let imageOfPlaylist = document.createElement("div");
								imageOfPlaylist.classList.add('image-of-playlist-track-in-playlist-artist-track');
								imageOfPlaylist.innerHTML = childElements[i].innerHTML;
								imageOfPlaylist.querySelector("img").src = 'data:image/jpeg;base64,' + history.playlist.image;
								imageOfPlaylist.querySelector(".hidden-name-of-playlist").textContent = history.playlist.playlistTitle;	
								newPlaylistParentDiv.appendChild(imageOfPlaylist)
							}else if(i == 1){
								let infoOfPlaylist = document.createElement("div");
								infoOfPlaylist.classList.add('info-artist-in-playlist-artist-track');
								infoOfPlaylist.innerHTML = childElements[i].innerHTML;
								infoOfPlaylist.querySelector(".name-of-playlist-artist-track").innerHTML = history.playlist.playlistTitle;
								
								let artistOfPlaylist =  infoOfPlaylist.querySelector(".artist-of-playlist-artist-track");
								
								artistOfPlaylist.querySelector('a').innerHTML = history.playlist.user.artistName;
								
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
						newPlaylistParentDiv.addEventListener('click', () => displayPageOfPlaylists(history.playlist.playlistTitle, 
							newPlaylistParentDiv.querySelector('.button-play')));
							
						/*Nhấn nút xóa bài trong lịch sử nghe không bị nhảy qua trang track*/
						newPlaylistParentDiv.querySelector('.icon-delete-in-search a').addEventListener('click', function(event){
					        event.stopPropagation();
					        deleteSearchHistory(event);
						});
							
						/*chỉnh cho nút play nếu đang play một bài hát*/
						if(history.playlist.playlistTitle == document.getElementById('valueOfTrack').value){
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
						
						document.getElementById('search-playlist').appendChild(newPlaylistParentDiv);
						
				}
			}else if(history.user && index <=quantity){
			
				let trackParentDiv = document.getElementById("artist-in-search-playlist");
				let childElements = trackParentDiv.children;
				let lengthOfAllDivChildInDisplayAllTrack = document.getElementById('search-playlist').children.length;
				if(lengthOfAllDivChildInDisplayAllTrack != null){
				
					let newTrackParentDiv = document.createElement("div");
					newTrackParentDiv.classList.add('playlist-artist-track');
					newTrackParentDiv.classList.add('artist');
					
					for(let i=0; i<= childElements.length-1 ; i++){
						if(i == 0){
							let imageOfTrack = document.createElement("div");
							imageOfTrack.classList.add('image-of-artist-in-playlist-artist-track');
							imageOfTrack.innerHTML = childElements[i].innerHTML;
							imageOfTrack.querySelector("img").src = 'data:image/jpeg;base64,' + history.user.image;
							imageOfTrack.querySelector(".hidden-name-of-playlist").textContent = history.user.artistName;	
							newTrackParentDiv.appendChild(imageOfTrack)
						}else if(i == 1){
							let infoOfTrack = document.createElement("div");
							infoOfTrack.classList.add('info-artist-in-playlist-artist-track');
							infoOfTrack.innerHTML = childElements[i].innerHTML;
							infoOfTrack.querySelector(".name-of-playlist-artist-track").innerHTML = history.user.artistName;
							
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
					newTrackParentDiv.addEventListener('click', () => displayPageOfArtist(history.user.artistName, 
						newTrackParentDiv.querySelector('.button-play')));
						
					/*Nhấn nút xóa bài trong lịch sử nghe không bị nhảy qua trang track*/
					newTrackParentDiv.querySelector('.icon-delete-in-search a').addEventListener('click', function(event){
				        event.stopPropagation();
				        deleteSearchHistory(event);
					});
						
					/*chỉnh cho nút play nếu đang play một bài hát*/
					if(history.user.artistName == document.getElementById('valueOfTrack').value){
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
				 	
					document.getElementById('search-playlist').appendChild(newTrackParentDiv);
				}
			}
		});
	}
	
  // bấm vào nút trang chủ 
  document.getElementById('href-display-all-currentTrack').addEventListener('click', function(){
	  if(this.textContent == 'Hiện tất cả'){
		  this.textContent = 'Rút gọn';
		  fetch('/artist/listeningHistory/findByUser')
			.then(response => response.json())
			.then(listeningHistory => {
				getAllListeningHistory(listeningHistory, 1000000000);
			});
	  }else{
		  this.textContent = 'Hiện tất cả';
		  fetch('/artist/listeningHistory/findByUser')
			.then(response => response.json())
			.then(listeningHistory => {
				getAllListeningHistory(listeningHistory, 4);
			});
	  }
  });
  
  fetch('/artist/listeningHistory/findByUser')
		.then(response => response.json())
		.then(listeningHistory => {
			if(document.getElementById('href-display-all-currentTrack').textContent == 'Hiện tất cả'){
				getAllListeningHistory(listeningHistory, 4);
			}else{
				getAllListeningHistory(listeningHistory, 1000000000);
			}
		});
		
  document.getElementById('href-display-all-searchTrack').addEventListener('click', function(){
	  if(this.textContent == 'Hiện tất cả'){
		  this.textContent = 'Rút gọn';
		  fetch('/artist/searchHistory/findByUser')
			.then(response => response.json())
			.then(searchHistory => {
				getAllSearchHistory(searchHistory, 1000000000);
			});
	  }else{
		  this.textContent = 'Hiện tất cả';
		  fetch('/artist/searchHistory/findByUser')
			.then(response => response.json())
			.then(searchHistory => {
				getAllSearchHistory(searchHistory, 4);
			});
	  }
  });
		
	fetch('/artist/searchHistory/findByUser')
		.then(response => response.json())
		.then(searchHistory => {
			if(document.getElementById('href-display-all-searchTrack').textContent == 'Hiện tất cả'){
				getAllSearchHistory(searchHistory, 4);
			}else{
				getAllSearchHistory(searchHistory, 1000000000);
			}
		});
  
  let index = document.getElementById('redirect-to-index');
  index.addEventListener('click', function(){
    document.getElementById('index').style.display = 'block';
    document.getElementById('display-all-track').style.display = 'none';
    document.getElementById('page-of-play-list').style.display = 'none';
    document.getElementById('page-of-artist').style.display = 'none';
    document.getElementById('page-of-track').style.display = 'none';
    document.getElementById('upload-track-by-artist').style.display = 'none';
    document.getElementById('upload-playlist-by-artist').style.display = 'none';
    document.getElementById('page-of-search').style.display = 'none';
    
	fetch('/artist/listeningHistory/findByUser')
		.then(response => response.json())
		.then(listeningHistory => {
			if(document.getElementById('href-display-all-currentTrack').textContent == 'Hiện tất cả'){
				getAllListeningHistory(listeningHistory, 4);
			}else{
				getAllListeningHistory(listeningHistory, 1000000000);
			}
		});
		
	fetch('/artist/searchHistory/findByUser')
		.then(response => response.json())
		.then(searchHistory => {
			if(document.getElementById('href-display-all-searchTrack').textContent == 'Hiện tất cả'){
				getAllSearchHistory(searchHistory, 4);
			}else{
				getAllSearchHistory(searchHistory, 1000000000);
			}
		});
		
	fetch('/artist/masterPlaylist/findAllMasterPlaylist')
		.then(response => response.json())
		.then(masterPlaylistList => {
			getAllMasterPlaylist(masterPlaylistList, 4)
		});
		
  });

  

  /*// bấm vào artist
  let pageOfArtist = document.getElementsByClassName('artist');
  Array.from(pageOfArtist).forEach(element => {
	  console.log('1')
    element.addEventListener('click', function(){
      document.getElementById('page-of-artist').style.display = 'block';
      document.getElementById('page-of-play-list').style.display = 'none';
      document.getElementById('page-of-track').style.display = 'none';
      document.getElementById('index').style.display = 'none';
      document.getElementById('display-all-track').style.display = 'none';
      document.getElementById('upload-track-by-artist').style.display = 'none';
      document.getElementById('upload-playlist-by-artist').style.display = 'none';
      document.getElementById('page-of-search').style.display = 'none';
    });
  });*/

  
  
});