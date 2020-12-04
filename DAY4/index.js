const fs = require("fs");
const path = require("path");

function getPassports() {
	const passports = [];
	try {
		const data = fs.readFileSync(
			path.join(__dirname, "./data.txt"),
			"UTF-8"
		);

		const lines = data.split(/\r?\n/);
		let passport = {};

		lines.forEach((line, row) => {
			if (line) {
				const pairs = line.split(" ");

				for (pair of pairs) {
					[key, value] = pair.split(":");
					passport[key] = value;
				}
			} else {
				passports.push(passport);
				passport = {};
			}
		});
	} catch (err) {
		console.error(err);
	}
	console.log("# passports", passports.length);
	return passports;
}

const requiredFields = ["byr", "iyr", "eyr", "hgt", "hcl", "ecl", "pid"];
const optionalFields = ["cid"];
const passports = getPassports();

function countValidPart1() {
	let countValid = 0;

	for (passport of passports) {
		const keys = Object.keys(passport).filter((key) => key !== "cid");
		countValid += requiredFields.every((key) => keys.indexOf(key) !== -1)
			? 1
			: 0;
	}
	return countValid;
}
function validateFields(passport) {
	const unit = passport.hgt.substring(
		passport.hgt.length,
		passport.hgt.length - 2
	);
	const heightValue = parseInt(passport.hgt.split(unit)[0]);
	const validHeight =
		(unit === "in" && heightValue >= 59 && heightValue <= 76) ||
		(unit === "cm" && heightValue >= 150 && heightValue <= 193);

	const validFields =
		parseInt(passport.byr) <= 2002 &&
		parseInt(passport.byr) >= 1920 &&
		parseInt(passport.iyr) <= 2020 &&
		parseInt(passport.iyr) >= 2010 &&
		parseInt(passport.eyr) <= 2030 &&
		parseInt(passport.eyr) >= 2020 &&
		validHeight &&
		/^#[0-9a-f]{6}$/i.test(passport.hcl) &&
		["amb", "blu", "brn", "gry", "grn", "hzl", "oth"].indexOf(
			passport.ecl
		) !== -1 &&
		/^[0-9]{9}$/i.test(passport.pid);

	return validFields;
}
function countValidPart2() {
	let countValid = 0;

	for (passport of passports) {
		const keys = Object.keys(passport).filter((key) => key !== "cid");
		if (
			requiredFields.every((key) => keys.indexOf(key) !== -1) &&
			validateFields(passport)
		) {
			countValid++;
		}
	}
	return countValid;
}

console.log("Valid passports PART1", countValidPart1());
console.log(
	"UNITTEST",
	validateFields({
		ecl: "amb",
		hgt: "177cm",
		hcl: "#b6a3ce",
		eyr: "2025",
		byr: "1967",
		pid: "506927066",
		iyr: "2018",
		cid: "93",
	})
);

console.log("Valid passports PART2", countValidPart2());
