import { useState } from "react";

import "./App.css";

function App() {
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  console.log(loading);

  const [queary, setQueary] = useState("");
  const [books, setBooks] = useState([]);
  const [favorites, setFavorites] = useState([]);
  console.log(favorites);

  const sendForm = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const data = await fetch(
        `https://openlibrary.org/search.json?q=${queary}&limit=10`
      ).then((res) => res.json());
      setBooks(data.docs);
      setQueary("");
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleFavorites = (book) => {
    setFavorites([...favorites, { ...book, status: "unread" }]);
  };

  const handleDelete = (id) => {
    const taskFiltered = favorites.filter((fav, index) => id !== index);
    setFavorites(taskFiltered);
  };

  const handleStatusChange = (book, status) => {
    const listStatusChanged = favorites.map((fav) =>
      book.key === fav.key ? { ...fav, status } : fav
    );
    setFavorites(listStatusChanged);
  };

  if (error) return <p>Hay un error: {error}</p>;
  if (loading) return <p>Cargando.....</p>;

  return (
    <>
      <section>
        <form onSubmit={(e) => sendForm(e)}>
          <input
            type="text"
            placeholder="Search for a book"
            value={queary}
            onChange={(e) => setQueary(e.target.value)}
          />
          <button type="submit">Search</button>
        </form>

        <h1>Books</h1>
        {books.length === 0 ? (
          <p>No books found. Please search for a book or try a different search.</p>
        ) : (
          <>
            {books.length > 0 &&
              books.map((book) => (
                <div key={book.key}>
                  <p>{book.title}</p>
                  <p>{book.author_name}</p>
                  <p>{book.first_publish_year}</p>
                  <button onClick={() => handleFavorites(book)}>
                    Add to the List
                  </button>
                </div>
              ))}
          </>
        )}
        <h1>Favorite Books</h1>
        {favorites.length === 0 ? (
          <p>No favorite books added yet.</p>
        ) : (
          <>
            {favorites.length > 0 &&
              favorites.map((fav, index) => (
                <div key={fav.key}>
                  <p>{fav.title}</p>
                  <p>{fav.author_name}</p>
                  <p>{fav.first_publish_year}</p>
                  <select
                    value={fav.status}
                    onChange={(e) => handleStatusChange(fav, e.target.value)}
                  >
                    <option value="unread">Unread</option>
                    <option value="reading">Reading</option>
                    <option value="read">Read</option>
                  </select>
                  <button onClick={() => handleDelete(index)}>Delete</button>
                </div>
              ))}
          </>
        )}
      </section>
    </>
  );
}

export default App;
