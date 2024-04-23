import axios from "axios";
import { useContext, useState } from "react";
import { UserContext } from "./UserContext";

const RegisterAndLoginForm = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const { setUsername: setLoggedInUserName, setId } = useContext(UserContext);
  const [isLoginInOrRegister, setIsLoginInOrRegister] = useState("register");

  const handleSubmit = async (e) => {
    e.preventDefault();
const url = isLoginInOrRegister === 'register' ? 'register' : 'login';
    const { data } = await axios.post(url, { username, password });
    //console.log(data)
    setLoggedInUserName(username);
    setId(data.id);
  };
  return (
    <div className="bg-blue-50 h-screen flex items-center">
      <form action="" className="w-64 mx-auto mb-12" onSubmit={handleSubmit}>
        <input
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          type="text"
          placeholder="username"
          className="block w-full rounded-sm p-2 mb-2 border "
        />
        <input
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          type="text"
          placeholder="password"
          className="block w-full rounded-sm p-2 mb-2 border "
        />
        <button className="bg-blue-500 text-white block w-full rounded-sm p-2">
          {isLoginInOrRegister === "register" ? "Register" : "Login"}
        </button>
        <div className="text-center mt-2">
          {isLoginInOrRegister === "register" && (
            <div>
              Already a member?
              <button onClick={()=>setIsLoginInOrRegister("login")}>
                Login here
              </button>
            </div>
          )}
          {isLoginInOrRegister === "login" && (
            <div>
              Don`t have an account?
              <button onClick={()=>setIsLoginInOrRegister("register")}>
                Register
              </button>
            </div>
          )}
        </div>
      </form>
    </div>
  );
};

export default RegisterAndLoginForm;
