const fs = require("fs");
const path = require("path");

function ProcessBoardingPasses() {
	let maxSeatId = 0;
	const seats = [];
	const maxRows = 127;
	const maxCols = 7;

	try {
		const data = fs.readFileSync(
			path.join(__dirname, "./data.txt"),
			"UTF-8"
		);

		const lines = data.split(/\r?\n/);

		lines.forEach((line, datarow) => {
			if (line) {
				const boardingPass = line.split("");
				let minrow = 0;
				let maxrow = 127;

				for (let i = 0; i <= 6; i++) {
					let letter = boardingPass.shift();

					if (letter === "F") {
						maxrow = minrow + parseInt((maxrow - minrow) / 2);
					} else {
						//if (letter === "B") {
						minrow = maxrow - parseInt((maxrow - minrow) / 2);
					}
				}
				let mincol = 0;
				let maxcol = 7;
				for (let i = 0; i <= 3; i++) {
					let letter = boardingPass.shift();
					if (letter === "L") {
						maxcol = mincol + parseInt((maxcol - mincol) / 2);
					} else {
						//if (letter === "R") {
						mincol = maxcol - parseInt((maxcol - mincol) / 2);
					}
				}
				let seatProcessed = {
					seatId: minrow * 8 + mincol,
					boardingPass: line,
				};
				seats.push(seatProcessed.seatId);
				console.log(seatProcessed);
				if (seatProcessed.seatId >= maxSeatId) {
					maxSeatId = seatProcessed.seatId;
				}
			}
		});
	} catch (error) {
		console.error(error);
	}
	console.log("PART1 -> Max seat", { maxSeatId });

	console.log("PART2 ", seatsNotInList(seats, maxSeatId));
}

function seatsNotInList(seats, maxSeat) {
	const notInList = [];
	for (let i = 0; i <= maxSeat; i++) {
		if (seats.indexOf(i) === -1) {
			notInList.push(i);
		}
	}
	console.log(notInList);
}

console.log(ProcessBoardingPasses());
