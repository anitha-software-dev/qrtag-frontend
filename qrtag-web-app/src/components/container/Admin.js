import {useState} from "react"
import Qrtag from "./Qrtag.jsx"
import {withAuthenticator} from '@aws-amplify/ui-react'
import '@aws-amplify/ui-react/styles.css'

import axios from "axios"
import { CSVLink } from "react-csv";
import { QRCodeSVG } from 'qrcode.react';

const apiURL = process.env.REACT_APP_API_URL

function Admin({signOut, user}) {
    //tracking input in state
    const [formValues, setFormValues] = useState({
      // Default state for the form.
      amount: 1,
      prefix: "",
      development: false
    })
    const [qrtags, setQrtags] = useState([])
  
    //changing input on changes
      const onChange = (e) =>{
        setFormValues({
          ...formValues,
          [e.target.name]: e.target.value
        })
    }
      const onBoxClick = () =>{
          setFormValues({
            ...formValues,
            development: !formValues.development
          })
      }

    //submition
    const onSubmit =(e)=>{
      e.preventDefault()
        axios.post(apiURL + "/qrtags", formValues)
          .then( res => {
            // Loop through the items and add the QRTag
            const qrtags = res.data;
            let newData = [];
            for (let tagObj of qrtags) { 
                let newObj = {
                  ...tagObj,
                  qrtag: (<QRCodeSVG value={tagObj.url} level='L' size="80"/>)
                }
                newData.push(newObj)
            }
            setQrtags(newData)
        })
      }
      
      const onDisplay =(e)=>{
        e.preventDefault()
        axios.get(apiURL + "/qrtags")
        .then( res => {
          // Loop through the items and add the QRTag
          const qrtags = res.data;
          let newData = [];
          for (let tagObj of qrtags) { 
              let newObj = {
                ...tagObj,
                qrtag: (<QRCodeSVG value={tagObj.url} level='L' size="80"/>)
              }
              newData.push(newObj)
          }
          setQrtags(newData)
      })

    }
    
    return (
      <div className="d-flex flex-column justify-content-between text-center text-white" >
        <header>
          <form className="d-flex flex-column align-items-center form p-3" style={{background: "#0a4275"}}>
          <h1>Generate QRTags</h1>  
                <div className="d-flex justify-content-evenly">
                  <div className="p-1 col-md-5">
                      <label>Quantity: </label>
                      <input className="form-control" name="amount" value={formValues.amount} onChange={onChange} placeholder="1"></input>
                  </div>
                  <div className="p-1 col-md-5">
                    <label>Prefix: </label>
                    <input className="form-control" name="prefix" value={formValues.prefix} onChange={onChange} placeholder="none"></input>
                  </div>
                </div>
                <div className="p-1">
                  <input className="form-check-input" name="development" value={formValues.development} onChange={onBoxClick} type="checkbox"></input>
                  <label className="form-check-label">create with local IP address</label>
                </div>
                <div className="p-1">
                  <button className="btn btn-outline-light btn-rounded" type="submit" onClick={onSubmit}>Create</button>
                  or
                  <button className="btn btn-outline-light btn-rounded" onClick={onDisplay}>Display Existing</button>
                </div>
          </form>
          
          <div className="qrtags text-dark">
            
            {qrtags.length > 0
              ?
                <Qrtag tags={qrtags}/>
              : <p>No QR-tags yet...</p>
            }            
          </div>
        </header>
        
        <footer className="text-center text-white" style={{background: "#0a4275"}}>
        {qrtags.length > 0
              ? 
                <div className="d-flex justify-content-end container p-2 pb-0 download"style={{background: "#0a4275"}}>
                  <CSVLink className="btn btn-outline-light btn-rounded p-1.5" data={qrtags}>Download CSV</CSVLink>
                </div>
              : <></>
            }
          <div className="text-center p-2" style={{background:"rgba(0, 0, 0, 0.2)"}}>
            <p>Hello {user?.attributes.email}</p>
                  <button onClick={signOut} className="btn btn-outline-light btn-rounded">Sign out</button>                
          </div>
        </footer>

      </div>
    );
  }

  export default withAuthenticator(Admin);
