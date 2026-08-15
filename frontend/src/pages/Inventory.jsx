import API_URL from "../api";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

function Inventory() {
  const [items, setItems] = useState([]);

  useEffect(() => {
    loadItems();
  }, []);

  async function loadItems() {
    try {
      const response = await fetch(
        `${API_URL}/api/inventory`
      );

      const data = await response.json();

      if (!response.ok) {
        console.error(data);
        setItems([]);
        return;
      }

      setItems(data);
    } catch (err) {
      console.error(err);
      setItems([]);
    }
  }

  async function deleteItem(id) {
    if (!window.confirm("Delete this inventory item?")) {
      return;
    }

    try {
      const response = await fetch(
        `${API_URL}/api/inventory/${id}`,
        {
          method: "DELETE",
        }
      );

      const data = await response.json();

      if (!response.ok) {
        alert(
          data.message ||
            "Failed to delete inventory item."
        );
        return;
      }

      alert(
        data.message ||
          "Inventory item deleted successfully."
      );

      loadItems();
    } catch (err) {
      console.error(err);
      alert("Failed to delete inventory item.");
    }
  }

  const headerStyle = {
    padding: "12px 7px",
    fontSize: "12px",
    fontWeight: "bold",
    whiteSpace: "nowrap",
    textAlign: "left",
  };

  const cellStyle = {
    padding: "12px 7px",
    fontSize: "12px",
    verticalAlign: "middle",
  };

  return (
    <div
      style={{
        width: "100%",
        maxWidth: "100%",
        minWidth: 0,
        boxSizing: "border-box",
        overflow: "hidden",
      }}
    >
      {/* PAGE HEADER */}

      <div
        style={{
          width: "100%",
          maxWidth: "100%",
          minWidth: 0,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          gap: "20px",
          marginBottom: "25px",
          flexWrap: "wrap",
          boxSizing: "border-box",
        }}
      >
        <div
          style={{
            minWidth: 0,
          }}
        >
          <h1
            style={{
              margin: 0,
              fontSize: "42px",
              lineHeight: 1.2,
            }}
          >
            📦 Inventory
          </h1>

          <p
            style={{
              marginTop: "8px",
              marginBottom: 0,
            }}
          >
            Manage all farm inventory.
          </p>
        </div>

        <Link
          className="button"
          to="/inventory/add"
          style={{
            whiteSpace: "nowrap",
            flexShrink: 0,
          }}
        >
          ➕ Add Item
        </Link>
      </div>

      {/* INVENTORY TABLE */}

      <div
        className="card"
        style={{
          width: "100%",
          maxWidth: "100%",
          minWidth: 0,
          boxSizing: "border-box",
          overflow: "hidden",
        }}
      >
        <table
          className="table"
          style={{
            width: "100%",
            maxWidth: "100%",
            minWidth: 0,
            tableLayout: "fixed",
            borderCollapse: "collapse",
            boxSizing: "border-box",
          }}
        >
          <colgroup>
            <col style={{ width: "17%" }} />
            <col style={{ width: "14%" }} />
            <col style={{ width: "11%" }} />
            <col style={{ width: "9%" }} />
            <col style={{ width: "12%" }} />
            <col style={{ width: "14%" }} />
            <col style={{ width: "11%" }} />
            <col style={{ width: "12%" }} />
          </colgroup>

          <thead>
            <tr>
              <th style={headerStyle}>Item</th>
              <th style={headerStyle}>Category</th>
              <th style={headerStyle}>Quantity</th>
              <th style={headerStyle}>Unit</th>
              <th style={headerStyle}>Status</th>
              <th style={headerStyle}>Supplier</th>
              <th style={headerStyle}>Price</th>
              <th style={headerStyle}>Actions</th>
            </tr>
          </thead>

          <tbody>
            {items.length === 0 ? (
              <tr>
                <td
                  colSpan="8"
                  style={{
                    textAlign: "center",
                    padding: "30px 10px",
                    fontSize: "14px",
                  }}
                >
                  No inventory items found.
                </td>
              </tr>
            ) : (
              items.map((item) => {
                const quantity = Number(
                  item.quantity || 0
                );

                const minimumStock = Number(
                  item.minimum_stock || 0
                );

                const isLow =
                  quantity <= minimumStock;

                return (
                  <tr key={item.id}>
                    {/* ITEM */}

                    <td
                      style={{
                        ...cellStyle,
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                      }}
                      title={item.item_name || ""}
                    >
                      {item.item_name || "-"}
                    </td>

                    {/* CATEGORY */}

                    <td
                      style={{
                        ...cellStyle,
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                      }}
                      title={item.category || ""}
                    >
                      {item.category || "-"}
                    </td>

                    {/* QUANTITY */}

                    <td
                      style={{
                        ...cellStyle,
                        textAlign: "center",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {item.quantity ?? 0}
                    </td>

                    {/* UNIT */}

                    <td
                      style={{
                        ...cellStyle,
                        textAlign: "center",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {item.unit || "-"}
                    </td>

                    {/* STATUS */}

                    <td
                      style={{
                        ...cellStyle,
                        textAlign: "center",
                      }}
                    >
                      <span
                        style={{
                          display: "inline-block",
                          background: isLow
                            ? "#E53935"
                            : "#4CAF50",
                          color: "white",
                          padding: "6px 8px",
                          borderRadius: "20px",
                          fontSize: "10px",
                          fontWeight: "bold",
                          whiteSpace: "nowrap",
                        }}
                      >
                        {isLow
                          ? "🔴 Low"
                          : "🟢 OK"}
                      </span>
                    </td>

                    {/* SUPPLIER */}

                    <td
                      style={{
                        ...cellStyle,
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                      }}
                      title={item.supplier || ""}
                    >
                      {item.supplier || "-"}
                    </td>

                    {/* PRICE */}

                    <td
                      style={{
                        ...cellStyle,
                        textAlign: "center",
                        fontSize: "11px",
                        whiteSpace: "nowrap",
                      }}
                    >
                      KES{" "}
                      {Number(
                        item.purchase_price || 0
                      ).toLocaleString()}
                    </td>

                    {/* ACTIONS */}

                    <td
                      style={{
                        padding: "8px 4px",
                        verticalAlign: "middle",
                      }}
                    >
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "center",
                          alignItems: "center",
                          gap: "4px",
                          flexWrap: "wrap",
                        }}
                      >
                        <Link
                          className="button"
                          to={`/inventory/edit/${item.id}`}
                          style={{
                            padding: "6px 7px",
                            fontSize: "10px",
                            whiteSpace: "nowrap",
                          }}
                        >
                          ✏ Edit
                        </Link>

                        <button
                          type="button"
                          className="button"
                          onClick={() =>
                            deleteItem(item.id)
                          }
                          style={{
                            padding: "6px 7px",
                            fontSize: "10px",
                            background: "#D32F2F",
                            color: "white",
                            border: "none",
                            whiteSpace: "nowrap",
                            cursor: "pointer",
                          }}
                        >
                          🗑 Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Inventory;
