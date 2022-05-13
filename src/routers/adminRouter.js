const express = require('express');

//we use debug to debug the mongo information and include it in admin route
const debug = require('debug')('app:adminRouter');
const { MongoClient } = require('mongodb');
const sessions = require('../data/sessions.json')


const adminRouter = express.Router();

adminRouter.route('/').get((req, res) => {
 const url ='mongodb+srv://globomantics:globo@globomantics.olcrp.mongodb.net?retryWrites=true&w=majority';

  const dbName ='globomantics';

(async function mongo(){
let client;
try {
  client = await MongoClient.connect(url);
  debug('Connected to the mongo DB');

//create instance of our mongo database
const db = client.db(dbName);

const response  =await db.collection('sessions').insertMany(sessions);

//sending back the response back to the browser page getting it
res.json(response);
} catch (error) {
  debug(error.stack);
}
client.close();
})();

});


module.exports =adminRouter