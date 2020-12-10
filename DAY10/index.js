const fs = require("fs");
const path = require("path");

function getData() {
	try {
		const data = fs.readFileSync(
			path.join(__dirname, "./jolts.txt"),
			"UTF-8"
		);

		return data
			.split(/\r?\n/)
			.filter((x) => x)
			.map((x) => parseInt(x))
			.sort((a, b) => a - b);
	} catch (error) {
		console.error(error);
	}
}

const fileData = getData();

function getGap(a, b) {
	return b - a;
}
function validGap(a, b) {
	const gap = getGap(a, b);
	return gap > 0 && gap <= 3;
}
function part1(data) {
	let gapsOfOne = 0;
	let gapsOfThree = 0;

	const firstGap = getGap(0, data[0]);

	if (firstGap === 1) {
		gapsOfOne++;
	} else if (firstGap === 3) {
		gapsOfThree++;
	}

	for (let i = 0; i < data.length - 1; i++) {
		let gap = getGap(data[i], data[i + 1]);

		if (gap === 1) {
			gapsOfOne++;
		} else if (gap === 3) {
			gapsOfThree++;
		}
	}
	gapsOfThree++; //Built-in adapter

	console.log("PART1", { gapsOfOne, gapsOfThree }, gapsOfOne * gapsOfThree);
}

function part2(dataInput) {
	let data = [0, ...dataInput, dataInput[dataInput.length - 1] + 3];

	const gaps = [];
	for (let i = 0; i < data.length - 1; i++) {
		gaps.push(getGap(data[i], data[i + 1]));
	}
	//CREDITS https://www.reddit.com/r/PowerShell/comments/kaa05c/advent_of_code_2020_day_10/gf9cyi3?utm_source=share&utm_medium=web2x&context=3

	const magic = gaps
		.join("")
		.split("3")
		.filter((x) => x)
		.map((x) => x.length)
		.filter((x) => x > 1)
		.map((x) => {
			//Number of possible variations if there are 4 numbers separated by 1, or 3 gaps of 1
			if (x === 3) {
				return 4;
			}
			//Number of possible variations if there are 5 numbers separated by 1, or 4 gaps of 1
			if (x === 4) {
				return 7;
			}
			//Number of possible variations if there are 3 numbers separated by 1, or 2 gaps of 1
			if (x === 2) {
				return 2;
			}
		})
		.reduce((acc, curr) => {
			acc[curr] = acc[curr] ? acc[curr] + 1 : 1;
			return acc;
		}, {});
	let possiblePaths = 1;
	let formula = "1";

	for (key of Object.keys(magic)) {
		possiblePaths = possiblePaths * Math.pow(parseInt(key), magic[key]);
		formula += `*${parseInt(key)}^${magic[key]}`;
	}

	console.log("PART2", possiblePaths, formula);
}

part1(fileData);
part1([1, 4, 5, 6, 7, 10, 11, 12, 15, 16, 19]);

part2([
	1,
	2,
	3,
	4,
	7,
	8,
	9,
	10,
	11,
	14,
	17,
	18,
	19,
	20,
	23,
	24,
	25,
	28,
	31,
	32,
	33,
	34,
	35,
	38,
	39,
	42,
	45,
	46,
	47,
	48,
	49,
]);
part2([1, 4, 5, 6, 7, 10, 11, 12, 15, 16, 19]);
part2(fileData);
