const Person = require('../backend/models/person')

const initialPersons = [
  {
    name: 'Jussi Sture',
    number: '040-999999'
  },
  {
    name: 'Robert De Node',
    number: '045-459888'
  }
]

const nonExistingId = async () => {
  const person = new Person({ name: 'Remove This Soon', number: '011-11111' })
  await person.save()
  await person.deleteOne()

  return person._id.toString()
}

const personsInDb = async () => {
  const persons = await Person.find({})
  return persons.map((p) => p.toJSON())
}

module.exports = {
  initialPersons,
  nonExistingId,
  personsInDb
}
