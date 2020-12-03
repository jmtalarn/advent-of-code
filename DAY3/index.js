const fs = require("fs");
const path = require("path");

function readMap() {
	const map = [];
	try {
		const data = fs.readFileSync(
			path.join(__dirname, "./map.txt"),
			"UTF-8"
		);

		const lines = data.split(/\r?\n/);

		lines.forEach((line, row) => {
			if (line) {
				map.push(line.split(""));
			}
		});
	} catch (err) {
		console.error("Something went wrong parsing the map", err);
	}
	return map;
}

function moveInMap(map, x, y, right, down) {
	const cols = map[0].length;
	const rows = map.length;
	const normalized = {
		x: x % cols,
		y: y,
		right: right % cols,
		down: down,
	};
	const newY = normalized.y + down;
	const newX = (normalized.x + right) % cols;

	return { x: newX, y: newY, tree: map[newY][newX] === "#" };
}
function isEndOfMap(map, x, y) {
	return y >= map.length;
}
function countTrees(aMap, right, down) {
	let trees = moveInMap(aMap, 0, 0, 0, 0).tree ? 1 : 0;

	let x = 0;
	let y = 0;

	while (!isEndOfMap(aMap, x, y + 1)) {
		const newPosition = moveInMap(aMap, x, y, right, down);

		x = newPosition.x;
		y = newPosition.y;
		trees += newPosition.tree ? 1 : 0;
	}
	return trees;
}
const aMap = readMap();
console.log(`PART1: I found ${countTrees(aMap, 3, 1)} trees`);

const case1 = countTrees(aMap, 1, 1);
const case2 = countTrees(aMap, 3, 1);
const case3 = countTrees(aMap, 5, 1);
const case4 = countTrees(aMap, 7, 1);
const case5 = countTrees(aMap, 1, 2);
console.log(
	`PART2:`,
	"counts",
	{ case1, case2, case3, case4, case5 },
	" multiplied",
	case1 * case2 * case3 * case4 * case5
);
