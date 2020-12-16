const fs = require("fs");
const path = require("path");

function getData(filename) {
	try {
		return fs
			.readFileSync(path.join(__dirname, `./${filename}.txt`), "UTF-8")
			.split(/\r?\n/);
	} catch (error) {
		console.error(error);
	}
}
function getDataBlocks(data) {
	const datablocks = {};
	datablocks.rules = getRules(data.slice(0, data.indexOf("")));

	const yourticketPosition = data.indexOf("your ticket:");
	datablocks.yourticket = data
		.slice(yourticketPosition + 1, yourticketPosition + 2)[0]
		.split(",")
		.map((x) => parseInt(x));

	const nearbyTicketsPosition = data.indexOf("nearby tickets:");
	datablocks.nearbytickets = data
		.slice(nearbyTicketsPosition + 1, data.length - 1)
		.map((x) => x.split(",").map((x) => parseInt(x)));
	return datablocks;
}

function getRules(rulesdata) {
	const rules = new Map();
	for (let rule of rulesdata) {
		const [_, label, range1, range2] = rule.match(
			/(.*):\s(\d+-\d+)\sor\s(\d+-\d+)/
		);
		rules.set(label, {
			range1: range1.split("-").map((x) => parseInt(x)),
			range2: range2.split("-").map((x) => parseInt(x)),
		});
	}
	return rules;
}

function getAllRanges(rules) {
	return [...rules.values()].map((x) => [x.range1, x.range2]).flat();
}
function numberValid(number, ranges) {
	return ranges.some((range) => number <= range[1] && number >= range[0]);
}

const test = getDataBlocks(getData("test"));

function part1(data) {
	const ranges = getAllRanges(data.rules);
	const badNumbers = data.nearbytickets
		.flat()
		.filter((x) => !numberValid(x, ranges))
		.reduce((acc, curr) => acc + curr, 0);

	console.log("PART1", { ["ticket scanning error rate"]: badNumbers });
}

part1(test);

const data1 = getDataBlocks(getData("data1"));
part1(data1);

function part2(data) {
	const ranges = getAllRanges(data.rules);
	const goodTickets = data.nearbytickets.filter(
		(ticket) => !ticket.some((x) => !numberValid(x, ranges))
	);
	goodTickets.push(data.yourticket);
	const orderedFields = orderFields(goodTickets, data.rules);

	const departureIndexes = orderedFields
		.map((label, index) => (label.startsWith("departure") ? index : null))
		.filter((x) => x);
	const departureProduct = departureIndexes
		.map((index) => data.yourticket[index])
		.reduce((acc, curr) => (acc *= curr), 1);

	console.log("PART2", {
		orderedFields,
		departureProduct,
	});
}

function orderFields(tickets, rules) {
	const orderedFields = [];
	const remainingKeysToProcess = new Set(rules.keys());
	for (let i = 0; i < tickets[0].length; i++) {
		const possibleFields = new Set(remainingKeysToProcess.values());

		for (let j = 0; j < tickets.length && possibleFields.size > 1; j++) {
			const number = tickets[j][i];

			for (let key of rules.keys()) {
				const ranges = [rules.get(key).range1, rules.get(key).range2];
				if (!numberValid(number, ranges)) {
					possibleFields.delete(key);
				}
			}
		}
		orderedFields[i] = [...possibleFields.values()];

		function cleanKey(orderedFields, key) {
			for (let k = 0; k <= i; k++) {
				const fieldsToClean = orderedFields[k];
				if (fieldsToClean.length > 1) {
					orderedFields[k] = fieldsToClean.filter(
						(field) => field !== key
					);
					if (orderedFields[k].length === 1) {
						remainingKeysToProcess.delete(orderedFields[k][0]);
						cleanKey(orderedFields, orderedFields[k][0]);
					}
				}
			}
		}
		if (possibleFields.size === 1) {
			const key = orderedFields[i][0];
			remainingKeysToProcess.delete(key);
			cleanKey(orderedFields, key);
		}
	}
	return orderedFields.flat();
}
part2(test);

part2(data1);
