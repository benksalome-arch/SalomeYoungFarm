function DataTable({
  columns,
  data,
  emptyMessage = "No records found.",
}) {
  return (
    <div className="card">

      <table className="table">

        <thead>
          <tr>
            {columns.map((column, index) => (
              <th key={index}>{column.header}</th>
            ))}
          </tr>
        </thead>

        <tbody>

          {data.length === 0 ? (

            <tr>
              <td
                colSpan={columns.length}
                style={{ textAlign: "center" }}
              >
                {emptyMessage}
              </td>
            </tr>

          ) : (

            data.map((row, rowIndex) => (

              <tr key={row.id || rowIndex}>

                {columns.map((column, colIndex) => (

                  <td key={colIndex}>
                    {column.render
                      ? column.render(row)
                      : row[column.accessor]}
                  </td>

                ))}

              </tr>

            ))

          )}

        </tbody>

      </table>

    </div>
  );
}

export default DataTable;