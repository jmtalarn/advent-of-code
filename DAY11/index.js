const fs = require("fs");
const path = require("path");

function getData(filename) {
	try {
		const data = fs.readFileSync(
			path.join(__dirname, `./${filename}.txt`),
			"UTF-8"
		);

		return data
			.split(/\r?\n/)
			.filter((x) => x)
			.map((row) => row.split(""));
	} catch (error) {
		console.error(error);
	}
}

function checkAdjacent(x, y, array) {
	const prevY = y - 1 >= 0 ? y - 1 : -1;
	const nextY = y + 1 < array.length ? y + 1 : -1;

	const prevX = x - 1 >= 0 ? x - 1 : -1;
	const nextX = x + 1 < array[y].length ? x + 1 : -1;
	const coordinatesAround = [
		[prevY, prevX],
		[prevY, x],
		[prevY, nextX],
		[y, prevX],
		[y, nextX],
		[nextY, prevX],
		[nextY, x],
		[nextY, nextX],
	].filter(([a, b]) => a !== -1 && b !== -1);
	let countOccupied = 0;
	for (let [row, col] of coordinatesAround) {
		countOccupied += array[row][col] === "#" ? 1 : 0;
	}
	return countOccupied;
}

const seats = getData("seats");
const test = getData("test");
const testfull = getData("testfull");

function cloneArray(array) {
	const result = [];
	for (let row = 0; row < array.length; row++) {
		result.push([...array[row]]);
	}
	return result;
}

function part1(inputData) {
	console.log("*****PART1*****");

	let loops = 0;
	let changes = true;
	while (changes) {
		changes = false;
		loops++;
		let data = cloneArray(inputData);
		for (let i = 0; i < data.length; i++) {
			for (let j = 0; j < data[0].length; j++) {
				const state = inputData[i][j];
				switch (state) {
					case "L":
						if (checkAdjacent(j, i, inputData) === 0) {
							data[i][j] = "#";
							changes = true;
						}

						break;
					case "#":
						if (checkAdjacent(j, i, inputData) >= 4) {
							data[i][j] = "L";
							changes = true;
						}

						break;
					default:
						break;
				}
			}
		}

		inputData = cloneArray(data);
	}

	const occupiedSeats = inputData
		.flat()
		.reduce((acc, curr) => (curr === "#" ? ++acc : acc), 0);

	console.log(
		`After ${loops} loops the people stopped moving and there are ${occupiedSeats} people seat.`
	);
}

part1(test);
part1(seats);

function checkAdjacentOnSight(x, y, array) {
	let pointY = 0;
	let pointX = 0;
	let count = 0;
	/* Check up */
	pointY = y;
	pointX = x;
	do {
		pointY--;
	} while (pointY >= 0 && array[pointY][pointX] === ".");
	if (pointY >= 0 && array[pointY][pointX] === "#") {
		count++;
	}
	/* Check up-right*/
	pointY = y;
	pointX = x;
	do {
		pointY--;
		pointX++;
	} while (
		pointY >= 0 &&
		pointX < array[0].length &&
		array[pointY][pointX] === "."
	);
	if (
		pointY >= 0 &&
		pointX < array[0].length &&
		array[pointY][pointX] === "#"
	) {
		count++;
	}
	/* Check right */
	pointY = y;
	pointX = x;
	do {
		pointX++;
	} while (pointX < array[0].length && array[pointY][pointX] === ".");
	if (pointX < array[0].length && array[pointY][pointX] === "#") {
		count++;
	}
	/* Check right down */
	pointY = y;
	pointX = x;
	do {
		pointY++;
		pointX++;
	} while (
		pointY < array.length &&
		pointX < array[0].length &&
		array[pointY][pointX] === "."
	);
	if (
		pointY < array.length &&
		pointX < array[0].length &&
		array[pointY][pointX] === "#"
	) {
		count++;
	}
	/* Check down */
	pointY = y;
	pointX = x;
	do {
		pointY++;
	} while (pointY < array.length && array[pointY][pointX] === ".");
	if (pointY < array.length && array[pointY][pointX] === "#") {
		count++;
	}
	/* Check down-left */
	pointY = y;
	pointX = x;
	do {
		pointY++;
		pointX--;
	} while (
		pointY < array.length &&
		pointX >= 0 &&
		array[pointY][pointX] === "."
	);
	if (pointY < array.length && pointX >= 0 && array[pointY][pointX] === "#") {
		count++;
	}
	/* Check left */
	pointY = y;
	pointX = x;
	do {
		pointX--;
	} while (pointX >= 0 && array[pointY][pointX] === ".");
	if (pointX >= 0 && array[pointY][pointX] === "#") {
		count++;
	}
	/* Check up left */
	pointY = y;
	pointX = x;
	do {
		pointY--;
		pointX--;
	} while (pointY >= 0 && pointX >= 0 && array[pointY][pointX] === ".");
	if (pointY >= 0 && pointX >= 0 && array[pointY][pointX] === "#") {
		count++;
	}
	return count;
}
function part2(inputData) {
	console.log("*****PART2*****");

	let loops = 0;
	let changes = true;
	while (changes) {
		changes = false;
		loops++;
		let data = cloneArray(inputData);
		for (let i = 0; i < data.length; i++) {
			for (let j = 0; j < data[0].length; j++) {
				const state = inputData[i][j];
				switch (state) {
					case "L":
						if (checkAdjacentOnSight(j, i, inputData) === 0) {
							data[i][j] = "#";
							changes = true;
						}

						break;
					case "#":
						if (checkAdjacentOnSight(j, i, inputData) >= 5) {
							data[i][j] = "L";
							changes = true;
						}

						break;
					default:
						break;
				}
			}
		}

		inputData = cloneArray(data);
	}

	const occupiedSeats = inputData
		.flat()
		.reduce((acc, curr) => (curr === "#" ? ++acc : acc), 0);

	console.log(
		`After ${loops} loops the people stopped moving and there are ${occupiedSeats} people seat.`
	);
}

part2(test);
part2(seats);
