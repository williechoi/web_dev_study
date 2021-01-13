const foodList = document.querySelector('#food-list');
const form = document.querySelector('#add-calorie-form');

// create element and render cafe 
function renderCalorieTable(doc) {
	let li = document.createElement('li');
	let name = document.createElement('span');
	let calorie = document.createElement('span');
	let closeBtn = document.createElement('div');

	li.setAttribute('data-id', doc.id);
	name.textContent = doc.data().name;
	calorie.textContent = doc.data().calorie;
	closeBtn.textContent = 'x';

	li.appendChild(name);
	li.appendChild(calorie);
	li.appendChild(closeBtn);

	foodList.appendChild(li);

	closeBtn.addEventListener('click', (e)=>{
		e.stopPropagation();
		let docId = e.target.parentElement.getAttribute('data-id');
		db.collection('Foods').doc(docId).delete();
	});
}

// getting data
// db.collection('Foods').orderBy('name').get().then(snapshot => {
// 	snapshot.docs.forEach(doc=>{
// 		renderCalorieTable(doc);
// 	});
// });

// saving data
form.addEventListener('submit', (e) => {
	e.preventDefault();
	db.collection('Foods').add({
		name: form.name.value,
		calorie: form.calorie.value
	});
	form.name.value = '';
	form.calorie.value = '';
});

// real-time listener
db.collection('Foods').orderBy('name').onSnapshot(snapshot=>{
	let changes = snapshot.docChanges();
	changes.forEach(change=>{
		if(change.type == 'added'){
			renderCalorieTable(change.doc);
		} else if (change.type == 'removed'){
			let li = foodList.querySelector('[data-id="' + change.doc.id + '"]');
			foodList.removeChild(li);
		}
		console.log(change.doc.data());
	})
})