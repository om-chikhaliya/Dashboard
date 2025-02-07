const Checkbox = ({ checked, onChange, id, className }) => {
    return (
      <input
        type="checkbox"
        id={id}
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        className={`rounded ${className}`}
      />
    )
  }
    
    export default Checkbox