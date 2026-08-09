import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import GoatTable from "../components/GoatTable";
import SearchBar from "../components/SearchBar";

function Goats() {
  const [goats, setGoats] = useState([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetch("http://localhost:5000/api/goats")
      .then((res) => {
        console.log("Response status:", res.status);
        return res.json();
      })
      .then((data) => {
        console.log("Goats from API:", data);
        setGoats(data);
      })
      .catch((err) => {
        console.error("Fetch error:", err);
        setGoats([]);
      });
  }, []);

  const filteredGoats = goats.filter((goat) =>
    `${goat.tag || goat.tag_number || ""} ${
      goat.name || ""
    } ${goat.breed || ""}`
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  return (
    <div
      style={{
        width: "100%",
        maxWidth: "100%",
        minWidth: 0,
        boxSizing: "border-box",
      }}
    >
      {/* PAGE HEADER */}

      <div
        style={{
          width: "100%",
          maxWidth: "100%",
          minWidth: 0,
          boxSizing: "border-box",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          gap: "20px",
          marginBottom: "25px",
          padding: "0",
        }}
      >
        <h1
          style={{
            margin: 0,
            fontSize: "42px",
            lineHeight: 1.2,
          }}
        >
          🐐 Goat Management
        </h1>

        <Link
          to="/goats/add"
          className="button"
          style={{
            textDecoration: "none",
            whiteSpace: "nowrap",
            flexShrink: 0,
          }}
        >
          + Add Goat
        </Link>
      </div>

      {/* SEARCH */}

      <div
        style={{
          width: "100%",
          maxWidth: "100%",
          boxSizing: "border-box",
          marginBottom: "25px",
        }}
      >
        <SearchBar
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {/* GOAT TABLE */}

      <div
        style={{
          width: "100%",
          maxWidth: "100%",
          minWidth: 0,
          boxSizing: "border-box",
        }}
      >
        <GoatTable goats={filteredGoats} />
      </div>
    </div>
  );
}

export default Goats;