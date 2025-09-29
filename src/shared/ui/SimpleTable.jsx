export default function SimpleTable({ columns, rows, keyField = "id" }) {
  return (
    <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 14 }}>
      <thead>
        <tr style={{ color: "#e5e7eb" }}>
          {columns.map((c) => (
            <th
              key={c.key}
              style={{
                textAlign: "left",
                padding: "8px 6px",
                borderBottom: "1px solid var(--border)",
              }}
            >
              {c.header}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {rows.map((r) => (
          <tr
            key={r[keyField] ?? JSON.stringify(r)}
            style={{ borderTop: "1px solid var(--border)" }}
          >
            {columns.map((c) => (
              <td key={c.key} style={{ padding: "8px 6px" }}>
                {typeof c.render === "function" ? c.render(r) : r[c.key]}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
}
