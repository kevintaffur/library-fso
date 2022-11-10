import { ALL_BOOKS_BY_GENRE } from "../queries";
import { useQuery } from "@apollo/client";

const Recommendations = ({ show, data }) => {
  const booksQuery = useQuery(ALL_BOOKS_BY_GENRE, {
    variables: { genre: data },
  });

  if (!show) {
    return null;
  }

  if (booksQuery.loading) {
    return <div>loading...</div>;
  }

  const books = booksQuery.data.allBooks;

  const booksMap = (a) => (
    <tr key={a.title}>
      <td>{a.title}</td>
      <td>{a.author.name}</td>
      <td>{a.published}</td>
    </tr>
  );

  return (
    <div>
      <h2>Recommendations</h2>
      <div>
        books in your favourite genre <strong>{data}</strong>
      </div>

      <table>
        <tbody>
          <tr>
            <th></th>
            <th>author</th>
            <th>published</th>
          </tr>
          {books.map(booksMap)}
        </tbody>
      </table>
    </div>
  );
};

export default Recommendations;
