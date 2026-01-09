import { useState, useEffect } from 'react'
import Filter from './components/Filter'
import PersonForm from './components/PersonForm'
import Persons from './components/Persons'
import personService from './services/persons'
import Notification from './components/Notification'


const App = () => {
  const [persons, setPersons] = useState([])
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [filteredChar, setFilteredChar] = useState('')
  const [notificationMsg, setNotificationMsg] = useState(null)
  const [notificationType, setNotificationType] = useState(null)

  const fetchData = () => {
    personService
      .getAll()
      .then(initialPersons => {
        setPersons(initialPersons)
      })
  }

  useEffect(() => {
    fetchData()
  }, [])


  //check for existing name
  const checkForName = (name) => {
    return persons.find(person => person.name === name)
  }


  const addData = (e) => {
    e.preventDefault()

    const existingName = checkForName(newName)

    if (existingName) {
      if (window.confirm(`${newName} is already added to phonebook, replace the old number with the new one?`)) {
        const updatedPerson = { ...existingName, number: newNumber }

        personService
          .update(existingName.id, updatedPerson)
          .then(returnedPerson => {
            setPersons(persons.map(person => person.id !== existingName.id ? person : returnedPerson));
            setNewName('');
            setNewNumber('');
            setNotificationMsg(`Updated ${updatedPerson.name}'s phone number`)
            setNotificationType('success');
            setTimeout(() => {
              setNotificationMsg(null)
            }, 5000)
          });
      }
    } else {
      const newPerson = {
        name: newName,
        number: newNumber
      }

      personService.create(newPerson)
        .then(returnedPerson => {
          setPersons(persons.concat(returnedPerson))
          setNewName('')
          setNewNumber('')
          setNotificationMsg(`Added ${newPerson.name}`)
          setNotificationType('success');
          setTimeout(() => {
            setNotificationMsg(null)
          }, 5000)
        }).catch(error => {
          const errorMessage = error.response.data.error;
          setNotificationMsg(errorMessage);
          setNotificationType('error');
          console.log(error.response.data)
          setTimeout(() => {
            setNotificationMsg(null);
          }, 5000);
        });
    }
  }

  const handleDeletePerson = (id, name) => {
    if (window.confirm(`Delete ${name}`)) {
      personService
        .remove(id)
        .then(() => {
          setPersons(persons.filter(person => person.id !== id))
          setNotificationMsg(`Deleted ${name}`)
          setNotificationType('success');
          setTimeout(() => {
            setNotificationMsg(null)
          }, 5000)
        })
        .catch(error => {
          setNotificationMsg(`Information of ${name} has already been removed from server`);
          setNotificationType('error');
          setTimeout(() => {
            setNotificationMsg(null)
          }, 5000)
        })
    }
  }

  const handleNameChange = (e) => {
    const updatedNewName = e.target.value
    setNewName(updatedNewName)
  }

  const handleNumberChange = (e) => {
    const updatedNewNumber = e.target.value
    setNewNumber(updatedNewNumber)
  }

  const handleFilterChange = (e) => {
    const updatedFilteredChar = e.target.value
    setFilteredChar(updatedFilteredChar);
  }

  const personsToShow = persons.filter((person) => {
    return person.name.toLowerCase().includes(filteredChar.toLowerCase())
  })

  return (
    <div>
      <div>
        <h2>Phonebook</h2>
        <Notification message={notificationMsg} type={notificationType} />
      </div>
      <Filter filteredChar={filteredChar} handleFilterChange={handleFilterChange} />
      <h2>Add a new</h2>
      <PersonForm
        addData={addData}
        newName={newName}
        newNumber={newNumber}
        handleNameChange={handleNameChange}
        handleNumberChange={handleNumberChange} />
      <h2>Numbers</h2>
      <Persons personsToShow={personsToShow} handleDeletePerson={handleDeletePerson} />
    </div>
  )

}

export default App