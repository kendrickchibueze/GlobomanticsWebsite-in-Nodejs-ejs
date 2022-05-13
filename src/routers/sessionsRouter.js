const express = require('express');

//we want to modify our session ie data to start coming out from mongodb instead of the direct json session file
const debug = require('debug')('app:sessionRouter');
const { MongoClient, ObjectID } = require('mongodb');
const speakerService = require('../services/speakerService')


const sessions = require('../data/sessions.json');
const sessionsRouter = express.Router();

//if u are not signedin, u cannot get to sessions page
sessionsRouter.use((req, res, next) => {
if(req.user){
next();
}else{
res.redirect('/auth/signIn');

}
})

sessionsRouter.route('/').get((req, res) =>{
    const url ='mongodb+srv://globomantics:globo@globomantics.olcrp.mongodb.net?retryWrites=true&w=majority';

    const dbName ='globomantics';

  (async function mongo(){
  let client;
  try {
    client = await MongoClient.connect(url);
    debug('Connected to the mongo DB');

  //create instance of our mongo database
  const db = client.db(dbName);

  //pull everything out from our database that is in sessions
  const sessions = await db.collection('sessions').find().toArray();

  //sending back the response back to the browser page getting it
//when we render session, we are passing an object that has session data in it
  res.render('sessions', {sessions});
  } catch (error) {
    debug(error.stack);
  }
  client.close();
  })();


 });

sessionsRouter.route('/:id').get((req, res) =>{
    const id = req.params.id;
    const url ='mongodb+srv://globomantics:globo@globomantics.olcrp.mongodb.net?retryWrites=true&w=majority';

    const dbName ='globomantics';

  (async function mongo(){
  let client;
  try {
    client = await MongoClient.connect(url);
    debug('Connected to the mongo DB');

  //create instance of our mongo database
  const db = client.db(dbName);

  //pull everything out from our database that is in sessions
  const session = await db.collection('sessions').findOne({_id: new ObjectID(id)});

  //feeding from third party Api
const speaker = await speakerService.getSpeakerById(session.speakers[0].id);

session.speaker = speaker.data;

//sending back the response back to the browser page getting it
//when we render session, we are passing an object that has session data in it
    //we are pulling the sessions from an external source
    res.render('session',  {
        session,
    });
  } catch (error) {
    debug(error.stack);
  }
  client.close();
  })();

})

module.exports =sessionsRouter;