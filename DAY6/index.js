const fs = require("fs");
const path = require("path");

function part1() {
	const groups = [];
	try {
		const data = fs.readFileSync(
			path.join(__dirname, "./data.txt"),
			"UTF-8"
		);

		const lines = data.split(/\r?\n/);

		let group = { people: 0, questions: [] };
		lines.forEach((line, datarow) => {
			if (line) {
				const questions = line.split("");
				group.questions = Array.from(
					new Set([...questions, ...group.questions])
				);
				group.people++;
			} else {
				groups.push(group);
				group = { people: 0, questions: [] };
			}
		});
	} catch (error) {
		console.error("ERROR PROCESSING FILE");
	}
	return groups.reduce((acc, curr) => acc + curr.questions.length, 0);
}
console.log("PART1 the sum", part1());
function part2() {
	const groups = [];
	try {
		const data = fs.readFileSync(
			path.join(__dirname, "./data.txt"),
			"UTF-8"
		);

		const lines = data.split(/\r?\n/);

		let group = { people: 0, questions: new Map() };
		lines.forEach((line, datarow) => {
			if (line) {
				const questions = line.split("");
				for (question of questions) {
					group.questions.set(
						question,
						group.questions.has(question)
							? group.questions.get(question) + 1
							: 1
					);
				}

				group.people++;
			} else {
				groups.push(group);
				group = { people: 0, questions: new Map() };
			}
		});
	} catch (error) {
		console.error("ERROR PROCESSING FILE");
	}

	return groups.reduce((acc, curr) => {
		let calculation = 0;
		for (pair of curr.questions.entries()) {
			if (pair[1] === curr.people) {
				calculation++;
			}
		}

		return acc + calculation;
	}, 0);
}

console.log("PART2 the sum", part2());
