var admin = require("firebase-admin");
var serviceAccount = require("../supportedfiles/google-services.json");
var messages = require("../messages/strings")
module.exports = {
    db_connect: function()
    {
        return new Promise((resolve, reject) => {
            if(admin.apps.length == 0)
            {
                admin.initializeApp({
                    credential: admin.credential.cert(serviceAccount)
                });
            }
              let db = admin.firestore()
              if(db != undefined)
              {
                resolve(db)
              }else{
                  reject(messages.strings.authFail)
              }
        });
    },

    authConnect: function()
    {
        if(admin.apps.length == 0)
        {
            admin.initializeApp({
                credential: admin.credential.cert(serviceAccount)
              });
        }
        return new Promise((resolve, reject) => {
              let auth = admin.auth()
              if (auth != undefined)
              {
                resolve(auth)
              }else
              {
                  reject(messages.strings.authFail)
              }
        });
    }
}