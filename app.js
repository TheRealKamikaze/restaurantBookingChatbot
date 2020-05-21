const express = require('express'),
      app = express();
      bodyParser = require('body-parser');
      mongoose   = require('mongoose');
      booking    = require('./models/booking')
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json())
mongoose.connect('mongodb+srv://tarun:QyDqfwsy7sulkeIo@cluster0-a0vpp.mongodb.net/minds2mentor?retryWrites=true&w=majority',{useNewUrlParser: true, useUnifiedTopology: true}).catch((err)=>{
  console.log(err);
})

app.post('/book',async (req,res)=>{
  try{
    console.log(req.body.queryResult);
    console.log(req.body.queryResult.outputContexts)
    if(req.body.queryResult.intent.displayName==='bookTable'){
      // console.log('in')
      // console.log(req.body.queryResult.outputContexts)
      let date = req.body.queryResult.parameters.date;
      let pos = req.body.queryResult.parameters.date.indexOf('T');
      let saveDate = date.substring(0,pos);
      let time = req.body.queryResult.parameters.time[0];
      let startPos = time.indexOf('T')+1;
      let endPos = time.indexOf('+');
      let saveTime = time.substring(startPos,endPos);
      let isAvailable = await booking.findOne({dateTime: saveDate + " "+ saveTime});
      // console.log(isAvailable);
      if(isAvailable===null){
        let response = {
          "fulfillmentMessages": [
            {
              "text": {
                "text": [
                  "Booking available, confirm booking?"
                ]
              }
            }
          ]
        }
        res.json(response)
      }else{
        let response = {
          "fulfillmentMessages": [
            {
              "text": {
                "text": [
                  "Booking not available, please pick a different time."
                ]
              }
            }
          ],
          "outputContexts": req.body.queryResult.outputContexts
        }
        res.json(response)
      }
    }else if(req.body.queryResult.intent.displayName==='bookTable - yes'){
      console.log(req.body.queryResult);
      let contexts = req.body.queryResult.outputContexts;
      let index = contexts.forEach((context)=>console.log(context.name))
      // console.log(index)
      let name = contexts[index].parameters.name;
      let date = contexts[index].parameters.date;
      let time = contexts[index].parameters.time[0];
      let guests = contexts[index].parameters.number;
      let pos = date.indexOf('T');
      let saveDate = date.substring(0,pos);
      let startPos = time.indexOf('T')+1;
      let endPos = time.indexOf('+');
      let saveTime = time.substring(startPos,endPos);
      let addBooking = {
        name: name,
        dateTime: saveDate + " " + saveTime,
        guests: 3
      }
      let booked = await booking.create(addBooking);
      console.log(booked)
      let response = {
        "fulfillmentMessages": [
          {
            "text": {
              "text": [
                "Booking confirmed, have a nice day."
              ]
            }
          }
        ]
      }
      res.json(response)
    }
  }catch(err){
    console.log(err);
  }
})

app.get('/',(req,res)=>{
  res.send('no content here');
})

app.listen(process.env.PORT, process.env.IP,()=>{
  console.log('restro-booking!!!');
})
