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
