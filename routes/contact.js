var express = require('express');
var router = express.Router();
var mailgun = require('mailgun-js')({
  apiKey: process.env.MAILGUN_API_KEY,
  domain: process.env.MAILGUN_DOMAIN
});
var info_email = process.env.INFO_EMAIL;
var webmaster_email = process.env.WEBMASTER_EMAIL;

router.post('/support', function(req, res) {

  if (!req.body) {
    res.sendStatus(409);
    return;
  }

  req.app.render('contact', req.body, function(err, html) {
    if (err) {
      res.sendStatus(409);
      return;
    }

    var data = {
      from: req.body.name + ' <' + req.body.email + '>',
      to: info_email,
      bcc: webmaster_email,
      subject: req.body.subject,
      html: html
    };

    mailgun.messages().send(data, function (err, body) {
      if (err) {
        res.sendStatus(409);
        return;
      }

      res.json({});
    });
  });
  
});

module.exports = router;
