
const Persons = ({ personsToShow, handleDeletePerson }) => {
    return (
        <div>
            {personsToShow.map((person) => {
                const { id, name, number } = person
                return <p
                    key={name}>
                    {name} {number}
                    <button onClick={() => handleDeletePerson(id, name)}
                        type="button"
                        style={{
                            marginLeft: '10px',
                            padding: '3px 5px',
                            backgroundColor: '#1A74ED',
                            borderRadius: '5px',
                            border: 'transparent',
                            cursor: 'pointer'
                        }}>
                        delete
                    </button>
                </p>
            })}
        </div>
    )
}

export default Persons