document.addEventListener('DOMContentLoaded', function(){
	
	/*bấm nút share playlist*/
	  document.getElementById('button-share-in-playlist').addEventListener('click', function(){
		 let playlistTitle = this.parentNode.parentNode.parentNode.querySelector('#info-background-playlist h1').textContent.trim();
		 localStorage.setItem('playlistTileWhenShare', playlistTitle);
		 
		 document.getElementById('confirm-share-playlist').style.display= 'block';		 
	  });
	  
	  /*Hủy share*/
	  document.getElementById('confirm-no-playlist').addEventListener('click', function(){
		  document.getElementById('confirm-share-playlist').style.display= 'none';
		  document.getElementById('message-share-playlist').value = '';
	  });
	  
	  /*Chấp nhận share*/
	  document.getElementById('confirm-yes-playlist').addEventListener('click', function(){
		  document.getElementById('confirm-share-playlist').style.display= 'none';
		  
		  let notifySuccessShare = document.getElementById('notify-success-share');
		  let style = window.getComputedStyle(notifySuccessShare);
		  if(style.bottom == '-1000px'){
			  notifySuccessShare.style.bottom = '30px';
			  setTimeout(function(){
				  notifySuccessShare.style.bottom = '-1000px';
			  }, 2000);
		  }
		  		  
		  let shareMessage = document.getElementById('message-share-playlist').value ;
		  document.getElementById('message-share-playlist').value = '' ;
		  fetch('/artist/share/add?playlistTitle='+localStorage.getItem('playlistTileWhenShare')+"&shareMessage="+shareMessage);
	  });
	
	/*bấm nút trái tim để add vào thư viện trong page of track*/
	  document.getElementById('button-save-to-libary-page-of-playlist').addEventListener('click', function(){
		  let playlistTitle = this.parentNode.parentNode.parentNode.querySelector('#info-background-playlist h1').textContent.trim();
		  	  
		  let colorOfHeart = this.querySelector('i').style.color;
		  
		  /*Đã thêm vào thư viện*/
		  if(colorOfHeart.trim() == 'rgba(241, 18, 18, 0.996)'){
			  this.querySelector('i').style.color = 'rgba(255, 255, 255, 0.7)';
			  
			  fetch('/artist/trackLibary/delete?playlistTitle='+playlistTitle)
			  	.then(response => response.json())
			  	.then(trackLibaryList => {
					  getAllTrackLibary();
				 });
		  }else{
			  /*Chưa thêm vào thư viện*/
			  this.querySelector('i').style.color = 'rgba(241, 18, 18, 0.996)';
			  
			   fetch('/artist/trackLibary/add?playlistTitle='+playlistTitle)
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
		if(document.getElementById('search-playlist').children.length != 3){
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
	
	
  window.setDynamicBackground = function setDynamicBackground() {
	  const backgroundPlayList = document.getElementsByClassName('background-playlist');
	  Array.from(backgroundPlayList).forEach(element => {
		    const avatarImg = element.querySelector('.avatar');
		    if(avatarImg.src != 'data:image/jpeg;base64,null'){
			    // Create a canvas element to extract colorz
			    const canvas = document.createElement('canvas');
			    const ctx = canvas.getContext('2d');
			    canvas.width = avatarImg.width;
			    canvas.height = avatarImg.height;
			  
			    // Draw the image onto the canvas
			    ctx.drawImage(avatarImg, 0, 0, avatarImg.width, avatarImg.height);
			  
			    // Get the average color of all pixels
			    const imageData = ctx.getImageData(0, 0, avatarImg.width, avatarImg.height).data;
			    let totalRed = 0, totalGreen = 0, totalBlue = 0;
			  
			    for (let i = 0; i < imageData.length; i += 4) {
			      totalRed += imageData[i];
			      totalGreen += imageData[i + 1];
			      totalBlue += imageData[i + 2];
			    }
			  
			    const pixelCount = imageData.length / 4;
			    const averageRed = Math.round(totalRed / pixelCount);
			    const averageGreen = Math.round(totalGreen / pixelCount);
			    const averageBlue = Math.round(totalBlue / pixelCount);
			  
			    // Tăng độ sáng bằng cách thay đổi giá trị của màu
			    const brightenFactor = 0.6; // Điều chỉnh giá trị này để làm sáng hoặc tối màu nền
			    const brightenedRed = Math.min(255, Math.round(averageRed * brightenFactor));
			    const brightenedGreen = Math.min(255, Math.round(averageGreen * brightenFactor));
			    const brightenedBlue = Math.min(255, Math.round(averageBlue * brightenFactor));
			  
			    // Set the background color of the avatar container with the brightened color
			    element.style.backgroundColor = `rgba(${brightenedRed}, ${brightenedGreen}, ${brightenedBlue}, 1)`;
		    }
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
  
  function getDataOtherTrackAndAlbum(artistName) {
	  fetch('/artist/tracks/findAllTrackByArtistName?artistName='+artistName)
        .then(response => response.json())
        .then(tracks => {
			let trackParentDiv = document.getElementById("track-in-page-of-playlist");
			let childElements = trackParentDiv.children;
			
			let lengthOfAllDivChildInDisplayAllTrack = document.getElementById('all-track-in-page-of-playlist').children.length;
			if(lengthOfAllDivChildInDisplayAllTrack != null){
				
				if(lengthOfAllDivChildInDisplayAllTrack != 1){
					let allTrack = document.getElementById('all-track-in-page-of-playlist');
					 for (let i = lengthOfAllDivChildInDisplayAllTrack - 1; i > 0; i--) {
				        allTrack.removeChild(allTrack.children[i]);
				    }
				}	
				
				Array.from(tracks).forEach((track) => {
					if(track.private == false && document.getElementById('all-track-in-page-of-playlist').children.length <=5){
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
										
									if(document.getElementById('button-play-in-playlist').querySelector('i').classList.contains('fa-pause')){
										document.getElementById('button-play-in-playlist').querySelector('i').classList.remove('fa-pause');
										document.getElementById('button-play-in-playlist').querySelector('i').classList.add('fa-play');
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
					 	
						document.getElementById('all-track-in-page-of-playlist').appendChild(newTrackParentDiv);
					}
				});
			}
			
            
    	})
    	.catch(error => console.error('Error fetching artists:', error));
  }
  
  function clickSeeAllTrackInPageOfPlaylist(){
	  document.getElementById('button-see-all-track-in-page-of-playlist').addEventListener('click', function(){
			document.getElementById('display-all-track').style.display = 'block';
			document.getElementById('upload-track-by-artist').style.display = 'none';
			document.getElementById('upload-playlist-by-artist').style.display = 'none';
			document.getElementById('page-of-track').style.display = 'none';
			document.getElementById('page-of-artist').style.display = 'none';
			document.getElementById('page-of-play-list').style.display = 'none';
			document.getElementById('index').style.display = 'none';
			document.getElementById('page-of-search').style.display = 'none';
			document.getElementById('page-of-lyrics').style.display = 'none';
			
		   let artistName = document.getElementById('important-info-background-playlist').querySelector('a').textContent;
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
				
				let nameOfUser = document.getElementById('important-info-background-playlist').querySelector('a').textContent;
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
				
				let nameOfUser = document.getElementById('important-info-background-playlist').querySelector('a').textContent;
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
  
  clickSeeAllTrackInPageOfPlaylist();
  
  var buttonPlayInPage = null;
	  
  /*bấm vào nút play trong page of playlist*/
  function clickButtonPlayInPageOfTrack(buttonPlay){
	  buttonPlay.click();
  }
  
  document.getElementById('button-play-in-playlist').addEventListener('click',function(){
	  clickButtonPlayInPageOfTrack(buttonPlayInPage);
	  
	  let buttonInPageOfPlaylist = document.getElementById('button-play-in-playlist').querySelector('i');
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
  
  async function clickTrackTitleAndGoToSearch(trackTitle){
		let name = trackTitle;
		await search(name);
		document.getElementById('button-search-all').click();
		Array.from(document.getElementById('all-track-in-page-of-search').children).forEach((element, index) => {
			if(index >0 ){
				let nameInSearch = element.querySelector('.name-of-playlist-artist-track').textContent;
				if(nameInSearch == name){
					element.click();
				}
			}
		});
	}
	
	async function clickToNameArtistGoMyMusic(trackTitle){
	    let name = trackTitle;
		await yourTracks();
		Array.from(document.getElementById('all-track').children).forEach((element, index) => {
			if(index >0 ){
				let nameInSearch = element.querySelector('.name-of-playlist-artist-track').textContent;
				if(nameInSearch == name){
					element.click();
				}
			}
		});
   }
	
	
  // bấm vào 1 playlist
   window.displayPageOfPlaylists =  function displayPageOfPlaylists(playlistTitle, buttonPlay){
	  document.getElementById('page-of-play-list').style.display = 'block';
	  document.getElementById('page-of-artist').style.display = 'none';
	  document.getElementById('page-of-track').style.display = 'none';
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
	  
	  fetch('/artist/playlists/findPlaylistByPlaylistTitleInPageOfArtist?playlistTitle='+playlistTitle)
	  	.then(response => response.json())
	  	.then(playlist => {
			if(playlist.playlistTitle.includes('Bài hát đã thích của')){
				document.getElementById('button-save-to-libary-page-of-playlist').style.display = 'none';
				document.getElementById('button-share-in-playlist').style.display = 'none';
			}else{
				document.getElementById('button-save-to-libary-page-of-playlist').style.display = 'block';
				if(playlist.private == true){
					document.getElementById('button-share-in-playlist').style.display = 'none';
				}else{
					document.getElementById('button-share-in-playlist').style.display = 'block';
				}
			}
			
			document.getElementById('avatar-page-of-playlist').src = 'data:image/jpeg;base64,' + playlist.image;
			document.getElementById('info-background-playlist').querySelector('h1').textContent = playlist.playlistTitle;
			
			if(playlist.album == true){
				document.getElementById('info-background-playlist').querySelector('p').textContent = 'Album ';
			}else{
				document.getElementById('info-background-playlist').querySelector('p').textContent = 'Danh sách phát ';
			}
			
			document.getElementById('important-info-background-playlist').querySelector("a").textContent = playlist.user.artistName;
			document.getElementById('important-info-background-playlist').querySelector("a").addEventListener('click', function(){
				clickToNameArtistInDataOtherTrackAndAlbumAndGoToSearch(playlist.user.artistName);
			});
			document.getElementById('important-info-background-playlist').querySelector("img").src = 'data:image/jpeg;base64,' +  playlist.user.image;
			
			let countTrack = 0;
			Array.from(playlist.trackList).forEach(track => {
				if(track.private == false){
					countTrack ++;
				}
			})
			document.getElementById('numberOfTracks').textContent = countTrack + ' bài hát';
			
			
			let releaseDate = playlist.dateAdded.split('-');
			document.getElementById('important-info-background-playlist').querySelector("#dateOfPlaylist").textContent 
				= '• Ngày ' + releaseDate[2] +' tháng ' + releaseDate[1] + ' năm ' + releaseDate[0] ;
				
			let totalTimeOfPlaylist = 0;
			Array.from(playlist.trackList).forEach(track => {
				totalTimeOfPlaylist += track.trackDuration;
			});
			
			let displayTimeOfTrack = document.getElementById('important-info-background-playlist').querySelector("#timeOfPlaylist");
			let minuteOfStartDerution = Math.floor(totalTimeOfPlaylist / 60);
		    let secondsOfStartDerution = Math.floor(totalTimeOfPlaylist % 60);
		    
		    if(secondsOfStartDerution >=0 && secondsOfStartDerution <10){
		       displayTimeOfTrack.textContent = '• ' + minuteOfStartDerution + ':0' + secondsOfStartDerution;
		    }else if (secondsOfStartDerution >=10 && secondsOfStartDerution <60){
		       displayTimeOfTrack.textContent = '• ' +  minuteOfStartDerution + ':' + secondsOfStartDerution;
		    }

		 	
		 	setDynamicBackground();
		 	
		 	/*set giá trị để khi bấm play trong page thì nó lấy buttonPlay của thằng trong nhạc*/
		 	buttonPlayInPage = buttonPlay;
		 	let buttonPlayInPlaylist = document.getElementById('button-play-in-playlist');
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
			 
			 let trackInPlaylist = document.getElementById('track-in-playlist');
			 let childElements = trackInPlaylist.children;
			 
			 let lengthOfAllDivChildInDisplayAllTrack = document.getElementById('all-music-in-playlist').children.length;
			 if(lengthOfAllDivChildInDisplayAllTrack != 1){
					let allTrack = document.getElementById('all-music-in-playlist');
					 for (let i = lengthOfAllDivChildInDisplayAllTrack - 1; i > 0; i--) {
				        allTrack.removeChild(allTrack.children[i]);
			    	}
			 }
			 

			 Array.from(playlist.trackList).forEach((track) => {
				 if(track.private == false){
					 let newTrackParentDiv = document.createElement("div");
					 newTrackParentDiv.classList.add('track-in-playlist');
					 
					 for(let i=0; i< childElements.length; i++){
						 if(i==0){
							 let infoOfTrack = document.createElement("div");
					 		 infoOfTrack.classList.add('info-of-track-artist-in-page-playlist');
					 		 infoOfTrack.innerHTML = childElements[i].innerHTML;
					 		 infoOfTrack.querySelector('.index-of-track-in-play-list').textContent = document.getElementById('all-music-in-playlist').children.length;
					 		 infoOfTrack.querySelector('.name-of-track-in-page-playlist').textContent = track.trackTitle;
							 
							 if(track.private == false){
								infoOfTrack.querySelector('.name-of-track-in-page-playlist').addEventListener('click', function(){
									clickTrackTitleAndGoToSearch(track.trackTitle);
								});
							}else {
								infoOfTrack.querySelector('.name-of-track-in-page-playlist').addEventListener('click', function(){
									clickToNameArtistGoMyMusic(track.trackTitle);
								});
							}
					 		 
					 		 
					 		 let artistOfTrack =  infoOfTrack.querySelector(".name-of-artists-in-page-playlist");
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
										aTagNameOfCooperatorArtist.setAttribute('href', '#');
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
					 
					 document.getElementById('all-music-in-playlist').appendChild(newTrackParentDiv);
					 newTrackParentDiv.querySelector('.button-play-of-track-in-play-list')
												.addEventListener('click',  function(){
						document.getElementById('button-play-in-playlist').click();				
					});	
				}			
			 });
		 	
		 	document.getElementById('albumAndTrackOfUserInPageOfPlaylist').textContent = playlist.user.artistName;
		 	
		 	/*Các bài hát và album khác*/
		 	getDataOtherTrackAndAlbum(playlist.user.artistName);
		 	
		 	
		 	/*Đổi màu trái tim khi đã add vào thư viên*/
			 let outLoop = false;
			 fetch('/artist/trackLibary/findByUser')
			 	.then(response => response.text())
			 	.then(trackLibaryList => {
				    if(trackLibaryList != ''){
				    	trackLibaryList = JSON.parse(trackLibaryList);
						if(trackLibaryList != null){
							Array.from(trackLibaryList).forEach(libary => {
								if(libary != null && libary.playlist!= null && libary.playlist.playlistTitle == playlist.playlistTitle){
									document.getElementById('button-save-to-libary-page-of-playlist').querySelector('i').style.color  = 'rgba(241, 18, 18, 0.996)';
									outLoop = true;
								}
							});
						}
					}
					
					if(outLoop == false){
						document.getElementById('button-save-to-libary-page-of-playlist').querySelector('i').style.color  = 'rgba(255, 255, 255, 0.7)';
					}
				 });
		 	
		 	
		 });
	  
  }
  
  
   /*cái này sau này bỏ*/
   let allPageOfPlaylist = document.getElementsByClassName('album-or-playlist');
	  Array.from(allPageOfPlaylist).forEach(element => {
	    element.addEventListener('click', displayPageOfPlaylists);
	});  

	
});