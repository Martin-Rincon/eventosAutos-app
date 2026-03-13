
import { useState, useEffect } from 'react';
import { API_BASE_URL } from '../config/api';

export interface Vehicle {
  id: string;
  brand: string;
  model: string;
  year: number;
  photos: string[];
  status: string;
}

export function useVehicles() {
  const [data, setData] = useState<Vehicle[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function fetchVehicles() {
      try {
        // AGREGÁ ESTA LÍNEA AQUÍ:
        console.log('📡 Intentando conectar a:', `${API_BASE_URL}/vehicles`);

        const res = await fetch(`${API_BASE_URL}/vehicles`);
        
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const json = await res.json();
        
        // AGREGÁ ESTA OTRA LÍNEA PARA VER SI LLEGAN DATOS:
        console.log('✅ Datos recibidos:', json.length, 'autos encontrados');
        
        if (!cancelled) setData(json);
      } catch (e) {
        // AGREGÁ ESTO PARA VER EL ERROR REAL:
        console.error('❌ Error en el fetch:', e);
        if (!cancelled) setError(e instanceof Error ? e : new Error('Failed to fetch'));
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    fetchVehicles();
    return () => {
      cancelled = true;
    };
  }, []);

  return { data, loading, error };
}
