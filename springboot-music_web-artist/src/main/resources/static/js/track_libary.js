document.addEventListener('DOMContentLoaded', function(){
	
	async function clickInLibaryAndSearchAndGoIntoPageOfTrackOrAlbumOrArtist(div){
		if(div.classList.contains('playlist-in-libary')){
			let name = div.querySelector('.name-of-artist').textContent;
			
			if(name.includes('Bài hát đã thích')){
				await yourTracks();
				 
				Array.from(document.getElementById('all-playlist-in-display-of-track').children).forEach((element, index) => {
					if(index >0 ){
						let nameInSearch = element.querySelector('.name-of-playlist-artist-track').textContent;
						if(nameInSearch ==name){
							element.click();
						}
					}
				});
			}else{
				await search(name);
				document.getElementById('button-search-all').click();
				Array.from(document.getElementById('all-playlist-in-page-of-search').children).forEach((element, index) => {
					if(index >0 ){
						let nameInSearch = element.querySelector('.name-of-playlist-artist-track').textContent;
						if(nameInSearch == name){
							element.click();
						}
					}
				});
			}
			
		}else if(div.classList.contains('artist-in-libary')){
			let name = div.querySelector('.name-of-artist').textContent;
	
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
			
		}else if(div.classList.contains('album-in-libary')){
			
			let name = div.querySelector('.name-of-artist').textContent;
	
			await search(name);
			document.getElementById('button-search-all').click();
			Array.from(document.getElementById('all-album-in-page-of-search').children).forEach((element, index) => {
				if(index >0 ){
					let nameInSearch = element.querySelector('.name-of-playlist-artist-track').textContent;
					if(nameInSearch == name){
						element.click();
					}
				}
			});
		} 
	}
	
	window.getAllTrackLibary = function getAllTrackLibary() {
		if( document.getElementById('all-track-playList-artist-in-libary').children.length != 2){
			let allTrack = document.getElementById('all-track-playList-artist-in-libary');
			 for (let i = document.getElementById('all-track-playList-artist-in-libary').children.length - 1; i > 1; i--) {
		        allTrack.removeChild(allTrack.children[i]);
		    }
		}
		
		fetch('/artist/trackLibary/findByUser')
			.then(response => response.json())
			.then(trackLibaryList => {
				Array.from(trackLibaryList).forEach(trackLibary => {
					if(trackLibary.playlist != null && trackLibary.playlist.album == true){
						let childElements = document.getElementById("track-playlist-in-libary").children;
						
						let newDivInLibary = document.createElement('div');
						newDivInLibary.classList.add('track-playList-artist-in-libary');
						newDivInLibary.classList.add('album-in-libary');
						
						for(let i=0; i< childElements.length; i++){
							if(i==0){
								let image = document.createElement("div");
								image.classList.add('image-of-playList-track');
								image.innerHTML = childElements[i].innerHTML;
								image.querySelector("img").src = 'data:image/jpeg;base64,' + trackLibary.playlist.image;
								newDivInLibary.appendChild(image) ;
							}else if(i==1){
								let info = document.createElement("div");
								info.classList.add('info-artist');
								info.innerHTML = childElements[i].innerHTML;
								info.querySelector(".role-of-track-playList").textContent = 'Album • ' + trackLibary.playlist.user.artistName;
								info.querySelector(".name-of-artist").textContent = trackLibary.playlist.playlistTitle;
								
								newDivInLibary.appendChild(info) ;
							}
						}
						
						newDivInLibary.addEventListener('click', function(){
							clickInLibaryAndSearchAndGoIntoPageOfTrackOrAlbumOrArtist(newDivInLibary);
						});
						
						document.getElementById('all-track-playList-artist-in-libary').appendChild(newDivInLibary);
						
					}else if (trackLibary.playlist != null && trackLibary.playlist.album == false){
						let childElements = document.getElementById("track-playlist-in-libary").children;
						
						let newDivInLibary = document.createElement('div');
						newDivInLibary.classList.add('track-playList-artist-in-libary');
						newDivInLibary.classList.add('playlist-in-libary');
						
						for(let i=0; i< childElements.length; i++){
							if(i==0){
								let image = document.createElement("div");
								image.classList.add('image-of-playList-track');
								image.innerHTML = childElements[i].innerHTML;
								image.querySelector("img").src = 'data:image/jpeg;base64,' + trackLibary.playlist.image;
								newDivInLibary.appendChild(image) ;
							}else if(i==1){
								let info = document.createElement("div");
								info.classList.add('info-artist');
								info.innerHTML = childElements[i].innerHTML;
								
								if(trackLibary.playlist.playlistTitle.includes('Bài hát đã thích')){
									info.querySelector(".role-of-track-playList").textContent 
										= 'Danh sách phát • ' + trackLibary.playlist.numberOfTracks +' bài hát';
								}else{
									info.querySelector(".role-of-track-playList").textContent = 'Danh sách phát • ' + trackLibary.playlist.user.artistName;
								}
								
								info.querySelector(".name-of-artist").textContent = trackLibary.playlist.playlistTitle;
								
								newDivInLibary.appendChild(info) ;
							}
						}
						
						newDivInLibary.addEventListener('click', function(){
							clickInLibaryAndSearchAndGoIntoPageOfTrackOrAlbumOrArtist(newDivInLibary);
						});
						
						document.getElementById('all-track-playList-artist-in-libary').appendChild(newDivInLibary);
						
					}else if(trackLibary.user != null){
						let childElements = document.getElementById("artist-in-libary").children;
						
						let newDivInLibary = document.createElement('div');
						newDivInLibary.classList.add('track-playList-artist-in-libary');
						newDivInLibary.classList.add('artist-in-libary');
						
						for(let i=0; i< childElements.length; i++){
							if(i==0){
								let image = document.createElement("div");
								image.classList.add('image-of-artist');
								image.innerHTML = childElements[i].innerHTML;
								image.querySelector("img").src = 'data:image/jpeg;base64,' + trackLibary.user.image;
								newDivInLibary.appendChild(image) ;
							}else if(i==1){
								let info = document.createElement("div");
								info.classList.add('info-artist');
								info.innerHTML = childElements[i].innerHTML;
								info.querySelector(".name-of-artist").textContent = trackLibary.user.artistName;
								
								newDivInLibary.appendChild(info) ;
							}
						}
						
						newDivInLibary.addEventListener('click', function(){
							clickInLibaryAndSearchAndGoIntoPageOfTrackOrAlbumOrArtist(newDivInLibary);
						});
						
						document.getElementById('all-track-playList-artist-in-libary').appendChild(newDivInLibary);
					}
				});
			});	
		
	}
	
	getAllTrackLibary();

	/*tìm kiếm trong libary*/
	document.getElementById('input-search-libary').addEventListener('input', function(){
		Array.from(document.getElementById('all-track-playList-artist-in-libary').children).forEach((element, index) => {
			if(index > 1){
				if(document.getElementById('filter-playlist-in-libary').style.backgroundColor == 'rgba(75, 73, 73, 0.992)'){
					if(element.querySelector('.name-of-artist').textContent.toLowerCase().includes(this.value.toLowerCase()) 
						&& element.classList.contains('playlist-in-libary') ){
						element.style.display = 'flex';
					}else{
						element.style.display = 'none';
					}
				}else if(document.getElementById('filter-artist-in-libary').style.backgroundColor == 'rgba(75, 73, 73, 0.992)'){
					if(element.querySelector('.name-of-artist').textContent.toLowerCase().includes(this.value.toLowerCase()) 
						&& element.classList.contains('artist-in-libary') ){
						element.style.display = 'flex';
					}else{
						element.style.display = 'none';
					}
				}else if(document.getElementById('filter-album-in-libary').style.backgroundColor == 'rgba(75, 73, 73, 0.992)'){
					if(element.querySelector('.name-of-artist').textContent.toLowerCase().includes(this.value.toLowerCase()) 
						&& element.classList.contains('album-in-libary') ){
						element.style.display = 'flex';
					}else{
						element.style.display = 'none';
					}
				}else {
					if(element.querySelector('.name-of-artist').textContent.toLowerCase().includes(this.value.toLowerCase()) ){
						element.style.display = 'flex';
					}else{
						element.style.display = 'none';
					}
				}
				
				
			}
		});
	});
	
	/*lọc playlist trong libary*/
	document.getElementById('filter-playlist-in-libary').addEventListener('click', function(){
		document.getElementById('filter-playlist-in-libary').style.backgroundColor = 'rgba(75, 73, 73, 0.992)';
		document.getElementById('filter-artist-in-libary').style.backgroundColor = 'rgba(47, 46, 46, 0.992)';
		document.getElementById('filter-album-in-libary').style.backgroundColor = 'rgba(47, 46, 46, 0.992)';
		
		Array.from(document.getElementById('all-track-playList-artist-in-libary').children).forEach((element, index) => {
			if(index > 1){
				if(element.classList.contains('playlist-in-libary')){
					element.style.display = 'flex';
					document.getElementById('filter-all').style.display = 'inline';
				}else{
					element.style.display = 'none';
				}
			}
		});
	});
	
	/*lọc artist trong libary*/
	document.getElementById('filter-artist-in-libary').addEventListener('click', function(){
		document.getElementById('filter-artist-in-libary').style.backgroundColor = 'rgba(75, 73, 73, 0.992)';
		document.getElementById('filter-playlist-in-libary').style.backgroundColor = 'rgba(47, 46, 46, 0.992)';
		document.getElementById('filter-album-in-libary').style.backgroundColor = 'rgba(47, 46, 46, 0.992)';
		
		Array.from(document.getElementById('all-track-playList-artist-in-libary').children).forEach((element, index) => {
			if(index > 1){
				if(element.classList.contains('artist-in-libary')){
					element.style.display = 'flex';
					document.getElementById('filter-all').style.display = 'inline';
				}else{
					element.style.display = 'none';
				}
			}
		});
	});
	
	/*lọc album trong libary*/
	document.getElementById('filter-album-in-libary').addEventListener('click', function(){
		document.getElementById('filter-album-in-libary').style.backgroundColor = 'rgba(75, 73, 73, 0.992)';
		document.getElementById('filter-artist-in-libary').style.backgroundColor = 'rgba(47, 46, 46, 0.992)';
		document.getElementById('filter-playlist-in-libary').style.backgroundColor = 'rgba(47, 46, 46, 0.992)';
		
		
		Array.from(document.getElementById('all-track-playList-artist-in-libary').children).forEach((element, index) => {
			if(index > 1){
				if(element.classList.contains('album-in-libary')){
					element.style.display = 'flex';
					document.getElementById('filter-all').style.display = 'inline';
				}else{
					element.style.display = 'none';
				}
			}
		});
	});
	
	/*Tắt lọc*/
	document.getElementById('filter-all').addEventListener('click', function(){
		document.getElementById('filter-album-in-libary').style.backgroundColor = 'rgba(47, 46, 46, 0.992)';
		document.getElementById('filter-artist-in-libary').style.backgroundColor = 'rgba(47, 46, 46, 0.992)';
		document.getElementById('filter-playlist-in-libary').style.backgroundColor = 'rgba(47, 46, 46, 0.992)';
		
		Array.from(document.getElementById('all-track-playList-artist-in-libary').children).forEach((element, index) => {
			document.getElementById('filter-all').style.display = 'none';
			if(index > 1){
				element.style.display = 'flex';
			}
		});
	});
});