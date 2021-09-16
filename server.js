const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const { OAuth2Client } = require("google-auth-library");
// const client = new OAuth2Client(CLIENT_ID);
const multer = require("multer");
const upload = multer({ dest: "uploads/" });
const path = require("path");
const fs = require("fs");
const PDFParser = require("pdf2json");
let pdfParser = new PDFParser(this, 1);

const app = express();
require("dotenv").config();

var corsOptions = {
  // origin: "http://localhost:8081"
  origin: "https://ecstatic-lichterman-fad233.netlify.app",
};

app.use(cors(corsOptions));
// parse requests of content-type - application/json
app.use(bodyParser.json());
// parse requests of content-type - application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }));

require("./app/routes/notes.routes")(app);


//Database connection
const db = require("./app/models");
db.mongoose
  .connect(process.env.MONGODB_URI || db.url, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
  })
  .then(() => {
    console.log("Connected to the database!");
  })
  .catch((err) => {
    console.log("Cannot connect to the database!", err);
    process.exit();
  });

if (process.env.NODE_ENV === "production") {
  // app.use(express.static('./client/build'))
  app.use(express.static("./client/build"));
}

app.post("/login", (req, res) => {
  let token = req.body.token;

  async function verify() {
    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: CLIENT_ID, // Specify the CLIENT_ID of the app that accesses the backend
    });
    const payload = ticket.getPayload();
    const userid = payload["sub"];
  }
  verify()
    .then(() => {
      res.cookie("session-token", token);
      res.send("success");
    })
    .catch(console.error);
});

async function verify() {
  const ticket = await client.verifyIdToken({
    idToken: token,
    audience: CLIENT_ID, // Specify the CLIENT_ID of the app that accesses the backend
    // Or, if multiple clients access the backend:
    //[CLIENT_ID_1, CLIENT_ID_2, CLIENT_ID_3]
  });
  const payload = ticket.getPayload();
  const userid = payload["sub"];
  // If request specified a G Suite domain:
  // const domain = payload['hd'];
}
// verify().catch(console.error);

// simple route
app.get("/", (req, res) => {
  res.json({ message: "Welcome to jay's application." });
});

//Placed it in here because not under any particular controller. Can relocated it afterwards if needed.
app.post("/api/upload", upload.single("pdf"), async (req, res, next) => {

  let fileName = "";
  if (req.file) {
    filename = req.file.originalname;
    var filepath = path.join(__dirname, req.file.path);
    console.log(filepath);
    var stream = fs.readFileSync(filepath);
    var extracted_text = await getPDFText(stream);
    // console.log("PDF Text:", text);
    //\r\n----------------Page (4) Break----------------\r\n
    let re = /\r\n----------------Page.*Break----------------\r\n/g;
    var textArr = extracted_text.split(re);
    var page = 0;
    textArr.forEach(function (entry) {
      console.log(entry);
      console.log(
        "\n\n================PageBreak" + page + "==================="
      );
      page++;
    });
  } else {
    console.log("No file received.");
  }

  //TODO: add it into database and assign userID

  res
    .status(201)
    .json({ message: "File Received", title: filename, text: textArr });
});

function getPDFText(data) {
  return new Promise((resolve, reject) => {
    const pdfParser = new PDFParser(null, 1);
    pdfParser.on("pdfParser_dataError", reject);
    pdfParser.on("pdfParser_dataReady", (pdfData) => {
      resolve(pdfParser.getRawTextContent());
    });
    pdfParser.parseBuffer(data);
  });
}

// set port, listen for requests
const PORT = process.env.PORT || 8081;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
