const fs = require("fs").promises;
const path = require("path");

const filePath = path.resolve(__dirname, "../data/questions.json");

async function parseQuestionsData() {
	try {
		let qustionFour = {};

		const data = await fs.readFile(filePath);
		const jsonData = JSON.parse(data);

		// console.log("jsonData: ", jsonData);

		jsonData.forEach((item) => {
			const questionIndex = item.questionIndex;

			if (questionIndex === 3) {
				qustionFour = {
					question: item.question,
					questionIndex: item.questionIndex,
					analysis: item.analysis,
					otherOptions: item.otherOptions,
				};
			}
		});

		return { qustionFour };
	} catch (error) {
		throw error;
	}
}

module.exports = { parseQuestionsData };
