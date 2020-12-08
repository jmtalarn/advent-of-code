const fs = require("fs");
const path = require("path");

function part1GetRules() {
	const rules = {};
	try {
		const data = fs.readFileSync(
			path.join(__dirname, "./rules.txt"),
			"UTF-8"
		);

		const lines = data.split(/\r?\n/);

		lines.forEach((line, datarow) => {
			if (line) {
				const patternContainer = /^(.*)\b bags contain \b(.*)/;
				let found = line.match(patternContainer);
				const [_, container, content] = found;

				const rawrules = content.replace(".", "").split(", ");
				for (rawrule of rawrules) {
					if (!rules[container]) {
						rules[container] = {};
					}
					if (rawrule !== "no other bags") {
						const patternContent = /(\d)\s([\w\s]+)\sbag(?:s)?/;
						const [_fullmatch2, units, bag] = rawrule.match(
							patternContent
						);

						rules[container][bag] = parseInt(units);
					}
				}
			}
		});
	} catch (error) {
		console.error("ERROR PROCESSING FILE", error);
	}
	return rules;
}

function searchInRules(bag, rules) {
	let possible = [];

	const keyRules = Object.keys(rules);
	for (key of keyRules) {
		const bagsInKey = Object.keys(rules[key]);

		if (bagsInKey.indexOf(bag) !== -1) {
			possible.push(key);
			possible = possible.concat(searchInRules(key, rules));
		}
	}
	return possible;
}

function countInSearch(possible) {
	return new Set(possible).size;
}

console.log(
	"PART1 search the shiny gold ",
	countInSearch(searchInRules("shiny gold", part1GetRules()))
);

function countContent(rule, rules) {
	const rulesWithin = rules[rule];

	let count = 0;
	for (ruleWithin of Object.keys(rulesWithin)) {
		const countRuleWithin = rulesWithin[ruleWithin]
			? rulesWithin[ruleWithin]
			: 0;

		count =
			count +
			countRuleWithin +
			countRuleWithin * countContent(ruleWithin, rules);
	}
	return count;
}
console.log(
	"PART2 the shiny gold bag content",
	countContent("shiny gold", part1GetRules())
);
