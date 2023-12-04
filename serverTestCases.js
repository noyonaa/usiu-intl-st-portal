import express from "express";
import bodyParser from "body-parser";

// Setup for Mock Database Connection
const mockDatabase = {
  students: [],
  applications: [
    {
      id_number: 1,
      full_name: "John Doe",
      imm_status: "Approved",
      type: "Type1",
    },
    {
      id_number: 2,
      full_name: "Jane Smith",
      imm_status: "Pending",
      type: "Type2",
    },
    // Add more mock application data as needed
  ],
  officials: [
    // Mock officials data
    { off_id: 1, off_name: "Official One", off_email: "official1@usiu.ac.ke" },
    { off_id: 2, off_name: "Official Two", off_email: "official2@usiu.ac.ke" },
    // Add more mock official data as needed
  ],
  query: (sql, params, callback) => {
    const command = sql.split(" ")[0].toUpperCase();

    if (command === "INSERT") {
      // Simulate an error for a specific id_number
      if (params && params[0] === 9999) {
        return callback(new Error("Simulated database error"));
      }

      if (sql.includes("students")) {
        const [id_number, full_name, email, password] = params;
        const existingStudent = mockDatabase.students.find(
          (student) =>
            student.id_number === id_number || student.email === email
        );
        if (existingStudent) {
          return callback({ code: "ER_DUP_ENTRY" });
        }
        const newStudent = { id_number, full_name, email, password };
        mockDatabase.students.push(newStudent);
        return callback(null, { insertId: id_number });
      } else if (sql.includes("applications")) {
        const [id_number, full_name, imm_status, type] = params;
        const newApplication = { id_number, full_name, imm_status, type };
        mockDatabase.applications.push(newApplication);
        return callback(null, { insertId: id_number });
      }
    } else if (command === "SELECT") {
      if (sql.includes("applications")) {
        return callback(null, mockDatabase.applications);
      }
      else if (sql.includes("officials")) {
      return callback(null, mockDatabase.officials);
    } 
    } else if (command === "UPDATE" && sql.includes("applications")) {
      const [variableName, variableValue, idNumber] = params;
      const application = mockDatabase.applications.find(
        (app) => app.id_number === idNumber
      );
      if (application) {
        application[variableName] = variableValue;
        return callback(null, { message: "Status Updated" });
      }
      return callback(new Error("Application not found"));
    }
    else {
      return callback(new Error("Unmocked query"));
    }
  },
};
const app = express();
app.use(bodyParser.json());

// Mocked '/signup-student' Route
app.post("/signup-student", (req, res) => {
  const { full_name, id_number, email, password } = req.body;
  mockDatabase.query(
    "INSERT INTO students (id_number, full_name, email, password) VALUES (?, ?, ?, ?)",
    [id_number, full_name, email, password],
    (err, result) => {
      if (err) {
        console.error("Mock DB error:", err);
        return res.status(500).json({ message: "Internal Server Error" });
      }
      return res.status(200).json({ message: "Success", id: result.insertId });
    }
  );
});

app.get("/get_data", (req, res) => {
  mockDatabase.query("SELECT * FROM applications", null, (error, results) => {
    if (error) {
      console.error(error);
      return res.status(500).send("Internal Server Error");
    }
    res.send(results);
  });
});

app.post("/apply-pass", (req, res) => {
  const { id_number, full_name, imm_status, type } = req.body;

  mockDatabase.query(
    "INSERT INTO applications (id_number,full_name,imm_status,type) VALUES (?,?,?,?)",
    [id_number, full_name, imm_status, type],
    (err, result) => {
      if (err) {
        console.error("Mock DB error:", err);
        return res.status(500).json({ message: "SOMETHING WENT WRONG" });
      }
      return res.status(200).json({ message: "Application successful" });
    }
  );
});

app.post("/update_data", (req, res) => {
  const { variable_name, variable_value, id_number } = req.body;

  mockDatabase.query(
    `UPDATE applications SET ? = ? WHERE id_number = ?`,
    [variable_name, variable_value, id_number],
    (err, result) => {
      if (err) {
        console.error("Mock DB error:", err);
        return res.status(500).json({ message: "Internal Server Error" });
      }
      return res.status(200).json(result);
    }
  );
});

app.get("/get_official_list", (req, res) => {
  mockDatabase.query("SELECT * FROM officials", null, (error, results) => {
    if (error) {
      console.error(error);
      return res.status(500).send("Internal Server Error");
    }
    res.send(results);
  });
});

export default app;
