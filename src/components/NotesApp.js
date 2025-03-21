import { useEffect, useState } from "react";
import { FaMoon, FaSun, FaEdit, FaTrash } from "react-icons/fa";
import "./NotesApp.css";

function NotesApp() {
  const [notes, setNotes] = useState([]);
  const [inputValue, setInputValue] = useState("");
  const [editIndex, setEditIndex] = useState(null);
  const [darkMode, setDarkMode] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  // ✅ Load notes and theme from localStorage when the page loads
  useEffect(() => {
    const savedNotes = JSON.parse(localStorage.getItem("notes")) || [];
    setNotes(savedNotes); // ✅ Set saved notes

    const savedTheme = localStorage.getItem("theme");
    if (savedTheme === "dark") {
      setDarkMode(true);
    }
  }, []);

  // ✅ Save notes to localStorage whenever notes change
  useEffect(() => {
    if (notes.length > 0) {
      localStorage.setItem("notes", JSON.stringify(notes));
    }
  }, [notes]);

  // ✅ Save theme preference to localStorage
  useEffect(() => {
    document.body.className = darkMode ? "dark-mode" : "light-mode";
    localStorage.setItem("theme", darkMode ? "dark" : "light");
  }, [darkMode]);

  // ✅ Handle Adding & Updating Notes
  const handleSubmit = (e) => {
    e.preventDefault();
    if (inputValue.trim() === "") return;

    const newNote = { text: inputValue, time: new Date().toLocaleTimeString() };
    if (editIndex !== null) {
      const updatedNotes = [...notes];
      updatedNotes[editIndex] = newNote;
      setNotes(updatedNotes);
      setEditIndex(null);
    } else {
      setNotes([...notes, newNote]);
    }
    setInputValue("");
  };

  // ✅ Handle Editing
  const handleEdit = (index) => {
    setInputValue(notes[index].text);
    setEditIndex(index);
  };

  // ✅ Handle Deleting Notes
  const handleDelete = (index) => {
    const updatedNotes = notes.filter((_, i) => i !== index);
    setNotes(updatedNotes);
    localStorage.setItem("notes", JSON.stringify(updatedNotes));
  };

  // ✅ Clear All Notes
  const handleClearAll = () => {
    localStorage.removeItem("notes");
    setNotes([]);
  };

  // ✅ Toggle Dark & Light Mode
  const handleToggleMode = () => {
    setDarkMode((prevMode) => !prevMode);
  };

  return (
    <div className={`app-container ${darkMode ? "dark" : "light"}`}>
      {/* Dark Mode Button */}
      <button
        className={`dark-btn ${darkMode ? "dark-mode-btn" : ""}`}
        onClick={handleToggleMode}
      >
        {darkMode ? <FaSun /> : <FaMoon />}
      </button>

      {/* Notes App Container */}
      <div className="notes-container">
        <h2>📌 Notes Keeper App</h2>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="Write your note..."
          />
          <button>{editIndex !== null ? "Update" : "Add"}</button>
        </form>
        <br />
        <input
          className="search-bar"
          type="text"
          placeholder="🔍 Search Notes"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />

        {/* Notes List */}
        <ul>
          {notes
            .filter((note) =>
              note.text.toLowerCase().includes(searchQuery.toLowerCase())
            )
            .map((note, index) => (
              <li key={index}>
                <p>
                  {note.text}
                  <br />
                  <small>🕒 {note.time}</small>
                </p>
                <div>
                  <button onClick={() => handleEdit(index)}>
                    <FaEdit />
                  </button>
                  <button
                    className="delete-btn"
                    onClick={() => handleDelete(index)}
                  >
                    <FaTrash />
                  </button>
                </div>
              </li>
            ))}
        </ul>

        {/* Clear All Button */}
        {notes.length > 0 && (
          <div className="btn-container">
            <button className="clear-btn" onClick={handleClearAll}>
              🗑️ Clear All
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default NotesApp;
