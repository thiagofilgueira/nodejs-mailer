var app = require('express')();
var http = require('http').Server(app);
const nodemailer = require('nodemailer');

// Generate SMTP service account from ethereal.email
nodemailer.createTestAccount((err, account) => {

    if (err) {
        console.error('Failed to create a testing account. ' + err.message);
        return process.exit(1);
    }

    const transporter = nodemailer.createTransport({
        host:  account.smtp.host,
        port: account.smtp.port,
        secure: account.smtp.secure, // true for 465, false for other ports
        auth: {
            user: account.user, // generated ethereal user
            pass: account.pass // generated ethereal password
        },
        tls: { rejectUnauthorized: false }
    });
    
    const mailOptions = {
        from: 'Sender 👻 <sender@example.com>', // sender address
        to: 'Recipient <recipient@example.com>', // list of receivers
        subject: 'Hello! ✔', // Subject line
        text: 'Plain text body', // plain text body
        html: `
            <h1>Title</h1>
            <p>Text</>
        `
    };
    
    transporter.sendMail(mailOptions, function(error, info){
        if (error) {
          console.log(error);
        } else {
            console.log('Email enviado: ' + info.response);
            console.log('Message sent: %s', info.messageId);
            // Preview only available when sending through an Ethereal account
            console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
        }
    });

});

app.get('/', function(req, res){
    res.send("Server UP!");
});

http.listen(3001, function(){
    console.log('listening on *:3001');
});