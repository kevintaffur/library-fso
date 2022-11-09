import { useApolloClient } from "@apollo/client";
import { useEffect, useState } from "react";
import Authors from "./components/Authors";
import Books from "./components/Books";
import LoginForm from "./components/LoginForm";
import NewBook from "./components/NewBook";

const App = () => {
  const [page, setPage] = useState("authors");
  const [token, setToken] = useState(null);
  const client = useApolloClient();
  const [recommend, setRecommend] = useState(false);

  useEffect(() => {
    const loggedUser = window.localStorage.getItem("library-user-token");
    if (loggedUser) {
      setToken(loggedUser);
    }
  }, []);

  const login = () => {
    setPage("login");
  };

  const logout = () => {
    setToken(null);
    localStorage.clear();
    client.resetStore();
  };

  const changePage = (page) => {
    setPage(page);
    setRecommend(false);
  };

  return (
    <div>
      <div>
        <button onClick={() => changePage("authors")}>authors</button>
        <button onClick={() => changePage("books")}>books</button>
        {token ? (
          <>
            <button onClick={() => changePage("add")}>add book</button>
            <button
              onClick={() => {
                setRecommend(true);
                setPage("books");
              }}
            >
              recommend
            </button>
            <button onClick={logout}>logout</button>
          </>
        ) : (
          <button onClick={login}>login</button>
        )}
      </div>

      <Authors show={page === "authors"} />
      <Books show={page === "books"} recommend={recommend} />
      <NewBook show={page === "add"} />
      <LoginForm
        setToken={setToken}
        show={page === "login"}
        setPage={setPage}
      />
    </div>
  );
};

export default App;
