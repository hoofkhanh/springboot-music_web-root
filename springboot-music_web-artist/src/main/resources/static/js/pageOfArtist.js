document.addEventListener('DOMContentLoaded', function(){
	
	async function deleteShareable(event){
		let id = event.target.parentNode.parentNode.parentNode.querySelector('.hidden-share-id').textContent;
		
		let	url = '/artist/share/delete?id='+id;
		
		await fetch(url)
			.then(response => response.json())
			.then(shareList => {
				getAllShareList(shareList, 4);
			});
	}
	
	function getAllShareList(shareList, quantity) {
		if( document.getElementById('all-share-track-in-page-of-artist').children.length != 2){
			let allTrack = document.getElementById('all-share-track-in-page-of-artist');
			 for (let i = document.getElementById('all-share-track-in-page-of-artist').children.length - 1; i > 1; i--) {
		        allTrack.removeChild(allTrack.children[i]);
		    }
		}	
		
		Array.from(shareList).forEach((share, index) => {
			if(share.track != null && index <=quantity ){
				
				let trackParentDiv = document.getElementById("share-track-in-page-of-artist");
				let childElements = trackParentDiv.children;
				
				let lengthOfAllDivChildInDisplayAllTrack = document.getElementById('all-share-track-in-page-of-artist').children.length;
				if(lengthOfAllDivChildInDisplayAllTrack != null){
					
					let newTrackParentDiv = document.createElement("div");
					newTrackParentDiv.classList.add('playlist-artist-track');
					newTrackParentDiv.classList.add('track');
					
					for(let i=0; i<= childElements.length-1 ; i++){
						if(i == 0){
							let imageOfTrack = document.createElement("div");
							imageOfTrack.classList.add('image-of-playlist-track-in-playlist-artist-track');
							imageOfTrack.innerHTML = childElements[i].innerHTML;
							imageOfTrack.querySelector("img").src = 'data:image/jpeg;base64,' + share.track.image;
							imageOfTrack.querySelector(".hidden-name-of-playlist").textContent = share.track.trackTitle;	
							if(document.getElementById('a-my-profile').getAttribute('value') == share.sharers.artistName){
								imageOfTrack.querySelector('.icon-delete').style.display = 'block';
							}else{
								imageOfTrack.querySelector('.icon-delete').style.display = 'none';
							}
							newTrackParentDiv.appendChild(imageOfTrack)
						}else if(i == 1){
							let infoOfTrack = document.createElement("div");
							infoOfTrack.classList.add('info-artist-in-playlist-artist-track');
							infoOfTrack.innerHTML = childElements[i].innerHTML;
							infoOfTrack.querySelector(".name-of-playlist-artist-track").innerHTML = share.track.trackTitle;
							
							let artistOfTrack =  infoOfTrack.querySelector(".artist-of-playlist-artist-track");
							artistOfTrack.querySelector('a').innerHTML = share.track.user.artistName;
							if(share.track.userList.length !=0){
								artistOfTrack.querySelector('a').insertAdjacentHTML('afterend', ',  ');
								
								for(let i=0; i<= share.track.userList.length -1; i++){
									let aTagNameOfCooperatorArtist =  document.createElement("a");
										aTagNameOfCooperatorArtist.classList.add('artist');
										aTagNameOfCooperatorArtist.innerHTML = share.track.userList[i].artistName;
										artistOfTrack.appendChild(aTagNameOfCooperatorArtist)
									if(i != share.track.userList.length -1 ){
										aTagNameOfCooperatorArtist.insertAdjacentHTML('afterend', ',  ');
									}
								}
							}
							
							newTrackParentDiv.appendChild(infoOfTrack)
						}else if(i== 2){
							let buttonPlay = document.createElement("a");
							buttonPlay.classList.add('button-play');
							buttonPlay.innerHTML = childElements[i].innerHTML;
							newTrackParentDiv.appendChild(buttonPlay);
						}else if(i ==3){
							let shareMessage = document.createElement("p");
							shareMessage.classList.add('message-text');
							if(share.shareMessage != null && share.shareMessage != ''){
								shareMessage.textContent = share.sharers.artistName + ": " + share.shareMessage;
							}else{
								shareMessage.textContent = '';
							}
							newTrackParentDiv.appendChild(shareMessage);
						}else{
							let hiddenShareId = document.createElement("span");
							hiddenShareId.classList.add('hidden-share-id');
							hiddenShareId.style.display = 'none';
							hiddenShareId.textContent = share.id;
							newTrackParentDiv.appendChild(hiddenShareId);
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
									
								if(document.getElementById('button-play-in-artist').querySelector('i').classList.contains('fa-pause')){
									document.getElementById('button-play-in-artist').querySelector('i').classList.remove('fa-pause');
									document.getElementById('button-play-in-artist').querySelector('i').classList.add('fa-play');
								}
							}
					});
					
					/*click vào button play thì không bị nhảy trang track*/
					newTrackParentDiv.querySelector('.button-play').addEventListener('click', function(event){
				        event.stopPropagation();
					});
								
					// event click để qua trang track
					newTrackParentDiv.addEventListener('click', () => displayPageOfTrack(share.track.trackTitle, 
						newTrackParentDiv.querySelector('.button-play')));
						
					/*Nhấn nút xóa bài trong share không bị nhảy qua trang track*/
					newTrackParentDiv.querySelector('.icon-delete a').addEventListener('click', function(event){
				        event.stopPropagation();
				        deleteShareable(event);
					});
						
					/*chỉnh cho nút play nếu đang play một bài hát*/
					if(share.track.trackTitle == document.getElementById('valueOfTrack').value){
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
				 	
					document.getElementById('all-share-track-in-page-of-artist').appendChild(newTrackParentDiv);
					
				}
			}else if(share.playlist != null  && index <=quantity){
				let playlistParentDiv = document.getElementById("share-playlist-in-page-of-artist");
				let childElements = playlistParentDiv.children;	
				
				let lengthOfAllDivChildInDisplayAllTrack = document.getElementById('all-share-track-in-page-of-artist').children.length;
				if(lengthOfAllDivChildInDisplayAllTrack != null){
					
					let newPlaylistParentDiv = document.createElement("div");
					newPlaylistParentDiv.classList.add('playlist-artist-track');
					newPlaylistParentDiv.classList.add('album-or-playlist');
					
					for(let i=0; i<= childElements.length-1 ; i++){
							if(i == 0){
								let imageOfPlaylist = document.createElement("div");
								imageOfPlaylist.classList.add('image-of-playlist-track-in-playlist-artist-track');
								imageOfPlaylist.innerHTML = childElements[i].innerHTML;
								imageOfPlaylist.querySelector("img").src = 'data:image/jpeg;base64,' + share.playlist.image;
								imageOfPlaylist.querySelector(".hidden-name-of-playlist").textContent = share.playlist.playlistTitle;	
								newPlaylistParentDiv.appendChild(imageOfPlaylist)
							}else if(i == 1){
								let infoOfPlaylist = document.createElement("div");
								infoOfPlaylist.classList.add('info-artist-in-playlist-artist-track');
								infoOfPlaylist.innerHTML = childElements[i].innerHTML;
								infoOfPlaylist.querySelector(".name-of-playlist-artist-track").innerHTML = share.playlist.playlistTitle;
								
								let artistOfPlaylist =  infoOfPlaylist.querySelector(".artist-of-playlist-artist-track");
								
								artistOfPlaylist.querySelector('a').innerHTML = share.playlist.user.artistName;
								
								newPlaylistParentDiv.appendChild(infoOfPlaylist)
							}else if(i== 2){
								let buttonPlay = document.createElement("a");
								buttonPlay.classList.add('button-play');
								buttonPlay.innerHTML = childElements[i].innerHTML;
								newPlaylistParentDiv.appendChild(buttonPlay);
							}else if(i == 3){
								let shareMessage = document.createElement("p");
								shareMessage.classList.add('message-text');
								if(share.shareMessage != null && share.shareMessage != ''){
									shareMessage.textContent = share.sharers.artistName + ": " + share.shareMessage;
								}else{
									shareMessage.textContent = '';
								}
								newPlaylistParentDiv.appendChild(shareMessage);
							}else {
								let hiddenShareId = document.createElement("span");
								hiddenShareId.classList.add('hidden-share-id');
								hiddenShareId.style.display = 'none';
								hiddenShareId.textContent = share.id;
								newPlaylistParentDiv.appendChild(hiddenShareId);
							}
						}
						newPlaylistParentDiv.querySelector('.button-play')
									.addEventListener('click',  (event) => addEventWhenClick(event));
									
						/*event để khi click một track trong playlist thì nó sẽ đổi thành dấu play chỗ playlist*/
						newPlaylistParentDiv.querySelector('.button-play')
							.addEventListener('click', function(){
								if(newPlaylistParentDiv.querySelector('.name-of-playlist-artist-track') 
									!= document.getElementById('valueOfTrack').value){
										
									if(document.getElementById('button-play-in-artist').querySelector('i').classList.contains('fa-pause')){
										document.getElementById('button-play-in-artist').querySelector('i').classList.remove('fa-pause');
										document.getElementById('button-play-in-artist').querySelector('i').classList.add('fa-play');
									}
								}
						});
									
						/*click vào button play thì không bị nhảy trang playlist*/
						newPlaylistParentDiv.querySelector('.button-play').addEventListener('click', function(event){
					        event.stopPropagation();
						});
									
						// event click để qua trang playlist
						newPlaylistParentDiv.addEventListener('click', () => displayPageOfPlaylists(share.playlist.playlistTitle, 
							newPlaylistParentDiv.querySelector('.button-play')));
							
						/*Nhấn nút xóa bài trong share không bị nhảy qua trang playlist*/
						newPlaylistParentDiv.querySelector('.icon-delete a').addEventListener('click', function(event){
					        event.stopPropagation();
					        deleteShareable(event);
						});
							
						/*chỉnh cho nút play nếu đang play một bài hát*/
						if(share.playlist.playlistTitle == document.getElementById('valueOfTrack').value){
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
						
						document.getElementById('all-share-track-in-page-of-artist').appendChild(newPlaylistParentDiv);
						
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
			 for (let i  = document.getElementById('search-playlist').children.length - 1; i > 2; i--) {
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
	
	
  let followButton = document.getElementById('button-follow');
  followButton.addEventListener('click', function(){
    let textContentOfButton = followButton.textContent;
    if(textContentOfButton.trim() == 'Theo dõi'){
      followButton.textContent = 'Đang theo dõi';
      
      let artistName = followButton.parentNode.querySelector('h1').textContent;
      fetch('/artist/artists/conductFollowArtist?artistName='+artistName)
      .then(response => response.json())
      	.then(artist => {
			  document.getElementById('followers-in-page-of-artist').textContent = artist.followerList.length + ' người theo dõi';
		  });
		  
	  fetch('/artist/trackLibary/add?artistName='+artistName)
	  	.then(response => response.json())
	  	.then(trackLibaryList => {
			 	 getAllTrackLibary();
			 });
    }else{
      followButton.textContent = 'Theo dõi';
      
      let artistName = followButton.parentNode.querySelector('h1').textContent;
      fetch('/artist/artists/cancelFollowArtist?artistName='+artistName)
      	.then(response => response.json())
      	.then(artist => {
			  document.getElementById('followers-in-page-of-artist').textContent = artist.followerList.length + ' người theo dõi';
		  });
		  
	  fetch('/artist/trackLibary/delete?artistName='+artistName)
		  	.then(response => response.json())
		  	.then(trackLibaryList => {
				  getAllTrackLibary();
			 });
    }
  });
  
  var srcOfImage = '';
    
  let imageFileOfTrack = document.getElementById('change-image-in-profile');
	imageFileOfTrack.addEventListener('change', function(){	
		if (imageFileOfTrack.files && imageFileOfTrack.files[0]) {
		    let reader = new FileReader();
		    reader.onload = function (e) {
		      $('#avatar-page-of-artist')
		        .attr('src', e.target.result)
		        .width(200)
		        .height(200)
		    };
		    reader.readAsDataURL(imageFileOfTrack.files[0]);
		    
		    /*chỗ này xử lý để đổi avatar cho chính mình*/
		  }
	});
	
	var buttonPlayInPage = null;
	
	function clickButtonPlayInPageOfTrack(buttonPlay){
		  buttonPlay.click();
    }
	  
  document.getElementById('button-play-in-artist').addEventListener('click',function(){
	  clickButtonPlayInPageOfTrack(buttonPlayInPage);
	  let buttonInPageOfPlaylist = document.getElementById('button-play-in-artist').querySelector('i');
	  /*trong if else này bị ngược lại với bth vì khi chạy tới chỗ này thì bên click buttonPlay chưa đổi icon của trên header*/
	  if(document.getElementById('icon-play-track').classList.contains('fa-pause')){
		  
		  /*trường hợp ở trang cũ và bấm cho nó ngưng nhạc*/
		  if(buttonInPageOfPlaylist.classList.contains('fa-pause')){
				  buttonInPageOfPlaylist.classList.remove('fa-pause');
				  buttonInPageOfPlaylist.classList.add('fa-play');
		  }else{
		  /*trường hợp ở trang cũ và bấm cho nó chạy nhạc*/
			  buttonInPageOfPlaylist.classList.remove('fa-play');
			  buttonInPageOfPlaylist.classList.add('fa-pause');
		  }
		  
	  }else{
		  if(buttonInPageOfPlaylist.classList.contains('fa-play')){
			  buttonInPageOfPlaylist.classList.remove('fa-play');
			  buttonInPageOfPlaylist.classList.add('fa-pause');
		  }
	  }
  });
  
  function getAllPopularTrackOfArtist(artist, buttonPlay){
	  fetch('/artist/tracks/findAllTrackByArtistName?artistName='+ artist.artistName)
 		.then(response => response.json())
 		.then(tracks => {
			 if(buttonPlay != null){
			 	buttonPlayInPage = buttonPlay;
			 	
			 	let buttonPlayInPlaylist = document.getElementById('button-play-in-artist');
			 	if( buttonPlayInPlaylist.querySelector('span').textContent !=
			 		 buttonPlay.parentNode.querySelector('.name-of-playlist-artist-track').textContent){
						  
					 if(buttonPlayInPlaylist.querySelector('i').classList.contains('fa-pause')){
						 buttonPlayInPlaylist.querySelector('i').classList.remove('fa-pause');
					 	 buttonPlayInPlaylist.querySelector('i').classList.add('fa-play');
					 }
				 }else {
					 if(buttonPlay.querySelector('i').classList.contains('fa-pause')){
						 if(buttonPlayInPlaylist.querySelector('i').classList.contains('fa-play')){
							 buttonPlayInPlaylist.querySelector('i').classList.remove('fa-play');
						 	 buttonPlayInPlaylist.querySelector('i').classList.add('fa-pause');
					 	 }
					 }else{
						 if(buttonPlayInPlaylist.querySelector('i').classList.contains('fa-pause')){
							 buttonPlayInPlaylist.querySelector('i').classList.remove('fa-pause');
						 	 buttonPlayInPlaylist.querySelector('i').classList.add('fa-play');
					 	 }
					 }
				 }
			  }
			  
				 let trackInPlaylist = document.getElementById('track-in-artist');
				 let childElements = trackInPlaylist.children;
				 
				 let lengthOfAllDivChildInDisplayAllTrack = document.getElementById('all-music-in-artist').children.length;
				 if(lengthOfAllDivChildInDisplayAllTrack != 1){
						let allTrack = document.getElementById('all-music-in-artist');
						 for (let i = lengthOfAllDivChildInDisplayAllTrack - 1; i > 0; i--) {
					        allTrack.removeChild(allTrack.children[i]);
				    	}
				 }
				 
				 Array.from(tracks).forEach((track, index) => {
					 let newTrackParentDiv = document.createElement("div");
					 newTrackParentDiv.classList.add('track-in-playlist');
					 
					 if(track.private == false && document.getElementById('all-music-in-artist').children.length <=10){
						 for(let i=0; i< childElements.length; i++){
							 if(i==0){
								 let infoOfTrack = document.createElement("div");
						 		 infoOfTrack.classList.add('info-of-track-artist-in-page-playlist');
						 		 infoOfTrack.innerHTML = childElements[i].innerHTML;
						 		 infoOfTrack.querySelector('.index-of-track-in-play-list').textContent = 
						 		 	document.getElementById('all-music-in-artist').children.length;
						 		 infoOfTrack.querySelector('.name-of-track-in-page-playlist').textContent = track.trackTitle;
						 		 
						 		 let artistOfTrack =  infoOfTrack.querySelector(".name-of-artists-in-page-playlist");
										artistOfTrack.querySelector('a').innerHTML = track.user.artistName;
						 		 
						 		 if(track.userList.length !=0){
											artistOfTrack.querySelector('a').insertAdjacentHTML('afterend', ',  ');
											
									for(let i=0; i<= track.userList.length -1; i++){
										let aTagNameOfCooperatorArtist =  document.createElement("a");
											aTagNameOfCooperatorArtist.classList.add('artist');
											aTagNameOfCooperatorArtist.innerHTML = track.userList[i].artistName;
											aTagNameOfCooperatorArtist.setAttribute('href', '#');
											artistOfTrack.appendChild(aTagNameOfCooperatorArtist)
										if(i != track.userList.length -1 ){
											aTagNameOfCooperatorArtist.insertAdjacentHTML('afterend', ',  ');
										}
									}
								}
								
								newTrackParentDiv.appendChild(infoOfTrack);
							 }else if(i ==1){
								 let imageOfTrack = document.createElement("div");
						 		 imageOfTrack.classList.add('image-of-track-artist-in-page-playlist');
						 		 imageOfTrack.innerHTML = childElements[i].innerHTML;
						 		 imageOfTrack.querySelector('img').src =  'data:image/jpeg;base64,' + track.image;
						 		 
						 		 newTrackParentDiv.appendChild(imageOfTrack);
							 }else if(i ==2){
								 let timeOfTrack = document.createElement("div");
						 		 timeOfTrack.classList.add('time-of-track-artist-in-page-playlist');
						 		 timeOfTrack.innerHTML  = childElements[i].innerHTML;
						 		 
								let minuteOfStartDerution = Math.floor(track.trackDuration / 60);
							    let secondsOfStartDerution = Math.floor(track.trackDuration % 60);
							    
							    if(secondsOfStartDerution >=0 && secondsOfStartDerution <10){
							       timeOfTrack.querySelector('span').textContent =  minuteOfStartDerution + ':0' + secondsOfStartDerution;
							    }else if (secondsOfStartDerution >=10 && secondsOfStartDerution <60){
							       timeOfTrack.querySelector('span').textContent =   minuteOfStartDerution + ':' + secondsOfStartDerution;
							    }
						 		 
						 		 newTrackParentDiv.appendChild(timeOfTrack);
							 }else if(i==3){
								 let listeners = document.createElement("div");
						 		 listeners.classList.add('listens-of-track-artist-in-page-playlist');
						 		 listeners.innerHTML  = childElements[i].innerHTML;
						 		 
						 		 listeners.querySelector('span').textContent = track.numberOfListens;
						 		 
						 		 newTrackParentDiv.appendChild(listeners);
							 }
						 }
						 
						 document.getElementById('all-music-in-artist').appendChild(newTrackParentDiv);
						 newTrackParentDiv.querySelector('.button-play-of-track-in-play-list')
													.addEventListener('click',  function(){
							document.getElementById('button-play-in-artist').click();		
						});	
						
					
					}			
				 });
				 
		 });
  }
  
  function getAllSingleTracOfArtist(artist){
	  fetch('/artist/tracks/findAllTrackByArtistName?artistName='+artist.artistName)
	    .then(response => response.json())
	    .then(tracks => {
			let trackParentDiv = document.getElementById("single-track-in-page-of-artist");
			let childElements = trackParentDiv.children;
			
			let lengthOfAllDivChildInDisplayAllTrack = document.getElementById('all-single-track-in-page-of-artist').children.length;
			if(lengthOfAllDivChildInDisplayAllTrack != null){
				
				if(lengthOfAllDivChildInDisplayAllTrack != 1){
					let allTrack = document.getElementById('all-single-track-in-page-of-artist');
					 for (let i = lengthOfAllDivChildInDisplayAllTrack - 1; i > 0; i--) {
				        allTrack.removeChild(allTrack.children[i]);
				    }
				}	
				
				Array.from(tracks).forEach(track => {
					if(track.private == false  && document.getElementById('all-single-track-in-page-of-artist').children.length <=5){
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
								newTrackParentDiv.appendChild(imageOfTrack);
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
							
						/*event để khi click một track trong playlist thì nó sẽ đổi thành dấu play chỗ playlist*/
						newTrackParentDiv.querySelector('.button-play')
							.addEventListener('click', function(){
								if(newTrackParentDiv.querySelector('.name-of-playlist-artist-track') 
									!= document.getElementById('valueOfTrack').value){
										
									if(document.getElementById('button-play-in-artist').querySelector('i').classList.contains('fa-pause')){
										document.getElementById('button-play-in-artist').querySelector('i').classList.remove('fa-pause');
										document.getElementById('button-play-in-artist').querySelector('i').classList.add('fa-play');
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
						
						document.getElementById('all-single-track-in-page-of-artist').appendChild(newTrackParentDiv);
					}
				});
			}
	
		})
		.catch(error => console.error('Error fetching artists:', error));
  }
  
  function getAllAlbumOfArtist(artist){
	  fetch('/artist/playlists/findAllPlaylistByArtistName?artistName='+artist.artistName)
        .then(response => response.json())
        .then(playlists => {
			let playlistParentDiv = document.getElementById("album-in-page-of-artist");
			let childElements = playlistParentDiv.children;	
			
			let lengthOfAllDivChildInDisplayAllTrack = document.getElementById('all-album-in-page-of-artist').children.length;
			if(lengthOfAllDivChildInDisplayAllTrack != null){
				if(lengthOfAllDivChildInDisplayAllTrack != 1){
					let allPlaylist = document.getElementById('all-album-in-page-of-artist');
					 for (let i = lengthOfAllDivChildInDisplayAllTrack - 1; i > 0; i--) {
				        allPlaylist.removeChild(allPlaylist.children[i]);
				    }
				}	
					
				Array.from(playlists).forEach(playlist => {
					if(playlist.private == false && playlist.album == true 
						&& document.getElementById('all-album-in-page-of-artist').children.length <=5){
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
									
						/*event để khi click một track trong playlist thì nó sẽ đổi thành dấu play chỗ playlist*/
						newPlaylistParentDiv.querySelector('.button-play')
							.addEventListener('click', function(){
								if(newPlaylistParentDiv.querySelector('.name-of-playlist-artist-track') 
									!= document.getElementById('valueOfTrack').value){
										
									if(document.getElementById('button-play-in-artist').querySelector('i').classList.contains('fa-pause')){
										document.getElementById('button-play-in-artist').querySelector('i').classList.remove('fa-pause');
										document.getElementById('button-play-in-artist').querySelector('i').classList.add('fa-play');
									}
								}
						});
									
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
						
						document.getElementById('all-album-in-page-of-artist').appendChild(newPlaylistParentDiv);
					}
				});
			}
	
    	})
    	.catch(error => console.error('Error fetching artists:', error));
  }
  
  function getAllPlaylistOfArtist(artist){
	  fetch('/artist/playlists/findAllPlaylistByArtistName?artistName='+artist.artistName)
        .then(response => response.json())
        .then(playlists => {
			let playlistParentDiv = document.getElementById("playlist-in-page-of-artist");
			let childElements = playlistParentDiv.children;	
			
			let lengthOfAllDivChildInDisplayAllTrack = document.getElementById('all-playlist-in-page-of-artist').children.length;
			if(lengthOfAllDivChildInDisplayAllTrack != null){
				if(lengthOfAllDivChildInDisplayAllTrack != 1){
					let allPlaylist = document.getElementById('all-playlist-in-page-of-artist');
					 for (let i = lengthOfAllDivChildInDisplayAllTrack - 1; i > 0; i--) {
				        allPlaylist.removeChild(allPlaylist.children[i]);
				    }
				}	
					
				Array.from(playlists).forEach(playlist => {
					if(playlist.private == false && playlist.album == false 
						&& document.getElementById('all-playlist-in-page-of-artist').children.length <=5){
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
						
						/*event để khi click một track trong playlist thì nó sẽ đổi thành dấu play chỗ playlist*/	
						newPlaylistParentDiv.querySelector('.button-play')
							.addEventListener('click', function(){
								if(newPlaylistParentDiv.querySelector('.name-of-playlist-artist-track') 
									!= document.getElementById('valueOfTrack').value){
										
									if(document.getElementById('button-play-in-artist').querySelector('i').classList.contains('fa-pause')){
										document.getElementById('button-play-in-artist').querySelector('i').classList.remove('fa-pause');
										document.getElementById('button-play-in-artist').querySelector('i').classList.add('fa-play');
									}
								}
						});
									
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
						
						document.getElementById('all-playlist-in-page-of-artist').appendChild(newPlaylistParentDiv);
					}
				});
			}
	
    	})
    	.catch(error => console.error('Error fetching artists:', error));
  }
  
  function clickSeeAllTrackInPageOfPlaylist(){
	  Array.from(document.getElementsByClassName('button-see-all-track-album-in-page-of-artist')).forEach(element =>{
		  element.addEventListener('click', function(){
				document.getElementById('display-all-track').style.display = 'block';
				document.getElementById('upload-track-by-artist').style.display = 'none';
				document.getElementById('upload-playlist-by-artist').style.display = 'none';
				document.getElementById('page-of-track').style.display = 'none';
				document.getElementById('page-of-artist').style.display = 'none';
				document.getElementById('page-of-play-list').style.display = 'none';
				document.getElementById('index').style.display = 'none';
				document.getElementById('page-of-search').style.display = 'none';
				
			   let artistName = document.getElementById('info-background-artist').querySelector('h1').textContent;
			  fetch('/artist/tracks/findAllTrackByArtistNameInSeeAll?artistName='+artistName)
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
							 	
								document.getElementById('all-track').appendChild(newTrackParentDiv);
							}
						});
					}
					
					let nameOfUser = document.getElementById('info-background-artist').querySelector('h1').textContent;
		            document.getElementById("title-of-track-display-all-track").innerHTML = "Nhạc của "+ nameOfUser;
		            document.getElementById("title-of-album-display-all-track").innerHTML = "Album của "+ nameOfUser;
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
					
					let nameOfUser = document.getElementById('info-background-artist').querySelector('h1').textContent;
		            document.getElementById("title-of-track-display-all-track").innerHTML = "Nhạc của "+ nameOfUser;
		            document.getElementById("title-of-album-display-all-track").innerHTML = "Album của "+ nameOfUser;
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
	  });
	  
  }
  
  function displayOtherArtist(artistName){
		fetch('/artist/artists/findTop15FollowingOfArtist?artistName='+artistName)
			.then(response => response.json())
			.then(artists => {
				let trackParentDiv = document.getElementById("the-other-artist-in-page-of-artist");
				let childElements = trackParentDiv.children;
				let lengthOfAllDivChildInDisplayAllTrack = document.getElementById('all-the-other-artist-in-page-of-artist').children.length;
				if(lengthOfAllDivChildInDisplayAllTrack != null){
					
					if(lengthOfAllDivChildInDisplayAllTrack != 1){
						let allTrack = document.getElementById('all-the-other-artist-in-page-of-artist');
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
											if(document.getElementById('button-play-in-artist').querySelector('i').classList.contains('fa-pause')){
												document.getElementById('button-play-in-artist').querySelector('i').classList.remove('fa-pause');
												document.getElementById('button-play-in-artist').querySelector('i').classList.add('fa-play');
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
					 	
						document.getElementById('all-the-other-artist-in-page-of-artist').appendChild(newTrackParentDiv);
					});
				}
			});
	}
	
	function isFollowing(artistNameInPageOfArtist, myArtistName){
		let check = false;
		fetch('/artist/artists/findByArtistName?artistName='+ myArtistName)
			.then(response => response.json())
			.then(artist => {
				if(artist.followingList != null){
					artist.followingList.forEach(element => {
						fetch('/artist/artists/findById?id='+element)
							.then(response => response.json())
							.then(artist => {
								if(artist.artistName == artistNameInPageOfArtist){
									document.getElementById("button-follow").textContent = 'Đang theo dõi';
									check = true;
								}
							})
					});
					
					if(check == false){
						document.getElementById("button-follow").textContent = 'Theo dõi';
					}
				}else{
					document.getElementById("button-follow").textContent = 'Theo dõi';
				}
			})
	}
  
  clickSeeAllTrackInPageOfPlaylist();
  
  
  // bấm vào 1 nghệ sĩ
   window.displayPageOfArtist =  function displayPageOfArtist(artistName, buttonPlay){
	  document.getElementById('page-of-artist').style.display = 'block';
	  document.getElementById('page-of-play-list').style.display = 'none';
	  document.getElementById('page-of-track').style.display = 'none';
	  document.getElementById('index').style.display = 'none';
	  document.getElementById('display-all-track').style.display = 'none';
	  document.getElementById('upload-track-by-artist').style.display = 'none';
	  document.getElementById('upload-playlist-by-artist').style.display = 'none';
	  document.getElementById('page-of-search').style.display = 'none';
	  
	  
	  /*lưu lịch sử tìm kiếm*/
	  if(buttonPlay != null){
		  if(buttonPlay.parentNode.classList.contains('search')){
		  	let NameOfCurrentTrack = buttonPlay.parentNode.querySelector('.name-of-playlist-artist-track');	
			
			if(NameOfCurrentTrack != null){
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
	  
	  isFollowing(artistName, document.getElementById('a-my-profile').getAttribute('value'));
	  
	  fetch('/artist/artists/findByArtistName?artistName='+artistName)
	  	.then(response => response.json())
	  	.then(artist => {
			if(buttonPlay == null || artist.artistName == 'ADMIN'){
				document.getElementById('big-all-music-in-artist').style.display = 'none';
				document.getElementById('button-play-saveToLibary-in-page-of-artist').style.display= 'none';
				
			}else{
				document.getElementById('big-all-music-in-artist').style.display = 'block';
				document.getElementById('button-play-saveToLibary-in-page-of-artist').style.display= 'flex';
				
				/*if(document.getElementById('a-my-profile').getAttribute('value') == artist.artistName){
					document.getElementById('button-play-saveToLibary-in-page-of-artist')
						.querySelector('#button-save-to-libary').style.display = 'none';
				}else{
					document.getElementById('button-play-saveToLibary-in-page-of-artist')
						.querySelector('#button-save-to-libary').style.display = 'block';
				}*/
			}
			  
			document.getElementById('avatar-page-of-artist').src = 'data:image/jpeg;base64,' + artist.image;
			document.getElementById('info-background-artist').querySelector('h1').textContent = artist.artistName;
			
			srcOfImage = 'data:image/jpeg;base64,' + artist.image;
			
			let followers = 0 + ' người theo dõi';
			if(artist.followerList != null && artist.followerList.length !=0){
				followers =  artist.followerList.length + ' người theo dõi';
			}
			document.getElementById('important-info-background-artist').querySelector("#followers-in-page-of-artist").textContent 
				= followers;
			
			let followings = 0 + ' đang theo dõi';
			if(artist.followingList != null && artist.followingList.length !=0){
				followings =  artist.followingList.length + ' đang theo dõi';
			}
			document.getElementById('important-info-background-artist').querySelector("#followings-in-page-of-artist").textContent 
				= followings;
			
			
			if(artist.artistName == document.getElementById('a-my-profile').getAttribute('value')){
				document.getElementById('button-follow').style.display = 'none';
			}else{
				document.getElementById('button-follow').style.display = 'inline-block';
			}
			
			buttonPlayInPage = buttonPlay;
		 	
		 	let buttonPlayInPlaylist = document.getElementById('button-play-in-artist');

		 	if(buttonPlay != null){
				 if(buttonPlayInPlaylist.querySelector('span').textContent !=
			 		 buttonPlay.parentNode.querySelector('.name-of-playlist-artist-track').textContent){
						  
					 if(buttonPlayInPlaylist.querySelector('i').classList.contains('fa-pause')){
						 buttonPlayInPlaylist.querySelector('i').classList.remove('fa-pause');
					 	 buttonPlayInPlaylist.querySelector('i').classList.add('fa-play');
					 }
				 }else {
					 if(buttonPlay.querySelector('i').classList.contains('fa-pause')){
						 if(buttonPlayInPlaylist.querySelector('i').classList.contains('fa-play')){
							 buttonPlayInPlaylist.querySelector('i').classList.remove('fa-play');
						 	 buttonPlayInPlaylist.querySelector('i').classList.add('fa-pause');
					 	 }
					 }else{
						 if(buttonPlayInPlaylist.querySelector('i').classList.contains('fa-pause')){
							 buttonPlayInPlaylist.querySelector('i').classList.remove('fa-pause');
						 	 buttonPlayInPlaylist.querySelector('i').classList.add('fa-play');
					 	 }
					 }
				 }
			 }
			
			
					 	
		 	setDynamicBackground();
		 	
		 	getAllPopularTrackOfArtist(artist, buttonPlay);
		 	
		 	getAllSingleTracOfArtist(artist);
		 	
		 	getAllAlbumOfArtist(artist);
		 	
		 	getAllPlaylistOfArtist(artist);
		 	
		 	displayOtherArtist(artist.artistName);
		 	
		 	fetch('/artist/share/getShareableByArtist?artistName='+artist.artistName)
		 		.then(response => response.json())
		 		.then(shareList => {
					getAllShareList(shareList, 4); 
				 });
		 	
		 });
	  
  }
  
  
  
  /*Hủy lưu avatar của trang artist*/
  document.getElementById('closeChangeImage').addEventListener('click', function(){
	  document.getElementById('div-change-image-in-profile').style.display= 'none';
	  document.getElementById('avatar-page-of-artist').src = srcOfImage;
	  document.getElementById('form-change-image').reset();
  });
  
  /*bấm chĩnh ảnh avatar của trang artist*/
  document.getElementById('avatar-page-of-artist').addEventListener('click', function(){
	  let myArtistName = document.getElementById('a-my-profile').getAttribute('value');
	  let artistNameInPageOfArtist = this.parentNode.parentNode.querySelector('#info-background-artist h1').textContent;
	  if(myArtistName == artistNameInPageOfArtist){
		  document.getElementById('div-change-image-in-profile').style.display= 'block';
		  document.getElementById('div-change-image-in-profile').querySelector('.idOfTrackInChangeImage').value = 
		  	document.getElementById('info-background-artist').querySelector('h1').textContent;
	  }
	  
  });
  
  /*sau khi bấm lưu xong*/
  document.getElementById('iframChangeImage').addEventListener('load', function(){
	 if(document.getElementById('iframChangeImage').contentWindow.document.body.textContent != ''){
		 let artist = JSON.parse(document.getElementById('iframChangeImage').contentWindow.document.body.textContent);
				alert("Lưu thành công");
				document.getElementById('div-change-image-in-profile').style.display= 'none';
				srcOfImage ='data:image/jpeg;base64,' + artist.image;
				document.getElementById('form-change-image').reset();
			}else{
				alert("Vui lòng chọn hình");
			} 
  });
  

  
  document.getElementById('a-my-profile')
  	.addEventListener('click', () => displayPageOfArtist(document.getElementById('a-my-profile').getAttribute('value')), null);
});