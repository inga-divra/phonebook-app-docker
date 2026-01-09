
const PersonForm = (props) => {
    const { addData, newName, newNumber, handleNameChange, handleNumberChange } = props
    return (
        <form onSubmit={addData}>
            <div style={{ marginBottom: '10px' }}>
                name: <input value={newName} onChange={handleNameChange} required type='text' />
            </div>
            <div style={{ marginBottom: '10px' }}>
                number: <input value={newNumber} onChange={handleNumberChange} type='text' />
            </div>
            <div>
                <button type="submit">add</button>
            </div>
        </form>
    )
}

export default PersonForm