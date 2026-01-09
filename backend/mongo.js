const mongoose = require('mongoose')
const Person = require('../backend/models/person')

if (process.argv.length < 3) {
  console.log('Give password as argument')
  process.exit(1)
}

const password = process.argv[2]

const url = `mongodb+srv://ingady:${password}@nodeexpressprojects.shkmp.mongodb.net/testPhonebookApp?retryWrites=true&w=majority&appName=NodeExpressProjects`

mongoose.set('strictQuery', false)
mongoose.connect(url).then(() => {
  const persons = [
    { name: 'Peeter Ronneberg', number: '09-4567899' },
    { name: 'John Sture', number: '044-6543210' }
  ]

  Person.insertMany(persons).then(() => {
    console.log('Persons saved!')

    Person.find({}).then((result) => {
      result.forEach((person) => {
        console.log(person)
      })

      mongoose.connection.close()
    })
  })
})
