document.addEventListener('DOMContentLoaded', function(){
	var trackInQueue = [];
	
	var listenTime =0;
	var trackPlay = null;
	
	var numberOfPlay = 0;
	
	var intervalQuangCao;
	
	var nameHiddenInQueue = '';
	
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
	
	async function getData(event){
	  let queueTrack = document.getElementById('queue-tracks');
	  
	  let nameOfTrack = event.target.parentNode.querySelector('.name-of-playlist-artist-track');	  

	  if(nameOfTrack != null){
		  let checkAlbumOrPlaylist = false;
		  
		  let trackTitle = nameOfTrack.textContent;
		  
		  url = '';
		  if(event.target.parentNode.classList.contains('track')){
			  url = "/artist/tracks/findAllTrackGenreTogether?trackTitle="+trackTitle;
		  }else if(event.target.parentNode.classList.contains('album-or-playlist')){
			  url = "/artist/playlists/findAllTrackListOfPlaylistByPlaylistTitle?playlistTitle="+trackTitle;
			  checkAlbumOrPlaylist = true;
		  }else if(event.target.parentNode.classList.contains('artist')){
			  url = "/artist/tracks/findAllTrackByArtistName?artistName="+trackTitle;
		  }
		  
		  await fetch(url)
		  	.then(json => json.json())
		  	.then(tracks => {
				  
				  if(tracks.length ==0){
					  alert('album không có bài hát nào');
					  throw new Error("album không có bài hát nào" );
				  }
				  
				  let valueOfTrackInInputHidden = document.getElementById('valueOfTrack');
				  if(valueOfTrackInInputHidden.value != trackTitle){
					  
					  /*xóa và display hàng chờ nếu như bấm vào bài hát khác chừa lại h2, input type hidden, và cái mẫu nên là i>2*/
					  let childrenOfQueueTrack = queueTrack.children.length;
					  if(childrenOfQueueTrack != 3){
						  for(let i=childrenOfQueueTrack -1; i>2 ;i--){
							  queueTrack.removeChild(queueTrack.children[i]);
						  }
					  }
					  
					  let playlistParentDiv = document.getElementById("queue-track-in-playlist");
					  let childElements = playlistParentDiv.children;	
					   Array.from(tracks).forEach((track, index) => {
						  if((checkAlbumOrPlaylist == false && index <20) // nếu là bài hát bth thì in 20 bài còn playlist hoặc album thì đc hơn
						  		|| checkAlbumOrPlaylist == true){
							  let newQueueTrackInPlaylist = document.createElement("div");
						  	  newQueueTrackInPlaylist.classList.add('track-in-playlist');
						  	  
						  	  for(let i=0; i< childElements.length; i++){
									if(i==0){
										let newQueueTrackInfo = document.createElement('div');
										newQueueTrackInfo.classList.add('info-of-track-artist-in-page-playlist');
										newQueueTrackInfo.innerHTML = childElements[i].innerHTML;
										newQueueTrackInfo.querySelector('img').src = 'data:image/jpeg;base64,' + track.image;
										newQueueTrackInfo.querySelector('.song source').src =  track.trackFile;
										newQueueTrackInfo.querySelector('.song span').textContent = track.trackTitle + '_queue';
										newQueueTrackInfo.querySelector('.name-of-track-in-page-playlist').textContent = track.trackTitle ;
										
										let artistOfTrack =  newQueueTrackInfo.querySelector(".name-of-artists-in-page-playlist");
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
										
										newQueueTrackInPlaylist.appendChild(newQueueTrackInfo);
										newQueueTrackInPlaylist.querySelector('.button-play-of-track-in-play-list')
											.addEventListener('click',  (event) => addEventWhenClick(event));
									}else{
										let timeOfTrackInQueue = document.createElement('div');
										timeOfTrackInQueue.classList.add('time-of-track-artist-in-page-playlist');
										timeOfTrackInQueue.innerHTML = childElements[i].innerHTML;
										
									    let minuteOfStartDerution = Math.floor(track.trackDuration / 60);
									    let secondsOfStartDerution = Math.floor(track.trackDuration % 60);
									    
									    if(index == 0){
											let progress = document.getElementById('progress');
											progress.max =  track.trackDuration;
											
										    minuteOfStartDerution = Math.floor(progress.max / 60);
										    secondsOfStartDerution = Math.floor(progress.max % 60);
										    let startDuration = document.getElementById('end-duration');
										    
										    if(secondsOfStartDerution >=0 && secondsOfStartDerution <10){
										      startDuration.innerHTML = minuteOfStartDerution + ':0' + secondsOfStartDerution;
										    }else if (secondsOfStartDerution >=10 && secondsOfStartDerution <60){
										      startDuration.innerHTML = minuteOfStartDerution + ':' + secondsOfStartDerution;
										    }
										}
										
									    if(secondsOfStartDerution >=0 && secondsOfStartDerution <10){
									       timeOfTrackInQueue.querySelector('span').textContent = minuteOfStartDerution + ':0' + secondsOfStartDerution;
									    }else if (secondsOfStartDerution >=10 && secondsOfStartDerution <60){
									       timeOfTrackInQueue.querySelector('span').textContent = minuteOfStartDerution + ':' + secondsOfStartDerution;
									    }
										
										newQueueTrackInPlaylist.appendChild(timeOfTrackInQueue);
									}
								}
								document.getElementById('queue-tracks').appendChild(newQueueTrackInPlaylist);
						  }
					  });
					  valueOfTrackInInputHidden.value = trackTitle;
					  
					  trackInQueue = '';
				  }
			  
		  });	
	  }
	  
		
		
	}
	
	window.addEventWhenClick = async function addEventWhenClick(event){
		clearAllInterVal();
		await getData(event);
				
		if(event.target.parentNode.classList.contains('track') || event.target.parentNode.classList.contains('album-or-playlist')  
			|| event.target.parentNode.classList.contains('artist') ){
				
			if(event.target.parentNode.classList.contains('track')){
				document.getElementById('button-play-in-track').querySelector('span').textContent 
					= event.target.parentNode.querySelector('.name-of-playlist-artist-track').textContent;
			}else if(event.target.parentNode.classList.contains('album-or-playlist')){
				document.getElementById('button-play-in-playlist').querySelector('span').textContent 
					= event.target.parentNode.querySelector('.name-of-playlist-artist-track').textContent;
			}else if(event.target.parentNode.classList.contains('artist')){
				document.getElementById('button-play-in-artist').querySelector('span').textContent 
					= event.target.parentNode.querySelector('.name-of-playlist-artist-track').textContent;
			}
		}
			
		
	  
     // kiểm tra xem track khác có được bật không
      let allAudioElements = document.querySelectorAll('audio');
      Array.from(allAudioElements).forEach(audio => {
        audio.addEventListener('play', function(){
          pauseOtherTrack(audio);
        })
      });

      // hàm để xử lý
      function pauseOtherTrack(currentTrack) {
        Array.from(allAudioElements).forEach(audio => {
          if(audio != currentTrack){
            audio.pause();
            let tagIconInButtonPlay = audio.parentNode.querySelector('i');
            tagIconInButtonPlay.classList.remove('fa-pause');
            tagIconInButtonPlay.classList.add('fa-play');
            audio.currentTime = 0;
          }
        });
      }
      
      


      // lấy bài hát đang được bấm nút button play
      let track = event.target.querySelector('.song');
      

      // phát nhạc trong queue vì bấm play ở album or playlist
      // thêm active khi bấm play trong hàng chờ
      if(event.target.parentNode.parentNode.parentNode.parentNode.classList.contains('queue-track-class')){
        let allElementHaveClassActiveMusic = document.querySelectorAll('.active-music');
        if(allElementHaveClassActiveMusic.length >0){
          Array.from(allElementHaveClassActiveMusic).forEach(element => {
            element.classList.remove('active-music');
          });
        }
        event.target.parentNode.parentNode.parentNode.classList.add('active-music');
        
        let nameOfPlaylist = localStorage.getItem('saveNameOfPlaylist');
        if(nameOfPlaylist!= null){
          let allSpanTagNameOfPlaylist = document.getElementsByClassName('hidden-name-of-playlist');
          Array.from(allSpanTagNameOfPlaylist).forEach(element => {
            if(element.textContent.trim() === nameOfPlaylist.trim()){
              if(!element.parentNode.parentNode.querySelector('.button-play').classList.contains('active-playlist')){
                element.parentNode.parentNode.querySelector('.button-play').classList.add('active-playlist');
              }
              
              let nameOfTrackInPageOfTrack = document.getElementById('button-play-in-track')
              	.parentNode.parentNode.parentNode.querySelector('#info-background-track h1').textContent;
              	
              let nameOfTrackInPageOfPlaylist = document.getElementById('button-play-in-playlist')
              	.parentNode.parentNode.parentNode.querySelector('#info-background-playlist h1').textContent;
              	
              let nameOfArtistInPageOfArtist = document.getElementById('button-play-in-artist')
              	.parentNode.parentNode.parentNode.querySelector('#info-background-artist h1').textContent;
              
              let buttonPlayOfPlaylist = element.parentNode.parentNode.querySelector('.button-play').querySelector('i');
              if(event.target.querySelector('i').classList.contains('fa-pause')){
                buttonPlayOfPlaylist.classList.remove('fa-pause');
                buttonPlayOfPlaylist.classList.add('fa-play');
                
                if(nameOfTrackInPageOfTrack == document.getElementById('valueOfTrack').value){
					document.getElementById('button-play-in-track').querySelector('i').classList.remove('fa-pause');
                	document.getElementById('button-play-in-track').querySelector('i').classList.add('fa-play');
				}else if(nameOfTrackInPageOfPlaylist == document.getElementById('valueOfTrack').value){
					document.getElementById('button-play-in-playlist').querySelector('i').classList.remove('fa-pause');
                	document.getElementById('button-play-in-playlist').querySelector('i').classList.add('fa-play');
				}else if(nameOfArtistInPageOfArtist == document.getElementById('valueOfTrack').value){
					document.getElementById('button-play-in-artist').querySelector('i').classList.remove('fa-pause');
                	document.getElementById('button-play-in-artist').querySelector('i').classList.add('fa-play');
				}
              }else{
                buttonPlayOfPlaylist.classList.remove('fa-play');
                buttonPlayOfPlaylist.classList.add('fa-pause');
                
                if(nameOfTrackInPageOfTrack == document.getElementById('valueOfTrack').value){
					document.getElementById('button-play-in-track').querySelector('i').classList.remove('fa-play');
                	document.getElementById('button-play-in-track').querySelector('i').classList.add('fa-pause');
				}else if(nameOfTrackInPageOfPlaylist == document.getElementById('valueOfTrack').value){
					document.getElementById('button-play-in-playlist').querySelector('i').classList.remove('fa-play');
                	document.getElementById('button-play-in-playlist').querySelector('i').classList.add('fa-pause');
				}else if(nameOfArtistInPageOfArtist == document.getElementById('valueOfTrack').value){
					document.getElementById('button-play-in-artist').querySelector('i').classList.remove('fa-play');
                	document.getElementById('button-play-in-artist').querySelector('i').classList.add('fa-pause');
				}
				
              }
            }
          });
        }
      }

      // bấm vào nút play trong album or playlist hoặc artist hoặc track
      let queueTracks = document.getElementById('queue-tracks');
      if(event.target.parentNode.classList.contains('album-or-playlist') || event.target.parentNode.classList.contains('artist')
        || event.target.parentNode.classList.contains('track')){
        let allTrackInQueue = queueTracks.querySelectorAll('.track-in-playlist');
        let haveClassActivePlay = false;
        Array.from(allTrackInQueue).forEach(element => {
          if(element.classList.contains('active-music')){
            haveClassActivePlay = element;
          }
        });
        
        if(haveClassActivePlay == false){
          track = queueTracks.querySelectorAll('.track-in-playlist')[1].querySelector('.song');
          queueTracks.querySelectorAll('.track-in-playlist')[1].classList.add('active-music');
        }else{
          track = haveClassActivePlay.querySelector('.song');
        }

        // đổi nút pause và play của nhạc trong queue khi nhấn vào album
        if(track.parentNode.parentNode.parentNode.parentNode.parentNode.classList.contains('queue-track-class')){
          let iconPlayInTrackOfQueue = track.parentNode.querySelector('i');
          if(event.target.parentNode.querySelector('.button-play i').classList.contains('fa-play')){
            iconPlayInTrackOfQueue.classList.remove('fa-play');
            iconPlayInTrackOfQueue.classList.add('fa-pause');
          }else{
            iconPlayInTrackOfQueue.classList.remove('fa-pause');
            iconPlayInTrackOfQueue.classList.add('fa-play');
          }
        }
      }
      
      /*xử lý để đã play bài hát khác và tính thời gian xem = 0*/
      if(trackPlay == null){
			listenTime =0;
			Array.from(document.getElementsByClassName('active-music')).forEach(track => {
				trackPlay = track.querySelector('.name-of-track-in-page-playlist').textContent;
				nameHiddenInQueue = document.getElementById('valueOfTrack').getAttribute('value');
			});
			
			/*kiểm tra số lần phát nhạc (nếu lẻ thì không phát quảng cáo và ngược lại)*/
			numberOfPlay += 1;
			
			/*lưu lịch sử nghe*/
			let NameOfCurrentTrack = event.target.parentNode.querySelector('.name-of-playlist-artist-track').textContent;	
			
		    if(event.target.parentNode.classList.contains('track')){
			   url = "/artist/listeningHistory/add?trackTitle="+NameOfCurrentTrack;
		    }else if(event.target.parentNode.classList.contains('album-or-playlist')){
			    url = "/artist/listeningHistory/add?playlistTitle="+NameOfCurrentTrack;
			    checkAlbumOrPlaylist = true;
		    }else if(event.target.parentNode.classList.contains('artist')){
			    url = "/artist/listeningHistory/add?artistName="+NameOfCurrentTrack;
		    }
		    
		    fetch(url)
				.then(response => response.json())
				.then(listeningHistory => {
					let styleOfIndex = window.getComputedStyle(document.getElementById('index'));
					
					/*kiểm tra xem đang ở trang index thì fetch data chỗ đã nghe gần đây còn ở trang như page of track, playlist, artist
					thì không được fetch vì phải giữ nút button play lại để có thể play trong những trang page of .. đó*/
					if(styleOfIndex.getPropertyValue('display') == 'block'){
						if(document.getElementById('href-display-all-currentTrack').textContent == 'Hiện tất cả'){
						getAllListeningHistory(listeningHistory, 4);
						}else{
							getAllListeningHistory(listeningHistory, 1000000000);
						}
					}
				});
			
		    
		}else{
			Array.from(document.getElementsByClassName('active-music')).forEach( track => {
				if(trackPlay != track.querySelector('.name-of-track-in-page-playlist').textContent
					|| (trackPlay == track.querySelector('.name-of-track-in-page-playlist').textContent 
					&& nameHiddenInQueue != document.getElementById('valueOfTrack').getAttribute('value')) ){
						
					listenTime =0;
					trackPlay = track.querySelector('.name-of-track-in-page-playlist').textContent;
					nameHiddenInQueue = document.getElementById('valueOfTrack').getAttribute('value');
					
					/*kiểm tra số lần phát nhạc (nếu lẻ thì không phát quảng cáo và ngược lại)*/
					numberOfPlay +=1;
					
					/*lưu lịch sử nghe*/
					let NameOfCurrentTrack = event.target.parentNode.querySelector('.name-of-playlist-artist-track');	
					
					if(NameOfCurrentTrack != null){
						NameOfCurrentTrack= NameOfCurrentTrack.textContent;
					    if(event.target.parentNode.classList.contains('track')){
						   url = "/artist/listeningHistory/add?trackTitle="+NameOfCurrentTrack;
					    }else if(event.target.parentNode.classList.contains('album-or-playlist')){
						    url = "/artist/listeningHistory/add?playlistTitle="+NameOfCurrentTrack;
						    checkAlbumOrPlaylist = true;
					    }else if(event.target.parentNode.classList.contains('artist')){
						    url = "/artist/listeningHistory/add?artistName="+NameOfCurrentTrack;
					    }
						
						fetch(url)
							.then(response => response.json())
							.then(listeningHistory => {
								let styleOfIndex = window.getComputedStyle(document.getElementById('index'));
								
					/*kiểm tra xem đang ở trang index thì fetch data chỗ đã nghe gần đây còn ở trang như page of track, playlist, artist
					thì không được fetch vì phải giữ nút button play lại để có thể play trong những trang page of .. đó*/
								if(styleOfIndex.getPropertyValue('display') == 'block'){
									if(document.getElementById('href-display-all-currentTrack').textContent == 'Hiện tất cả'){
									getAllListeningHistory(listeningHistory, 4);
									}else{
										getAllListeningHistory(listeningHistory, 1000000000);
									}
								}
								
							});
							
					}
				}
			});
		}

		
		/*cài nhạc quảng cáo vào track và ngăn chặn click các công cụ ở header*/
		if(numberOfPlay%2 !== 0 && numberOfPlay != 1 ){
			if(document.getElementById('next-gen-package').getAttribute('value') != 'ARTIST_NEXT_GEN'){
				track = document.getElementById('id-quang-cao');
				
				intervalQuangCao = true;
			}
			
			numberOfPlay =0;
		}else{
			if(intervalQuangCao == true){
				intervalQuangCao = false;
			}
			
			document.getElementById('icon-next-track').style.pointerEvents = 'auto';
			document.getElementById('icon-previous-track').style.pointerEvents = 'auto';
			Array.from(document.getElementsByClassName('button-play-of-track-in-play-list')).forEach(button => {
				button.style.pointerEvents = 'auto';
			});
			
			Array.from(document.getElementsByClassName('button-play')).forEach(button => {
				button.style.pointerEvents = 'auto';
			});
			document.getElementById('button-play-in-track').style.pointerEvents = 'auto';
			document.getElementById('button-play-in-playlist').style.pointerEvents = 'auto';
			document.getElementById('button-play-in-artist').style.pointerEvents = 'auto';
			document.getElementById('progress').style.pointerEvents = 'auto';
			document.getElementById('icon-repeat').style.pointerEvents = 'auto';
			document.getElementById('icon-shuffle').style.pointerEvents = 'auto';
		}
		

      // gán giá trị max và value cho input range
      let progress = document.getElementById('progress');
      
      if(isNaN(track.duration)== false){
		  progress.max = track.duration;
		  
		  // display thời gian audio
	      let startDuration = document.getElementById('end-duration');
	      let minuteOfStartDerution = Math.floor(progress.max / 60);
	      let secondsOfStartDerution = Math.floor(progress.max % 60);
	      if(secondsOfStartDerution >=0 && secondsOfStartDerution <10){
	        startDuration.innerHTML = minuteOfStartDerution + ':0' + secondsOfStartDerution;
	      }else if (secondsOfStartDerution >=10 && secondsOfStartDerution <60){
	        startDuration.innerHTML = minuteOfStartDerution + ':' + secondsOfStartDerution;
	      }
	  }
      progress.value = track.currentTime;

      if(track.currentTime ==0 ){
        document.getElementById('start-duration').innerHTML = '0:00';
      }

      // lấy iconPlayMusic trên header
      let iconPlayMusic = document.getElementById('icon-play-track');
      iconPlayMusic.classList.remove('fa-play');
      iconPlayMusic.classList.add('fa-pause');

      // icon chỗ mấy con track
      let iconPlayInTrack = event.target.querySelector('i');
      if(iconPlayInTrack.classList.contains('fa-play')){
        track.play();
    
        iconPlayInTrack.classList.remove('fa-play');
        iconPlayInTrack.classList.add('fa-pause');	
        iconPlayMusic.classList.remove('fa-play');
        iconPlayMusic.classList.add('fa-pause');
      }else{
        track.pause();
        
		iconPlayInTrack.classList.remove('fa-pause');
        iconPlayInTrack.classList.add('fa-play');	
        iconPlayMusic.classList.remove('fa-pause');
        iconPlayMusic.classList.add('fa-play');
      }
      
      /*Xử lý để khi nhấn nút button thì tất cả bài hát, playlist, track đều có button đồng đều*/
      if(iconPlayInTrack.parentNode.parentNode != null && iconPlayInTrack.parentNode.parentNode.classList.contains('artist')){
		  let name = iconPlayInTrack.parentNode.parentNode.querySelector('.name-of-playlist-artist-track').textContent;
		  Array.from(document.getElementsByClassName('playlist-artist-track artist')).forEach(element => {
			 if(element.querySelector('.name-of-playlist-artist-track').textContent == name){
				 if(iconPlayInTrack.classList.contains('fa-play')){
					 if(element.querySelector('.button-play i').classList.contains('fa-pause')){
						 element.querySelector('.button-play i').classList.remove('fa-pause');
						 element.querySelector('.button-play i').classList.add('fa-play');
					 }
				 }else{
					 if(element.querySelector('.button-play i').classList.contains('fa-play')){
						 element.querySelector('.button-play i').classList.remove('fa-play');
						 element.querySelector('.button-play i').classList.add('fa-pause');
					 }
				 }
			 }
		  });
	  }else if(iconPlayInTrack.parentNode.parentNode != null && iconPlayInTrack.parentNode.parentNode.classList.contains('track')){
		  let name = iconPlayInTrack.parentNode.parentNode.querySelector('.name-of-playlist-artist-track').textContent;
		  Array.from(document.getElementsByClassName('playlist-artist-track track')).forEach(element => {
			 if(element.querySelector('.name-of-playlist-artist-track').textContent == name){
				 if(iconPlayInTrack.classList.contains('fa-play')){
					 if(element.querySelector('.button-play i').classList.contains('fa-pause')){
						 element.querySelector('.button-play i').classList.remove('fa-pause');
						 element.querySelector('.button-play i').classList.add('fa-play');
					 }
				 }else{
					 if(element.querySelector('.button-play i').classList.contains('fa-play')){
						 element.querySelector('.button-play i').classList.remove('fa-play');
						 element.querySelector('.button-play i').classList.add('fa-pause');
					 }
				 }
			 }
		  });
	  }else if(iconPlayInTrack.parentNode.parentNode != null && iconPlayInTrack.parentNode.parentNode.classList.contains('album-or-playlist')){
		  let name = iconPlayInTrack.parentNode.parentNode.querySelector('.name-of-playlist-artist-track').textContent;
		  Array.from(document.getElementsByClassName('playlist-artist-track album-or-playlist')).forEach(element => {
			 if(element.querySelector('.name-of-playlist-artist-track').textContent == name){
				 if(iconPlayInTrack.classList.contains('fa-play')){
					 if(element.querySelector('.button-play i').classList.contains('fa-pause')){
						 element.querySelector('.button-play i').classList.remove('fa-pause');
						 element.querySelector('.button-play i').classList.add('fa-play');
					 }
				 }else{
					 if(element.querySelector('.button-play i').classList.contains('fa-play')){
						 element.querySelector('.button-play i').classList.remove('fa-play');
						 element.querySelector('.button-play i').classList.add('fa-pause');
					 }
				 }
			 }
		  });
	  }
      

      localStorage.setItem('track', track.textContent.trim());
      if(event.target.parentNode.classList.contains('album-or-playlist') || 
        event.target.parentNode.classList.contains('artist') || event.target.parentNode.classList.contains('track')){
        localStorage.setItem('saveNameOfPlaylist', event.target.parentNode
          .querySelector('.hidden-name-of-playlist').textContent);
         
        if(!event.target.classList.contains('active-playlist')){
          event.target.classList.add('active-playlist');
        }

        let nameOfPlaylistInHomePage = localStorage.getItem('saveNameOfPlaylist');
        let allHiddenNameOfPlaylistTemp = document.getElementsByClassName('hidden-name-of-playlist');
        Array.from(allHiddenNameOfPlaylistTemp).forEach(element => {
          if(element.textContent.trim() != nameOfPlaylistInHomePage){
            let iconInPlaylist =  element.parentNode.parentNode.querySelector('.button-play i');
            if(iconInPlaylist != null && iconInPlaylist.classList.contains('fa-pause')){
              iconInPlaylist.classList.remove('fa-pause');
              iconInPlaylist.classList.add('fa-play');
            }

            let elementHaveActivePlaylist = element.parentNode.parentNode.querySelector('.button-play');
            if(elementHaveActivePlaylist != null && elementHaveActivePlaylist.classList.contains('active-playlist')){
              elementHaveActivePlaylist.classList.remove('active-playlist');
            }
          }else{
			  
			  /*Upadte 14/4 khi nhấn nut play pause trên header thì tất cả bài đó trong trang đều động bộ icon play pause*/
			  let elementHaveActivePlaylist = element.parentNode.parentNode.querySelector('.button-play');
	            if(elementHaveActivePlaylist != null && !elementHaveActivePlaylist.classList.contains('active-playlist')){
					
	              elementHaveActivePlaylist.classList.add('active-playlist');
	            }
		  }
        });
      }else{
         // xử lý cho nút button ở cac album or playlist (khi bấm vào bài mới không phải album)
        if(!event.target.parentNode.parentNode.parentNode.parentNode.classList.contains('queue-track-class')){
          let allElementHaveActivePlaylist = document.getElementsByClassName('active-playlist');
          if(allElementHaveActivePlaylist.length >0){
            Array.from(allElementHaveActivePlaylist).forEach(element => {
              element.classList.remove('active-playlist');
              let tagIconInAlbumOrPlaylist = element.querySelector('i');
              if(tagIconInAlbumOrPlaylist.classList.contains('fa-pause')){
                tagIconInAlbumOrPlaylist.classList.remove('fa-pause');
                tagIconInAlbumOrPlaylist.classList.add('fa-play');
              }
            });
          }
        }
      }
		
		
    if(checkEventClickOnIconPlayMusic == ''){
		  iconPlayMusic.addEventListener('click', function(){
		      tempTrack = localStorage.getItem('track');
		      let allAudio = document.getElementsByClassName('song');
		      let newTrack ;
		      Array.from(allAudio).forEach(element => {
		        if(element.textContent.trim() == tempTrack){
		          newTrack = element;
		        }
		      });
		
		      // xử lý nút play ở các album hoặc playlist
		      let allElementHaveActivePlaylist = document.getElementsByClassName('active-playlist');
		      Array.from(allElementHaveActivePlaylist).forEach(element => {
		        let iconPlayInAlbumOrPlaylist = element.querySelector('i');
		        if(iconPlayInAlbumOrPlaylist.classList.contains('fa-play')){
		          iconPlayInAlbumOrPlaylist.classList.remove('fa-play');
		          iconPlayInAlbumOrPlaylist.classList.add('fa-pause');
		        }else{
		          iconPlayInAlbumOrPlaylist.classList.remove('fa-pause');
		          iconPlayInAlbumOrPlaylist.classList.add('fa-play');
		        }
		      });
		      
		      
		      let buttonPlayInPageOfTrack = document.getElementById('button-play-in-track').querySelector('i');	
		      let nameOfTrackInPageOfTrack = document.getElementById('button-play-in-track')
              	.parentNode.parentNode.parentNode.querySelector('#info-background-track h1').textContent;
              	
              let buttonPlayInPageOfPlaylist = document.getElementById('button-play-in-playlist').querySelector('i');	
              let nameOfTrackInPageOfPlaylist = document.getElementById('button-play-in-playlist')
              	.parentNode.parentNode.parentNode.querySelector('#info-background-playlist h1').textContent;
              	
              let buttonPlayInPageOfArtist = document.getElementById('button-play-in-artist').querySelector('i');	
              let nameOfArtistInPageOfArtist = document.getElementById('button-play-in-artist')
              	.parentNode.parentNode.parentNode.querySelector('#info-background-artist h1').textContent;
              	
              
		      // các nút button cho các bài hát riêng lẻ và trên queue
		      let newIconPlayInTrack = newTrack.parentNode.querySelector('i');
		      if(iconPlayMusic.classList.contains('fa-play')){
		        newTrack.play();
		        iconPlayMusic.classList.remove('fa-play');
		        iconPlayMusic.classList.add('fa-pause');
		        newIconPlayInTrack.classList.remove('fa-play');
		        newIconPlayInTrack.classList.add('fa-pause');
		        if(nameOfTrackInPageOfTrack 
		        	== document.getElementById('valueOfTrack').value){
					buttonPlayInPageOfTrack.classList.remove('fa-play');
		        	buttonPlayInPageOfTrack.classList.add('fa-pause');
				}else if(nameOfTrackInPageOfPlaylist
		        	== document.getElementById('valueOfTrack').value){
					buttonPlayInPageOfPlaylist.classList.remove('fa-play');
		        	buttonPlayInPageOfPlaylist.classList.add('fa-pause');
				}else if(nameOfArtistInPageOfArtist
		        	== document.getElementById('valueOfTrack').value){
					buttonPlayInPageOfArtist.classList.remove('fa-play');
		        	buttonPlayInPageOfArtist.classList.add('fa-pause');
				}
		      }else{
		        newTrack.pause();
		        iconPlayMusic.classList.remove('fa-pause');
		        iconPlayMusic.classList.add('fa-play');
		        newIconPlayInTrack.classList.remove('fa-pause');
		        newIconPlayInTrack.classList.add('fa-play');
		        if(nameOfTrackInPageOfTrack
		        	== document.getElementById('valueOfTrack').value){
					buttonPlayInPageOfTrack.classList.remove('fa-pause');
			        buttonPlayInPageOfTrack.classList.add('fa-play');
				}else if(nameOfTrackInPageOfPlaylist
		        	== document.getElementById('valueOfTrack').value){
		        	buttonPlayInPageOfPlaylist.classList.remove('fa-pause');
			        buttonPlayInPageOfPlaylist.classList.add('fa-play');
		     	}else if(nameOfArtistInPageOfArtist
		        	== document.getElementById('valueOfTrack').value){
		        	buttonPlayInPageOfArtist.classList.remove('fa-pause');
			        buttonPlayInPageOfArtist.classList.add('fa-play');
		     	}
		     }	 
	
	    });
	}
       
      // khi play audio
      track.addEventListener('play', function() {
        clearAllInterVal();
        setInterval(() => {
          progress.value = track.currentTime;
          let startDuration = document.getElementById('start-duration');
          if(progress.value >=0 && progress.value < 10){
            startDuration.innerHTML= '0:0'+ progress.value;
          }else if(progress.value >=10 && progress.value < 60){
            startDuration.innerHTML= '0:'+ progress.value;
          }else{
            // Math.floor là làm tròn xuống
            let minutes = Math.floor(progress.value / 60);
            let seconds = progress.value % 60
            if(seconds >=0 && seconds <10) {
              startDuration.innerHTML= minutes + ':0' + seconds;
            }else {
              startDuration.innerHTML= minutes + ':' + seconds;
            }
          }
          
           if(document.getElementById('icon-play-track').classList.contains('fa-pause') 
           		&& track.querySelector('span').textContent != 'quang_cao'){
			  listenTime += 0.5;
			  
			  /*nghe đc 1/2 thời gian thì tăng lượt nghe*/
			  if(track.querySelector('span').textContent != 'quang_cao'){
				  if(listenTime == Math.ceil(track.duration/2)){
					  fetch('/artist/tracks/increaseNumberOfListenByTrackTitle?trackTitle='+trackPlay);
				  }
			  }
			  
		  }
		  
		  
        }, 500);
      });

      // khi nhấn vào thanh xả audio
      progress.onchange = function(){
        clearAllInterVal();

        track.currentTime = progress.value;
        let startDuration = document.getElementById('start-duration');
        if(progress.value >=0 && progress.value < 10){
          startDuration.innerHTML= '0:0'+ progress.value;
        }else if(progress.value >=10 && progress.value < 60){
          startDuration.innerHTML= '0:'+ progress.value;
        }else{
          // Math.floor là làm tròn xuống
          let minutes = Math.floor(progress.value / 60);
          let seconds = progress.value % 60
          if(seconds >=0 && seconds <10) {
            startDuration.innerHTML= minutes + ':0' + seconds;
          }else {
            startDuration.innerHTML= minutes + ':' + seconds;
          }
        }

        setInterval(() => { 
          progress.value = track.currentTime;
          let startDuration = document.getElementById('start-duration');
          if(progress.value >=0 && progress.value < 10){
            startDuration.innerHTML= '0:0'+ progress.value;
          }else if(progress.value >=10 && progress.value < 60){
            startDuration.innerHTML= '0:'+ progress.value;
          }else{
            // Math.floor là làm tròn xuống
            let minutes = Math.floor(progress.value / 60);
            let seconds = progress.value % 60
            if(seconds >=0 && seconds <10) {
              startDuration.innerHTML= minutes + ':0' + seconds;
            }else {
              startDuration.innerHTML= minutes + ':' + seconds;
            }
          }
          
          
          
          if(document.getElementById('icon-play-track').classList.contains('fa-pause') 
           		&& track.querySelector('span').textContent != 'quang_cao'){
			  listenTime += 0.5;
			  
			  /*nghe đc 1/2 thời gian thì tăng lượt nghe*/
			  if(track.querySelector('span').textContent != 'quang_cao'){
				  if(listenTime == Math.ceil(track.duration/2)){
					  fetch('/artist/tracks/increaseNumberOfListenByTrackTitle?trackTitle='+trackPlay);
				  }
			  }
			  
		  }
		
          
        }, 500);
      }
      
      track.addEventListener('ended',async function(){
        clearAllInterVal();
        let queueTrackHaveClassActiveMusic = document.getElementById('queue-tracks');
	    if(queueTrackHaveClassActiveMusic.querySelector('.active-music') != null &&
	      queueTrackHaveClassActiveMusic.querySelector('.active-music').nextElementSibling != null){
			
		  if(track.querySelector('span').textContent == 'quang_cao'){
			  queueTrackHaveClassActiveMusic.querySelector('.active-music .button-play-of-track-in-play-list').click();
		  }else {
			  queueTrackHaveClassActiveMusic.querySelector('.active-music')
	        	.nextElementSibling.querySelector('.button-play-of-track-in-play-list').click();
		  }
	      
	    }else{
			if(track.querySelector('span').textContent == 'quang_cao'){
			  queueTrackHaveClassActiveMusic.querySelector('.active-music .button-play-of-track-in-play-list').click();
		    }else {
			    trackInQueue = Array.from(trackInQueue);
				let currentTrack = document.getElementById('queue-tracks').querySelectorAll('.track-in-playlist');
				if(currentTrack != null){
					Array.from(currentTrack).forEach((track, index) => {
						if(index != 0){
							trackInQueue.push(track.querySelector('.name-of-track-in-page-playlist').textContent.trim());
						}
					});
								
					await fetch("/artist/tracks/findAllTrackGenreTogetherNotInTheQueue?trackTitle="+trackInQueue.join(', '))
						.then(response => response.json())
						.then(tracks => {
							
							/*xóa và display hàng chờ nếu như bấm vào bài hát khác chừa lại h2, input type hidden, và cái mẫu nên là i>2*/
							let queueTrack = document.getElementById('queue-tracks');
							let childrenOfQueueTrack = queueTrack.children.length;
							if(childrenOfQueueTrack != 3){
								  for(let i=childrenOfQueueTrack -1; i>2 ;i--){
									  queueTrack.removeChild(queueTrack.children[i]);
								  }
							}
							
						  let playlistParentDiv = document.getElementById("queue-track-in-playlist");
						  let childElements = playlistParentDiv.children;	
						   Array.from(tracks).forEach((track, index) => {
							  if(index <= 20){
								  let newQueueTrackInPlaylist = document.createElement("div");
							  	  newQueueTrackInPlaylist.classList.add('track-in-playlist');
							  	  
							  	  for(let i=0; i< childElements.length; i++){
										if(i==0){
											let newQueueTrackInfo = document.createElement('div');
											newQueueTrackInfo.classList.add('info-of-track-artist-in-page-playlist');
											newQueueTrackInfo.innerHTML = childElements[i].innerHTML;
											newQueueTrackInfo.querySelector('img').src = 'data:image/jpeg;base64,' + track.image;
											newQueueTrackInfo.querySelector('.song source').src =  track.trackFile;
											newQueueTrackInfo.querySelector('.song span').textContent = track.trackTitle + '_queue';
											newQueueTrackInfo.querySelector('.name-of-track-in-page-playlist').textContent = track.trackTitle ;
											
											let artistOfTrack =  newQueueTrackInfo.querySelector(".name-of-artists-in-page-playlist");
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
											
											newQueueTrackInPlaylist.appendChild(newQueueTrackInfo);
											newQueueTrackInPlaylist.querySelector('.button-play-of-track-in-play-list')
												.addEventListener('click',  (event) => addEventWhenClick(event));
										}else{
											let timeOfTrackInQueue = document.createElement('div');
											timeOfTrackInQueue.classList.add('time-of-track-artist-in-page-playlist');
											timeOfTrackInQueue.innerHTML = childElements[i].innerHTML;
											
										    let minuteOfStartDerution = Math.floor(track.trackDuration / 60);
										    let secondsOfStartDerution = Math.floor(track.trackDuration % 60);
										    
										    if(index == 0){
												let progress = document.getElementById('progress');
												progress.max =  track.trackDuration;
												
											    minuteOfStartDerution = Math.floor(progress.max / 60);
											    secondsOfStartDerution = Math.floor(progress.max % 60);
											    let startDuration = document.getElementById('end-duration');
											    
											    if(secondsOfStartDerution >=0 && secondsOfStartDerution <10){
											      startDuration.innerHTML = minuteOfStartDerution + ':0' + secondsOfStartDerution;
											    }else if (secondsOfStartDerution >=10 && secondsOfStartDerution <60){
											      startDuration.innerHTML = minuteOfStartDerution + ':' + secondsOfStartDerution;
											    }
											}
											
										    if(secondsOfStartDerution >=0 && secondsOfStartDerution <10){
										       timeOfTrackInQueue.querySelector('span').textContent = minuteOfStartDerution + ':0' + secondsOfStartDerution;
										    }else if (secondsOfStartDerution >=10 && secondsOfStartDerution <60){
										       timeOfTrackInQueue.querySelector('span').textContent = minuteOfStartDerution + ':' + secondsOfStartDerution;
										    }
											
											newQueueTrackInPlaylist.appendChild(timeOfTrackInQueue);
										}
									}
									document.getElementById('queue-tracks').appendChild(newQueueTrackInPlaylist);
							  }
						  });
					});
					
					document.getElementById('queue-tracks').querySelectorAll('.track-in-playlist')[1]
						.querySelector('.button-play-of-track-in-play-list').click();
				}
		    }
			
			
	    }
      },{ once: true });

      // display left-header
      let ImageOfPlaylistOfArtistTrack;
      let nameOfTrackPlaylist;
      let nameOfArtists;
      if(!event.target.classList.contains('button-play-of-track-in-play-list')){
        if(event.target.parentNode.classList.contains('album-or-playlist') || 
          event.target.parentNode.classList.contains('artist') || event.target.parentNode.classList.contains('track')){
          elementActiveInQueue = document.getElementById('queue-tracks').getElementsByClassName('track-in-playlist');
          Array.from(elementActiveInQueue).forEach(element => {
            if(element.classList.contains('active-music')){
              ImageOfPlaylistOfArtistTrack = element.querySelector('.image-of-track-artist-in-page-playlist img');
              nameOfTrackPlaylist = element.querySelector('.name-of-track-artist-in-page-playlist')
                .querySelector('.name-of-track-in-page-playlist');
              nameOfArtists = element.querySelector('.name-of-track-artist-in-page-playlist')
                .querySelector('.name-of-artists-in-page-playlist').children;
            }
          });
        }
      }else if(event.target.parentNode.parentNode.parentNode.parentNode.classList.contains('queue-track-class')){
        ImageOfPlaylistOfArtistTrack =  event.target.parentNode
        .querySelector('.image-of-track-artist-in-page-playlist img');
        nameOfTrackPlaylist = event.target.parentNode.parentNode
          .querySelector('.name-of-track-artist-in-page-playlist .name-of-track-in-page-playlist');
        nameOfArtists = event.target.parentNode.parentNode
          .querySelector('.name-of-track-artist-in-page-playlist .name-of-artists-in-page-playlist')
          .children;
      }else{
        ImageOfPlaylistOfArtistTrack =  event.target.parentNode.parentNode
        .querySelector('.image-of-track-artist-in-page-playlist img');
        nameOfTrackPlaylist = event.target.parentNode
          .querySelector('.name-of-track-artist-in-page-playlist .name-of-track-in-page-playlist');
        nameOfArtists = event.target.parentNode
          .querySelector('.name-of-track-artist-in-page-playlist .name-of-artists-in-page-playlist')
          .children;
      }
      

      // Kiểm tra hình ảnh (ảnh chưa display và ảnh mới)
      let displayImageInLeftHeader = document.
        getElementById('image-of-track-playlist');
      if(displayImageInLeftHeader.src != ImageOfPlaylistOfArtistTrack.src){
        displayImageInLeftHeader.src=ImageOfPlaylistOfArtistTrack.src;
      }
      
      // Kiểm tra name (name chưa display và name mới)
      let displayNameOfTrackInLeftHeader =  
        document.getElementById('display-name-of-track');
      if(displayNameOfTrackInLeftHeader.textContent != nameOfTrackPlaylist.textContent){
        displayNameOfTrackInLeftHeader.innerHTML =
          nameOfTrackPlaylist.textContent;
      }

      // hiển thị tên artist
      let infoOfTrackArtist = document.getElementById('all-display-name-of-artist');
      // xóa hết phần tử con để không bị thêm artist dư thừa vào
      while(infoOfTrackArtist.children.length > 0){
        infoOfTrackArtist.removeChild(infoOfTrackArtist.children[0]);
      }

      Array.from(nameOfArtists).forEach((element, index, array) => {
        let displayNameOfArtist = document.createElement('a');
        displayNameOfArtist.className ='display-name-of-artist';
        if(index != array.length -1){
          displayNameOfArtist.textContent = element.textContent;
          infoOfTrackArtist.appendChild(displayNameOfArtist);
          let split = document.createElement('span');
          split.textContent = ', ';
          infoOfTrackArtist.appendChild(split);
        }else{
          displayNameOfArtist.textContent = element.textContent;
          infoOfTrackArtist.appendChild(displayNameOfArtist);
        }
      });

      // animation cho chữ dài quá chỗ left header
      let allDisplayNameOfTrack = document.getElementById('all-display-name-of-track');
      let displayNameOfTrack = document.getElementById('display-name-of-track');
      if(parseFloat(displayNameOfTrack.offsetWidth) >= 180){
        allDisplayNameOfTrack.classList.add('class-for-runNameOfArtist');
      }else{
        allDisplayNameOfTrack.classList.remove('class-for-runNameOfArtist');
      }

      let allDisplayNameOfArtist = document.getElementById('all-display-name-of-artist');
      let totalWidthOfNameOfArtist =0;
      let allDisplayNameOfArtistChildren = document.getElementById('all-display-name-of-artist').children;
      Array.from(allDisplayNameOfArtistChildren).forEach(element => {
        totalWidthOfNameOfArtist += parseFloat(element.offsetWidth);
      });
      if(parseFloat(totalWidthOfNameOfArtist) >= 180){
        allDisplayNameOfArtist.classList.add('class-for-runNameOfArtist');
      }else{
        allDisplayNameOfArtist.classList.remove('class-for-runNameOfArtist');
      }

      /*let IconHeartSaveToLibary = document.getElementById('heart-save-to-libary');
      IconHeartSaveToLibary.style.display= 'block';*/


      // change volume
      let volumeIcon = document.getElementById('volume-icon');
      let volumeInput = document.getElementById('volume-input');

      // giữ cho volume khi play bài khác
      track.volume = volumeInput.value;

      if(checkEventClickOnIconPlayMusic == ''){
        volumeInput.addEventListener('input', function(){
          let trackTemp = localStorage.getItem('track');
          Array.from(document.querySelectorAll('audio')).forEach(element => {
            if(element.textContent.trim() == trackTemp){
              trackTemp = element;
            }
          });

          trackTemp.volume = volumeInput.value;
  
          if(volumeInput.value >= 0.6){
            if(!volumeInput.classList.contains('fa-volume-high')){
              volumeIcon.setAttribute('class', 'fa-solid fa-volume-high');
            }
          }else if( volumeInput.value>=0.3 && volumeInput.value < 0.6) {
            if(!volumeInput.classList.contains('fa-volume-low')){
              volumeIcon.setAttribute('class', 'fa-solid fa-volume-low');
            }
          }else if (volumeInput.value < 0.3 && volumeInput.value >0){
            if(!volumeInput.classList.contains('fa-volume-off')){
              volumeIcon.setAttribute('class', 'fa-solid fa-volume-off');
            }
          }else{
            if(!volumeInput.classList.contains('fa-volume-xmark')){
              volumeIcon.setAttribute('class', 'fa-solid fa-volume-xmark');
            }
          }
        });
      }

      if(checkEventClickOnIconPlayMusic == '') {
        volumeIcon.addEventListener('click', function(){
          let newTrack = localStorage.getItem('track');
          Array.from(document.querySelectorAll('audio')).forEach(element => {
            if(element.textContent.trim() == newTrack){
              newTrack = element;
            }
          });

          let volumeInputTemp = document.getElementById('volume-input');

          let volumeIconTemp = document.getElementById('volume-icon');
          if(!volumeIconTemp.classList.contains('fa-volume-xmark')){
            localStorage.setItem('volume', volumeInputTemp.value);
            volumeIconTemp.setAttribute('class', 'fa-solid fa-volume-xmark');
            volumeInputTemp.value = 0;
            newTrack.volume = 0;
          }else {
            newTrack.volume = localStorage.getItem('volume');
            volumeInputTemp.value = localStorage.getItem('volume');
            if(volumeInputTemp.value >= 0.6){
              if(!volumeInput.classList.contains('fa-volume-high')){
                volumeIconTemp.setAttribute('class', 'fa-solid fa-volume-high');
              }
            }else if( volumeInputTemp.value>=0.3 && volumeInputTemp.value < 0.6) {
              if(!volumeInput.classList.contains('fa-volume-low')){
                volumeIconTemp.setAttribute('class', 'fa-solid fa-volume-low');
              }
            }else if (volumeInputTemp.value < 0.3 && volumeInputTemp.value >0){
              if(!volumeInput.classList.contains('fa-volume-off')){
                volumeIconTemp.setAttribute('class', 'fa-solid fa-volume-off');
              }
            }else{
              if(!volumeInputTemp.classList.contains('fa-volume-xmark')){
                volumeIconTemp.setAttribute('class', 'fa-solid fa-volume-xmark');
              }
            }
          }
        });
        checkEventClickOnIconPlayMusic = 'khong vao nua';
      }
	}
	  
  var checkEventClickOnIconPlayMusic = '';

  function clearAllInterVal(){
    const interval_id = window.setInterval(function(){}, Number.MAX_SAFE_INTEGER);
    for (let i = 1; i < interval_id; i++) {
      	window.clearInterval(i);
    }
    
    /*kiểm tra đang có quảng cáo không nếu có thì không cho click các công cụ trên header*/
    if(intervalQuangCao == true){
		function turnOfEventsWhenAdversiting () {
			if(intervalQuangCao == false){
				return;
			}
			
			/*cái thanh xả nhạc này tạm thời kh tắt sự kiển vì để test */
			document.getElementById('progress').style.pointerEvents = 'auto';
			
	      	document.getElementById('icon-next-track').style.pointerEvents = 'none';
			document.getElementById('icon-previous-track').style.pointerEvents = 'none';
			Array.from(document.getElementsByClassName('button-play-of-track-in-play-list')).forEach(button => {
				button.style.pointerEvents = 'none';
			});
			
			Array.from(document.getElementsByClassName('button-play')).forEach(button => {
				button.style.pointerEvents = 'none';
			});
			document.getElementById('button-play-in-track').style.pointerEvents = 'none';
			document.getElementById('button-play-in-playlist').style.pointerEvents = 'none';
			document.getElementById('button-play-in-artist').style.pointerEvents = 'none';
			document.getElementById('icon-repeat').style.pointerEvents = 'none';
			
			
			setTimeout(turnOfEventsWhenAdversiting, 100);
		};
		turnOfEventsWhenAdversiting();
	}
  }

  let buttonPlay1 = Array.from(document.getElementsByClassName('button-play'));
  let buttonPlay2 = Array.from(document.getElementsByClassName('button-play-of-track-in-play-list'));
  let combineButton = buttonPlay1.concat(buttonPlay2);
  Array.from(combineButton).forEach(element => {
    element.addEventListener('click', (event) => addEventWhenClick(event));
  });
  

  // open tracks queue
  let IconQueueTracks = document.getElementById('i-queue-tracks');
  let queueTracks =  document.getElementById('queue-tracks');
  let computedStyleQueueTracks = window.getComputedStyle(queueTracks);
  IconQueueTracks.addEventListener('click', function(){
    if(computedStyleQueueTracks.top === '-100px' && computedStyleQueueTracks.bottom === '100px'){
      queueTracks.style.top = '62px';
      queueTracks.style.bottom = '-630px';
    }else {
      queueTracks.style.top = '-100px';
      queueTracks.style.bottom = '100px';
    }
  });

  // xóa khi bấm vào nút play chỗ mấy album playlist thì không bị nhảy qua chỗ playlist 
  let aTagOfAlbumOrPlaylist = document.querySelectorAll('.album-or-playlist .button-play');
  Array.from(aTagOfAlbumOrPlaylist).forEach(element => {
    element.addEventListener('click', function(event){
      event.stopPropagation();
    });
  });

  // xóa khi bấm vào nút play chỗ mấy artist thì không bị nhảy qua chỗ trang artist 
  let aTagOfArtist = document.querySelectorAll('.artist .button-play');
  Array.from(aTagOfArtist).forEach(element => {
    element.addEventListener('click', function(event){
      event.stopPropagation();
    });
  });

  // xóa khi bấm vào nút play chỗ mấy artist thì không bị nhảy qua chỗ trang track 
    let aTagOfTrack = document.querySelectorAll('.track .button-play');
    Array.from(aTagOfTrack).forEach(element => {
      element.addEventListener('click', function(event){
        event.stopPropagation();
      });
    });

  // xóa khi bấm vào nút play chỗ mấy artist thì không bị nhảy qua chỗ trang track 
  let aTagOfArtistInTrack1 = Array.from(document.querySelectorAll('.artist-of-playlist-artist-track .artist'));
  let aTagOfArtistInTrack2 = Array.from(document.querySelectorAll('.name-of-artists-in-page-playlist .artist'));
  let combineATagOfArtist = aTagOfArtistInTrack1.concat(aTagOfArtistInTrack2);
  Array.from(combineATagOfArtist).forEach(element => {
    element.addEventListener('click', function(event){
      event.stopPropagation();
    });
  });

  // khi bấm vào button play ở trang (page of playlist) thì nó sẽ gọi button của thằng playlist đó bên ngoài và bật nhạc 
  // đồng thời trong trang page of playlist sẽ tự động đổi pause thành play và ngược lại
  // let buttonInPageOfPlaylist =  document.getElementById('button-play-in-playlist');
  // buttonInPageOfPlaylist.addEventListener('click', function(){
  //   // thêm biến local để xử lý khi bám vào nút của trang nào thì trang đó sẽ đổi icon pause và play
  //   localStorage.setItem('clickButtonInPageOfPlaylistOrArtist', 'pageOfPlaylist');
  //   let nameOfPlaylist = document.getElementById('include-name-of-playlist').textContent;
  //   let allHiddenNameOfPlaylist = document.getElementsByClassName('hidden-name-of-playlist');

  //   Array.from(allHiddenNameOfPlaylist).forEach(element => {
  //     if(nameOfPlaylist === element.textContent.trim()){
  //       let buttonPlayInPlaylist = element.parentNode.parentNode.querySelector('.button-play');
  //       buttonPlayInPlaylist.click();
  //     }
  //   });
  // });

  // khi bấm vào button play ở trang (page of playlist) thì nó sẽ gọi button của thằng playlist đó bên ngoài và bật nhạc 
  // đồng thời trong trang page of playlist sẽ tự động đổi pause thành play và ngược lại
  // let buttonInPageOfTrack =  document.getElementById('button-play-in-track');
  // buttonInPageOfTrack.addEventListener('click', function(){
  //   // thêm biến local để xử lý khi bám vào nút của trang nào thì trang đó sẽ đổi icon pause và play
  //   localStorage.setItem('clickButtonInPageOfPlaylistOrArtist', 'pageOfTrack');
  //   let nameOfPlaylist = document.getElementById('include-name-of-track').textContent;
  //   let allHiddenNameOfPlaylist = document.getElementsByClassName('hidden-name-of-playlist');

  //   Array.from(allHiddenNameOfPlaylist).forEach(element => {
  //     if(nameOfPlaylist === element.textContent.trim()){
  //       let buttonPlayInPlaylist = element.parentNode.parentNode.querySelector('.button-play');
  //       buttonPlayInPlaylist.click();
  //     }
  //   });
  // });

  // khi bấm vào button play ở trang (page of artist) thì nó sẽ gọi button của thằng playlist đó bên ngoài và bật nhạc 
  // đồng thời trong trang page of playlist sẽ tự động đổi pause thành play và ngược lại
  // let buttonInPageOfArtist =  document.getElementById('button-play-in-artist');
  // buttonInPageOfArtist.addEventListener('click', function(){
  //   // thêm biến local để xử lý khi bám vào nút của trang nào thì trang đó sẽ đổi icon pause và play
  //   localStorage.setItem('clickButtonInPageOfPlaylistOrArtist', 'pageOfArtist');
  //   let nameOfArtist = document.getElementById('include-name-of-artist').textContent;
  //   let allHiddenNameOfArtist = document.getElementsByClassName('hidden-name-of-playlist');

  //   Array.from(allHiddenNameOfArtist).forEach(element => {
  //     if(nameOfArtist === element.textContent.trim()){
  //       let buttonPlayInArtist = element.parentNode.parentNode.querySelector('.button-play');
  //       buttonPlayInArtist.click();
  //       return false
  //     }
  //   });
  // });

  // bấm nút next bài
  let nextTrackButton = document.getElementById('icon-next-track');
  nextTrackButton.addEventListener('click', async function(){
    let queueTrackHaveClassActiveMusic = document.getElementById('queue-tracks');
    if(queueTrackHaveClassActiveMusic.querySelector('.active-music') != null &&
      queueTrackHaveClassActiveMusic.querySelector('.active-music').nextElementSibling != null){

      queueTrackHaveClassActiveMusic.querySelector('.active-music')
        .nextElementSibling.querySelector('.button-play-of-track-in-play-list').click();
    }else{
		trackInQueue = Array.from(trackInQueue);
		let currentTrack = document.getElementById('queue-tracks').querySelectorAll('.track-in-playlist');
		if(currentTrack != null){
			Array.from(currentTrack).forEach((track, index) => {
				if(index != 0){
					trackInQueue.push(track.querySelector('.name-of-track-in-page-playlist').textContent.trim());
				}
			});
						
			await fetch("/artist/tracks/findAllTrackGenreTogetherNotInTheQueue?trackTitle="+trackInQueue.join(', '))
				.then(response => response.json())
				.then(tracks => {
					
					/*xóa và display hàng chờ nếu như bấm vào bài hát khác chừa lại h2, input type hidden, và cái mẫu nên là i>2*/
					let queueTrack = document.getElementById('queue-tracks');
					let childrenOfQueueTrack = queueTrack.children.length;
					if(childrenOfQueueTrack != 3){
						  for(let i=childrenOfQueueTrack -1; i>2 ;i--){
							  queueTrack.removeChild(queueTrack.children[i]);
						  }
					}
					
				  let playlistParentDiv = document.getElementById("queue-track-in-playlist");
				  let childElements = playlistParentDiv.children;	
				   Array.from(tracks).forEach((track, index) => {
					  if(index <= 20){
						  let newQueueTrackInPlaylist = document.createElement("div");
					  	  newQueueTrackInPlaylist.classList.add('track-in-playlist');
					  	  
					  	  for(let i=0; i< childElements.length; i++){
								if(i==0){
									let newQueueTrackInfo = document.createElement('div');
									newQueueTrackInfo.classList.add('info-of-track-artist-in-page-playlist');
									newQueueTrackInfo.innerHTML = childElements[i].innerHTML;
									newQueueTrackInfo.querySelector('img').src = 'data:image/jpeg;base64,' + track.image;
									newQueueTrackInfo.querySelector('.song source').src =  track.trackFile;
									newQueueTrackInfo.querySelector('.song span').textContent = track.trackTitle + '_queue';
									newQueueTrackInfo.querySelector('.name-of-track-in-page-playlist').textContent = track.trackTitle ;
									
									let artistOfTrack =  newQueueTrackInfo.querySelector(".name-of-artists-in-page-playlist");
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
									
									newQueueTrackInPlaylist.appendChild(newQueueTrackInfo);
									newQueueTrackInPlaylist.querySelector('.button-play-of-track-in-play-list')
										.addEventListener('click',  (event) => addEventWhenClick(event));
								}else{
									let timeOfTrackInQueue = document.createElement('div');
									timeOfTrackInQueue.classList.add('time-of-track-artist-in-page-playlist');
									timeOfTrackInQueue.innerHTML = childElements[i].innerHTML;
									
								    let minuteOfStartDerution = Math.floor(track.trackDuration / 60);
								    let secondsOfStartDerution = Math.floor(track.trackDuration % 60);
								    
								    if(index == 0){
										let progress = document.getElementById('progress');
										progress.max =  track.trackDuration;
										
									    minuteOfStartDerution = Math.floor(progress.max / 60);
									    secondsOfStartDerution = Math.floor(progress.max % 60);
									    let startDuration = document.getElementById('end-duration');
									    
									    if(secondsOfStartDerution >=0 && secondsOfStartDerution <10){
									      startDuration.innerHTML = minuteOfStartDerution + ':0' + secondsOfStartDerution;
									    }else if (secondsOfStartDerution >=10 && secondsOfStartDerution <60){
									      startDuration.innerHTML = minuteOfStartDerution + ':' + secondsOfStartDerution;
									    }
									}
									
								    if(secondsOfStartDerution >=0 && secondsOfStartDerution <10){
								       timeOfTrackInQueue.querySelector('span').textContent = minuteOfStartDerution + ':0' + secondsOfStartDerution;
								    }else if (secondsOfStartDerution >=10 && secondsOfStartDerution <60){
								       timeOfTrackInQueue.querySelector('span').textContent = minuteOfStartDerution + ':' + secondsOfStartDerution;
								    }
									
									newQueueTrackInPlaylist.appendChild(timeOfTrackInQueue);
								}
							}
							document.getElementById('queue-tracks').appendChild(newQueueTrackInPlaylist);
					  }
				  });
			});
			
			document.getElementById('queue-tracks').querySelectorAll('.track-in-playlist')[1]
				.querySelector('.button-play-of-track-in-play-list').click();
		}
    }
  });

  // bấm nút previous bài
  let previousTrackButton = document.getElementById('icon-previous-track');
  previousTrackButton.addEventListener('click', function(){
    let queueTrackHaveClassActiveMusic = document.getElementById('queue-tracks');
    if(queueTrackHaveClassActiveMusic.querySelector('.active-music') != null &&  
      queueTrackHaveClassActiveMusic.querySelector('.active-music').previousElementSibling.previousElementSibling.classList.contains('track-in-playlist')){
      // nếu phát dưới 5s thì sẽ qua bài còn không thì nếu bấm previous thì nó sẽ về 0s bài hát
      let currentTimeOfTrackInQueueHaveClassActiveMusic = queueTrackHaveClassActiveMusic
        .querySelector('.active-music').querySelector('.song');
      if(currentTimeOfTrackInQueueHaveClassActiveMusic.currentTime >= 5){
        currentTimeOfTrackInQueueHaveClassActiveMusic.currentTime =0;
      }else{
        queueTrackHaveClassActiveMusic.querySelector('.active-music')
          .previousElementSibling.querySelector('.button-play-of-track-in-play-list').click();
      }
    }else{
      let currentTimeOfTrackInQueueHaveClassActiveMusic = queueTrackHaveClassActiveMusic
        .querySelector('.active-music');
      if(currentTimeOfTrackInQueueHaveClassActiveMusic != null){
		  currentTimeOfTrackInQueueHaveClassActiveMusic.querySelector('.song');
		  currentTimeOfTrackInQueueHaveClassActiveMusic.currentTime =0;
	  }
    }
  });

});
