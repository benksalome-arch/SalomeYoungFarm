import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import GoatTable from "../components/GoatTable";
import SearchBar from "../components/SearchBar";
import API_URL from "../api";

function Goats() {
  const [goats, setGoats] = useState([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    async function loadGoats() {
      try {
        const response = await fetch(
          `${API_URL}/api/goats`
        );

        console.log(
          "Goats response status:",
          response.status
        );

        const data = await response.json();

        console.log(
          "Goats from API:",
          data
        );

        if (!response.ok) {
          throw new Error(
            data.message ||
              "Failed to load goats."
          );
        }

        setGoats(
          Array.isArray(data)
            ? data
            : []
        );
      } catch (error) {
        console.error(
          "Goats fetch error:",
          error
        );

        setGoats([]);
      }
    }

    loadGoats();
  }, []);

  const filteredGoats = goats.filter(
    (goat) =>
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
          onChange={(e) =>
            setSearch(e.target.value)
          }
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
        <GoatTable
          goats={filteredGoats}
        />
      </div>
    </div>
  );
}

export default Goats;