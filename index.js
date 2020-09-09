const express = require('express')
const mongo = require('mongodb').MongoClient

// Database url
const url = 'mongodb://localhost:27017'

// Connect to the database
let db, trips, expenses
mongo.connect(url,  {
    useNewUrlParser: true,
    useUnifiedTopology: true
  }, (err, client) => {
    if (err) {
      console.log(err)
      return
    }
    db = client.db('tripcost')
    trips = db.collection('trips')
    expenses = db.collection('expenses')
  }
)

// initialize app
const app = express()

// middleware
app.use(express.json())

// **** Routes
// Add trip
app.post('/trip', (req, res) => {
  const name = req.body.name
  // add trip to the db
  trips.insertOne({name: name}, (err, result) => {
    if (err) {
      console.log(err)
      res.status(500).json({err: err})
      return
    }
    console.log(result)
    res.status(200).json({ok: true})
  })
})

// Add expense
app.post('/expense', (req, res) => {
  expenses.insertOne(
    {
      trip: req.body.trip,
      date: req.body.date,
      amount: req.body.amount,
      category: req.body.category,
      description: req.body.description
    },
    (err, result) => {
      if (err) {
        console.log(err)
        res.status(500).json({err: err})
        return
      }
      res.status(200).json({ok: true})
    }
  )
})

// List trips
app.get('/trips', (req, res) => {
  trips.find().toArray((err, items) => {
    if (err) {
      console.log(err)
      res.status(500).json({err: err})
      return
    }
    res.status(200).json({trips: items})
  })
})

// List expenses
app.get('/expenses', (req, res) => {
  expenses.find().toArray((err, items) => {
    if (err) {
      console.log(err)
      res.status(500).json({err: err})
      return
    }
    res.status(200).json({expenses: items})
  })
})


// Start app
app.listen(3000, ()=> console.log('Server ready'))




