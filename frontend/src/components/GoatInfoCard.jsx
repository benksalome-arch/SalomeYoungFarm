function GoatInfoCard({ goat }) {
  return (
    <div className="card">

      <h2>🐐 Goat Information</h2>

      <table className="table">

        <tbody>

          <tr>
            <td><strong>Tag</strong></td>
            <td>{goat.tag}</td>
          </tr>

          <tr>
            <td><strong>Name</strong></td>
            <td>{goat.name}</td>
          </tr>

          <tr>
            <td><strong>Breed</strong></td>
            <td>{goat.breed}</td>
          </tr>

          <tr>
            <td><strong>Sex</strong></td>
            <td>{goat.sex}</td>
          </tr>

          <tr>
            <td><strong>Date of Birth</strong></td>
            <td>{goat.date_of_birth || "-"}</td>
          </tr>

          <tr>
            <td><strong>Colour</strong></td>
            <td>{goat.color || "-"}</td>
          </tr>

          <tr>
            <td><strong>Current Weight</strong></td>
            <td>{goat.weight} kg</td>
          </tr>

          <tr>
            <td><strong>Status</strong></td>
            <td>{goat.status}</td>
          </tr>

          <tr>
            <td><strong>Father Tag</strong></td>
            <td>{goat.father_tag || "-"}</td>
          </tr>

          <tr>
            <td><strong>Mother Tag</strong></td>
            <td>{goat.mother_tag || "-"}</td>
          </tr>

          <tr>
            <td><strong>Purchase Price</strong></td>
            <td>
              {goat.purchase_price
                ? `KES ${Number(goat.purchase_price).toLocaleString()}`
                : "-"}
            </td>
          </tr>

          <tr>
            <td><strong>Notes</strong></td>
            <td>{goat.notes || "-"}</td>
          </tr>

        </tbody>

      </table>

    </div>
  );
}

export default GoatInfoCard;