import { useState } from "react";
import { useQuery } from "@apollo/client";
import { ALL_AUTHORS, EDIT_BIRTHYEAR } from "../queries";
import { useMutation } from "@apollo/client";
import { useEffect } from "react";

const Authors = (props) => {
  const [name, setName] = useState("");
  const [born, setBorn] = useState("");
  const allAuthorsQuery = useQuery(ALL_AUTHORS);
  const [changeBirthyear, result] = useMutation(EDIT_BIRTHYEAR);

  useEffect(() => {
    if (result.data && result.data.editAuthor === null) {
      console.log("Person not found");
    }
  }, [result.data]);

  if (!props.show) {
    return null;
  }

  if (allAuthorsQuery.loading) {
    return <div>loading...</div>;
  }

  const authors = allAuthorsQuery.data.allAuthors;

  const submit = async (event) => {
    event.preventDefault();

    if (name === "") {
      return console.log("Choose an author");
    }
    const year = Number(born);
    changeBirthyear({ variables: { name, setBornTo: year } });

    setName("");
    setBorn("");
  };

  return (
    <div>
      <h2>Authors</h2>
      <table>
        <tbody>
          <tr>
            <th></th>
            <th>born</th>
            <th>books</th>
          </tr>
          {authors.map((a) => (
            <tr key={a.name}>
              <td>{a.name}</td>
              <td>{a.born}</td>
              <td>{a.bookCount}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <h3>Set Birthyear</h3>
      <form onSubmit={submit}>
        <select onChange={({ target }) => setName(target.value)}>
          <option>Choose an author</option>
          {authors.map((author) => (
            <option key={author.name}>{author.name}</option>
          ))}
        </select>
        <div>
          born
          <input
            type="number"
            value={born}
            onChange={({ target }) => setBorn(target.value)}
          />
        </div>
        <button type="submit">update author</button>
      </form>
    </div>
  );
};

export default Authors;
