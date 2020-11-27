const express = require("express");
const app = express();
const cors = require("cors");

const nodemailer = require("nodemailer");
require("dotenv").config();

app.use(cors());
app.use(express.json());

app.post("/api/sendmail", async (request, response, next) => {
  try {
    const names = request.body.names;
    console.log(request.body);
    //   const names = [
    //     {
    //       email: "tothpeter1216@gmail.com",
    //       giftTo: "Mozart",
    //     },
    //     {
    //       email: "7peregrin@gmail.com",
    //       giftTo: "Beethoven",
    //     },
    //   ];
    names.map((name) => {
      sendMail(
        name.email,
        "Szia!\nEzt a levelet azért kaptad, mert valakinek a szervezésében részt vettél egy karácsonyi ajándékozós párosítás sorsolásában.\nValaki a te nevedet is 'kihúzta', de ami most fontosabb, neked is készülnöd kell egy ajándékkal. A következő személyt kell meglepned: " +
          name.giftTo +
          "     \n\nBoldog karácsonyt! :)"
      );
    });
    response.json({ message: "it works" });
  } catch (error) {
    console.log(error);
    response.status(500).json(error);
  }
});

const sendMail = (email, text) => {
  var transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.USER,
      pass: process.env.PASS,
    },
  });

  var mailOptions = {
    from: "codetheworlds@gmail.com",
    to: email,
    subject: "karácsony",
    text: text,
  };

  transporter.sendMail(mailOptions, function (error, info) {
    if (error) {
      console.log(error);
    } else {
      console.log("Email sent: " + info.response);
    }
  });
};

app.listen(process.env.PORT, () => {
  console.log("The server is runing on port " + process.env.PORT);
});
