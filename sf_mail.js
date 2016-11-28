var nodemailer = require("nodemailer");

var transporter = nodemailer.createTransport('smtps://rahm.jihoon.lee%40gmail.com:rlehd3wndeo@smtp.gmail.com');

var mailOptions = {
    from:'"jihoon" <rahm.jihoon.lee@gmail.com>',
    to: 'frank.jihoon.lee@gmail.com',
    subject :'test!',
    text: 'your ',
    html: '<b>hi</b>'
};

transporter.sendMail(mailOptions, function(error, info){
    if(error){
        return console.log(error);
    }
    console.log('Message sent' + info.response);
});