const dotenv = require('dotenv').config();
const express = require("express");
require("./db/dbConnection.cjs");
const User = require("./models/userModel.cjs");
const activeStudentsRouter = require("./routers/activeStudentsRouter.cjs");
const passiveStudentsRouter = require("./routers/passiveStudentsRouter.cjs");
const actionRouter = require("./routers/actionRouter.cjs");
const uploadRouter = require("./routers/uploadRouter.cjs");
const cors = require("cors");
const path = require('path');

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use('/uploads', express.static(path.join(__dirname, './uploads')));

app.post("/addUser", async (req, res) => {
  const newUser = await User.create({
    tc: req.body.tc,
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    schoolNumber: req.body.schoolNumber,
    eMail: req.body.eMail,
    phoneNumber: req.body.phoneNumber,
    password: req.body.password,
    status: req.body.status,
    department: req.body.department,
    classNo: req.body.classNo,
  });
  if(newUser){
    res.send(newUser);
  }
  else{
    res.send({
      msg: "Yüklerken hata oluştu"
    })
  }
});

app.get("/", (req, res) => {
  res.send("eBitirmeProjesi API'si çalışıyor");
});


app.use("/active", activeStudentsRouter);
app.use("/upload", uploadRouter);
app.use("/passive", passiveStudentsRouter);
app.use("/action", actionRouter);

app.listen(process.env.PORT, () => {
  console.log("Server 3000 portunda çalışıyor!");
});
