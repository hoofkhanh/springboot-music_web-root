document.addEventListener('DOMContentLoaded', function(){
	
  var buttonPlayInPage = null;
  
  /*bấm nút share nhạc*/
  document.getElementById('button-share-in-track').addEventListener('click', function(){
	 let trackTitle = this.parentNode.parentNode.parentNode.querySelector('#info-background-track h1').textContent.trim();
	 localStorage.setItem('trackTileWhenShare', trackTitle);
	 
	 document.getElementById('confirm-share-track').style.display= 'block';		 
  });
  
 	 /*Hủy share*/
	  document.getElementById('confirm-no-track').addEventListener('click', function(){
		  document.getElementById('confirm-share-track').style.display= 'none';
		  document.getElementById('message-share-track').value = '';
	  });
	  
	  /*Chấp nhận share*/
	  document.getElementById('confirm-yes-track').addEventListener('click', function(){
		  document.getElementById('confirm-share-track').style.display= 'none';
		  
		  let notifySuccessShare = document.getElementById('notify-success-share');
		  let style = window.getComputedStyle(notifySuccessShare);
		  if(style.bottom == '-1000px'){
			  notifySuccessShare.style.bottom = '30px';
			  setTimeout(function(){
				  notifySuccessShare.style.bottom = '-1000px';
			  }, 2000);
		  }
		  		  
	 	   let shareMessage = document.getElementById('message-share-track').value ;
	 	   document.getElementById('message-share-track').value = '' ;
		   fetch('/artist/share/add?trackTitle='+localStorage.getItem('trackTileWhenShare')+"&shareMessage="+shareMessage) ;
		 	
	   });
  
  /*bấm nút trái tim để add track vào thư viện trong page of track*/
  document.getElementById('button-save-to-libary-page-of-track').addEventListener('click', function(){
	  let trackTitle = this.parentNode.parentNode.parentNode.querySelector('#info-background-track h1').textContent.trim();
	  	  
	  let colorOfHeart = this.querySelector('i').style.color;
	  
	  /*Đã thêm vào thư viện*/
	  if(colorOfHeart.trim() == 'rgba(241, 18, 18, 0.996)'){
		  this.querySelector('i').style.color = 'rgba(255, 255, 255, 0.7)';
		  
		  fetch('/artist/trackLibary/delete?trackTitle='+trackTitle)
		  	.then(response => response.json())
		  	.then(trackLibaryList => {
				  getAllTrackLibary();
			 });
	  }else{
		  /*Chưa thêm vào thư viện*/
		  this.querySelector('i').style.color = 'rgba(241, 18, 18, 0.996)';
		  
		   fetch('/artist/trackLibary/add?trackTitle='+trackTitle)
		  	.then(response => response.json())
		  	.then(trackLibaryList => {
				  getAllTrackLibary();
			 });
	  }
	  
	 
  });
  
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
							artistOfTrack.querySelector('a').addEventListener('click', function(event){
								event.stopPropagation();
								clickToNameArtistInDataOtherTrackAndAlbumAndGoToSearch(history.track.user.artistName);
							 });
							if(history.track.userList.length !=0){
								artistOfTrack.querySelector('a').insertAdjacentHTML('afterend', ',  ');
								
								for(let i=0; i<= history.track.userList.length -1; i++){
									let aTagNameOfCooperatorArtist =  document.createElement("a");
										aTagNameOfCooperatorArtist.classList.add('artist');
										aTagNameOfCooperatorArtist.innerHTML = history.track.userList[i].artistName;
										aTagNameOfCooperatorArtist.addEventListener('click', function(event){
											event.stopPropagation();
											clickToNameArtistInDataOtherTrackAndAlbumAndGoToSearch(history.track.userList[i].artistName);
										});
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
								artistOfPlaylist.querySelector('a').addEventListener('click', function(event){
									event.stopPropagation();
									clickToNameArtistInDataOtherTrackAndAlbumAndGoToSearch(history.playlist.user.artistName);
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
							imageOfTrack.classList.add('image-of-playlist-track-in-playlist-artist-track');
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
	
	  
  /*bấm vào nút play trong page of track*/
  function clickButtonPlayInPageOfTrack(buttonPlay){
	  buttonPlay.click();
  }
  
  document.getElementById('button-play-in-track').addEventListener('click',function(){
	  clickButtonPlayInPageOfTrack(buttonPlayInPage);
	  
	  let buttonInPageOfTrack = document.getElementById('button-play-in-track').querySelector('i');
	  /*trong if else này bị ngược lại với bth vì khi chạy tới chỗ này thì bên click buttonPlay chưa đổi icon của trên header*/
	  if(document.getElementById('icon-play-track').classList.contains('fa-pause')){
		  
		  /*trường hợp ở trang cũ và bấm cho nó ngưng nhạc*/
		  if(buttonInPageOfTrack.classList.contains('fa-pause')){
				  buttonInPageOfTrack.classList.remove('fa-pause');
				  buttonInPageOfTrack.classList.add('fa-play');
		  }else{
		  /*trường hợp ở trang cũ và bấm cho nó chạy nhạc*/
			  buttonInPageOfTrack.classList.remove('fa-play');
			  buttonInPageOfTrack.classList.add('fa-pause');
		  }
	  }else{
		  if(buttonInPageOfTrack.classList.contains('fa-play')){
			  buttonInPageOfTrack.classList.remove('fa-play');
			  buttonInPageOfTrack.classList.add('fa-pause');
		  }
	  }
  });
  
  async function clickToDisplayAritsitInTrackAndGoToSearch(div){
	  let name = div.querySelector('.name-of-track-in-page-playlist').textContent;
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
  
  async function displayAllArtistInTrack(artist){
	  await fetch('/artist/artists/findByArtistName?artistName='+artist.artistName)
	  	.then(response => response.json())
	  	.then(artist => {
			let allArist = document.getElementById('all-artist-in-page-of-track');
			
			let divArtist = document.createElement('div');
			divArtist.classList.add('track-in-playlist');
			divArtist.classList.add('pointer');
			divArtist.classList.add('artist');
			
			let childrenOfArtistInPageOfTrack = document.getElementById('artist-in-page-of-track').children;
			for(let i=0; i< childrenOfArtistInPageOfTrack.length ; i++){
				let inforOfArtist = document.createElement('div');
				inforOfArtist.classList.add('info-of-track-artist-in-page-playlist');
				inforOfArtist.innerHTML = childrenOfArtistInPageOfTrack[i].innerHTML;
				inforOfArtist.querySelector('img').src =  'data:image/jpeg;base64,' + artist.image;
				inforOfArtist.querySelector('.name-of-track-in-page-playlist').textContent = artist.artistName;
				divArtist.appendChild(inforOfArtist);
			}
			
			divArtist.addEventListener('click', function(){
				clickToDisplayAritsitInTrackAndGoToSearch(divArtist);
			});
			
			allArist.appendChild(divArtist);
			
		 });
  }
  
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
  
  function getDataOtherTrackAndAlbum(artistName, trackTitle) {
	  fetch('/artist/tracks/findAllTrackByArtistName?artistName='+artistName)
        .then(response => response.json())
        .then(tracks => {
			let trackParentDiv = document.getElementById("popular-track-of-artist-in-page-of-track");
			let childElements = trackParentDiv.children;
			
			let lengthOfAllDivChildInDisplayAllTrack = document.getElementById('all-popular-track-of-artist-in-page-of-track').children.length;
			if(lengthOfAllDivChildInDisplayAllTrack != null){
				
				if(lengthOfAllDivChildInDisplayAllTrack != 1){
					let allTrack = document.getElementById('all-popular-track-of-artist-in-page-of-track');
					 for (let i = lengthOfAllDivChildInDisplayAllTrack - 1; i > 0; i--) {
				        allTrack.removeChild(allTrack.children[i]);
				    }
				}	
				
				Array.from(tracks).forEach((track) => {
					if(track.private == false && document.getElementById('all-popular-track-of-artist-in-page-of-track').children.length <=5 
						&& track.trackTitle != trackTitle){
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
							
						/*event để khi click một track trong playlist thì nó sẽ đổi thành dấu play chỗ playlist*/
						newTrackParentDiv.querySelector('.button-play')
							.addEventListener('click', function(){
								if(newTrackParentDiv.querySelector('.name-of-playlist-artist-track') 
									!= document.getElementById('valueOfTrack').value){
										
									if(document.getElementById('button-play-in-track').querySelector('i').classList.contains('fa-pause')){
										document.getElementById('button-play-in-track').querySelector('i').classList.remove('fa-pause');
										document.getElementById('button-play-in-track').querySelector('i').classList.add('fa-play');
									}
								}
						});
						
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
						
						clickSeeAllTrackInPageOfTrack(artistName, 
							document.getElementById('big-all-popular-track-of-artist-in-page-of-track').querySelector('.title-and-see-all h4 a'));
					 	
					 	document.getElementById('big-all-popular-track-of-artist-in-page-of-track').querySelector('.name-of-artist').textContent
					 		 = artistName;
						document.getElementById('all-popular-track-of-artist-in-page-of-track').appendChild(newTrackParentDiv);
					}
				});
			}
			
            
    	})
    	.catch(error => console.error('Error fetching artists:', error));
  }
  
   function getDataOtherTrackAndAlbumForCooperator(artistName, trackTitle) {
	  fetch('/artist/tracks/findAllTrackByArtistName?artistName='+artistName)
        .then(response => response.json())
        .then(tracks => {
			let trackParentDiv = document.getElementById("popular-track-of-artist-in-page-of-track");
			let childElements = trackParentDiv.children;
			
			let lengthOfAllDivChildInDisplayAllTrack = document.getElementById('all-popular-track-of-artist-in-page-of-track').children.length;
			if(lengthOfAllDivChildInDisplayAllTrack != null){
				
				let newBigAllPopularTrack = document.getElementById('big-all-popular-track-of-artist-in-page-of-track').cloneNode(true);
				newBigAllPopularTrack.removeAttribute('id');
				
				if(newBigAllPopularTrack.querySelector('#all-popular-track-of-artist-in-page-of-track').children.length != 1){
					 for (let i = newBigAllPopularTrack.querySelector('#all-popular-track-of-artist-in-page-of-track').children.length - 1; 
					 	i > 0; i--) {
				        newBigAllPopularTrack.querySelector('#all-popular-track-of-artist-in-page-of-track')
				        	.removeChild(newBigAllPopularTrack.querySelector('#all-popular-track-of-artist-in-page-of-track').children[i]);
				    }
				}
				
				
				Array.from(tracks).forEach((track) => {
					if(track.private == false 
						&& newBigAllPopularTrack.querySelector('#all-popular-track-of-artist-in-page-of-track').children.length <=5
						&& track.trackTitle != trackTitle){
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
							
						/*event để khi click một track trong playlist thì nó sẽ đổi thành dấu play chỗ playlist*/
						newTrackParentDiv.querySelector('.button-play')
							.addEventListener('click', function(){
								if(newTrackParentDiv.querySelector('.name-of-playlist-artist-track') 
									!= document.getElementById('valueOfTrack').value){
										
									if(document.getElementById('button-play-in-track').querySelector('i').classList.contains('fa-pause')){
										document.getElementById('button-play-in-track').querySelector('i').classList.remove('fa-pause');
										document.getElementById('button-play-in-track').querySelector('i').classList.add('fa-play');
									}
								}
						});
						
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
					 	
						newBigAllPopularTrack.querySelector('#all-popular-track-of-artist-in-page-of-track').appendChild(newTrackParentDiv);
					}
				});
				
				clickSeeAllTrackInPageOfTrack(artistName, newBigAllPopularTrack.querySelector('.title-and-see-all h4 a'));
				
				newBigAllPopularTrack.querySelector('.name-of-artist').textContent
					 		 = artistName;
				document.getElementById('big-all-popular-track-of-artist-in-page-of-track').insertAdjacentElement('afterend', newBigAllPopularTrack);
			}
			
            
    	})
    	.catch(error => console.error('Error fetching artists:', error));
  }
  
  function clickSeeAllTrackInPageOfTrack(artistName, buttonSeeAll){
	 buttonSeeAll.addEventListener('click', function(){
			document.getElementById('display-all-track').style.display = 'block';
			document.getElementById('upload-track-by-artist').style.display = 'none';
			document.getElementById('upload-playlist-by-artist').style.display = 'none';
			document.getElementById('page-of-track').style.display = 'none';
			document.getElementById('page-of-artist').style.display = 'none';
			document.getElementById('page-of-play-list').style.display = 'none';
			document.getElementById('index').style.display = 'none';
			document.getElementById('page-of-search').style.display = 'none';
			document.getElementById('page-of-lyrics').style.display = 'none';
			
		  fetch('/artist/tracks/findAllTrackByArtistName?artistName='+artistName)
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
						if(track.private == false){
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
									artistOfTrack.querySelector('a').addEventListener('click', function(event) {
										document.getElementById('input-search-track-album-playlist-artist').value = '';
										event.stopPropagation();
										clickToNameArtistInDataOtherTrackAndAlbumAndGoToSearch(track.user.artistName)
									});
										
									if(track.userList.length !=0){
										artistOfTrack.querySelector('a').insertAdjacentHTML('afterend', ',  ');
										
										for(let i=0; i<= track.userList.length -1; i++){
											let aTagNameOfCooperatorArtist =  document.createElement("a");
												aTagNameOfCooperatorArtist.classList.add('artist');
												aTagNameOfCooperatorArtist.innerHTML = track.userList[i].artistName;
												aTagNameOfCooperatorArtist.addEventListener('click', function(event) {
													document.getElementById('input-search-track-album-playlist-artist').value = '';
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
						}
					});
				}
				
	            document.getElementById("title-of-track-display-all-track").innerHTML = "Nhạc của "+ artistName;
	    	})
	    	.catch(error => console.error('Error fetching artists:', error));
	
		 fetch('/artist/playlists/findAllPlaylistByArtistName?artistName='+artistName)
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
						if(playlist.private == false && playlist.album == true){
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
										document.getElementById('input-search-track-album-playlist-artist').value = '';
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
				
	            document.getElementById("title-of-album-display-all-track").innerHTML = "Album của "+ artistName;
	    	})
	    	.catch(error => console.error('Error fetching artists:', error));
	    	
    	fetch('/artist/playlists/findAllPlaylistByArtistName?artistName='+artistName)
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
					if(playlist.album == false && playlist.private == false){
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
									document.getElementById('input-search-track-album-playlist-artist').value = '';
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
			
            document.getElementById("title-of-playlist-display-all-track").innerHTML = "Danh sách phát của "+artistName;
    	})
    	.catch(error => console.error('Error fetching artists:', error));
	  });
  }
  
  function displayOtherArtist(artistName){
		fetch('/artist/artists/findTop15FollowingOfArtist?artistName='+artistName)
			.then(response => response.json())
			.then(artists => {
				let trackParentDiv = document.getElementById("the-other-artist-in-page-of-track");
				let childElements = trackParentDiv.children;
				let lengthOfAllDivChildInDisplayAllTrack = document.getElementById('all-the-other-artist-in-page-of-track').children.length;
				if(lengthOfAllDivChildInDisplayAllTrack != null){
					
					if(lengthOfAllDivChildInDisplayAllTrack != 1){
						let allTrack = document.getElementById('all-the-other-artist-in-page-of-track');
						 for (let i = lengthOfAllDivChildInDisplayAllTrack - 1; i > 0; i--) {
					        allTrack.removeChild(allTrack.children[i]);
					    }
					}	
					
					Array.from(artists).forEach(artist => {
						let newTrackParentDiv = document.createElement("div");
						newTrackParentDiv.classList.add('playlist-artist-track');
						newTrackParentDiv.classList.add('artist');
						
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
							
						/*event để khi click một track trong playlist thì nó sẽ đổi thành dấu play chỗ playlist*/
						newTrackParentDiv.querySelector('.button-play')
							.addEventListener('click', function(){
								if(newTrackParentDiv.querySelector('.name-of-playlist-artist-track') 
									!= document.getElementById('valueOfTrack').value){
										
									fetch('/artist/artists/totalTrack?artistName='+newTrackParentDiv.querySelector('.name-of-playlist-artist-track').textContent)
									.then(response => response.text())
									.then(response => {
										if(response != 0){
											if(document.getElementById('button-play-in-track').querySelector('i').classList.contains('fa-pause')){
												document.getElementById('button-play-in-track').querySelector('i').classList.remove('fa-pause');
												document.getElementById('button-play-in-track').querySelector('i').classList.add('fa-play');
											}
										}
									});
										
									
								}
						});
						
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
					 	
						document.getElementById('all-the-other-artist-in-page-of-track').appendChild(newTrackParentDiv);
					});
				}
			});
	}
	
	
  // bấm vào 1 track
   window.displayPageOfTrack =  function displayPageOfTrack(trackTitle, buttonPlay){
	  document.getElementById('page-of-track').style.display = 'block';
	  document.getElementById('page-of-artist').style.display = 'none';
	  document.getElementById('page-of-play-list').style.display = 'none';
	  document.getElementById('index').style.display = 'none';
	  document.getElementById('display-all-track').style.display = 'none';
	  document.getElementById('upload-track-by-artist').style.display = 'none';
	  document.getElementById('upload-playlist-by-artist').style.display = 'none';	 
	  document.getElementById('page-of-search').style.display = 'none';
	  document.getElementById('page-of-lyrics').style.display = 'none';
	  
	  
	  /*lưu lịch sử tìm kiếm*/
	  if(buttonPlay != null){
		  if(buttonPlay.parentNode.classList.contains('search')){
		  	let NameOfCurrentTrack = buttonPlay.parentNode.querySelector('.name-of-playlist-artist-track');	
			let valueOfInputSearch = document.getElementById('input-search-track-album-playlist-artist').value;
			if(NameOfCurrentTrack != null && valueOfInputSearch != null && valueOfInputSearch != ''){
				NameOfCurrentTrack= NameOfCurrentTrack.textContent;
			    if(buttonPlay.parentNode.classList.contains('track')){
				   url = "/artist/searchHistory/add?trackTitle="+NameOfCurrentTrack;
			    }else if(buttonPlay.parentNode.classList.contains('album-or-playlist')){
				    url = "/artist/searchHistory/add?playlistTitle="+NameOfCurrentTrack;
				    checkAlbumOrPlaylist = true;
			    }else if(buttonPlay.parentNode.classList.contains('artist')){
				    url = "/artist/searchHistory/add?artistName="+NameOfCurrentTrack;
			    }
			    
					    
			  	fetch(url)
					.then(response => response.json())
					.then(searchHistory => {
						if(document.getElementById('href-display-all-searchTrack').textContent == 'Hiện tất cả'){
							getAllSearchHistory(searchHistory, 4);
						}else{
							getAllSearchHistory(searchHistory, 1000000000);
						}
						
					});
			}
			
		  }
	  }
	   
	  fetch('/artist/tracks/findByTrackTitleOfArtist?trackTitle='+trackTitle)
	  	.then(response => response.json())
	  	.then(async track => {
			  
			if(track.private == true){
				document.getElementById('button-share-in-track').style.display = 'none';
			}else {
				document.getElementById('button-share-in-track').style.display = 'block';
			}
			  
			document.getElementById('avatar-page-of-track').src = 'data:image/jpeg;base64,' + track.image;
			document.getElementById('info-background-track').querySelector('h1').textContent = track.trackTitle;
			document.getElementById('important-info-background-track').querySelector("a").textContent = track.user.artistName;
			document.getElementById('important-info-background-track').querySelector("a").addEventListener('click', function(){
				clickToNameArtistInDataOtherTrackAndAlbumAndGoToSearch(track.user.artistName);
			});
			document.getElementById('important-info-background-track').querySelector("img").src = 'data:image/jpeg;base64,' + track.user.image;
			
			let releaseDate = track.releaseDate.split('-');
			document.getElementById('important-info-background-track').querySelector("#dateOfTrack").textContent 
				= '• Ngày ' + releaseDate[2] +' tháng ' + releaseDate[1] + ' năm ' + releaseDate[0] ;
				
			let displayTimeOfTrack = document.getElementById('important-info-background-track').querySelector("#timeOfTrack");
			let minuteOfStartDerution = Math.floor(track.trackDuration / 60);
		    let secondsOfStartDerution = Math.floor(track.trackDuration % 60);
		    if(secondsOfStartDerution >=0 && secondsOfStartDerution <10){
		       displayTimeOfTrack.textContent = '• ' + minuteOfStartDerution + ':0' + secondsOfStartDerution;
		    }else if (secondsOfStartDerution >=10 && secondsOfStartDerution <60){
		       displayTimeOfTrack.textContent = '• ' +  minuteOfStartDerution + ':' + secondsOfStartDerution;
		    }
		    
			document.getElementById('important-info-background-track').querySelector("#numberOfListenOfTrack").textContent 
				= '• ' + track.numberOfListens + ' lượt nghe';
		 	
		 	setDynamicBackground();
		 	
		 	/*set giá trị để khi bấm play trong page thì nó lấy buttonPlay của thằng trong nhạc*/
		 	buttonPlayInPage = buttonPlay;
		 	
		 	let buttonPlayInTrack = document.getElementById('button-play-in-track');
		 	if( buttonPlayInTrack.querySelector('span').textContent !=
		 		 buttonPlay.parentNode.querySelector('.name-of-playlist-artist-track').textContent){
					  
				 if(buttonPlayInTrack.querySelector('i').classList.contains('fa-pause')){
					 buttonPlayInTrack.querySelector('i').classList.remove('fa-pause');
				 	 buttonPlayInTrack.querySelector('i').classList.add('fa-play');
				 }
			 }else {
				 if(buttonPlay.querySelector('i').classList.contains('fa-pause')){
					 if(buttonPlayInTrack.querySelector('i').classList.contains('fa-play')){
						 buttonPlayInTrack.querySelector('i').classList.remove('fa-play');
					 	 buttonPlayInTrack.querySelector('i').classList.add('fa-pause');
				 	 }
				 }else{
					 if(buttonPlayInTrack.querySelector('i').classList.contains('fa-pause')){
						 buttonPlayInTrack.querySelector('i').classList.remove('fa-pause');
					 	 buttonPlayInTrack.querySelector('i').classList.add('fa-play');
				 	 }
				 }
			 }
			 
			 /*xóa tất cả display artist trong trang track khi vào một track mới*/
			 let lengthOfAllArtist = document.getElementById('all-artist-in-page-of-track').children.length;
			 let allArist = document.getElementById('all-artist-in-page-of-track');
			
			 if(lengthOfAllArtist >1){
				 for(let i= lengthOfAllArtist-1; i>0; i--){
					 allArist.removeChild(allArist.children[i]);
				 }
			 }
			 
			 /*display người đăng nhạc và các người hợp tác*/
			 await displayAllArtistInTrack(track.user);
			 Array.from(track.userList).forEach(async artist => {
				 await displayAllArtistInTrack(artist);
			 });
			 
			 /*xóa các other track của cách ng tham gia bài hát*/
			 let AllOtherTrackOfAllArtist = document.getElementsByClassName('other-track-of-multil-artist');
			 Array.from(AllOtherTrackOfAllArtist).forEach((element, index) => {
				 if(index > 0){
					 document.getElementById('page-of-track').removeChild(element)
				 }
			 });
			 
			 /*artist's popular track of current Track*/
			 getDataOtherTrackAndAlbum(track.user.artistName, trackTitle);
			 Array.from(track.userList).forEach(async artist => {
				 getDataOtherTrackAndAlbumForCooperator(artist.artistName, trackTitle);
			 });
			 
			 displayOtherArtist(track.user.artistName);
			 
			 /*Đổi màu trái tim khi đã add vào thư viên*/
			 let outLoop = false;
			 fetch('/artist/trackLibary/playlist/findAllLikedTrack')
			 	.then(response => response.text())
			 	.then(playlist => {
				    if(playlist != ''){
				    	playlist = JSON.parse(playlist);
						if(playlist != null && playlist.trackList != null && playlist.trackList.length >0){
							Array.from(playlist.trackList).forEach(trackInPlaylist => {
								if(trackInPlaylist != null && trackInPlaylist.trackTitle == track.trackTitle){
									document.getElementById('button-save-to-libary-page-of-track').querySelector('i').style.color  = 'rgba(241, 18, 18, 0.996)';
									outLoop = true;
								}
							});
						}
					}
					
					if(outLoop == false){
						document.getElementById('button-save-to-libary-page-of-track').querySelector('i').style.color  = 'rgba(255, 255, 255, 0.7)';
					}
				 });
			 
			 if(track.private == false){
				 document.getElementById('button-save-to-libary-page-of-track').style.display= 'block';
			 }else{
				 document.getElementById('button-save-to-libary-page-of-track').style.display= 'none';
			 }
		 	
		 });	
	  
  }
  
  
   /*cái này sau này bỏ*/
   let allPageOfTrack = document.getElementsByClassName('track');
	  Array.from(allPageOfTrack).forEach(element => {
	    element.addEventListener('click', displayPageOfTrack);
	});  
});