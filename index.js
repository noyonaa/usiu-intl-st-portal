const express = require('express');
const app = express();
const port = 3000; // Change this to your desired port number
const mysql = require('mysql');
const path = require('path');
const bodyparser = require("body-parser");
app.use(bodyparser.json())
app.use(bodyparser.urlencoded({ entended: false }))
const crypto = require('crypto')
const uuid4 = require('uuid4')
const fs = require('fs')

const cookieParser = require("cookie-parser");
const sessions = require('express-session');
const { log, error } = require('console');
const moment = require('moment')
const filestore = require("session-file-store")(sessions)
const multer = require('multer');
const cors = require('cors')
const oneDay = 1000 * 60 * 60 * 24;
const oneHour = 1000 * 60 * 60;
const oneMinute = 1000 * 60;

const Security = require('./Security')

// app.use(express.json({ limit: '50mb' }));
// app.use(express.urlencoded({ limit: '50mb', extended: true }));
app.use(express.json());
app.use(express.urlencoded({extended: true }));


app.use(cors())
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

// Setting up the project
app.set('views', 'views') // Where the pages are going to be stored
app.set('view engine', 'hbs') // The view engine used
app.use(express.static('public')) //The folder for the assests

// cookie parser middleware
app.use(cookieParser());

//session middleware
app.use(sessions({
  name: "User_Session",
  secret: "8Ge2xLWOImX2HP7R1jVy9AmIT0ZN68oSH4QXIyRZyVqtcl4z1I",
  saveUninitialized: false,
  cookie: { maxAge: oneDay, httpOnly: false },
  resave: false,
  store: new filestore({ logFn: function() {} }),
  path: "/sessions/"
}));

// var session;
var message
//mysql connection
const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'intstudentpass',
});

connection.connect((err) => {
  if (err) throw err;
  console.log('Connected to the database');
});

// Middleware
function checkAuth(request, response, next){
  const {user} = request.cookies
}


// The Home page
app.get('/', (request, response) => {
  response.render('login')
});


// Configure file upload storage
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
      cb(null, 'uploads/') // Upload files to the 'uploads' directory
  },
  filename: function (req, file, cb) {
      cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname))
  }
});

// Create a multer instance with the storage configuration
const upload = multer({ dest:'./uploads' });
// const upload = multer({ storage: storage });

module.exports = upload;

//Login Page
app.get('/login-page', (request, response) => {
  const { user } = request.cookies
  if (user === 'student')
      return response.redirect('/')
  if (user === 'official')
      return response.redirect('/official-profile')
  response.render('login', { message: message })
})

//Signup Page
app.get('/sign-up-page', (request, response) => {
  response.render('./sign-up')
})


app.post('/login', (req, res) => {
    const { type_of_user, email, password } = req.body;
    console.log('Here')
    console.log(email)
    console.log(password)
    // Perform SQL query to check if the email and password are valid
    // Replace 'users' with your actual table name

    if (email === 'admin@gmail.com' && password === 'admin123') {
      const sql = `SELECT * FROM admin WHERE ad_email = ? AND ad_password = ?`;
      connection.query(sql, [email, password], (err, results) => {
        if (err) throw err;
        if (results.length > 0) {
          delete results[0].password
          req.session.user = results[0]

          res.redirect('/admin-dash')//redirects to profile
        } else {
          res.send('Invalid credentials!'); // Display an error message on the login page
        }
      
      });
    }
    else if (type_of_user === 'Student') {
      const sql = `SELECT * FROM students WHERE email = ? AND password = ?`;
      connection.query(sql, [email, Security.EncPass(password)], (err, results) => {
        if (err) throw err;
        if (results.length > 0) {
          delete results[0].password
          req.session.user = results[0]

          res.redirect('/my-profile')//redirects to profile
        } else {
          res.send('Invalid credentials!'); // Display an error message on the login page
        }
      
      });
    }

    else if (type_of_user === 'Official') {
      const sql = `SELECT * FROM officials WHERE off_email = ? AND off_pass = ?`;
      connection.query(sql, [email, password], (err, results) => {
        if (err) throw err;
        if (results.length > 0) {
          delete results[0].password
          req.session.user = results[0]

          res.redirect('/off-profile')//redirects to profile
        } else {
          res.send('Invalid credentials!'); // Display an error message on the login page
        }
      
      });
    }
  });


app.get('/admin-dash', (request, response) => {
  response.render('./admin/AdminDash')
})



app.get('/report-req', (request, response) => {
  response.render('./admin/report')
})

app.get('/admin-list-off', (request, response) => {
  response.render('./admin/adminOfficials')
})

app.get('/admin-list-students', (request, response) => {
  response.render('./admin/adminStudents')
})

app.get('/passlist', (request, response) => {
  response.render('./admin/adminPasslist')
})

app.get('/pass-list', (request, response) => {
  response.render('./officials/off-passes')
})
//official activities
app.get('/off-dashboard', (request, response) => {
  response.render('./officials/pass-requests')
})

app.get('/off-profile', (request, response) => {
  response.render('./officials/off-profile')
})


app.get('/cover-letter-request', (request, response) => {
  response.render('./Students/letter-requests')
})

app.get("/get_data", (request, response) => {
	const sql = `SELECT * FROM applications`;

	connection.query(sql, (error, results) => {
		console.log(error);
		response.send(results);

	});
});

app.get("/get_pass_data", (request, response) => {
	const sql = `SELECT * FROM passes`;

	connection.query(sql, (error, results) => {
		console.log(error);
		response.send(results);

	});
});
app.post('/update_pass_data', (request, response) => {

	const variable_name = request.body.variable_name;

	const variable_value = request.body.variable_value;

	const id_number = request.body.id_number;

	const sql = `UPDATE passes SET `+variable_name+`= "${variable_value}" WHERE id_number = "${id_number}"`;

	connection.query(sql, (error, results) => {

		response.json({
			message : 'Status Updated'
		});

	});

});

app.post("/delete_pass_data", (request, response) => {

	const id = request.body.id;

	const sql = `DELETE FROM passes WHERE id = '${id}'`;

	connection.query(sql, (error, results) => {
		response.json({
			message : 'Data Deleted'
		});
	});

});


//student list stuff

app.get("/get_student_list", (request, response) => {
	const sql = `SELECT * FROM students`;

	connection.query(sql, (error, results) => {
		console.log(error);
		response.send(results);

	});
});


app.post('/update_student_data', (request, response) => {

	const variable_name = request.body.variable_name;

	const variable_value = request.body.variable_value;

	const id_number = request.body.id_number;

	const sql = `UPDATE students SET `+variable_name+`= "${variable_value}" WHERE id_number = "${id_number}"`;

	connection.query(sql, (error, results) => {

		response.json({
			message : 'Status Updated'
		});

	});

});

app.post("/delete_student_data", (request, response) => {

	const id = request.body.id;

	const sql = `DELETE FROM students WHERE id = '${id}'`;

	connection.query(sql, (error, results) => {
		response.json({
			message : 'Data Deleted'
		});
	});

});


app.get("/get_official_list", (request, response) => {
	const sql = `SELECT * FROM officials`;

	connection.query(sql, (error, results) => {
		console.log(error);
		response.send(results);

	});
});


app.post('/update_official_data', (request, response) => {

	const variable_name = request.body.variable_name;

	const variable_value = request.body.variable_value;

	const id_number = request.body.id_number;

	const sql = `UPDATE officials SET `+variable_name+`= "${variable_value}" WHERE off_id = "${id_number}"`;

	connection.query(sql, (error, results) => {

		response.json({
			message : 'Status Updated'
		});

	});

});

app.post("/delete_official_data", (request, response) => {

	const id = request.body.id;

	const sql = `DELETE FROM officials WHERE off_id = '${id}'`;

	connection.query(sql, (error, results) => {
		response.json({
			message : 'Data Deleted'
		});
	});

});

app.get('/generate-report', async (req, res) => {
  try {
      const queryString = 'SELECT id_number, imm_status, type, status FROM applications';
      connection.query(queryString, (error, results) => {
          if (error) {
              console.error(error);
              return res.status(500).json({ message: 'Error generating report' });
          }

          const reportData = results.map(result => ({
              id: result.id_number,
              immigrationStatus: result.imm_status,
              applicationType: result.type,
              status: result.status
          }));

          res.json(reportData);
      });
  } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Error generating report' });
  }
});

//application status list
app.get('/get-student-pass', (req, res) => {
  const studentId = req.query.id; // Extract student ID from the request query parameters

  // Perform the SQL query to fetch the pass status for the given student ID
  const sqlQuery = 'SELECT status FROM applications WHERE id_number = ?';

  // Execute the query with the student ID parameter
  connection.query(sqlQuery, [studentId], (err, result) => {
    if (err) {
      console.error('Error fetching pass status:', err);
      res.status(500).json({ error: 'Internal server error' });
    } else {
      // If the query is successful, send the pass status back to the client
      if (result.length > 0) {
        const passStatus = result[0].status;
        res.json({ status: passStatus });
      } else {
        res.status(404).json({ error: 'Pass status not found for the student' });
      }
    }
  });
});


app.post('/update_data', (request, response) => {

	const variable_name = request.body.variable_name;

	const variable_value = request.body.variable_value;

	const id_number = request.body.id_number;

	const sql = `UPDATE applications SET `+variable_name+`= "${variable_value}" WHERE id_number = "${id_number}"`;

	connection.query(sql, (error, results) => {

		response.json({
			message : 'Status Updated'
		});

	});

});

app.post("/delete_data", (request, response) => {

	const id = request.body.id;

	const sql = `DELETE FROM applications WHERE id_number = '${id}'`;

	connection.query(sql, (error, results) => {
		response.json({
			message : 'Data Deleted'
		});
	});

});


// Student's profile
app.get('/my-profile', (request, response) => {
  response.render('./Students/student-profile')
})

app.get('/student-list', (request, response) => {
  response.render('./officials/off-students')
})

//Apply
app.get('/apply', (request, response) => {
  response.render('./Students/apply')
})

app.post('/apply-pass', upload.array('file'),(request, response)=>{
  console.log("here")
  // const {id_number, full_name, imm_status, type} = JSON.parse(request.body.data)
  const {id_number, full_name, imm_status, type} = request.body
  // console.log(JSON.parse(request.body.data))
  console.log(request.body)
  console.log(request.files)

  const police_clearance = request.files[0].path
  const police_clearanceData = fs.readFileSync(police_clearance);

  const biodata = request.files[1].path
  const biodataData = fs.readFileSync(biodata);

  const idPhoto = request.files[2].path
  const idPhotoData = fs.readFileSync(idPhoto);
    // const uploadedFile = request.body.file;
  // const formFile = fs.readFileSync(uploadedFile.path)
  // console.log(uploadedFile)
  // console.log(formFile)

  connection.query('INSERT INTO applications (id_number,full_name,imm_status,type,passport,Police_clearance,Photograph) values (?,?,?,?,?,?,?) ',[id_number,full_name,imm_status,type,biodataData,police_clearanceData,idPhotoData], (err,result)=>{
    if(err){
      console.log("err")
      console.log(err)
      return response.status(500).json({
        message: 'SOMETHING WENT WRONG'
      });
    }
    console.log(result)
    return response.status(200).json({
      message:'Application successful'
    })
  })
})

app.get('/off-add-pass', (request, response)=>{
  response.render('./officials/add-pass')
})



//Send police clearance image

app.get('/policeClearance/:id/', (req, res) => {
  const {id} = req.params;
  console.log("Police clearance")

  const query = 'SELECT Police_clearance FROM applications WHERE id_number = ?';
  connection.query(query, [id], (error, results) => {
      if (error) {
          console.error('Error retrieving image:', error);
          res.status(500).send('Error retrieving image');
      } else if (results.length === 0) {
          res.status(404).send('Image not found');
      } else {
          const imageData = results[0].Police_clearance;
          res.setHeader('Content-Type', 'image/jpeg');
          res.send(imageData);
      }
  });
});

//Send a passport image

app.get('/passport/:id/', (req, res) => {
  const {id} = req.params;
  console.log("Passport image")

  const query = 'SELECT passport FROM applications WHERE id_number = ?';
  connection.query(query, [id], (error, results) => {
      if (error) {
          console.error('Error retrieving image:', error);
          res.status(500).send('Error retrieving image');
      } else if (results.length === 0) {
          res.status(404).send('Image not found');
      } else {
          const imageData = results[0].passport;
          res.setHeader('Content-Type', 'image/jpeg');
          res.send(imageData);
      }
  });
});

//Send a id photo image

app.get('/idPhoto/:id/', (req, res) => {
  const {id} = req.params;
  console.log("Biodata image")

  const query = 'SELECT Photograph FROM applications WHERE id_number = ?';
  connection.query(query, [id], (error, results) => {
      if (error) {
          console.error('Error retrieving image:', error);
          res.status(500).send('Error retrieving image');
      } else if (results.length === 0) {
          res.status(404).send('Image not found');
      } else {
          const imageData = results[0].Photograph;
          res.setHeader('Content-Type', 'image/jpeg');
          res.send(imageData);
      }
  });
});

app.post('/add-pass', (request, response)=>{
  console.log(request.body)
  const {id_number, pass_number, exp_date} = request.body
  try {
    connection.query('INSERT INTO applications (id_number, pass_number, exp_date) values (?,?,?)',[id_number, pass_number, exp_date],(err,result)=>{   
    if (err) {
            return response.status(401).json({
                message: 'Application already made before'
            })
        }

        console.log("Record inserted")
        return response.status(200).json({
            message:' Success'
        })
    })

} catch (error) {
    console.log("An error occured")
    console.log(error)
    response.status(500).json({
      message: 'Something went wrong'
    });
}
})

//send user session info
app.get('/get-session-user', (request, response) => {
  response.send(request.session.user)
})



//Logout route
app.get('/logout', (request, response) => {
   
  request.session.destroy((err) => {
      message = null

      if (err) throw err;
      request.session = null;
      response.clearCookie('user')
      response.clearCookie('User_Session')
      response.redirect('/')
  })
})

//
app.post('/signup-student', (request, response) => {
  console.log(request.body)
  const {full_name,id_number,email,password} = request.body
  try {
      // connection.query(`INSERT INTO donors values ('${uuid4()}','${Donor_info.Donor_Fname}', '${Donor_info.Donor_Lname}', '${Donor_info.Donor_Number}', '${Donor_info.Donor_Email}', '${Donor_info.Donor_Password}')`, (err, result) => {
      connection.query('INSERT INTO students (id_number, full_name,email,password) values (?,?,?,?)',[id_number,full_name,email,Security.EncPass(password)],(err,result)=>{   
      if (err) {
              return response.status(401).json({
                  message: 'ID or Email already in use'
              })
          }

          console.log("Record inserted")
          return response.status(200).json({
              message:' Success'
          })
      })

  } catch (error) {
      console.log("Sadly there was an error")
      console.log(error)
      response.status(500).json({
        message: 'Something went wrong'
      });
  }
})



app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
