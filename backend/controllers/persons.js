const express = require('express')
const personsRouter = express.Router()
const Person = require('../models/person')

// Get ALL PERSONS
personsRouter.get('/', async (req, res) => {
  const persons = await Person.find({})
  res.json(persons)
})

// Create NEW PERSON/CONTACT
personsRouter.post('/', async (req, res, next) => {
  const body = req.body

  if (!body.name) {
    return res.status(400).json({ error: 'name missing' })
  }

  if (!body.number) {
    return res.status(400).json({ error: 'number missing' })
  }

  const person = new Person({
    name: body.name,
    number: body.number
  })

  const savedPerson = await person.save()
  res.status(201).json(savedPerson)
})

//UPDATE Person
personsRouter.put('/:id', (req, res, next) => {
  const { name, number } = req.body

  Person.findById(req.params.id)
    .then((person) => {
      if (!person) {
        return res.status(404).end()
      }

      person.name = name
      person.number = number

      return person.save().then((updatedPerson) => {
        res.json(updatedPerson)
      })
    })
    .catch((error) => next(error))
})

//Get SINGLE PERSON
personsRouter.get('/:id', async (req, res, next) => {
  const person = await Person.findById(req.params.id)
  if (person) {
    res.json(person)
  } else {
    res.status(404).end()
  }
})

//GET INFO
personsRouter.get('/info', (req, res, next) => {
  Person.countDocuments({})
    .then((personsTotal) => {
      const currentTime = new Date()
      res.send(`
        <p>Phonebook has info for ${personsTotal} people</p>
        <p>${currentTime}</p>
      `)
    })
    .catch((error) => next(error))
})

// DELETE Person/Contact
personsRouter.delete('/:id', async (req, res) => {
  await Person.findByIdAndDelete(req.params.id)
  res.status(204).end()
})

module.exports = personsRouter
