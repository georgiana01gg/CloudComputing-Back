// messagesRouter.js
const connection = require("../db.js");
const mysql = require("mysql");
const express = require("express");
const { detectLanguage, translateText, } = require("../utils/translateFunctions.js");
const { LANGUAGE_ISO_CODE } = require("../utils/dictionaries.js");
const { sendMail } = require("../utils/mailFunctions.js");

const buildInsertQueryString = (senderName, senderMail, receiverMail, messageContent) => {
    const queryString = `INSERT INTO messages (senderName, senderMail, receiverMail, messageContent) 
        VALUES (${mysql.escape(senderName)}, ${mysql.escape(senderMail)}, ${mysql.escape(receiverMail)}, ${mysql.escape(messageContent)})`;
    return queryString;
};

const router = express.Router();




router.get("/", (req, res) => {
  connection.query("SELECT * FROM messages", (err, results) => {
    if (err) {
      return res.send(err);
    }

    return res.json({
      messages: results,
    });
  });
});

router.post("/", (req, res) => {
  const { senderName, senderMail, receiverMail, messageContent } = req.body;
  
  if (!senderName || !senderMail || !receiverMail || !messageContent || !language) {
    // send bad request error
    return res.status(400).send("Bad request. Missing parametres.");
  }

  const queryString = `INSERT INTO messages (senderName, senderMail, receiverMail, messageContent) VALUES (${mysql.escape(
    senderName
  )}, ${mysql.escape(senderMail)}, ${mysql.escape(
    receiverMail
  )}, ${mysql.escape(messageContent)})`;

  connection.query(queryString, (err, results) => {
    if (err) {
      return res.send(err);
    }

    return res.json({
      data: results,
    });
  });
});

// Add get by id route
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

// Add delete by id route
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

// Add update by id route
router.put("/:id", (req, res) => {
    const { id } = req.params;
    if (!id) {
        // send bad request error
        return res.status(400).send("Bad request. Missing parametres.");
    }
    const { senderName, senderMail, receiverMail, messageContent } = req.body;
    if (!senderName || !senderMail || !receiverMail || !messageContent) {
        // send bad request error
        return res.status(400).send("Bad request. Missing parametres.");
    }
    const queryString = `UPDATE messages SET senderName = ${mysql.escape(senderName)}, senderMail = ${mysql.escape(senderMail)}, receiverMail = ${mysql.escape(receiverMail)}, messageContent = ${mysql.escape(messageContent)} WHERE entryID = ${mysql.escape(id)}`;
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

router.post("/foreign", async (req, res) => {
  const { senderName, senderMail, receiverMail, messageContent, language } =
      req.body;
      
  if (!senderName || !senderMail || !receiverMail || !messageContent || !language) {
      // send bad request error
      return res.status(400).send("Bad request. Missing parametres.");
  }

    if (!LANGUAGE_ISO_CODE[language] && language !== ALL) {
        console.log(language);
        return res.status(400).send("Invalid language");
    }

  let translationData = {};

  const queryString = buildInsertQueryString(senderName, senderMail, receiverMail, messageContent);

  try {
      //Translate the message in one or more languages
      if (LANGUAGE_ISO_CODE[language]) {
          const originalLanguageResponse = await detectLanguage(messageContent);
          translationData.originalLanguage = originalLanguageResponse[0]?.language;

          const translatedTextResponse = await translateText(
              messageContent,
              LANGUAGE_ISO_CODE[language]
          );
          translationData.translatedText = translatedTextResponse[0];
      }

      else if (language === "ALL") {
          const originalLanguageResponse = await detectLanguage(messageContent);
          translationData.originalLanguage = originalLanguageResponse[0]?.language;
          const availableLanguages = Object.values(LANGUAGE_ISO_CODE);

          const translatedAnswersArray = await Promise.all(
              availableLanguages.map(async (language) => {
                  const translatedTextResponse = await translateText(messageContent, language);
                  return translatedTextResponse[0];
              })
          );
          translationData.translatedText = translatedAnswersArray.reduce(
              (acc, curr) => {
                  return acc + curr + "\n";
              },
              ""
          );
      }


      else {
          return res.send("Language not supported");
      }

      //Send the message through the mail service
      const sendMailResponse = await sendMail(
          receiverMail,
          senderMail,
          senderName + "" + " sent you a message",
          translationData.translatedText
      );

      // Store original message in database
      connection.query(queryString, (err, results) => {
          if (err) {
              return res.send(err);
          }

          return res.json({
              data: results,
              translationData,
          });
      });
  } catch (err) {
      console.log(err);
      return res.send("Something went wrong");
  }
});

module.exports = router;