const wiki = require('wikijs').default;
const chrono = require('chrono-node');

const dateyRegex = /\d{4}|\d{2}|\d{1}|(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)/g;

/* functions */
function sendQuery() {
	const query = document.getElementById('query');
	if (query.value.length > 0) {	
		wiki().search(query.value)
			.then(data => populateResults(data.results));
	}
}

function populateResults(results) {
	const resNode = document.getElementById('search-results');
	const parsedDates = [];
	results
		.filter(Boolean)
		.map(res => dateyRegex.exec(res))
		.filter(Boolean)
		.map(regexRes => regexRes[0])
		.map(chrono.parseDate)
		.filter(Boolean)
		.map(pDate => {
			parsedDates.push(pDate);
			const el = fragmentFromString(`<li>${pDate}</li>`);
			return el;
		})
		.forEach(frag => resNode.appendChild(frag));

	Array.from(resNode.children)
		.forEach((node, ind) =>
						 node.addEventListener(
							 'click',
							 () => selectDate(parsedDates[ind].toString()),
							 false));
}

function selectDate(dateText) {
	const dateOutput = document.getElementById('selected-date');
	dateOutput.innerHTML = dateText;
}

// https://stackoverflow.com/a/42511421/2023432
function fragmentFromString(strHTML) {
  return document.createRange().createContextualFragment(strHTML);
}

/* init */
const queryButton = document.getElementById('query-button');
queryButton.onclick = sendQuery;
