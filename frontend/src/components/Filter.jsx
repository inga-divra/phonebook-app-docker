
const Filter = ({ filteredChar, handleFilterChange }) => {
    return (
        <div>
            <span>filter shown with </span>
            <input value={filteredChar} onChange={handleFilterChange} type='text' />
        </div>
    )
}

export default Filter