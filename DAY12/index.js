const fs = require("fs");
const path = require("path");

function getData(filename) {
	try {
		const data = fs.readFileSync(
			path.join(__dirname, `./${filename}.txt`),
			"UTF-8"
		);

		return data.split(/\r?\n/).filter((x) => x);
	} catch (error) {
		console.error(error);
	}
}

const test = getData("test");

function moveIt(position, instruction, value) {
	switch (instruction) {
		case "N":
			position.north += parseInt(value);
			break;
		case "S":
			position.north -= parseInt(value);
			break;
		case "W":
			position.east -= parseInt(value);
			break;
		case "E":
			position.east += parseInt(value);
			break;
		default:
			break;
	}
	return position;
}
function rotate(position, instruction, value) {
	const { direction: currentDirection, north, east } = position;
	const directions = new Proxy(["E", "S", "W", "N"], {
		get(target, prop) {
			if (!isNaN(prop)) {
				prop = parseInt(prop, 10);
				if (prop < 0) {
					prop += target.length;
				}
			}
			return target[prop];
		},
	});
	let correction = (value % 360) / 90; // TO NOT SPIN TOO MUCH
	if (instruction == "R") {
		const newDirection =
			directions[
				Math.abs(
					(directions.indexOf(currentDirection) + correction) % 4
				)
			];
		position.direction = newDirection;
	} else {
		const newDirection =
			directions[(directions.indexOf(currentDirection) - correction) % 4];
		position.direction = newDirection;
	}
	return position;
}
function part1(data) {
	let position = { east: 0, north: 0, direction: "E" };

	for (let step of data) {
		const [_, instruction, value] = step.match(/([NSWEFRL])(\d+)/);

		switch (instruction) {
			case "N":
			case "S":
			case "W":
			case "E":
				position = moveIt(position, instruction, parseInt(value));
				break;
			case "F":
				position = moveIt(
					position,
					position.direction,
					parseInt(value)
				);
				break;
			case "R":
			case "L":
				position = rotate(position, instruction, parseInt(value));
				break;
		}
		console.log(step, position);
	}
	console.log(
		"PART 1 ",
		position,
		Math.abs(position.north) + Math.abs(position.east)
	);
}

part1(test);

const data = getData("navigation");
part1(data);

function moveWaypoint(position, instruction, value) {
	switch (instruction) {
		case "N":
			position.waypoint.north += parseInt(value);
			break;
		case "S":
			position.waypoint.north -= parseInt(value);
			break;
		case "W":
			position.waypoint.east -= parseInt(value);
			break;
		case "E":
			position.waypoint.east += parseInt(value);
			break;
		default:
			break;
	}
	return position;
}
function moveToWaypoint(position, value) {
	position.north += parseInt(value) * position.waypoint.north;
	position.east += parseInt(value) * position.waypoint.east;
	return position;
}
function rotateWaypoint(position, instruction, value) {
	if (instruction === "R") {
		value *= -1;
	}
	const radians = value * (Math.PI / 180);

	const newEast =
		Math.cos(radians) * position.waypoint.east -
		Math.sin(radians) * position.waypoint.north;
	const newNorth =
		Math.sin(radians) * position.waypoint.east +
		Math.cos(radians) * position.waypoint.north;

	position.waypoint.north = Math.round(newNorth);
	position.waypoint.east = Math.round(newEast);
	return position;
}

function part2(data) {
	let position = {
		east: 0,
		north: 0,
		direction: "E",
		waypoint: { north: 1, east: 10 },
	};

	for (let step of data) {
		const [_, instruction, value] = step.match(/([NSWEFRL])(\d+)/);

		switch (instruction) {
			case "N":
			case "S":
			case "W":
			case "E":
				position = moveWaypoint(position, instruction, parseInt(value));
				break;
			case "F":
				position = moveToWaypoint(
					position,

					parseInt(value)
				);
				break;
			case "R":
			case "L":
				position = rotateWaypoint(
					position,
					instruction,
					parseInt(value)
				);
				break;
		}
		console.log(step, position);
	}
	console.log(
		"PART 2 ",
		position,
		Math.abs(position.north) + Math.abs(position.east)
	);
}

part2(test);

part2(data);
