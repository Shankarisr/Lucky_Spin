// // const express = require("express");
// // const fs = require("fs");
// // const XLSX = require("xlsx");
// // const cors = require("cors");

// // const app = express();
// // app.use(express.json());
// // app.use(cors());

// // const FILE_NAME = "players.xlsx";

// // // Load existing data or create a new file if not exists
// // const loadExcel = () => {
// //     if (fs.existsSync(FILE_NAME)) {
// //         const workbook = XLSX.readFile(FILE_NAME);
// //         const sheet = workbook.Sheets[workbook.SheetNames[0]];
// //         return XLSX.utils.sheet_to_json(sheet);
// //     }
// //     return [];
// // };

// // const saveExcel = (data) => {
// //     const worksheet = XLSX.utils.json_to_sheet(data);
// //     const workbook = XLSX.utils.book_new();
// //     XLSX.utils.book_append_sheet(workbook, worksheet, "Players");
// //     XLSX.writeFile(workbook, FILE_NAME);
// // };

// // app.post("/submit", (req, res) => {
// //     const { name, instaId, phone } = req.body;
// //     let players = loadExcel();
    
// //     // Check if user already played
// //     if (players.some(player => player.phone === phone)) {
// //         return res.status(400).json({ message: "You have already played!" });
// //     }
    
// //     // Add new player and save
// //     players.push({ name, instaId, phone });
// //     saveExcel(players);
// //     res.json({ message: "Successfully registered! You can now spin." });
// // });

// // app.listen(6000, () => console.log("Server running on port 5000"));

// const express = require("express");
// const fs = require("fs");
// const cors = require("cors");
// const bodyParser = require("body-parser");
// const XLSX = require("xlsx");

// const app = express();
// app.use(cors({ origin: "*", methods: "GET,POST", allowedHeaders: "Content-Type" }));
// app.use(bodyParser.json());

// const JSON_FILE = "test.json";
// const EXCEL_FILE = "test.xlsx";

// // **Route to Save User Data**
// app.post("/saveUser", (req, res) => {
//     const userData = req.body;

//     let data = [];
//     if (fs.existsSync(JSON_FILE)) {
//         data = JSON.parse(fs.readFileSync(JSON_FILE, "utf8"));
//     }

//     data.push(userData);
//     fs.writeFileSync(JSON_FILE, JSON.stringify(data, null, 2));

//     res.json({ message: "User data saved successfully!" });
// });

// // **Route to Convert JSON to Excel**
// app.get("/convertToExcel", (req, res) => {
//     if (!fs.existsSync(JSON_FILE)) {
//         return res.status(404).json({ message: "No user data found!" });
//     }

//     const jsonData = JSON.parse(fs.readFileSync(JSON_FILE, "utf8"));
//     const worksheet = XLSX.utils.json_to_sheet(jsonData);
//     const workbook = XLSX.utils.book_new();
//     XLSX.utils.book_append_sheet(workbook, worksheet, "Users");

//     XLSX.writeFile(workbook, EXCEL_FILE);

//     res.download(EXCEL_FILE, "userdata.xlsx", (err) => {
//         if (err) console.error("Error sending file:", err);
//     });
// });

// // **Start Server**
// app.listen(5000, () => console.log("Server running on port 5000"));


const express = require("express");
const fs = require("fs");
const cors = require("cors");
const bodyParser = require("body-parser");
const XLSX = require("xlsx");

const app = express();
const PORT = 5000;

app.use(cors({ origin: "*", methods: "GET,POST", allowedHeaders: "Content-Type" }));
app.use(bodyParser.json());

const JSON_FILE = "test.json";
const EXCEL_FILE = "test.xlsx";

// **Route to Save User Data & Convert to Excel Automatically**
app.post("/saveUser", (req, res) => {
    const userData = req.body;

    let data = [];
    if (fs.existsSync(JSON_FILE)) {
        try {
            data = JSON.parse(fs.readFileSync(JSON_FILE, "utf8"));
        } catch (error) {
            return res.status(500).json({ message: "Error reading JSON file!" });
        }
    }

    data.push(userData);
    fs.writeFileSync(JSON_FILE, JSON.stringify(data, null, 2));

    // Convert to Excel Automatically
    convertJsonToExcel();

    res.json({ message: "User data saved & Excel file updated!" });
});

// **Function to Convert JSON to Excel**
const convertJsonToExcel = () => {
    if (!fs.existsSync(JSON_FILE)) return;

    const jsonData = JSON.parse(fs.readFileSync(JSON_FILE, "utf8"));
    const worksheet = XLSX.utils.json_to_sheet(jsonData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Users");

    XLSX.writeFile(workbook, EXCEL_FILE);
    console.log("Excel file updated successfully!");
};

// **Route to Download Latest Excel File**
app.get("/downloadExcel", (req, res) => {
    if (!fs.existsSync(EXCEL_FILE)) {
        return res.status(404).json({ message: "No Excel file found!" });
    }

    res.download(EXCEL_FILE, "userdata.xlsx", (err) => {
        if (err) console.error("Error sending file:", err);
    });
});

// **Start Server**
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
