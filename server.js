const express = require('express');
const bodyParser= require('body-parser');
const app = express();
const MongoClient = require('mongodb').MongoClient
const connectionString = "mongodb+srv://<username>:<password>@cluster0.wsehm.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";
app.set('view engine', 'ejs')
app.use(bodyParser.urlencoded({ extended: true }))
app.use(express.static('public'))
app.use(bodyParser.json())


MongoClient.connect(connectionString, { useUnifiedTopology: true })
  .then(client => {
    console.log('Connected to Database')
    const db = client.db('star-wars-quotes')
    const quotesCollection = db.collection('quotes')
    
    app.get('/', (req, res) => {
      db.collection('quotes').find().toArray()
        .then(results => {
          console.log(results)
          res.render('index.ejs', { quotes: results })
        })
        .catch('')
    })

    app.post('/quotes', (req, res) => {
      quotesCollection.insertOne(req.body)
        .then(result => {
          res.redirect('/')
        })
        .catch(error => console.error(error))
    })

    app.put('/quotes', (req, res) => {
      console.log(req.body)
      quotesCollection.findOneAndUpdate(
        { name: 'rafli' },
        {
          $set: {
            name: req.body.name,
            quote: req.body.quote
          }
        },
        {
          upsert: true
        }
      )
        .then(result => {
          console.log(result)
         }) 
        .catch(error => console.error(error))
    })

    app.delete('/quotes', (req, res) => {
      quotesCollection.deleteOne( { name: req.body.name })
        .then(result => {
          if (result.deletedCount === 0) {
            return res.json('No quote to delete')
          }
          res.json(`Deleted Darth Vadar's quote`)
        })
        .catch(error => console.error(error))
    })
    

  })
  .catch(console.error)


app.listen(3000, function() {
  console.log('listening on 3000')
})
