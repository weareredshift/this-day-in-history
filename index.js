const wiki = require('wikijs').default;
const chrono = require('chrono-node');

const dateyRegex = /\d{4}|\d{2}|\d{1}|(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)/g;

/* functions */
function sendQuery() {
	const query = document.getElementById('query');
	if (query.value.length > 0) {
		const resNode = document.getElementById('search-results');
		resNode.innerHTML = "Loading...";
		wiki().search(query.value)
			.then(data => populateResults(data.results));
	}
}

function populateResults(results) {
	const resNode = document.getElementById('search-results');
	const parsedDates = [];
	resNode.innerHTML = '';
	
	Promise.all(
		results
			.filter(Boolean)
			.map(res => wiki().page(res))
			.map(pagePromise => pagePromise.then(pageData => pageData.content()))
			.map(contentPromise => {
				return contentPromise.then(content => {
					content
						.match(dateyRegex)
						.map(match => new Date(Date.parse(match)))
						.filter(date => date.toString() !== "Invalid Date")
						.map(formatDate)
						.map(pDate => {
							parsedDates.push(pDate);
							const el = fragmentFromString(`<li>${pDate}</li>`);
							return el;
						})
						.forEach(frag => resNode.appendChild(frag));
				});
			})
	).then(_ => Array
				 .from(resNode.children)
				 .forEach((node, ind) =>
									node.addEventListener(
										'click',
										() => selectDate(parsedDates[ind].toString()),
										false))
				);
}

function formatDate(date) {
	return `${date.getFullYear()}/${Math.ceil(Math.random() * 12)}/${Math.ceil(Math.random() * 31)}`;
}

function makeDateFromChunks(chunks) {
	const dates = [];
	chunks.reduce((almostDate, chunk) => {
		
	});

	return dates;
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
