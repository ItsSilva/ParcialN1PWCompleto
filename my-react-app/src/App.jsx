import { useState } from "react";
import "./App.css";

function App() {
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  
  const [queary, setQueary] = useState("");
  const [books, setBooks] = useState([]);
  const [favorites, setFavorites] = useState([]);

  const sendForm = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const data = await fetch(
        `https://openlibrary.org/search.json?q=${queary}&limit=12`
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

  if (error) return <p className="error">There is an error: {error}</p>;
  if (loading) return <p className="loading">Loading...</p>;

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

        <h1>Results {books.length > 0 && <span>({books.length})</span>}</h1>
        {books.length === 0 ? (
          <p className="no-results">No books found. Please search for a book or try a different search.</p>
        ) : (
          <div className="books-grid">
            {books.map((book) => (
              <div key={book.key} className="book-card">
                <h3>{book.title}</h3>
                <p className="author">{book.author_name}</p>
                <p className="year">{book.first_publish_year}</p>
                <button className="btn" onClick={() => handleFavorites(book)}>
                  Add to List
                </button>
              </div>
            ))}
          </div>
        )}

        <h1>Liked Songs {favorites.length > 0 && <span>({favorites.length})</span>}</h1>
        {favorites.length === 0 ? (
          <p className="no-results">No favorite books added yet.</p>
        ) : (
          <div className="books-grid">
            {favorites.map((fav, index) => (
              <div key={fav.key} className="book-card">
                <h3>{fav.title}</h3>
                <p className="author">{fav.author_name}</p>
                <p className="year">{fav.first_publish_year}</p>
                <select
                  value={fav.status}
                  onChange={(e) => handleStatusChange(fav, e.target.value)}
                >
                  <option value="unread">Unread</option>
                  <option value="reading">Reading</option>
                  <option value="read">Read</option>
                </select>
                <button className="btn btn-delete" onClick={() => handleDelete(index)}>
                  Delete
                </button>
              </div>
            ))}
          </div>
        )}
      </section>
    </>
  );
}

export default App;