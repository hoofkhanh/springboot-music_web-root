document.addEventListener('DOMContentLoaded', function(){

	async function getAllTrackListFromPlaylist(id){
		const response = await fetch('/admin/masterPlaylists/findAllTrackListOfPlaylist?id='+id);
	    const json = await response.json();
	    return json;

	}
	
	let detailButtons = document.getElementsByClassName('detailButton');
	Array.from(detailButtons).forEach(element => {
		element.addEventListener('click', function(event){
			event.preventDefault();
			let href = event.target.getAttribute('href');
			$.get(href, async function(masterPlaylist){
				document.getElementById('masterPlaylistTitleDetail').value = masterPlaylist.titleOfMasterPlaylist;
				
				let playlistList =  await getAllTrackListFromPlaylist(masterPlaylist.id);
				let masterPlaylistListDetail =  document.getElementById('masterPlaylistListDetail');
				masterPlaylistListDetail.value = '';
				Array.from(playlistList).forEach(element => {
					masterPlaylistListDetail.value += element.playlistTitle + ", ";
				});
				masterPlaylistListDetail.value  = masterPlaylistListDetail.value.trim();
				if(masterPlaylistListDetail.value.endsWith(',')){
					masterPlaylistListDetail.value = masterPlaylistListDetail.value.slice(0 ,-1);
				}
			});
		});
	});
	

});