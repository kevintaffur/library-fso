import { useApolloClient, useQuery, useSubscription } from "@apollo/client";
import { useEffect, useState } from "react";
import Authors from "./components/Authors";
import Books from "./components/Books";
import LoginForm from "./components/LoginForm";
import NewBook from "./components/NewBook";
import Recommendations from "./components/Recommendations";
import { BOOK_ADDED, FAVOURITE_GENRE } from "./queries";

const App = () => {
  const [page, setPage] = useState("authors");
  const [token, setToken] = useState(null);
  const client = useApolloClient();
  const favouriteGenreQuery = useQuery(FAVOURITE_GENRE);

  useSubscription(BOOK_ADDED, {
    onData: ({ data }) => {
      window.alert(`new book added: ${data.data.bookAdded.title}`);
    },
  });

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
    setPage("authors");
  };

  if (favouriteGenreQuery?.loading) {
    return <div>loading...</div>;
  }

  const favourite = favouriteGenreQuery.data.me?.favouriteGenre;

  return (
    <div>
      <div>
        <button onClick={() => setPage("authors")}>authors</button>
        <button onClick={() => setPage("books")}>books</button>
        {token ? (
          <>
            <button onClick={() => setPage("add")}>add book</button>
            <button onClick={() => setPage("recommendations")}>
              recommend
            </button>
            <button onClick={logout}>logout</button>
          </>
        ) : (
          <button onClick={login}>login</button>
        )}
      </div>

      <Authors show={page === "authors"} />
      <Books show={page === "books"} />
      <NewBook show={page === "add"} />
      <Recommendations show={page === "recommendations"} data={favourite} />
      <LoginForm
        setToken={setToken}
        show={page === "login"}
        setPage={setPage}
      />
    </div>
  );
};

export default App;
