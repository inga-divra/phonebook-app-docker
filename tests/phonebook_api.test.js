const assert = require('node:assert')
const { test, after, beforeEach } = require('node:test')
const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../backend/app')
const helper = require('../tests/test_helper')
const Person = require('../backend/models/person')

const api = supertest(app)

const initialPersons = [
  { name: 'Peeter Ronneberg', number: '09-4567899' },
  { name: 'John Sture', number: '044-6543210' }
]

beforeEach(async () => {
  await Person.deleteMany({})
  await Person.insertMany(helper.initialPersons)
})

test('all persons are returned', async () => {
  const persons = await helper.personsInDb()
  assert.strictEqual(persons.length, helper.initialPersons.length)
})

test('another specific person is within the returned persons', async () => {
  const response = await api.get('/api/persons')

  const names = response.body.map((person) => person.name)
  assert(names.includes('John Sture'))
})

test('a valid person can be added', async () => {
  const newPerson = {
    name: 'Jukka Pekka',
    number: '044-444444'
  }

  await api
    .post('/api/persons')
    .send(newPerson)
    .expect(201)
    .expect('Content-Type', /application\/json/)

  const personsAtEnd = await helper.personsInDb()
  assert.strictEqual(personsAtEnd.length, helper.initialPersons.length + 1)

  const names = personsAtEnd.map((p) => p.name)
  assert(names.includes('Jukka Pekka'))
})

test('person without name is not added', async () => {
  const newPerson = {
    number: '044-444444'
  }

  await api.post('/api/persons').send(newPerson).expect(400)

  const personsAtEnd = await helper.personsInDb()
  assert.strictEqual(personsAtEnd.length, helper.initialPersons.length)
})

test('a specific person can be viewed', async () => {
  const personsAtStart = await helper.personsInDb()
  const personToView = personsAtStart[0]

  const resultPerson = await api
    .get(`/api/persons/${personToView.id}`)
    .expect(200)
    .expect('Content-Type', /application\/json/)

  assert.deepStrictEqual(resultPerson.body, personToView)
})

test('a person can be deleted', async () => {
  const personsAtStart = await helper.personsInDb()
  const personToDelete = personsAtStart[0]

  await api.delete(`/api/persons/${personToDelete.id}`).expect(204)

  const personsAtEnd = await helper.personsInDb()

  const names = personsAtEnd.map((person) => person.name)
  assert(!names.includes(personToDelete.name))

  assert.strictEqual(personsAtEnd.length, helper.initialPersons.length - 1)
})

after(async () => {
  await mongoose.connection.close()
})
