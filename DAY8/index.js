const fs = require("fs");
const path = require("path");

function part1() {
	let accumulator = 0;
	try {
		const data = fs.readFileSync(
			path.join(__dirname, "./code.txt"),
			"UTF-8"
		);

		const lines = data.split(/\r?\n/);

		const alreadyExecuted = [];

		let next = 0;

		while (alreadyExecuted.indexOf(next) === -1) {
			alreadyExecuted.push(next);
			const [instruction, variable] = lines[next].split(" ");
			switch (instruction) {
				case "acc":
					accumulator = accumulator + parseInt(variable);
					next++;
					break;
				case "jmp":
					next = next + parseInt(variable);

					break;
				case "nop":
					next++;
					break;
			}
		}
	} catch (error) {
		console.error("RUNTIME ERROR", error);
	}
	return accumulator;
}

console.log("PART1 accumulator", part1());

function part2(lines) {
	let accumulator = 0;
	const alreadyExecuted = [];
	let next = 0;
	do {
		if (next == lines.length) {
			return { itwasok: true, accumulator };
		}
		const [instruction, variable] = lines[next].split(" ");

		if (alreadyExecuted.includes(next)) {
			return { itwasok: false };
		}
		alreadyExecuted.push(next);

		switch (instruction) {
			case "nop":
				next++;
				break;
			case "acc":
				accumulator += parseInt(variable);
				next++;
				break;
			case "jmp":
				next += parseInt(variable);
				break;
			default:
				break;
		}
	} while (true);
}

function getLines() {
	const data = fs.readFileSync(path.join(__dirname, "./code.txt"), "UTF-8");

	return data.split(/\r?\n/).filter((x) => x);
}
const codelines = getLines();

for (let i = 0; i < codelines.length; i++) {
	const newLines = [...codelines];
	const op = newLines[i].split(" ")[0];

	if (op === "jmp") {
		newLines[i] = newLines[i].replace("jmp", "nop");
	} else if (op === "nop") {
		newLines[i] = newLines[i].replace("nop", "jmp");
	}

	response = part2(newLines);

	if (response.itwasok) {
		console.log("PART2", response);
		break;
	}
}
