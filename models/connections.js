var database = require('../database/db');
var messages = require('../messages/strings');
module.exports =
{
    addUserData: function(db, schema)
    {
        return new Promise((resolve, reject) => {
           let isAdded = addUserDataToDB(db, schema)
            if (isAdded != undefined)
            {
                resolve(true)
            }else{
                reject(messages.strings.dbError)
            }
        })
    },

    addProdutsOrServicesData: function(db, name, value)
    {
        return new Promise((resolve, reject) => {
           let isAdded =  addProdutsOrServicesDataToDB(db, name, value)
            if (isAdded != undefined)
            {
                resolve(true)
            }else{
                reject(messages.strings.dbError)
            }
        })
    }
}

async function addProdutsOrServicesDataToDB(db, name, value)
{
    let isAdded =  await db.collection(name).add({
        name : value,
        isEnabled  : true
    })
    
    return isAdded
}

async function addUserDataToDB(db, schema)
{
    let isAdded = await db.collection("users").doc(schema.mobile).set(schema)
    return isAdded
}