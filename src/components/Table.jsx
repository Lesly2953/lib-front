import React, { useEffect, useState } from "react";
import axios from "axios";

const Table = () => {
  const [data, setData] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchCategory, setSearchCategory] = useState("name");
  const [sortOrder, setSortOrder] = useState("asc");
  const [currentPage, setCurrentPage] = useState(1);
  const [booksPerPage] = useState(10);

  useEffect(() => {
    axios
      .get("https://lib-back-1.onrender.com/db")
      .then((response) => {
        setData(response.data);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  }, []);

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
    setCurrentPage(1);
  };

  const handleSearchCategoryChange = (event) => {
    setSearchCategory(event.target.value);
  };

  const handleSortOrderChange = (event) => {
    setSortOrder(event.target.value);
  };

  const filteredData = data.filter((item) => {
    if (searchTerm === "") return true;
    if (
      searchCategory === "name" &&
      item.name.toLowerCase().includes(searchTerm.toLowerCase())
    ) {
      return true;
    }
    if (
      searchCategory === "author" &&
      item.author.toLowerCase().includes(searchTerm.toLowerCase())
    ) {
      return true;
    }
    if (
      searchCategory === "subject" &&
      item.subject.toLowerCase().includes(searchTerm.toLowerCase())
    ) {
      return true;
    }
    return false;
  });

  const sortedData = filteredData.sort((a, b) => {
    if (sortOrder === "asc") {
      return new Date(a.published) - new Date(b.published);
    } else {
      return new Date(b.published) - new Date(a.published);
    }
  });

  const indexOfLastBook = currentPage * booksPerPage;
  const indexOfFirstBook = indexOfLastBook - booksPerPage;
  const currentBooks = sortedData.slice(indexOfFirstBook, indexOfLastBook);

  const pageNumbers = [];
  for (let i = 1; i <= Math.ceil(filteredData.length / booksPerPage); i++) {
    pageNumbers.push(i);
  }

  const handleClick = (number) => {
    setCurrentPage(number);
  };

  const styles = {
    container: {
      maxWidth: "800px",
      margin: "auto",
    },
    title: {
      textAlign: "center",
      fontSize: "2em",
      margin: "20px 0",
    },
    searchContainer: {
      marginBottom: "20px",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
    },
    label: {
      marginBottom: "10px",
      fontSize: "1.2em",
    },
    select: {
      marginRight: "10px",
      padding: "8px",
      fontSize: "1em",
    },
    input: {
      padding: "8px",
      fontSize: "1em",
    },
    totalBooks: {
      marginBottom: "10px",
      fontSize: "1.2em",
    },
    table: {
      width: "100%",
      borderCollapse: "collapse",
      marginBottom: "20px",
    },
    tableHeader: {
      backgroundColor: "#f2f2f2",
      padding: "15px",
      borderBottom: "1px solid #ddd",
      fontSize: "1.2em",
    },
    tableCell: {
      padding: "15px",
      borderBottom: "1px solid #ddd",
      fontSize: "1em",
    },
    pagination: {
      display: "flex",
      justifyContent: "center",
    },
    pageNumber: {
      margin: "5px",
    },
    currentPage: {
      padding: "5px",
      background: "green",
      color: "white",
      cursor: "pointer",
    },
    pageButton: {
      padding: "5px",
      cursor: "pointer",
    },
  };

  return (
    <article style={styles.container}>
      <h1 style={styles.title}>Library Management System</h1>
      <div style={styles.searchContainer}>
        <div style={styles.label}>Search by</div>
        <select
          value={searchCategory}
          onChange={handleSearchCategoryChange}
          style={styles.select}
        >
          <option value="name">Name</option>
          <option value="author">Author</option>
          <option value="subject">Subject</option>
        </select>
        <input
          type="text"
          placeholder="Search..."
          value={searchTerm}
          onChange={handleSearchChange}
          style={styles.input}
        />
        <div style={styles.label}>Date sort by</div>
        <select
          value={sortOrder}
          onChange={handleSortOrderChange}
          style={styles.select}
        >
          <option value="asc">Ascending</option>
          <option value="desc">Descending</option>
        </select>
      </div>
      <span style={styles.totalBooks}>
        Total Books found: {filteredData.length}
      </span>
      <table style={styles.table}>
        <thead>
          <tr>
            <th style={styles.tableHeader}>Name</th>
            <th style={styles.tableHeader}>Author</th>
            <th style={styles.tableHeader}>Subject</th>
            <th style={styles.tableHeader}>Published</th>
          </tr>
        </thead>
        <tbody>
          {currentBooks.map((item, index) => (
            <tr key={index}>
              <td style={styles.tableCell}>{item.name}</td>
              <td style={styles.tableCell}>{item.author}</td>
              <td style={styles.tableCell}>{item.subject}</td>
              <td style={styles.tableCell}>{item.published}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <div style={styles.pagination}>
        {pageNumbers.map((number) => (
          <span key={number} style={styles.pageNumber}>
            {currentPage === number ? (
              <span
                role="button"
                style={styles.currentPage}
                onClick={() => handleClick(number)}
              >
                {number}
              </span>
            ) : (
              <span
                role="button"
                style={styles.pageButton}
                onClick={() => handleClick(number)}
              >
                {number}
              </span>
            )}
          </span>
        ))}
      </div>
    </article>
  );
};

export default Table;
