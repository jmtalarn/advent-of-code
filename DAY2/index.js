const fs = require("fs");
const path = require("path");
let countValidPasswordsPart1 = 0;
let countValidPasswordsPart2 = 0;
function validatePasswordPart1(password, character, min, max) {
	if (password.indexOf(character) === -1) {
		console.warn("No minimum security requirements");
		return false;
	} else {
		const occurrences = password
			.split("")
			.filter((letter) => letter === character).length;
		return occurrences >= parseInt(min) && occurrences <= parseInt(max);
	}
}
function validatePasswordPart2(password, character, pos1, pos2) {
	const letters = password.split("");

	const indx1 = parseInt(pos1) - 1;
	const indx2 = parseInt(pos2) - 1;

	return (
		(letters[indx1] === character && letters[indx2] !== character) ||
		(letters[indx1] !== character && letters[indx2] === character)
	);
}

try {
	const data = fs.readFileSync(path.join(__dirname, "./data.txt"), "UTF-8");

	const lines = data.split(/\r?\n/);

	lines.forEach((line, row) => {
		if (line) {
			const [[min, max], character, password] = line
				.split(" ")
				.map((item, index) => {
					switch (index) {
						case 0:
							return item.split("-");
						case 1:
							return item.replace(":", "");
						case 2:
							return item;
						default:
							console.error("Error parsing line");
					}
				});
			countValidPasswordsPart1 += validatePasswordPart1(
				password,
				character,
				min,
				max
			)
				? 1
				: 0;
			countValidPasswordsPart2 += validatePasswordPart2(
				password,
				character,
				min,
				max
			)
				? 1
				: 0;
		}
	});

	console.log({ countValidPasswordsPart1, countValidPasswordsPart2 });
} catch (err) {
	console.error(err);
}
