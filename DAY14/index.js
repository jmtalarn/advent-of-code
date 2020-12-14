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

function decimalToBinary(number) {
	let binary = "";
	let temp = number;

	while (temp > 0) {
		if (temp % 2 == 0) {
			binary = "0" + binary;
		} else {
			binary = "1" + binary;
		}

		temp = Math.floor(temp / 2);
	}
	binary = binary.padStart(36, "0");
	//console.log("decimatToBinary", number, binary);
	return binary;
}

function binaryToDecimal(binaryNumber) {
	let total = 0;
	for (let i = 0; i < binaryNumber.length; i++) {
		let bit = binaryNumber.charAt(binaryNumber.length - (i + 1));
		if (bit == 1) {
			let temp = Math.pow(2, i * parseInt(bit));
			total += temp;
		}
	}
	//console.log("binaryToDecimal", binaryNumber, total);
	return total;
}
function applyMask(binaryNumber, mask) {
	const masked = binaryNumber
		.split("")
		.map((digit, index) => {
			if (mask.charAt(index) !== "X") {
				return mask.charAt(index);
			} else {
				return digit;
			}
		})
		.join("");
	//console.log("applyMask", binaryNumber, mask, masked);
	return masked;
}
function part1Filter(data) {
	//console.log(data);
	return data.map((row) => {
		if (row.startsWith("mask = ")) {
			const [fullmatch, mask] = row.match(/mask = ([\dX]+)/);
			return { type: "mask", mask };
		} else {
			const [fullmatch, slot, value] = row.match(/mem\[(\d+)\] = (\d+)/);
			return { type: "mem", slot, value };
		}
	});
}
function part1(dataInput) {
	let currentMask = "XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX";

	const data = part1Filter(dataInput);
	const mem = [];
	for (let i of data) {
		if (i.type === "mask") {
			currentMask = i.mask;
		} else if (i.type === "mem") {
			mem[i.slot] = binaryToDecimal(
				applyMask(decimalToBinary(parseInt(i.value)), currentMask)
			);
		}
	}
	console.log(
		"PART1 sum of all values left in memory",
		mem.reduce((acc, curr) => {
			if (curr) {
				return acc + curr;
			} else {
				return acc;
			}
		}, 0)
	);
}

const test = getData("test");

part1(test);

const data = getData("data");
part1(data);
function applyMaskToAddress(binaryNumber, mask) {
	return binaryNumber
		.split("")
		.map((bit, index) => {
			const maskBit = mask.charAt(index);
			switch (maskBit) {
				case "0":
					return bit;
					break;
				case "1":
					return "1";
					break;
				case "X":
					return "X";
				default:
					break;
			}
		})
		.join("");
}
function getAllAddresses(binaryNumber, currentMask) {
	const allAddresses = [];
	const addressMasked = applyMaskToAddress(binaryNumber, currentMask);

	const xCount = addressMasked
		.split("")
		.reduce((acc, bit) => (bit === "X" ? ++acc : acc), 0);

	for (let i = 0; i < Math.pow(2, xCount); i++) {
		let xToApply = parseInt(decimalToBinary(i))
			.toString()
			.padStart(xCount, "0")
			.split("");
		let indexApplied = 0;

		allAddresses.push(
			addressMasked
				.split("")
				.map((bit) => {
					if (bit === "X") {
						indexApplied++;
						return xToApply[indexApplied - 1];
					} else {
						return bit;
					}
				})
				.join("")
		);
	}
	return allAddresses;
}

function part2(dataInput) {
	let currentMask = "XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX";

	const data = part1Filter(dataInput);
	const addressesMap = new Map();
	for (let i of data) {
		if (i.type === "mask") {
			currentMask = i.mask;
		} else if (i.type === "mem") {
			const allAddressess = getAllAddresses(
				decimalToBinary(i.slot),
				currentMask
			);

			for (let address of allAddressess) {
				addressesMap.set(address, parseInt(i.value));
			}
		}
	}

	console.log(
		"PART2 sum of all values left in memory",
		[...addressesMap.values()].reduce((acc, curr) => {
			if (curr) {
				return acc + curr;
			} else {
				return acc;
			}
		}, 0)
	);
}

const test2 = getData("test2");

part2(test2);

part2(data);
