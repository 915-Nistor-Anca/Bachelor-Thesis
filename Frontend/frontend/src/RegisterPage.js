import './RegisterPage.css'
  
function Register() { 
    return ( 
        <div className="register-container">
        <div className="register-box">
        <h2 className="register-title">Register</h2>
  
            <form>
                <input
                    type="text"
                    placeholder="Username"
                />  
                <input
                    type="email"
                    placeholder="Email"
                />  
                <input
                    type="password"
                    placeholder="Password"
                /> 
                <button type="button"> 
                    Register 
                </button> 
            </form> 
        </div> 
        </div>
    ); 
} 

export default Register;