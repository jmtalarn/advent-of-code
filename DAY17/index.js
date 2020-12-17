/* global __dirname */
const fs = require('fs');
const path = require('path');

function getData(filename) {
	try {
		return fs
			.readFileSync(path.join(__dirname, `./${filename}.txt`), 'UTF-8')
			.split(/\r?\n/)
			.map((row) => row.split(''))
			.filter((x) => x.length > 0);
	} catch (error) {
		console.error(error);
	}
}

class DimensionalBox {
	constructor(data) {
		this.db = new Map();
		this.cycles = 0;

		for (let j = 0; j < data.length; j++) {
			for (let i = 0; i < data[j].length; i++) {
				this.db.set(this.getKey(i, j, 0), data[j][i]);
			}
		}
	}
	getCurrentlyActives() {
		return [...this.db.values()].filter((x) => x === '#').length;
	}
	getKey(x, y, z) {
		return `${x}#${y}#${z}`;
	}
	getCoordinatesFromKey(a) {
		const [x, y, z] = a.split('#').map((x) => parseInt(x));
		return { x, y, z };
	}

	setPoint(x, y, z, value) {
		this.db.set(this.getKey(x, y, z), value);
	}
	getPoint(x, y, z) {
		const key = this.getKey(x, y, z);
		return this.db.has(key) ? this.db.get(key) : '.';
	}
	getActiveNeighbours(x, y, z) {
		let active = 0;
		for (let k = z - 1; k <= z + 1; k++) {
			for (let j = y - 1; j <= y + 1; j++) {
				for (let i = x - 1; i <= x + 1; i++) {
					const point = this.getPoint(i, j, k);

					if (!(i === x && j === y && k === z)) {
						active += point === '#' ? 1 : 0;
					}
				}
			}
		}

		return active;
	}
	getIndexes() {
		const xSet = new Set();
		const ySet = new Set();
		const zSet = new Set();
		for (let key of this.db.keys()) {
			let { x, y, z } = this.getCoordinatesFromKey(key);
			xSet.add(x);
			ySet.add(y);
			zSet.add(z);
		}
		const xs = [...xSet.values()].sort((a, b) => a - b);
		const ys = [...ySet.values()].sort((a, b) => a - b);
		const zs = [...zSet.values()].sort((a, b) => a - b);
		return { xs, ys, zs };
	}
	print() {
		const { xs, ys, zs } = this.getIndexes();
		for (let zkey of zs) {
			console.log(`z=${zkey}`);
			for (let ykey of ys) {
				let row = '';
				for (let xkey of xs) {
					row += this.getPoint(xkey, ykey, zkey);
				}
				console.log(row);
			}
		}
		console.log('\n');
	}
	cycleOfUpdates() {
		const nextDb = new Map();
		this.cycles++;
		//ADD BEFORE DIMENSION AND AFTER DIMENSION
		let { xs, ys, zs } = this.getIndexes();

		xs.push(xs[xs.length - 1] + 1);
		xs.unshift(xs[0] - 1);
		ys.push(ys[ys.length - 1] + 1);
		ys.unshift(ys[0] - 1);
		zs.push(zs[zs.length - 1] + 1);
		zs.unshift(zs[0] - 1);

		for (let z of zs) {
			for (let y of ys) {
				for (let x of xs) {
					const activeNeighbours = this.getActiveNeighbours(x, y, z, nextDb);
					const point = this.getPoint(x, y, z);
					const key = this.getKey(x, y, z);
					nextDb.set(key, point);

					if (point === '#') {
						if (activeNeighbours === 2 || activeNeighbours === 3) {
							nextDb.set(key, '#');
						} else {
							nextDb.set(key, '.');
						}
					} else {
						if (activeNeighbours === 3) {
							nextDb.set(key, '#');
						}
					}
					// console.log(
					// 	{ x, y, z },
					// 	' contains ',
					// 	point,
					// 	' has ',
					// 	activeNeighbours,
					// 	'will turn into ',
					// 	nextDb.get(key),
					// );
				}
			}
		}

		this.db = nextDb;
	}
}

function part1(data) {
	const dimensionalbox = new DimensionalBox(data);

	for (let i = 0; i < 6; i++) {
		dimensionalbox.cycleOfUpdates();
	}
	//dimensionalbox.print();
	console.log('PART1 currently active', dimensionalbox.cycles, dimensionalbox.getCurrentlyActives());
}

const test = getData('test');

part1(test);

const input = getData('input');
part1(input);

class Dimensional4dBox {
	constructor(data) {
		this.db = new Map();
		this.cycles = 0;

		for (let j = 0; j < data.length; j++) {
			for (let i = 0; i < data[j].length; i++) {
				this.db.set(this.getKey(i, j, 0, 0), data[j][i]);
			}
		}
	}
	getCurrentlyActives() {
		return [...this.db.values()].filter((x) => x === '#').length;
	}
	getKey(x, y, z, w) {
		return `${x}#${y}#${z}#${w}`;
	}
	getCoordinatesFromKey(a) {
		const [x, y, z, w] = a.split('#').map((x) => parseInt(x));
		return { x, y, z, w };
	}

	setPoint(x, y, z, w, value) {
		this.db.set(this.getKey(x, y, z, w), value);
	}
	getPoint(x, y, z, w) {
		const key = this.getKey(x, y, z, w);
		return this.db.has(key) ? this.db.get(key) : '.';
	}
	getActiveNeighbours(x, y, z, w) {
		let active = 0;
		for (let l = w - 1; l <= w + 1; l++) {
			for (let k = z - 1; k <= z + 1; k++) {
				for (let j = y - 1; j <= y + 1; j++) {
					for (let i = x - 1; i <= x + 1; i++) {
						const point = this.getPoint(i, j, k, l);

						if (!(i === x && j === y && k === z && l === w)) {
							active += point === '#' ? 1 : 0;
						}
					}
				}
			}
		}

		return active;
	}
	getIndexes() {
		const xSet = new Set();
		const ySet = new Set();
		const zSet = new Set();
		const wSet = new Set();
		for (let key of this.db.keys()) {
			let { x, y, z, w } = this.getCoordinatesFromKey(key);
			xSet.add(x);
			ySet.add(y);
			zSet.add(z);
			wSet.add(w);
		}
		const xs = [...xSet.values()].sort((a, b) => a - b);
		const ys = [...ySet.values()].sort((a, b) => a - b);
		const zs = [...zSet.values()].sort((a, b) => a - b);
		const ws = [...wSet.values()].sort((a, b) => a - b);
		return { xs, ys, zs, ws };
	}
	print() {
		const { xs, ys, zs, ws } = this.getIndexes();
		for (let wkey of ws) {
			for (let zkey of zs) {
				console.log(`z=${zkey}`);
				for (let ykey of ys) {
					let row = '';
					for (let xkey of xs) {
						row += this.getPoint(xkey, ykey, zkey, wkey);
					}
					console.log(row);
				}
			}
		}
		console.log('\n');
	}
	cycleOfUpdates() {
		const nextDb = new Map();
		this.cycles++;
		//ADD BEFORE DIMENSION AND AFTER DIMENSION
		let { xs, ys, zs, ws } = this.getIndexes();

		xs.push(xs[xs.length - 1] + 1);
		xs.unshift(xs[0] - 1);
		ys.push(ys[ys.length - 1] + 1);
		ys.unshift(ys[0] - 1);
		zs.push(zs[zs.length - 1] + 1);
		zs.unshift(zs[0] - 1);
		ws.push(ws[ws.length - 1] + 1);
		ws.unshift(ws[0] - 1);
		for (let w of ws) {
			for (let z of zs) {
				for (let y of ys) {
					for (let x of xs) {
						const activeNeighbours = this.getActiveNeighbours(x, y, z, w);
						const point = this.getPoint(x, y, z, w);
						const key = this.getKey(x, y, z, w);
						nextDb.set(key, point);

						if (point === '#') {
							if (activeNeighbours === 2 || activeNeighbours === 3) {
								nextDb.set(key, '#');
							} else {
								nextDb.set(key, '.');
							}
						} else {
							if (activeNeighbours === 3) {
								nextDb.set(key, '#');
							}
						}
					}
				}
			}
		}
		this.db = nextDb;
	}
}

function part2(data) {
	const dimensionalbox = new Dimensional4dBox(data);

	for (let i = 0; i < 6; i++) {
		dimensionalbox.cycleOfUpdates();
	}
	//dimensionalbox.print();
	console.log('PART2 currently active', dimensionalbox.cycles, dimensionalbox.getCurrentlyActives());
}

part2(test);
part2(input);
