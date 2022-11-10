import { ALL_BOOKS, ALL_BOOKS_BY_GENRE } from "../queries";
import { useLazyQuery, useQuery } from "@apollo/client";
import { useState } from "react";

const Books = ({ show }) => {
  const allBooksQuery = useQuery(ALL_BOOKS);
  const [genreSelection, setGenreSelection] = useState("all");
  const [getBooksByGenre, { loading, data }] = useLazyQuery(ALL_BOOKS_BY_GENRE);

  if (!show) {
    return null;
  }

  if (allBooksQuery.loading) {
    return <div>loading...</div>;
  }

  if (loading) {
    return <div>loading...</div>;
  }

  const books = allBooksQuery.data.allBooks;

  const genres = books.map((book) => {
    return book.genres;
  });
  const uniqueGenres = [...new Set(genres.join().split(","))];

  const handleSelection = (genre) => {
    setGenreSelection(genre);
    getBooksByGenre({ variables: { genre } });
  };

  const booksMap = (a) => (
    <tr key={a.title}>
      <td>{a.title}</td>
      <td>{a.author.name}</td>
      <td>{a.published}</td>
    </tr>
  );

  return (
    <div>
      <h2>Books</h2>
      {uniqueGenres.map((g) => (
        <button key={g} onClick={() => handleSelection(g)}>
          {g}
        </button>
      ))}
      <button onClick={() => handleSelection("all")}>all genres</button>

      <div>
        in genre <strong>{genreSelection}</strong>
      </div>

      <table>
        <tbody>
          <tr>
            <th></th>
            <th>author</th>
            <th>published</th>
          </tr>
          {genreSelection === "all"
            ? books.map(booksMap)
            : data.allBooks.map(booksMap)}
        </tbody>
      </table>
    </div>
  );
};

export default Books;
