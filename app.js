const express = require('express'),
      app = express();
      bodyParser = require('body-parser'),
      mongoose   = require('mongoose'),
      booking    = require('./models/booking'),
      user    = require('./models/user'),
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json())
mongoose.connect('mongodb+srv://tarun:QyDqfwsy7sulkeIo@cluster0-a0vpp.mongodb.net/minds2mentor?retryWrites=true&w=majority',{useNewUrlParser: true, useUnifiedTopology: true}).catch((err)=>{
  console.log(err);
})

app.post('/book',async (req,res)=>{
  try{
    // console.log(req.body.queryResult);
    // console.log(req.body.queryResult.outputContexts)
    if(req.body.queryResult.intent.displayName==='getName'){
        let name = req.body.queryResult.parameters.name;
        let session = req.body.session.split("/");
        let sessionId = session[session.length-1];
        let newUser = {
         name: name,
         sessionId: sessionId
        };
        let addedUser = await user.create(newUser);
        let response = {
          "fulfillmentMessages": [
            {
              "text": {
                "text": [
                  "Hello, "+name+" how may i help you today?"
                ]
              }
            }
          ],
          "payload": {
              "google": {
                "expectUserResponse": true,
                "richResponse": {
                  "items": [
                    {
                      "simpleResponse": {
                        "textToSpeech": "Hello, " + name + ". How may I help you today?"
                      }
                    }
                  ],
                  "suggestions": [
                        {
                          "title": "Book a table"
                        }
                  ]
                }
              }
            }
        }
        res.json(response)
    }else if(req.body.queryResult.intent.displayName==='bookTable'){
      // console.log('in')
      // console.log(req.body.queryResult.outputContexts)
      let date = req.body.queryResult.parameters.date;
      let pos = req.body.queryResult.parameters.date.indexOf('T');
      let saveDate = date.substring(0,pos);
      let time = req.body.queryResult.parameters.time;
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
          ],
          "payload": {
              "google": {
                "expectUserResponse": true,
                "richResponse": {
                  "items": [
                    {
                      "simpleResponse": {
                        "textToSpeech": "Booking available, confirm booking?"
                      }
                    }
                  ]
                }
              }
            }
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
          "payload": {
              "google": {
                "expectUserResponse": true,
                "richResponse": {
                  "items": [
                    {
                      "simpleResponse": {
                        "textToSpeech": "Booking not available, please pick a different time."
                      }
                    }
                  ]
                }
              }
            },
          "outputContexts": req.body.queryResult.outputContexts
        }
        res.json(response)
      }
    }else if(req.body.queryResult.intent.displayName==='bookTable - yes'){
      console.log(req.body.queryResult);
      let contexts = req.body.queryResult.outputContexts;
      let index = contexts.findIndex((context)=>{
        let someParts = context.name.split('/');
        return someParts[someParts.length-1] === 'getname'
      })
      console.log(index)
      let name = contexts[index].parameters.name;
      let date = contexts[index].parameters.date;
      let time = contexts[index].parameters.time;
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
        ],
        "payload": {
            "google": {
              "expectUserResponse": true,
              "richResponse": {
                "items": [
                  {
                    "simpleResponse": {
                      "textToSpeech": "Booking confirmed, have a nice day."
                    }
                  }
                ]
              }
            }
          }
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
