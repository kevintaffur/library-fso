import { useState } from "react";
import { useQuery } from "@apollo/client";
import Authors from "./components/Authors";
import Books from "./components/Books";
import NewBook from "./components/NewBook";
import { ALL_AUTHORS, ALL_BOOKS } from "./queries";

const App = () => {
  const [page, setPage] = useState("authors");
  const allAuthorsQuery = useQuery(ALL_AUTHORS);
  const allBooksQuery = useQuery(ALL_BOOKS);

  if (allAuthorsQuery.loading || allBooksQuery.loading) {
    return <div>loading...</div>;
  }

  return (
    <div>
      <div>
        <button onClick={() => setPage("authors")}>authors</button>
        <button onClick={() => setPage("books")}>books</button>
        <button onClick={() => setPage("add")}>add book</button>
      </div>

      <Authors
        show={page === "authors"}
        authors={allAuthorsQuery.data.allAuthors}
      />

      <Books show={page === "books"} books={allBooksQuery.data.allBooks} />

      <NewBook show={page === "add"} />
    </div>
  );
};

export default App;
