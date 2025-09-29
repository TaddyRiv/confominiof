import Sidebar from "../../../shared/ui/Sidebar";
import Topbar from "../../../shared/ui/Topbar";

export default function AdminLayout({ children }){
  return (
    <div style={{ display: "grid", gridTemplateColumns: "260px 1fr", height: "100vh" }}>
      <Sidebar />
      <div style={{ display: "grid", gridTemplateRows: "64px 1fr" }}>
        <Topbar />
        <main style={{ padding: 16, overflow: "auto" }}>{children}</main>
      </div>
    </div>
  );
}
