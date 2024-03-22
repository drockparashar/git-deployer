import { useState } from "react";
import "./App.css"
import axios from "axios";

function App() {
  const [url,setUrl]=useState("");
  const [uploading,setUploading]=useState(false);
  const [deployed,setDeployed]=useState(false);
  const [id,setId]=useState("");
  return (
    <div className="parent">
     <div className="container">
        <div className="heading">Enter Your Github repository Url</div>
        <form className="form">
          <input
            className="input"
            type="text"
            id="username"
            placeholder="URL"
            onChange={(e)=>setUrl(e.target.value)}
          />
          <button type="submit" className="login-button" 
            onClick={async()=>{
              setUploading(true)
              const res=axios.post("http://localhost:3002/deploy",{
                repoUrl:url
              })
              setId(res.id);
              setUploading(false);
              const interval = setInterval(async () => {
                const response = await axios.get(`http://localhost:3002/status?id=${res.data.id}`);
          
                if (response.data.status === "deployed") {
                  clearInterval(interval);
                  setDeployed(true);
                }
              }, 3000)
            }} disabled={id !== "" || uploading}>
            
           
            {id ? `Deploying (${id})` : uploading ? "Uploading..." : "Upload"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default App;
