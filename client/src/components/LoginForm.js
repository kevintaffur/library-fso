import { useMutation } from "@apollo/client";
import { useEffect, useState } from "react";
import { FAVOURITE_GENRE, LOGIN } from "../queries";

const LoginForm = ({ setToken, show, setPage }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [login, result] = useMutation(LOGIN, {
    refetchQueries: [{ query: FAVOURITE_GENRE }],
  });

  useEffect(() => {
    if (result.data) {
      const token = result.data.login.value;
      setToken(token);
      setPage("authors");
      localStorage.setItem("library-user-token", token);
    }
  }, [result.data]); // eslint-disable-line

  if (!show) {
    return null;
  }

  const submit = (event) => {
    event.preventDefault();
    login({ variables: { username, password } });
    setUsername("");
    setPassword("");
  };

  return (
    <>
      <h2>Log in</h2>
      <form onSubmit={submit}>
        <div>
          username
          <input
            type="text"
            value={username}
            onChange={({ target }) => setUsername(target.value)}
          />
        </div>
        <div>
          password
          <input
            type="password"
            value={password}
            onChange={({ target }) => setPassword(target.value)}
          />
        </div>
        <button type="submit">login</button>
      </form>
    </>
  );
};

export default LoginForm;
