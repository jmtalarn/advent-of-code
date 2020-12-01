let expenses = require("./data");
const last = expenses.length - 1;

function findRestoFor(MAX, ignoreIndex) {
	for (let i = 0; i < last; i++) {
		if (i != ignoreIndex) {
			const value = expenses[i];

			const resto = MAX - value;

			const indice = expenses.indexOf(resto);
			if (indice !== -1 && indice !== i) {
				return [value, resto];
			}
		}
	}
	throw new Error("F EN EL CHAT");
}

console.log("PART 1");
console.log("******");
const [a, b] = findRestoFor(2020, null);

console.log({ a, b, product: a * b });

console.log("PART 2");
console.log("******");

for (let i = 0; i < last; i++) {
	const initial = expenses[i];
	const resto = 2020 - initial;
	try {
		const [a, b] = findRestoFor(resto, i);
		console.log({ initial, a, b, product: initial * a * b });
	} catch (e) {}
}
