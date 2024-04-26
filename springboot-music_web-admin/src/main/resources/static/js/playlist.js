document.addEventListener('DOMContentLoaded', function(){
	
	async function getAllTrackListFromPlaylist(id){
		const response = await fetch('/admin/playlists/findAllTrackListOfPlaylist?id='+id);
	    const json = await response.json();
	    return json;

	}
	
	let detailButtons = document.getElementsByClassName('detailButton');
	Array.from(detailButtons).forEach(element => {
		element.addEventListener('click', function(event){
			event.preventDefault();
			let href = event.target.getAttribute('href');
			$.get(href, async function(playlist){
				document.getElementById('playlistTitleDetail').value = playlist.playlistTitle;
				
				if(playlist.private == true){
					document.getElementById('isPrivateYesDetail').checked = true;
					document.getElementById('isPrivateNoDetail').checked = false;
				}else{
					document.getElementById('isPrivateNoDetail').checked = true;
					document.getElementById('isPrivateYesDetail').checked = false;
				}
				
				let trackList = await getAllTrackListFromPlaylist(playlist.id);
				let trackListDetail =  document.getElementById('trackListDetail');
				trackListDetail.value = '';
				Array.from(trackList).forEach(element => {
					trackListDetail.value += element.trackTitle + ", ";
				});
				trackListDetail.value  = trackListDetail.value.trim();
				if(trackListDetail.value.endsWith(',')){
					trackListDetail.value = trackListDetail.value.slice(0 ,-1);
				}
			});
		});
	});
	

});