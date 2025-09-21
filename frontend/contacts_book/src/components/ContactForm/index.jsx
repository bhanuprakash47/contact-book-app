import { useState ,useEffect}  from "react"

import LoadingView from "../Loader"
import FailureView from "../FailureView"

const apiStatusConstants={
     initial: 'INITIAL',
    success: 'SUCCESS',
    failure: 'FAILURE',
    inProgress: 'IN PROGRESS',
}

const ContactForm=()=>{
    const [name,setName]=useState("")
    const [email,setEmail]=useState("")
    const [phone,setPhone]=useState("")
    const [formDetails,updateFormDetails]=useState({})
    const [mailErrorMsg,setMailErrMsg]=useState("")
    const [phoneErrorMsg,setPhoneErrMsg]=useState("")
    const [contactsList,updateContactsList]=useState([])
    const [apiStatus,setApiStatus]=useState(apiStatusConstants.initial)
    
    const onChangeName=(event)=>setName(event.target.value)
    const onChangeEmail=(event)=>setEmail(event.target.value)
    const onChangePhoneNumber=(event)=>setPhone(event.target.value)
    
    const SubmitForm=(event)=>{
        event.preventDefault()
        const emailregx = /^\S+@\S+\.\S+$/
        if (!emailregx.test(email)) {
            setMailErrMsg("Please enter a valid email address...")
            return
        } else {
            setMailErrMsg("")
        }

        const phoneRegex = /^\d{10}$/
        if (phone.length !== 10 || !phoneRegex.test(phone)) {
            setPhoneErrMsg("Please enter a valid 10-digit phone number...")
            return
        } else {
            setPhoneErrMsg("")
        }

    }


    useEffect(()=>{
            apiCall()
    },[])

    const apiCall=async()=>{
        setApiStatus(apiStatusConstants.inProgress)
        try {
            const responseData = await fetch("http://localhost:5000/contacts?page=1&limit=10") 
            if (responseData.ok === true) {
                const data = await responseData.json()
                updateContactsList(data)
                setApiStatus(apiStatusConstants.success)
                console.log("API call successful. Status:", apiStatusConstants.success);
            } else {
                setApiStatus(apiStatusConstants.failure)
                console.log("API call failed with response not OK. Status:", apiStatusConstants.failure);
            }
        } catch (e) {
            setApiStatus(apiStatusConstants.failure)
            console.error("Error fetching data:", e);
        }

    }

    const renderContactsList=()=>{
        switch(apiStatus){
            case apiStatusConstants.inProgress:
                return <LoadingView/>
            case apiStatusConstants.failure:
                return <FailureView/>
            case apiStatusConstants.success:
                return (<div className="contacts-list-container">
                {contactsList.map((each) => (
                    <div key={each.id} className="contact-item">
                        <p className="contact-name">{each.name}</p>
                        <p className="contact-email">{each.email}</p>
                        <p className="contact-phone">{each.phone}</p>
                    </div>
                ))}
            </div>)
            default:
                return null
        }
    }

    return(
        <div className="form-container">
            <h1 className="form-heading">Add Contacts by filling details below</h1>
            <form className="form-card"  onSubmit={SubmitForm}>
                <div className="input-container">
                    <label htmlFor="name" className="label-element">Name</label>
                    <input 
                        className="input-element"  
                        type="text" placeholder="Enter Name" 
                        onChange={onChangeName} 
                        id="name"
                        value={name}
                    />
                </div>
                 <div className="input-container">
                    <label htmlFor="email" className="label-element">Email</label>
                    <input 
                        className="input-element"  
                        type="text" placeholder="Enter Email" 
                        onChange={onChangeEmail} 
                        id="email"
                        value={email}
                    />
                    <p className="error-message">{mailErrorMsg}</p>
                </div>
                 <div className="input-container">
                    <label htmlFor="phone" className="label-element">Mobile Number</label>
                    <input 
                        className="input-element"  
                        type="text" placeholder="Enter Phone Number" 
                        onChange={onChangePhoneNumber} 
                        id="phone"
                        value={phone}
                    />
                    <p className="error-message">{phoneErrorMsg}</p>
                </div>
                <button className="add-button" type="submit">Add Contact</button>
            </form>
            {renderContactsList()}
        </div>
    )

}

export default ContactForm