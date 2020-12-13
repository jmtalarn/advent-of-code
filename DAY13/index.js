const fs = require("fs");
const path = require("path");

function getData(filename) {
	try {
		const data = fs
			.readFileSync(path.join(__dirname, `./${filename}.txt`), "UTF-8")
			.split(/\r?\n/)
			.filter((x) => x);

		const earliestDeparture = parseInt(data[0]);
		const busIds = data[1].split(",");

		return { earliestDeparture, busIds };
	} catch (error) {
		console.error(error);
	}
}
function filterPart1({ earliestDeparture, busIds }) {
	return {
		earliestDeparture,
		busIds: busIds
			.filter((busId) => busId !== "x")
			.map((busId) => parseInt(busId)),
	};
}

const test = getData("test");

function part1(inputData) {
	const data = filterPart1(inputData);
	let i = data.earliestDeparture;
	let found = false;
	let nextBusId = 0;
	while (nextBusId === 0) {
		for (let busId of data.busIds) {
			if (i % busId === 0) {
				nextBusId = busId;
				break;
			}
		}
		if (nextBusId === 0) {
			i++;
		}
	}
	console.log(
		"PART1 ",
		i,
		data.earliestDeparture,
		nextBusId,
		(i - test.earliestDeparture) * nextBusId
	);
}

part1(test);

const data = getData("data");
part1(data);

function part2(data) {
	const { busIds } = data;
	const busIdsWithT = busIds
		.map((busId, index) => ({
			busId: busId,
			t: index,
		}))
		.filter((item) => item.busId !== "x")
		.map((item) => ({ busId: parseInt(item.busId), t: item.t }));
	//Credits https://github.com/oddbytes/adventofcode/blob/master/src/2020/Day%2013/part2.ts
	let timestamp = 0;
	let increment = 1;

	function incrementTimestamp(initialTimestamp, increment, nextBus) {
		while ((initialTimestamp + nextBus.t) % nextBus.busId != 0) {
			initialTimestamp += increment;
		}
		return initialTimestamp;
	}

	for (let bus = 1; bus < busIdsWithT.length; bus++) {
		increment *= busIdsWithT[bus - 1].busId;
		timestamp = incrementTimestamp(timestamp, increment, busIdsWithT[bus]);
	}
	console.log("PART2", timestamp);
}

part2(test);

part2(data);
