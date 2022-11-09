import { ALL_BOOKS, FAVOURITE_GENRE } from "../queries";
import { useQuery } from "@apollo/client";
import { useState } from "react";

const Books = ({ show, recommend }) => {
  const allBooksQuery = useQuery(ALL_BOOKS);
  const favouriteGenreQuery = useQuery(FAVOURITE_GENRE);
  const [genreSelection, setGenreSelection] = useState("all");

  if (!show) {
    return null;
  }

  if (allBooksQuery.loading || favouriteGenreQuery.loading) {
    return <div>loading...</div>;
  }

  const favouriteGenre = favouriteGenreQuery.data.me.favouriteGenre;
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
      {recommend ? (
        <h2>Recommendations</h2>
      ) : (
        <>
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
        </>
      )}

      <div>
        books in your favourite genre <strong>{favouriteGenre}</strong>
      </div>

      <table>
        <tbody>
          <tr>
            <th></th>
            <th>author</th>
            <th>published</th>
          </tr>
          {recommend
            ? books
                .filter((a) => a.genres.includes(favouriteGenre))
                .map(booksMap)
            : genreSelection === "all"
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
