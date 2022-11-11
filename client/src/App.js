import { useApolloClient, useQuery, useSubscription } from "@apollo/client";
import { useEffect, useState } from "react";
import Authors from "./components/Authors";
import Books from "./components/Books";
import LoginForm from "./components/LoginForm";
import NewBook from "./components/NewBook";
import Recommendations from "./components/Recommendations";
import {
  ALL_AUTHORS,
  ALL_BOOKS,
  ALL_BOOKS_BY_GENRE,
  BOOK_ADDED,
  FAVOURITE_GENRE,
} from "./queries";

export const updateCache = (cache, query, added, all) => {
  const unique = (objs) => {
    const seen = new Set();
    return objs.filter((obj) => {
      const identifier = all === "Books" ? obj.title : obj.name;
      return seen.has(identifier) ? false : seen.add(identifier);
    });
  };

  if (all === "Books") {
    cache.updateQuery(query, ({ allBooks }) => {
      return {
        allBooks: unique(allBooks.concat(added)),
      };
    });
  } else if (all === "Authors") {
    cache.updateQuery(query, ({ allAuthors }) => {
      return {
        allAuthors: unique(
          allAuthors.concat({ ...added, bookCount: added.bookCount + 1 })
        ),
      };
    });
  }
};

const App = () => {
  const [page, setPage] = useState("authors");
  const [token, setToken] = useState(null);
  const client = useApolloClient();
  const favouriteGenreQuery = useQuery(FAVOURITE_GENRE);

  useSubscription(BOOK_ADDED, {
    onData: ({ client, data }) => {
      window.alert(`new book added: ${data.data.bookAdded.title}`);
      updateCache(
        client.cache,
        { query: ALL_BOOKS },
        data.data.bookAdded,
        "Books"
      );

      const arr = data.data.bookAdded.genres;
      for (const value of arr) {
        updateCache(
          client.cache,
          { query: ALL_BOOKS_BY_GENRE, variables: { genre: value } },
          data.data.bookAdded,
          "Books"
        );
      }

      updateCache(
        client.cache,
        { query: ALL_AUTHORS },
        data.data.bookAdded.author,
        "Authors"
      );
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
