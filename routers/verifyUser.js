var database = require('../database/db');
var messages = require('../messages/strings');
var connections = require('../models/connections')
const Joi = require('joi');
const { Timestamp } = require('@google-cloud/firestore');

exports.checkUserAvailability = function(req, res)
{
    var schema = undefined
    if (req.body.type == "unknown")
    {
         schema = Joi.object().keys({
            mobile: Joi.string().required(),
            uid: Joi.string().required(),
            type: Joi.string().required()
          });
    }else
    {
        schema = Joi.object().keys({
            mobile: Joi.string().required(),
            uid: Joi.string().required(),
            type: Joi.string().required(),
            operatorName : Joi.string().required(),
            businessName : Joi.string().required(),
            businessImage : Joi.string().allow(null).allow('').optional(),
            businessType : Joi.string().required(),
            businessSubType : Joi.string().required(),
            businessSubTypeName : Joi.string().allow(null).allow('').optional(),
          });
    }
    const validation = schema.validate(req.body);
    if (validation.error)
    {
        res.status(200).end(JSON.stringify({status:messages.strings.fail, message:validation.error.details[0].message}));
    }else
    {
        database.authConnect().then(auth => {
             auth.getUserByPhoneNumber(req.body.mobile).then((user,error) => {
                if (error) throw error
                if (user.uid == req.body.uid)
                {
                    database.db_connect().then(db => {
                        db.collection("users").doc(req.body.mobile).get().then((document) => {
                            if (!document.exists)
                            {
                                if (req.body.type == "unknown")
                                {
                                    res.status(200).end(JSON.stringify({status:messages.strings.success, message:messages.strings.user_not_fond}));
                                }else
                                {
                                    var mobileNumber = parseInt(req.body.mobile)
                                    var last4Digits = mobileNumber % 10000
                                    last4Digits = last4Digits.toString()
                                    var businessName = req.body.businessName
                                    businessName = businessName.split(' ').join('_')
                                    
                                    if(req.body.businessSubType == "Others")
                                    {
                                        var dbRef = "services"
                                        if (req.body.businessType == "Product")
                                        {
                                            dbRef = "products"
                                        }
                                        connections.addProdutsOrServicesData(db, dbRef, req.body.businessSubTypeName).then(isAdded => {
                                            const userSchema = {
                                                mobile : req.body.mobile,
                                                uid : req.body.uid,
                                                operatorName : req.body.operatorName,
                                                businessName : req.body.businessName,
                                                businessImage : req.body.businessImage,
                                                businessType : req.body.businessType,
                                                businessSubType : req.body.businessSubTypeName,
                                                storeURL : "http://lekkapakka.eu-4.evennode.com/api/services/storeInfo/"+businessName+last4Digits,
                                                isOnline : true,
                                                createdTime : Timestamp.fromDate(new Date()),
                                                updatedTime : Timestamp.fromDate(new Date())
                                            }
                                            connections.addUserData(db, userSchema).then(status => {
                                                res.status(200).end(JSON.stringify({status:messages.strings.success, message:messages.strings.user_added}));
                                            }).catch(message => {
                                                res.status(200).end(JSON.stringify({status:messages.strings.fail, message:message}));
                                            })
                                        }).catch(message => {
                                            res.status(200).end(JSON.stringify({status:messages.strings.fail, message:message}));
                                        })
                                    }else
                                    {
                                        const userSchema = {
                                            mobile : req.body.mobile,
                                            uid : req.body.uid,
                                            operatorName : req.body.operatorName,
                                            businessName : req.body.businessName,
                                            businessImage : req.body.businessImage,
                                            businessType : req.body.businessType,
                                            businessSubType : req.body.businessSubType,
                                            storeURL : "http://lekkapakka.eu-4.evennode.com/api/services/storeInfo/"+businessName+last4Digits,
                                            isOnline : true,
                                            createdTime : Timestamp.fromDate(new Date()),
                                            updatedTime : Timestamp.fromDate(new Date())
                                        }
                                        connections.addUserData(db, userSchema).then(status => {
                                            res.status(200).end(JSON.stringify({status:messages.strings.success, message:messages.strings.user_added, data : userSchema}));
                                        }).catch(message => {
                                            res.status(200).end(JSON.stringify({status:messages.strings.fail, message:message}));
                                        })
                                    }
                                }
                            }else
                            {
                                res.status(200).end(JSON.stringify({status:messages.strings.success, message:messages.strings.okMessage, data : document.data()}));
                            }
                        }).catch(error => {
                            res.status(200).end(JSON.stringify({status:messages.strings.fail, message:error}));
                        })
                    }).catch(error=>{
                        res.status(200).end(JSON.stringify({status:messages.strings.fail, message:error}));
                    })
                }else{
                    res.status(200).end(JSON.stringify({status:messages.strings.fail, message:messages.strings.authFail}));
                }
            });
        })
    }
}