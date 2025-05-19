import { useState } from "react"


function NewUser({onSubmit,onCancel}) {

    const [name,setName] = useState('')

    const handleClick = (e) => { 
    e.preventDefault()
    onSubmit(name)
    }
    return (
        <>
            <div>
                <form onSubmit={handleClick}
                    style={{
                        position: 'absolute',
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                        backgroundColor: '#fff',
                        padding: '20px',
                        borderRadius: '8px',
                        boxShadow: '0 0 15px rgba(0,0,0,0.2)',
                        zIndex: 1000, // make sure it's above the canvas
                    }}>
                    <label>
                        Name: <input type="text" onChange={(e)=>{
                            setName(e.target.value)
                        }}required />
                    </label>
                    <br />
                    <button type="submit" >Create</button>
                    <button type="button" onClick={onCancel}>Cancel</button>
                </form>
            </div>
        </>
    )

}

export default NewUser
