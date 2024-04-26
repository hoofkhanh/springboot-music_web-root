document.addEventListener('DOMContentLoaded', function() {

	let detailButton = document.getElementsByClassName('detailButton');
	Array.from(detailButton).forEach(element => {
		element.addEventListener('click', function(event) {
			event.preventDefault();
			let href = element.getAttribute('href');

			$.get(href, function(track) {
				$('#trackTitleDetail').val(track.trackTitle);
				$('#numberOfListensDetail').val(track.numberOfListens);
				$('#releaseDateDetail').val(track.releaseDate);
				$('#userDetail').val(track.user.artistName);
				$('#genreDetail').val(track.genre.id);
				
				let userList = '';
				Array.from(track.userList).forEach((user, index) => {
					userList += user.artistName;
					if(index != track.userList.length -1){
						userList += ', ';
					}
				});
				
				$('#cooperatorDetail').val(userList);
				
				if (track.private == true) {
					$('#isPrivateDetailYes').prop("checked", true);
					$('#isPrivateDetailNo').prop("checked", false);
				} else {	
					$('#isPrivateDetailNo').prop("checked", true);
					$('#isPrivateDetailYes').prop("checked", false);
				}
				
				let displayTimeOfTrack = document.getElementById('trackDurationDetail');
				let minuteOfStartDerution = Math.floor(track.trackDuration / 60);
			    let secondsOfStartDerution = Math.floor(track.trackDuration % 60);
			    if(secondsOfStartDerution >=0 && secondsOfStartDerution <10){
			       displayTimeOfTrack.value =  minuteOfStartDerution + ':0' + secondsOfStartDerution;
			    }else if (secondsOfStartDerution >=10 && secondsOfStartDerution <60){
			       displayTimeOfTrack.value =   minuteOfStartDerution + ':' + secondsOfStartDerution;
			    }
			});
		});	
	});

});