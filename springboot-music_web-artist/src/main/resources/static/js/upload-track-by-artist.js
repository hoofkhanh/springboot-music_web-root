document.addEventListener('DOMContentLoaded', function(){
	
	var checkEvent = '';
	
	// bấm vào nút đăng bài nhạc (upload)
  let aTagUploadTrack = document.getElementById('a-upload-track');
  aTagUploadTrack.addEventListener('click', function(){
	  document.getElementById('upload-track-by-artist').style.display = 'block';
	  document.getElementById('page-of-track').style.display = 'none';
      document.getElementById('page-of-artist').style.display = 'none';
      document.getElementById('page-of-play-list').style.display = 'none';
      document.getElementById('index').style.display = 'none';
      document.getElementById('display-all-track').style.display = 'none';  
      document.getElementById('upload-playlist-by-artist').style.display = 'none'; 
      document.getElementById('page-of-search').style.display = 'none';
      document.getElementById('page-of-lyrics').style.display = 'none';
      
      document.getElementById("upload-track-form").reset();
	  document.getElementById("imageOfTrack").src = ''; 
	  
	  document.getElementById('reset-submit-form-upload').click();   
	  
	  /*in ra các nggười đang follow qua lại vs bạn*/
	  fetch('/artist/artists/findCooperatorArtist')
	  	.then(response => response.json())
	  	.then(artists => {
			 let dataList = document.getElementById("userList-dataList");
			 dataList.innerHTML = ''
			 Array.from(artists).forEach(artist => {
				 let option = document.createElement("option");
			     option.text = artist.artistName;
			     option.value = artist.email;
			     dataList.appendChild(option);
			 }) ;
		  });
	     
      /*kiểm tra đăng thành công không*/
		let iframeWhenAddTrack = document.getElementById('iframeAddTrack');
		if(checkEvent == ''){
			iframeWhenAddTrack.addEventListener('load', function(){
				if(iframeWhenAddTrack.contentWindow.document.body.textContent == "Thành công"){
					alert("Đăng thành công");
					document.getElementById("upload-track-form").reset();
					document.getElementById("imageOfTrack").src = '';
					document.getElementById('id-in-upload-track-form').value = '';
					
					getAllTrackLibary();
				}else{
					alert("Đăng thất bại do trùng tên");
				}	       
			});
		}
		
		if(checkEvent == ''){
			let file = document.getElementById('fileOfTrackInTrack');
			file.addEventListener('change', function(){				
				if(file.files.length >0){
					startTask();
					// Step 1: We need AudioContext instance to decode audio files.
					let context = new AudioContext();
					
					// Step 2: Download a .mp3 file using AJAX
					let request = new XMLHttpRequest();
					request.addEventListener('load', fileLoaded);
					request.open('GET', URL.createObjectURL(file.files[0]));
					request.responseType = 'arraybuffer';
					request.send();
					
					// Step 3: File downloaded, need to be decoded now.
					function fileLoaded() {
					     if (request.status < 400)
					        context.decodeAudioData(request.response, fileDecoded);
					}
					
					// Step 4: File decoded, we can get the duration.
					function fileDecoded(audioBuffer) {	
						document.getElementById('track-duration-in-upload-track').value = audioBuffer.duration;  
					}
				}
				
			});
		}
		
		
		/*khi post tệp lên input file thì change image*/
		if(checkEvent == ''){
			let imageFileOfTrack = document.getElementById('imageFileOfTrack');
			imageFileOfTrack.addEventListener('change', function(){	
				if (imageFileOfTrack.files && imageFileOfTrack.files[0]) {
				    let reader = new FileReader();
				    reader.onload = function (e) {
				      $('#imageOfTrack')
				        .attr('src', e.target.result)
				        .width(100)
				        .height(100)
				    };
				    reader.readAsDataURL(imageFileOfTrack.files[0]);
				  }
			});
		}
		
		
		/*click vào Hủy (reset)*/
		if(checkEvent == ''){
			document.getElementById('reset-submit-form-upload').addEventListener('click', function(){
				document.getElementById('imageOfTrack').src = '';
				document.getElementById('id-in-upload-track-form').value = '';
			})
		}
		
			
		/*click vào chỉnh sửa*/
		if(checkEvent == ''){
			let editText = document.getElementById('edit-text-in-upload-track-by-artist');
			editText.addEventListener('click', function(){
				let foo = prompt("Điền vào tên bài hát nào bạn muốn sửa \n(Vui lòng không đặt tên có chữ '&', nếu bạn muốn giữ hình ảnh và file mp3 như cũ vui lòng không thay đổi nó khi chỉnh sửa)");		
				const url = '/artist/tracks/findByTrackTitle?trackTitle=' + foo;
				fetch(url)
					.then(response => response.text())
					.then(track => {
						if(track != null && track != ''){
							track = JSON.parse(track);
							document.getElementById('id-in-upload-track-form').value = track.id;
							document.getElementById('imageOfTrack').src =  'data:image/jpeg;base64,' + track.image;
							document.getElementById('trackTitleInForm').value =  track.trackTitle;
							document.getElementById('genreInForm').value =  track.genre.id;
							document.getElementById('track-duration-in-upload-track').value =  track.trackDuration;
							document.getElementById('lyrics').value =  track.lyrics;
							
							let userList = '';
							for(let i=0; i< track.userList.length ; i++){
								userList += track.userList[i].email;
								if(i != track.userList.length -1){
									userList += ', ';	
								}
							}
							document.getElementById('userListInForm').value =  userList;
							
							if(track.private == true){
								document.getElementById('havePrivateYes').checked =  true;
							}else{
								document.getElementById('havePrivateNo').checked =  true;
							}
						}else{
							if(foo != null){
								alert('Không có tên : '+ foo);
							}
						}
					})
					.catch(error  => console.error(error));
			});
		}
		
		
		/*Click vào xóa bài nhạc*/
		if(checkEvent == ''){
			let deleteText = document.getElementById('delete-text-in-upload-track-by-artist');
			deleteText.addEventListener('click', function(){
				let foo = prompt("Nhập tên bài hát bạn muốn xóa");
				const url = '/artist/tracks/deleteByTrackTitle?trackTitle=' + foo;
				if(foo != null ){
					fetch(url)
					.then(response => response.text())
					.then(text => {
						if(text.includes('Xóa thành công')){
							getAllTrackLibary();
						}
						
						document.getElementById("upload-track-form").reset();
						document.getElementById("imageOfTrack").src = '';
						document.getElementById('id-in-upload-track-form').value = '';
						alert(text);
					})
					.catch(error  => console.error(error));
				}
			});
		}
		
		checkEvent = 'khong cho vao nua';
		
  });
  
  	function startTask() {
	    // Hiển thị spinner khi bắt đầu tác vụ
	    showSpinner();
	
	    // Giả định là một tác vụ bất đồng bộ (ví dụ: setTimeout để giả lập)
	    setTimeout(function() {
	        // Kết thúc tác vụ, ẩn spinner
	        hideSpinner();
	    }, 2000); // Giả định thời gian tác vụ là 2 giây
	}

    function showSpinner() {
        var spinnerContainer = document.querySelector('.spinner-container');
        spinnerContainer.style.display = 'block';
    }

    function hideSpinner() {
        var spinnerContainer = document.querySelector('.spinner-container');
        spinnerContainer.style.display = 'none';
    }
	
	
});	