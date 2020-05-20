const express = require('express'),
      app = express();
      bodyParser = require('body-parser');
      mongoose   = require('mongoose');

app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json())
mongoose.connect('mongodb+srv://tarun:QyDqfwsy7sulkeIo@cluster0-a0vpp.mongodb.net/minds2mentor?retryWrites=true&w=majority',{useNewUrlParser: true, useUnifiedTopology: true}).catch((err)=>{
  console.log(err);
})

app.post('/book',async (req,res)=>{
  console.log(req.body);
  res.json({
    "status": "received"
  })
})

app.get('/',(req,res)=>{
  res.send('no content here');
})

app.listen(3000,()=>{
  console.log('restro-booking!!!');
})
