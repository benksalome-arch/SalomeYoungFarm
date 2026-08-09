function GoatStats({ goat }) {
  return (
    <div className="card">

      <h2>📊 Goat Statistics</h2>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(2,1fr)",
          gap: "20px",
          marginTop: "20px",
        }}
      >

        <div className="card">
          <h3>⚖ Current Weight</h3>
          <h1>{goat.weight || 0} kg</h1>
        </div>

        <div className="card">
          <h3>❤️ Status</h3>
          <h1>{goat.status}</h1>
        </div>

        <div className="card">
          <h3>🧬 Breed</h3>
          <h2>{goat.breed}</h2>
        </div>

        <div className="card">
          <h3>🚻 Sex</h3>
          <h2>{goat.sex}</h2>
        </div>

      </div>

    </div>
  );
}

export default GoatStats;