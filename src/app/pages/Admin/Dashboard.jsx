import AdminLayout from "./Layout";
import StatCard from "../../../shared/ui/StatCard";
import Card from "../../../shared/ui/Card";

const kpis = [
  { title: "Apartamentos", value: 128, hint: "12 libres · 116 ocupados" },
  { title: "Residentes", value: 312, hint: "Activos este mes" },
  { title: "Visitas hoy", value: 23, hint: "Últimas 24h" },
  { title: "Pagos del mes", value: "Bs 18,450", hint: "Cobrado" },
];

export default function AdminDashboard(){
  return (
    <AdminLayout>
      {/* KPIs */}
      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(4, minmax(180px, 1fr))",
        gap: 16, marginBottom: 16
      }}>
        {kpis.map((k)=> <StatCard key={k.title} {...k} />)}
      </div>

      {/* Dos columnas: tabla + resumen */}
      <div style={{ display: "grid", gridTemplateColumns: "1.2fr .8fr", gap: 16 }}>
        <Card title="Visitas recientes" footer="Actualizado hace 3 min">
          <table style={{ width:"100%", borderCollapse:"collapse", fontSize:14 }}>
            <thead>
              <tr style={{ color:"#e5e7eb" }}>
                <th style={{ textAlign:"left", padding:"8px 6px" }}>Visitante</th>
                <th style={{ textAlign:"left", padding:"8px 6px" }}>Apto</th>
                <th style={{ textAlign:"left", padding:"8px 6px" }}>Hora</th>
                <th style={{ textAlign:"left", padding:"8px 6px" }}>Estado</th>
              </tr>
            </thead>
            <tbody>
              {[
                { v:"Juan Pérez", a:"208", h:"14:02", e:"Dentro" },
                { v:"María S.", a:"305", h:"13:40", e:"Salida" },
                { v:"Carlos R.", a:"102", h:"13:15", e:"Dentro" },
              ].map((r,i)=>(
                <tr key={i} style={{ borderTop:"1px solid var(--border)" }}>
                  <td style={{ padding:"8px 6px" }}>{r.v}</td>
                  <td style={{ padding:"8px 6px" }}>{r.a}</td>
                  <td style={{ padding:"8px 6px" }}>{r.h}</td>
                  <td style={{ padding:"8px 6px", color:"var(--brand)" }}>{r.e}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>

        <Card title="Ocupación por torre">
          <ul style={{ margin:0, paddingLeft:18, lineHeight:1.8 }}>
            <li>Torre A: 58/64</li>
            <li>Torre B: 60/64</li>
            <li>Torre C: 52/64</li>
          </ul>
        </Card>
      </div>
    </AdminLayout>
  );
}
