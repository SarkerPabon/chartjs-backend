const express = require("express");
const cors = require("cors");
const { parseAnswersData } = require("./utility/answerDataHandler");
const { parseQuestionsData } = require("./utility/questionDataHandler");

const app = express();
const port = 4000;

app.use(cors());
app.use(express.static(__dirname + "/public/"));
app.use(express.json());

app.get("/", (req, res) => {
	res.json({ message: "Hello World" });
});

app.get("/chart-one", async (req, res) => {
	try {
		const { answerOne, answerTwo } = await parseAnswersData();

		// Group answerTwo data into male and female arrays
		const male = [];
		const female = [];
		answerTwo.forEach((item) => {
			if (item.answer === "Male") {
				male.push(item);
			} else if (item.answer === "Female") {
				female.push(item);
			}
		});

		// Function to group data by age and count occurrences
		const groupByAgeAndCount = (data) => {
			const result = {};
			data.forEach((item) => {
				const age = answerOne.find(
					(entry) => entry.submissionId === item.submissionId
				)?.answer;
				if (!result[age]) {
					result[age] = 0;
				}
				result[age]++;
			});
			return result;
		};

		// Group male and female arrays by age and count occurrences
		const maleByAge = groupByAgeAndCount(male);
		const femaleByAge = groupByAgeAndCount(female);

		// Sorting Function for Object Keys
		const sortedKeys = (obj) => {
			const sortedKeys = Object.keys(obj).sort((a, b) => {
				const [aStart, aEnd] = a.split("-").map(Number);
				const [bStart, bEnd] = b.split("-").map(Number);
				return aStart - bStart || aEnd - bEnd;
			});

			const sortedObj = {};
			sortedKeys.forEach((key) => {
				sortedObj[key] = obj[key];
			});

			return sortedObj;
		};

		const sortedMaleByAge = sortedKeys(maleByAge);
		const sortedFemaleByAge = sortedKeys(femaleByAge);

		res.json({ sortedMaleByAge, sortedFemaleByAge });
	} catch (error) {
		console.error("Error processing JSON:", error);
		res.status(500).json({ error: "Chart One Internal Server Error" });
	}
});

app.get("/chart-two", async (req, res) => {
	try {
		const { answerThree } = await parseAnswersData();

		// Group data based on answer property and count occurrences
		const locations = answerThree.reduce((acc, obj) => {
			const { answer } = obj;
			if (!acc[answer]) {
				acc[answer] = 0;
			}
			acc[answer]++;
			return acc;
		}, {});

		// Extract labels and counts for Chart.js
		const labels = Object.keys(locations);
		const counts = Object.values(locations);
		const totalLocations = counts.reduce((total, count) => total + count, 0);

		res.json({ labels, locations, totalLocations });
	} catch (error) {
		console.error("Error processing JSON:", error);
		res.status(500).json({ error: "Chart Two Internal Server Error" });
	}
});

app.get("/chart-three", async (req, res) => {
	try {
		const { answerFour } = await parseAnswersData();
		const { qustionFour } = await parseQuestionsData();

		// console.log("qustionFour: ", qustionFour);

		// Check length
		// console.log("answerFour Length: ", answerFour.length);

		// Create a map to store unique submissionIds
		const submissionIdsMap = new Map();

		// Filter the array to remove duplicates based on submissionId
		const uniqueAnswerFourObj = answerFour.filter((obj) => {
			if (!submissionIdsMap.has(obj.submissionId)) {
				submissionIdsMap.set(obj.submissionId, true);
				return true;
			}
			return false;
		});

		// console.log("submissionIdsMap Size: ", submissionIdsMap.size);

		// Create a map to store unique submissionIds
		const participantsMap = new Map();

		const groupedByAnswerFour = answerFour.reduce((acc, obj) => {
			if (obj.answer !== "") {
				acc[obj.answer] = (acc[obj.answer] || 0) + 1;
				if (!participantsMap.has(obj.submissionId)) {
					participantsMap.set(obj.submissionId, true);
				}
			}
			return acc;
		}, {});

		// console.log("participantsMap Size: ", participantsMap.size);
		const participants = participantsMap.size;
		// console.log("participants: ", participants);

		// console.log("groupedByAnswerFour: ", groupedByAnswerFour);
		const total = Object.values(groupedByAnswerFour).reduce(
			(total, count) => total + count,
			0
		);
		// console.log("groupedByAnswerFour Total: ", total);

		const participantsPercentage = (
			(participants / uniqueAnswerFourObj.length) *
			100
		).toFixed(2);
		// console.log("participantsPercentage: ", participantsPercentage);

		const answerPerRespondentPercentage = (
			total / submissionIdsMap.size
		).toFixed(2);
		// console.log(
		// 	"answerPerRespondentPercentage: ",
		// 	answerPerRespondentPercentage
		// );

		res.json({
			groupedByAnswerFour,
			total,
			participants,
			percentage: participantsPercentage,
			perRespondent: answerPerRespondentPercentage,
			qustionFour,
		});
	} catch (error) {
		console.error("Error processing JSON:", error);
		res.status(500).json({ error: "Chart Three Internal Server Error" });
	}
});

app.listen(port, () => {
	console.log(`Server is listening on port ${port}`);
});
