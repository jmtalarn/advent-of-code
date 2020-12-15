const fs = require("fs");
const path = require("path");

function getData(filename) {
	try {
		return fs
			.readFileSync(path.join(__dirname, `./${filename}.txt`), "UTF-8")
			.split(/\r?\n/)
			.filter((x) => x.length > 0);
	} catch (error) {
		console.error(error);
	}
}

function pushAndShift(temp, lastNumberSpoken, i) {
	if (!temp[lastNumberSpoken]) {
		temp[lastNumberSpoken] = [];
	} else if (temp[lastNumberSpoken].length > 1) {
		temp[lastNumberSpoken].shift();
	}
	temp[lastNumberSpoken].push(i);
	return temp;
}

function part1(input, turnToEnd) {
	const data = input.split(",");
	let lastNumberSpoken;
	const temp = data.reduce((acc, curr, index) => {
		acc[curr] = [index + 1];
		lastNumberSpoken = parseInt(curr);
		return acc;
	}, {});
	for (let i = data.length + 1; i <= turnToEnd; i++) {
		//console.log({ turn: i, lastNumberSpoken });
		if (temp[lastNumberSpoken].length === 1) {
			lastNumberSpoken = 0;
			pushAndShift(temp, lastNumberSpoken, i);
		} else if (temp[lastNumberSpoken].length === 2) {
			if (temp[lastNumberSpoken][0] + 1 === temp[lastNumberSpoken][1]) {
				lastNumberSpoken = 1;

				pushAndShift(temp, lastNumberSpoken, i);
			} else {
				lastNumberSpoken =
					temp[lastNumberSpoken][1] - temp[lastNumberSpoken][0];
				pushAndShift(temp, lastNumberSpoken, i);
			}
		}
		//console.log(temp);
	}
	console.log("PART1 ", turnToEnd, input, lastNumberSpoken);
}

part1("0,3,6", 10);
part1("0,3,6", 2020);
part1("1,3,2", 2020);
part1("2,1,3", 2020);
part1("2,3,1", 2020);
part1("3,2,1", 2020);
part1("3,1,2", 2020);

part1("0,13,16,17,1,10,6", 2020);

function part2(input, turnToEnd) {
	const data = input.split(",");
	let lastNumberSpoken;
	const temp = data.reduce((acc, curr, index) => {
		acc.set(parseInt(curr), index);
		lastNumberSpoken = parseInt(curr);
		return acc;
	}, new Map());
	for (let i = data.length - 1; i < turnToEnd - 1; i++) {
		let nextNumberSpoken = temp.has(lastNumberSpoken)
			? i - temp.get(lastNumberSpoken)
			: 0;

		temp.set(lastNumberSpoken, i);
		lastNumberSpoken = nextNumberSpoken;
	}

	console.log("PART2 ", turnToEnd, input, lastNumberSpoken);
}
part2("0,3,6", 30000000);
part2("1,3,2", 30000000);
part2("2,1,3", 30000000);
part2("2,3,1", 30000000);
part2("3,2,1", 30000000);
part2("3,1,2", 30000000);

part2("0,13,16,17,1,10,6", 30000000);
