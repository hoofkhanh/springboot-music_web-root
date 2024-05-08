document.addEventListener('DOMContentLoaded', function(){
	
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
	
	function seeAllMasterPlaylist(newMasterPlaylistDiv, masterPlaylist, nextElement , titleTextContent,quantity){		
		
		if(titleTextContent == 'Rút gọn'){
			newMasterPlaylistDiv.querySelector('.title-and-see-all h4 a').textContent = 'Hiện tất cả';
		}else{
			newMasterPlaylistDiv.querySelector('.title-and-see-all h4 a').textContent = 'Rút gọn';
		}
		
		let masterPlaylistExample = document.getElementById('master-playlist');
		let childrenOfMasterPlaylistExample = masterPlaylistExample.children;
		Array.from(childrenOfMasterPlaylistExample).forEach((element, index) => {
			if(index == 0){
				let title = document.createElement('div');
				title.classList.add('title-and-see-all');
				title.innerHTML = element.innerHTML;
				title.querySelector('h1 a').textContent = masterPlaylist.titleOfMasterPlaylist;
				
				title.querySelector('h4 a').textContent = newMasterPlaylistDiv.querySelector('.title-and-see-all h4 a').textContent;
				newMasterPlaylistDiv.appendChild(title);
				
				title.querySelector('h4 a').addEventListener('click', function(){
					if(title.querySelector('h4 a').textContent == 'Rút gọn'){
						seeAllMasterPlaylist(newMasterPlaylistDiv, masterPlaylist, newMasterPlaylistDiv.nextElementSibling, title.querySelector('h4 a').textContent, 4);
					}else{
						seeAllMasterPlaylist(newMasterPlaylistDiv, masterPlaylist, newMasterPlaylistDiv.nextElementSibling, title.querySelector('h4 a').textContent, 1000000000);
					}
				})
			}else if(index ==1){
				let allPlaylist = document.createElement('div');
				allPlaylist.classList.add('grid-playlist-artist-track');
				allPlaylist.innerHTML = element.innerHTML;
				
				Array.from(masterPlaylist.playlistList).forEach((playlist, indexOfPlaylist) => {
					if(indexOfPlaylist <= quantity){
						let newPlaylistDiv = document.createElement('div');
						newPlaylistDiv.classList.add('playlist-artist-track');
						newPlaylistDiv.classList.add('album-or-playlist');
							
						Array.from(document.getElementById('playlist-in-master-playlist').children).forEach((element_2, index_2) => {
							
							if(index_2 == 0){
								let imageOfPlaylist = document.createElement("div");
								imageOfPlaylist.classList.add('image-of-playlist-track-in-playlist-artist-track');
								imageOfPlaylist.innerHTML = element_2.innerHTML;
								imageOfPlaylist.querySelector("img").src = 'data:image/jpeg;base64,' + playlist.image;
								imageOfPlaylist.querySelector(".hidden-name-of-playlist").textContent = playlist.playlistTitle;	
								newPlaylistDiv.appendChild(imageOfPlaylist)
							}else if(index_2 ==1){
								let infoOfPlaylist = document.createElement("div");
								infoOfPlaylist.classList.add('info-artist-in-playlist-artist-track');
								infoOfPlaylist.innerHTML = element_2.innerHTML;
								infoOfPlaylist.querySelector(".name-of-playlist-artist-track").innerHTML = playlist.playlistTitle;
								
								let artistOfPlaylist =  infoOfPlaylist.querySelector(".artist-of-playlist-artist-track");
								artistOfPlaylist.querySelector('a').innerHTML = playlist.user.artistName;
								artistOfPlaylist.querySelector('a').addEventListener('click', function(event){
									event.stopPropagation();
									clickToNameArtistInDataOtherTrackAndAlbumAndGoToSearch(playlist.user.artistName);
								});
								
								newPlaylistDiv.appendChild(infoOfPlaylist)
							}else{
								let buttonPlay = document.createElement("a");
								buttonPlay.classList.add('button-play');
								buttonPlay.innerHTML = element_2.innerHTML;
								newPlaylistDiv.appendChild(buttonPlay);
							}
							
						});
						
						newPlaylistDiv.querySelector('.button-play')
								.addEventListener('click',  (event) => addEventWhenClick(event));
								
						/*click vào button play thì không bị nhảy trang playlist*/
						newPlaylistDiv.querySelector('.button-play').addEventListener('click', function(event){
					        event.stopPropagation();
						});
									
						// event click để qua trang playlist
						newPlaylistDiv.addEventListener('click', () => displayPageOfPlaylists(playlist.playlistTitle, 
							newPlaylistDiv.querySelector('.button-play')));
							
						/*chỉnh cho nút play nếu đang play một bài hát*/
						if(playlist.playlistTitle == document.getElementById('valueOfTrack').value){
							newPlaylistDiv.querySelector('.button-play').classList.add('active-playlist');
							if(document.getElementById('icon-play-track').classList.contains('fa-pause')){
								if(newPlaylistDiv.querySelector('i').classList.contains('fa-play')){
									newPlaylistDiv.querySelector('i').classList.remove('fa-play');
									newPlaylistDiv.querySelector('i').classList.add('fa-pause');
								}
							}else{
								if(newPlaylistDiv.querySelector('i').classList.contains('fa-pause')){	
									newPlaylistDiv.querySelector('i').classList.remove('fa-pause');
									newPlaylistDiv.querySelector('i').classList.add('fa-play');
								}
							}
						}
						
						allPlaylist.appendChild(newPlaylistDiv);
					}
				});
				
				allPlaylist.removeChild(allPlaylist.children[0]);	
				newMasterPlaylistDiv.removeChild(newMasterPlaylistDiv.children[0])
				newMasterPlaylistDiv.removeChild(newMasterPlaylistDiv.children[0])				
				newMasterPlaylistDiv.appendChild(allPlaylist);
				
				
				
				document.getElementById('all-playlist-artist-track-index').insertBefore(newMasterPlaylistDiv, nextElement);
			}
		});
	}
	
	window.getAllMasterPlaylist = function getAllMasterPlaylist(masterPlaylistList, quantity){
		
		let masterPlaylistCheck = document.getElementsByClassName('master-playlist')
		Array.from(masterPlaylistCheck).forEach(element => {
			if(element.style.display != 'none'){
				document.getElementById('all-playlist-artist-track-index').removeChild(element)
			}
		});
		
		Array.from(masterPlaylistList).forEach(masterPlaylist => {
			let masterPlaylistExample = document.getElementById('master-playlist');
			
			let newMasterPlaylistDiv = document.createElement('div');
			newMasterPlaylistDiv.classList.add('grid-all-playlist-artist-track');
			newMasterPlaylistDiv.classList.add('master-playlist');
			newMasterPlaylistDiv.innerHTML = masterPlaylistExample.innerHTML;
			
			let childrenOfMasterPlaylistExample = masterPlaylistExample.children;
			Array.from(childrenOfMasterPlaylistExample).forEach((element, index) => {
				if(index == 0){
					let title = document.createElement('div');
					title.classList.add('title-and-see-all');
					title.innerHTML = element.innerHTML;
					title.querySelector('h1 a').textContent = masterPlaylist.titleOfMasterPlaylist;
					newMasterPlaylistDiv.appendChild(title);
					
					title.querySelector('h4 a').addEventListener('click', function(){
						if(title.querySelector('h4 a').textContent == 'Rút gọn'){
							seeAllMasterPlaylist(newMasterPlaylistDiv, masterPlaylist, newMasterPlaylistDiv.nextElementSibling, title.querySelector('h4 a').textContent, 4);
						}else{
							seeAllMasterPlaylist(newMasterPlaylistDiv, masterPlaylist, newMasterPlaylistDiv.nextElementSibling, title.querySelector('h4 a').textContent, 1000000000);
						}
						
					})
				}else if(index ==1){
					let allPlaylist = document.createElement('div');
					allPlaylist.classList.add('grid-playlist-artist-track');
					allPlaylist.innerHTML = element.innerHTML;
					
					Array.from(masterPlaylist.playlistList).forEach((playlist, indexOfPlaylist) => {
						if(indexOfPlaylist <= quantity){
							let newPlaylistDiv = document.createElement('div');
							newPlaylistDiv.classList.add('playlist-artist-track');
							newPlaylistDiv.classList.add('album-or-playlist');
								
							Array.from(document.getElementById('playlist-in-master-playlist').children).forEach((element_2, index_2) => {
								
								if(index_2 == 0){
									let imageOfPlaylist = document.createElement("div");
									imageOfPlaylist.classList.add('image-of-playlist-track-in-playlist-artist-track');
									imageOfPlaylist.innerHTML = element_2.innerHTML;
									imageOfPlaylist.querySelector("img").src = 'data:image/jpeg;base64,' + playlist.image;
									imageOfPlaylist.querySelector(".hidden-name-of-playlist").textContent = playlist.playlistTitle;	
									newPlaylistDiv.appendChild(imageOfPlaylist)
								}else if(index_2 ==1){
									let infoOfPlaylist = document.createElement("div");
									infoOfPlaylist.classList.add('info-artist-in-playlist-artist-track');
									infoOfPlaylist.innerHTML = element_2.innerHTML;
									infoOfPlaylist.querySelector(".name-of-playlist-artist-track").innerHTML = playlist.playlistTitle;
									
									let artistOfPlaylist =  infoOfPlaylist.querySelector(".artist-of-playlist-artist-track");
									artistOfPlaylist.querySelector('a').innerHTML = playlist.user.artistName;
									artistOfPlaylist.querySelector('a').addEventListener('click', function(event){
										event.stopPropagation();
										clickToNameArtistInDataOtherTrackAndAlbumAndGoToSearch(playlist.user.artistName);
									});
									
									newPlaylistDiv.appendChild(infoOfPlaylist)
								}else{
									let buttonPlay = document.createElement("a");
									buttonPlay.classList.add('button-play');
									buttonPlay.innerHTML = element_2.innerHTML;
									newPlaylistDiv.appendChild(buttonPlay);
								}
								
							});
							
							newPlaylistDiv.querySelector('.button-play')
									.addEventListener('click',  (event) => addEventWhenClick(event));
									
							/*click vào button play thì không bị nhảy trang playlist*/
							newPlaylistDiv.querySelector('.button-play').addEventListener('click', function(event){
						        event.stopPropagation();
							});
										
							// event click để qua trang playlist
							newPlaylistDiv.addEventListener('click', () => displayPageOfPlaylists(playlist.playlistTitle, 
								newPlaylistDiv.querySelector('.button-play')));
								
							/*chỉnh cho nút play nếu đang play một bài hát*/
							if(playlist.playlistTitle == document.getElementById('valueOfTrack').value){
								newPlaylistDiv.querySelector('.button-play').classList.add('active-playlist');
								if(document.getElementById('icon-play-track').classList.contains('fa-pause')){
									if(newPlaylistDiv.querySelector('i').classList.contains('fa-play')){
										newPlaylistDiv.querySelector('i').classList.remove('fa-play');
										newPlaylistDiv.querySelector('i').classList.add('fa-pause');
									}
								}else{
									if(newPlaylistDiv.querySelector('i').classList.contains('fa-pause')){	
										newPlaylistDiv.querySelector('i').classList.remove('fa-pause');
										newPlaylistDiv.querySelector('i').classList.add('fa-play');
									}
								}
							}
							
							allPlaylist.appendChild(newPlaylistDiv);
						}
					});
					
					allPlaylist.removeChild(allPlaylist.children[0]);	
					newMasterPlaylistDiv.removeChild(newMasterPlaylistDiv.children[0])
					newMasterPlaylistDiv.removeChild(newMasterPlaylistDiv.children[0])				
					newMasterPlaylistDiv.appendChild(allPlaylist);
										
					document.getElementById('all-playlist-artist-track-index').insertBefore(newMasterPlaylistDiv, document.getElementById('master-playlist'));
				}
			});
		});
	}
	
	fetch('/artist/masterPlaylist/findAllMasterPlaylist')
		.then(response => response.json())
		.then(masterPlaylistList => {
			getAllMasterPlaylist(masterPlaylistList, 4)
		});
	
});