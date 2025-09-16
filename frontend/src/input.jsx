const Input = ({name,value,label,onChange,type}) => {
    return (
        <div className='form-class'>
            <label htmlFor={name}>{label}</label>
            <input
                onChange={onChange}
                value={value}
                /*ref={this.username}*/ 
                name={name}   
                id={name}
                type={type}
            />
        </div>
    )
}
export default Input