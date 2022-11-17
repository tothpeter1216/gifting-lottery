const express = require("express")
const app = express()
const cors = require("cors")

const nodemailer = require("nodemailer")
const { google } = require("googleapis")
require("dotenv").config()

app.use(cors())
app.use(express.json())
app.use(express.static("build"))

const CLIENT_ID = process.env.CLIENT_ID
const CLIENT_SECRET = process.env.CLIENT_SECRET
const REDIRECT_URI = process.env.REDIRECT_URI

const USER = process.env.process.env.USER
const PASS = process.env.process.env.PASS

const REFRESH_TOKEN = process.env.REFRESH_TOKEN

const oAuth2Client = new google.auth.OAuth2(CLIENT_ID, CLIENT_SECRET, REDIRECT_URI)
oAuth2Client.setCredentials({ refresh_token: REFRESH_TOKEN })

app.post("/api/sendmail", async (request, response, next) => {
    try {
        const names = request.body.names

        names.map((name) => {
            sendMail(
                name.email,
                "Szia!\nEzt a levelet azért kaptad, mert részt vettél egy karácsonyi ajándékozás sorsolásában.\nValaki a te nevedet is 'kihúzta', de ami most fontosabb, neked is készülnöd kell egy ajándékkal. \nA következő személyt kell meglepned: ***" +
                    name.giftTo +
                    "***\n\nBoldog karácsonyt! :)"
            )
        })
        console.log("it works")
        response.json({ message: "it works" })
    } catch (error) {
        console.log(error)
        response.status(500).json(error)
    }
})

const sendMail = async (email, text) => {
    try {
        const accessToken = await oAuth2Client.getAccessToken()

        var transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: USER,
                pass: PASS,
                // type: "OAuth2",
                // user: "codemyworlds@gmail.com",
                // clientId: CLIENT_ID,
                // clientSecret: CLIENT_SECRET,
                // refreshToken: REFRESH_TOKEN,
                // accessToken: accessToken,
            },
        })

        var mailOptions = {
            from: "a Mikulás <codemyworlds@gmail.com>",
            to: email,
            subject: "karácsony",
            text: text,
        }

        transporter.sendMail(mailOptions, function (error, info) {
            if (error) {
                console.log(error)
            } else {
                console.log("Email sent: " + info.response)
            }
        })
    } catch (error) {
        return error
    }
}

app.listen(process.env.PORT, () => {
    console.log("The server is runing on port " + process.env.PORT)
})
