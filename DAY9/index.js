const fs = require("fs");
const path = require("path");

function getData() {
	try {
		const data = fs.readFileSync(
			path.join(__dirname, "./data.txt"),
			"UTF-8"
		);

		return data
			.split(/\r?\n/)
			.filter((x) => x)
			.map((x) => parseInt(x));
	} catch (error) {
		console.error(error);
	}
}

function findSum(number, array) {
	for (let i = 0; i < array.length - 1; i++) {
		for (let j = 1; j < array.length; j++) {
			if (array[i] + array[j] === number) {
				return [array[i], array[j]];
			}
		}
	}
	return [-1, -1];
}

function part1() {
	const data = getData();
	for (let i = 25; i < data.length; i++) {
		const [a, b] = findSum(data[i], data.slice(0, i));
		if (a === -1) {
			console.log("El numero maldito", data[i]);
			return data[i];
		}
	}
}
const resultPart1 = part1();
console.log("PART1 XMAS invalid number", resultPart1);

function part2(part1result) {
	const data = getData();
	for (let i = 0; i < data.length; i++) {
		let sum = 0;

		let j = i;
		let min = data[i];
		let max = data[i];

		while (sum < part1result) {
			sum = sum + data[j];
			if (data[j] > max) {
				max = data[j];
			} else if (data[j] < min) {
				min = data[j];
			}
			j++;
		}
		if (sum === part1result) {
			return min + max;
		}
	}
}

const resultPart2 = part2(resultPart1);

console.log("PART2 XMAS weakness ", resultPart2);
