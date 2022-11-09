import { ALL_BOOKS } from "../queries";
import { useQuery } from "@apollo/client";
import { useState } from "react";

const Books = (props) => {
  const allBooksQuery = useQuery(ALL_BOOKS);
  const [genreSelection, setGenreSelection] = useState("");

  if (!props.show) {
    return null;
  }

  if (allBooksQuery.loading) {
    return <div>loading...</div>;
  }

  const books = allBooksQuery.data.allBooks;
  const genres = books.map((book) => {
    return book.genres;
  });
  const uniqueGenres = [...new Set(genres.join().split(","))];

  const handleSelection = (genre) => {
    setGenreSelection(genre);
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
            : books
                .filter((a) => a.genres.includes(genreSelection))
                .map(booksMap)}
        </tbody>
      </table>
    </div>
  );
};

export default Books;
