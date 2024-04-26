document.addEventListener('DOMContentLoaded', async function() {

	let allCheckboxs = document.querySelectorAll('.checkbox');
	Array.from(allCheckboxs).forEach(element => {
		element.addEventListener('change', function() {		
			let allTrackHaveCheckedInCheckbox = document.getElementById('allTrackHaveCheckedInCheckbox');
			let idOfTrack = element.parentNode.querySelector('.hiddenIdOfTrack').value; 
			if(element.checked == true){
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
	});
	

	let inputHiddenOfAllCheckboxes = document.getElementById('allTrackHaveCheckedInCheckbox');
	if(inputHiddenOfAllCheckboxes.value != ''){
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
				let myTable = document.getElementById('dataTable').querySelector('tbody');
				let rows = myTable.getElementsByTagName('tr');
				myTable.insertBefore(rowInTable[i], rows[0]);
			}
		}
	}
	
	
	
	
	
	let imageOfPlaylistFile = document.getElementById('imageOfPlaylistFile');
	imageOfPlaylistFile.addEventListener('change', function(){	
		if (imageOfPlaylistFile.files && imageOfPlaylistFile.files[0]) {
		    let reader = new FileReader();
		    reader.onload = function (e) {
		      $('#imageOfPlaylistDisplay')
		        .attr('src', e.target.result)
		        .width(100)
		        .height(100);
		    };
		    reader.readAsDataURL(imageOfPlaylistFile.files[0]);
		  }
	});
	

});