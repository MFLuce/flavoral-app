// ℹ️ Gets access to environment variables/settings
// https://www.npmjs.com/package/dotenv
require("dotenv/config");

//Nodemailer :
const nodemailer = require("nodemailer");

const message = `
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta http-equiv="X-UA-Compatible" content="IE=edge" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Document</title>
    <style>
      body {
        font-family: sans-serif;
      }

      p {
        margin: 2rem auto 0;
        text-align: center;
        max-width: 40ch;
      }

      h1,
      footer {
        text-align: center;
      }

      footer {
        margin-top: 2rem;
        background: #000;
        color: white;
        padding: 1.5rem;
      }
    </style>
  </head>
  <body>
    <h1>SENDING EMAILS THE 21st CENTURY WAY</h1>
    <p>
      Lorem ipsum dolor sit amet consectetur adipisicing elit. Est quos sed quod
      suscipit, labore quia quidem illum voluptate atque corrupti!
    </p>
    <img
      src="https://res.cloudinary.com/dlfxinw9v/image/upload/v1598868393/rd5ghxgs3wenbw6zz9yx.png"
      alt="Duffman"
      width="400"
      style="
        display: block;
        margin: 1em auto;
        box-shadow: rgba(0, 0, 0, 0.16) 0px 1px 4px;
        outline: 3px groove silver;
      "
    />
    <p>
      Lorem ipsum dolor sit amet consectetur adipisicing elit. Itaque asperiores
      eligendi, cupiditate qui laboriosam facilis!
    </p>
    <footer>Nodemailer | 2021</footer>
  </body>
</html>
`;

// 1. Create a Nodemailer transporter using either SMTP or some other transport mechanism
const transport = nodemailer.createTransport({
  //I put the emailtrap parameters than I found on my account
  host: "smtp.mailtrap.io",
  port: 2525,
  auth: {
    user: process.env.EMAIL_TEST,
    pass: process.env.PW_TEST,
  },
});

transport.sendMail({
  from: '"Fred Foo 👻" <sendersaddress@here.com>', // sender address
  to: "receiversaddress@here.com", // list of receivers
  subject: "WE ARE ALIVE! 🔥", // Subject line
  text: "Hello world?", // plain text body
  html: message, // html body
});
