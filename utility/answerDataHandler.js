const fs = require("fs").promises;

async function parseAnswersData() {
	try {
		const answerOne = [];
		const answerTwo = [];
		const answerThree = [];
		const answerFour = [];

		const data = await fs.readFile("../data/answers.json");
		const jsonData = JSON.parse(data);

		jsonData.forEach((item) => {
			const questionIndex = item.questionIndex;

			if (questionIndex === 0) {
				answerOne.push(item);
			}

			if (questionIndex === 1) {
				answerTwo.push(item);
			}

			if (questionIndex === 2) {
				answerThree.push(item);
			}
			if (questionIndex === 3) {
				answerFour.push(item);
			}
		});

		return { answerOne, answerTwo, answerThree, answerFour };
	} catch (error) {
		throw error;
	}
}

module.exports = { parseAnswersData };
