import API_URL from "../api";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useLanguage } from "../context/LanguageContext";

function Inventory() {
  const { t } = useLanguage();
  const [items, setItems] = useState([]);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [deleteItemId, setDeleteItemId] = useState(null);

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

  function requestDeleteItem(id) {
    setDeleteItemId(id);
    setDeleteModalOpen(true);
  }

  async function confirmDeleteItem() {
    if (!deleteItemId) {
      setDeleteModalOpen(false);
      return;
    }

    try {
      const response = await fetch(
        `${API_URL}/api/inventory/${deleteItemId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      const data = await response.json();

      setDeleteModalOpen(false);
      setDeleteItemId(null);

      if (!response.ok) {
        alert(t("failedToDeleteInventory"));
        return;
      }

      alert(t("inventoryDeletedSuccessfully"));

      loadItems();
    } catch (err) {
      console.error(err);
      setDeleteModalOpen(false);
      setDeleteItemId(null);
      alert(t("failedToDeleteInventory"));
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
            {t("manageAllFarmInventory")}
          </p>
        </div>

        <div
          style={{
            display: "flex",
            flexDirection: "row",
            alignItems: "flex-end",
            gap: "10px",
            flexShrink: 0,
          }}
        >
          <Link
            className="button"
            to="/inventory/add"
            style={{
              whiteSpace: "nowrap",
            }}
          >
            ➕ {t("addItem")}
          </Link>

          <button
            type="button"
            className="button"
            onClick={() => window.history.back()}
            style={{
              whiteSpace: "nowrap",
            }}
          >
            ← {t("back")}
          </button>
        </div>
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
              <th style={headerStyle}>{t("itemName")}</th>
              <th style={headerStyle}>{t("category")}</th>
              <th style={headerStyle}>{t("quantity")}</th>
              <th style={headerStyle}>{t("unit")}</th>
              <th style={headerStyle}>{t("status")}</th>
              <th style={headerStyle}>{t("supplier")}</th>
              <th style={headerStyle}>{t("purchasePriceKES")}</th>
              <th style={headerStyle}>{t("actions")}</th>
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
                  {t("noInventoryItemsFound")}
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
                          ? `🔴 ${t("low")}`
                          : `🟢 ${t("ok")}`}
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
                          ✏ {t("edit")}
                        </Link>

                        <button
                          type="button"
                          className="button"
                          onClick={() =>
                            requestDeleteItem(item.id)
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
                          🗑 {t("delete")}
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

      {deleteModalOpen && (
        <div
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              setDeleteModalOpen(false);
              setDeleteItemId(null);
            }
          }}
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0, 0, 0, 0.45)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 99999,
            padding: "16px",
            boxSizing: "border-box",
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              width: "min(92vw, 430px)",
              background: "#fff",
              borderRadius: "14px",
              padding: "24px",
              boxShadow: "0 12px 35px rgba(0,0,0,0.25)",
              boxSizing: "border-box",
            }}
          >
            <div
              style={{
                textAlign: "center",
                marginBottom: "20px",
              }}
            >
              <div
                style={{
                  width: "52px",
                  height: "52px",
                  margin: "0 auto 14px",
                  borderRadius: "50%",
                  background: "#ffebee",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "25px",
                }}
              >
                🗑️
              </div>

              <h2
                style={{
                  margin: "0 0 8px",
                  fontSize: "20px",
                  color: "#222",
                }}
              >
                {t("deleteInventoryTitle")}
              </h2>

              <p
                style={{
                  margin: 0,
                  color: "#666",
                  fontSize: "15px",
                  lineHeight: 1.5,
                }}
              >
                {t("deleteInventoryMessage")}
              </p>
            </div>

            <div
              style={{
                display: "flex",
                gap: "10px",
                justifyContent: "center",
              }}
            >
              <button
                type="button"
                onClick={() => {
                  setDeleteModalOpen(false);
                  setDeleteItemId(null);
                }}
                style={{
                  flex: 1,
                  minHeight: "44px",
                  border: "1px solid #ccc",
                  borderRadius: "8px",
                  background: "#fff",
                  color: "#333",
                  fontSize: "14px",
                  fontWeight: 600,
                  cursor: "pointer",
                }}
              >
                {t("cancel")}
              </button>

              <button
                type="button"
                onClick={confirmDeleteItem}
                style={{
                  flex: 1,
                  minHeight: "44px",
                  border: "1px solid #c62828",
                  borderRadius: "8px",
                  background: "#c62828",
                  color: "#fff",
                  fontSize: "14px",
                  fontWeight: 600,
                  cursor: "pointer",
                }}
              >
                {t("delete")}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Inventory;
