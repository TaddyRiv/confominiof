import { useEffect, useState } from "react";
import { listApartments } from '../../../features/apartments/api';

export default function HomePage() {
  const [items, setItems] = useState([]);

  useEffect(() => {
    (async () => {
      try {
        const data = await listApartments();
        // si tu API devuelve {results: []}, ajusta a data.results
        setItems(Array.isArray(data) ? data : (data.results ?? []));
      } catch (e) {
        console.error(e);
      }
    })();
  }, []);

  return (
    <div style={{ padding: 24 }}>
      <h1>Home</h1>
      <ul>
        {items.map((a) => (
          <li key={a.id}>{a.numero || a.nombre || `Apto ${a.id}`}</li>
        ))}
      </ul>
    </div>
  );
}
