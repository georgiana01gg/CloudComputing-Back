const express = require('express');
const mysql= require('mysql');
const router = express.Router();
const connection = require('../db');

//get all msg
router.get("/", (req, res) => {
    connection.query("SELECT * FROM messages", (err, results) => {
      if (err) {
        return res.send(err);
      }
  
      return res.json({
        data: results,
      });
    });
  });
  


  //get a msg by ID
  router.get("/:id", (req, res) => {
    const { id } = req.params;
    if (!id) {
        // send bad request error
        return res.status(400).send("Bad request. Missing parametres.");
    }
    const queryString = `SELECT * FROM messages WHERE entryID = ${mysql.escape(id)}`;
    connection.query(queryString, (err, results) => {
        if (err) {
            return res.send(err);
        }
        if (results.length === 0) {
            return res.status(404).send("Message not found.");
        }
        return res.json({
            messages: results,
        });
    }
    );
}
);

  //insert a msg
  router.post("/", (req, res) => {
      console.log(req.body);
      const {
        senderName,
        senderMail,
        receiverMail,
        messageContent
      } = req.body;

      if (!senderName || !senderMail || !receiverMail || !messageContent ) {
        // send bad request error
        return res.status(400).send("Bad request. Missing parametres.");
      }

      

      const queryString = `INSERT INTO messages (senderName, senderMail, receiverMail, messageContent) VALUES (${mysql.escape(senderName)}, ${mysql.escape(senderMail)}, ${mysql.escape(receiverMail)}, ${mysql.escape(messageContent)})`;

  connection.query(queryString, (err, results) => {
    if (err) {
      return res.send(err);
    }

    return res.json({
      data: results,
    });
  });
});




// delete by id route
router.delete("/:id", (req, res) => {
    const { id } = req.params;
    if (!id) {
        // send bad request error
        return res.status(400).send("Bad request. Missing parametres.");
    }
    const queryString = `DELETE FROM messages WHERE entryID = ${mysql.escape(id)}`;
    connection.query(queryString, (err, results) => {
        if (err) {
            return res.send(err);
        }
        if (results.length === 0) {
            return res.status(404).send("Message not found.");
        }
        return res.json({
            results,
        });
    }
    );
}
);


module.exports = router;