document.addEventListener('DOMContentLoaded', function(){
	
  var checkEvent = ''	;
	
/*get dữ liệu track*/
	 async function getTrackData(name){
		url = '/artist/' + name;
		 await fetch(url)
	        .then(response => response.json())
	        .then(tracks => {
				let trackParentDiv = document.getElementById("tr-in-table");
				let childElements = trackParentDiv.children;
				
				let lengthOfAllDivChildInDisplayAllTrack = document.getElementById('table').querySelector('tbody').children.length;
				if(lengthOfAllDivChildInDisplayAllTrack != null){
					
					if(lengthOfAllDivChildInDisplayAllTrack != 2){
						let allTrack = document.getElementById('table').querySelector('tbody');
						 for (let i = lengthOfAllDivChildInDisplayAllTrack - 1; i > 1; i--) {
					        allTrack.removeChild(allTrack.children[i]);
					    }
					}	
					
					Array.from(tracks).forEach(track => {
						if(track.private == false){
							let newTrackParentDiv = document.createElement("tr");
						
							for(let i=0; i<= childElements.length-1 ; i++){
								if(i == 0){
									let imageOfTrack = document.createElement("td");
									imageOfTrack.classList.add('td-image');
									imageOfTrack.innerHTML = document.getElementById('id-td-image').innerHTML;
									imageOfTrack.querySelector('img').src = 'data:image/jpeg;base64,' + track.image;
									newTrackParentDiv.appendChild(imageOfTrack)
								}else if(i == 1){
									let trackTitle = document.createElement("td");
									trackTitle.textContent = track.trackTitle;
									newTrackParentDiv.appendChild(trackTitle)
								}else if(i ==2){
									let genre = document.createElement("td");
									genre.textContent = track.genre.name;
									newTrackParentDiv.appendChild(genre)
								}else if(i ==3){
									let user = document.createElement("td");
									user.textContent = track.user.artistName;
									newTrackParentDiv.appendChild(user)
								}else if(i ==4){
									let cooperator = document.createElement("td");
									if(track.userList.length !=0){									
										for(let i=0; i<= track.userList.length -1; i++){
											let aTagNameOfCooperatorArtist =  document.createElement("a");
												aTagNameOfCooperatorArtist.classList.add('artist');
												aTagNameOfCooperatorArtist.setAttribute('href', '#');
												aTagNameOfCooperatorArtist.innerHTML = track.userList[i].artistName;
												cooperator.appendChild(aTagNameOfCooperatorArtist);
											if(i != track.userList.length -1 ){
												aTagNameOfCooperatorArtist.insertAdjacentHTML('afterend', ',  ');
											}		
										}
									}
									
									newTrackParentDiv.appendChild(cooperator)
								}else {
									let hiddenOfTrack = document.createElement("td");
									hiddenOfTrack.innerHTML = childElements[i].innerHTML;
									hiddenOfTrack.querySelector('.hiddenIdOfTrack').value = track.id;
									newTrackParentDiv.appendChild(hiddenOfTrack);
									getTrackIdWhenClickCheckbox(newTrackParentDiv.querySelector('.checkbox'));
	
								}
							}
							document.getElementById('table').querySelector('tbody').appendChild(newTrackParentDiv);
						}
						

					});
				}
	    	})
	    	.catch(error => console.error('Error fetching artists:', error));
	}
	
	/*xử lý chỗ checkbox và gắn id vào input type hidden*/
	function getTrackIdWhenClickCheckbox (checkbox){
		checkbox.addEventListener('change', function() {
			let allTrackHaveCheckedInCheckbox = document.getElementById('allTrackHaveCheckedInCheckbox');
			let idOfTrack = checkbox.parentNode.querySelector('.hiddenIdOfTrack').value; 
			if(checkbox.checked == true){
				if(allTrackHaveCheckedInCheckbox.value == ''){
					allTrackHaveCheckedInCheckbox.value += idOfTrack;
				}else{
					allTrackHaveCheckedInCheckbox.value += ' ' + idOfTrack;
				}
				
			}else{
				/* nếu số 1 thì nó sẽ tím số 1 và replace chứ không phải thây số 1 trong 10 thì cũng replace*/
				let regex = new RegExp('\\b' + idOfTrack + '\\b', 'g'); 
				allTrackHaveCheckedInCheckbox.value = allTrackHaveCheckedInCheckbox.value.replace(regex, '');
			}
			
			allTrackHaveCheckedInCheckbox.value = allTrackHaveCheckedInCheckbox.value.trim();
			/*bỏ khoảng trống dư thừa giữa 2 chữ*/
			allTrackHaveCheckedInCheckbox.value = allTrackHaveCheckedInCheckbox.value.replace(/\s+/g, ' ');
		});
	}
	
	async function getAllTrackListFromPlaylist(id){
		const response = await fetch('/artist/playlists/findAllTrackListOfPlaylist?id='+id);
	    const json = await response.json();
	    return json;

	}
	
  // bấm vào nút đăng bài playlist (upload)

  let aTagUploadPlaylist = document.getElementById('a-upload-playlist');
  aTagUploadPlaylist.addEventListener('click', function(){
	  document.getElementById('upload-playlist-by-artist').style.display = 'block';
	  document.getElementById('upload-track-by-artist').style.display = 'none';
	  document.getElementById('page-of-track').style.display = 'none';
      document.getElementById('page-of-artist').style.display = 'none';
      document.getElementById('page-of-play-list').style.display = 'none';
      document.getElementById('index').style.display = 'none';
      document.getElementById('display-all-track').style.display = 'none';  
      document.getElementById('page-of-search').style.display = 'none';
      
      document.getElementById('reset-submit-form-upload-playlist').click();
      
    /*khi post tệp lên input file thì change image*/
    if(checkEvent == ''){
		let imageFileOfPlaylist = document.getElementById('imageFileOfPlaylist');
		imageFileOfPlaylist.addEventListener('change', function(){	
			if (imageFileOfPlaylist.files && imageFileOfPlaylist.files[0]) {
			    let reader = new FileReader();
			    reader.onload = function (e) {
			      $('#imageOfPlaylist')
			        .attr('src', e.target.result)
			        .width(100)
			        .height(100)
			    };
			    reader.readAsDataURL(imageFileOfPlaylist.files[0]);
			  }
		});
	}
	
	
	async function tickTheCheckbox(playlist){
		let trackList = '';
		Array.from(await getAllTrackListFromPlaylist(playlist.id)).forEach(track => {
			trackList += track.id + ' ';
		});
		trackList = trackList.trim();
		
			
		let inputHiddenOfAllCheckboxes = document.getElementById('allTrackHaveCheckedInCheckbox');
		inputHiddenOfAllCheckboxes.value = trackList;
		let arrayCheckBoxAfterAdd = inputHiddenOfAllCheckboxes.value.split(' ');
		let rowInTable = [];
		Array.from(arrayCheckBoxAfterAdd).forEach(checkbox => {
			let idOfTrack = document.getElementsByClassName('hiddenIdOfTrack');
			Array.from(idOfTrack).forEach(element => {
				if(element.value == checkbox){
					element.parentNode.querySelector('.checkbox').checked = true;
					
					rowInTable.push(element.parentNode.parentNode);
				}
			});
		});
		
		if(rowInTable.length > 0){
			for(let i = rowInTable.length-1; i>=0; i--){
				let myTable = document.getElementById('table').querySelector('tbody');
				let rows = myTable.getElementsByTagName('tr');
				myTable.insertBefore(rowInTable[i], rows[2]);
			}
		}
	}
	
	/*display track trong thêm album*/ 
	if(checkEvent == ''){
		let isAlbum = document.getElementById('isAlbumInPlaylist');
		isAlbum.addEventListener('change', async function(){
			await getTrackData('tracks');
			document.getElementById('allTrackHaveCheckedInCheckbox').value = '';
			
			let idOfPlaylist = document.getElementById('id-in-upload-playlist-form');
			if(idOfPlaylist.value != 0 && idOfPlaylist.value != null){
				fetch('/artist/playlists/findById?id='+idOfPlaylist.value)
					.then(response => response.json())
					.then(playlist => {
						if(playlist.album){
							tickTheCheckbox(playlist);
						}
					});
			}
		});
	}
	
	
	if(checkEvent == ''){
		let isPlaylist = document.getElementById('isPlaylistInPlaylist');
		isPlaylist.addEventListener('change',async function(){
			await getTrackData('tracks/allTrack');
			document.getElementById('allTrackHaveCheckedInCheckbox').value = '';
			
			let idOfPlaylist = document.getElementById('id-in-upload-playlist-form');
			if(idOfPlaylist.value != 0 && idOfPlaylist.value != null){
				fetch('/artist/playlists/findById?id='+idOfPlaylist.value)
					.then(response => response.json())
					.then(playlist => {
						if(!playlist.album){
							tickTheCheckbox(playlist);
						}
					});
			}
		});
	}
	
	let isAlbum = document.getElementById('isAlbumInPlaylist');
	if(isAlbum.checked == true){
		 getTrackData('tracks');
	}
	
	/*tìm kiếm*/
	if(checkEvent == ''){
		let inputSearch = document.getElementById('searchTrackInUploadPageOfPlaylist');
		inputSearch.addEventListener('input', function(){
			let valueOfInput = inputSearch.value.toLowerCase();
			
			let table = document.getElementById('table').querySelector('tbody');
			for(let i=2; i< table.children.length -1; i++){
				let check = false;
				
				let tr = table.children[i];
				for(let i=1; i<= tr.children.length -1; i++){
					let value = tr.children[i].textContent.toLowerCase();
					if(value.includes(valueOfInput) ){
						check = true;
					}
				}
				
				if(check== false){
					table.children[i].style.display='none';
				}else{
					table.children[i].style.display='table-row';
				}
			}
		});
	}
	
	
	/*click vào Hủy (reset)*/
	if(checkEvent == ''){
		document.getElementById('reset-submit-form-upload-playlist').addEventListener('click', function(){
			document.getElementById("upload-playlist-form").reset();
			document.getElementById("imageOfPlaylist").src = '';
			document.getElementById("allTrackHaveCheckedInCheckbox").value = ''
			document.getElementById("id-in-upload-playlist-form").value = ''
		});
	}
	
	
	if(checkEvent == ''){
		let iframeAddPlaylist = document.getElementById('iframeAddPlaylist');
		iframeAddPlaylist.addEventListener('load', function(){
			if(iframeAddPlaylist.contentWindow.document.body.textContent == "Thành công"){
				alert("Đăng thành công");
				document.getElementById("upload-playlist-form").reset();
				document.getElementById("imageOfPlaylist").src = '';
				document.getElementById("allTrackHaveCheckedInCheckbox").value = ''
				document.getElementById("id-in-upload-playlist-form").value = ''
				
				getAllTrackLibary();
			}else{
				alert("Đăng thất bại do trùng tên hoặc là bạn không thêm bài hát nào vào");
			}	       
		});
	}
	
	
	/*click vào chỉnh sửa*/
	if(checkEvent == ''){
		let editText = document.getElementById('edit-text-in-upload-playlist-by-artist');
		editText.addEventListener('click', function(){
			let foo = prompt("Điền vào tên bài hát nào bạn muốn sửa \n(Vui lòng không đặt tên có chữ '&', nếu bạn muốn giữ hình ảnh và file mp3 như cũ vui lòng không thay đổi nó khi chỉnh sửa)");		
			const url = '/artist/playlists/findByPlaylistTitle?playlistTitle=' + foo;
			fetch(url)
				.then(response => response.text())
				.then(async playlist => {
					if(playlist != null && playlist != ''){
						playlist = JSON.parse(playlist);
						document.getElementById('id-in-upload-playlist-form').value = playlist.id;
						document.getElementById('imageOfPlaylist').src =  'data:image/jpeg;base64,' + playlist.image;
						document.getElementById('playlistTitleInForm').value =  playlist.playlistTitle;
						
						if(playlist.album){
							document.getElementById('isAlbumInPlaylist').checked =  true;
							await getTrackData('tracks');
						}else{
							document.getElementById('isPlaylistInPlaylist').checked =  true;
							await getTrackData('tracks/allTrack');
						}
						
						if(playlist.private == true){
							document.getElementById('havePrivateYesInPlaylist').checked =  true;
						}else{
							document.getElementById('havePrivateNoInPlaylist').checked =  true;
						}
												
						tickTheCheckbox(playlist);
						
					}else{
						if(foo != null){
							alert('Không có tên: '+ foo);
						}
					}
				})
				.catch(error  => console.error(error));
		});
	}
	
	
	/*Click vào xóa bài nhạc*/
	if(checkEvent == ''){
		let deleteText = document.getElementById('delete-text-in-upload-playlist-by-artist');
		deleteText.addEventListener('click', function(){
			let foo = prompt("Nhập tên bài hát bạn muốn xóa");
			const url = '/artist/playlists/deleteByPlaylistTitle?playlistTitle=' + foo;
			if(foo != null){
				fetch(url)
				.then(response => response.text())
				.then(text => {
					if(text.includes('Xóa thành công')){
						getAllTrackLibary();
					}
					
					alert(text);
					document.getElementById("upload-playlist-form").reset();
					document.getElementById("imageOfPlaylist").src = '';
					document.getElementById("allTrackHaveCheckedInCheckbox").value = ''
					document.getElementById("id-in-upload-playlist-form").value = ''
				})
				.catch(error  => console.error(error));
			}
		});
	}
	
	checkEvent = 'khong vao nua';
  });
	
	
});