const wiki = require('wikijs').default;

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
	resNode.innerHTML = '';
	
	Promise.all(
		arrUnique(results
							.filter(Boolean)
							.slice(0,5))
			.map(res => wiki().page(res))
			.map(pagePromise => pagePromise.then(pageData => pageData.content()))
			.map(contentPromise => {
				return contentPromise.then(content => {
					const firstPara = content.split('\n').slice(0,1).join(' ');
					const excerptStart = Math.ceil(Math.random() * firstPara.length);
					const excerptEnd = Math.max(
						Math.ceil(Math.random() * firstPara.length) +
							excerptStart, 30);
					const summary = firstPara
								.concat('...')
								.slice(excerptStart, excerptEnd)
								.concat('...');

					resNode.appendChild(fragmentFromString(`<p><em>${summary}</em></p>`));
					
					content
						.match(dateyRegex)
						.map(match => new Date(Date.parse(match)))
						.filter(date => date.toString() !== "Invalid Date")
						.slice(0,5)
						.map(formatDate)
						.forEach(pDate => {
							const el = fragmentFromString(`<li><p><strong>${pDate}</strong></p></li>`);
							resNode.appendChild(el);
							resNode.children[resNode.children.length - 1].secretDate = pDate;
						});
				});
			})
	).then(_ => Array
				 .from(resNode.children)
				 .forEach((node, ind) => {
					 if (node.nodeName === "LI") {
						 node.addEventListener(
							 'click',
							 () => selectDate(node.secretDate),
							 false);
					 }
				 })
				);
}

function arrUnique(arr) {
	return Array.from(new Set(arr));
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
