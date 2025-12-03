import { supabase } from "../view/lib/supabase";

export async function saveRideToSupabase(userId, distanceKm, elapsedSec, points) {
  try {
    //Crear sesión de ruta
    const { data: session, error: sessionError } = await supabase
      .from("biker_sessions")
      .insert([
        {
          biker_id: userId,
          distance_m: Math.round(distanceKm * 1000),
          elapsed_sec: elapsedSec,
          finished_at: new Date().toISOString(),
        },
      ])
      .select()
      .single();

    if (sessionError) throw sessionError;

    const sessionId = session.id;

    //Crear puntos de la ruta
    const pointRows = points.map((p) => ({
      session_id: sessionId,
      biker_id: userId,
      latitude: p.latitude,
      longitude: p.longitude,
      recorded_at: new Date().toISOString()
    }));

    const { error: pointsError } = await supabase
      .from("biker_route_points")
      .insert(pointRows);

    if (pointsError) throw pointsError;

    return { success: true };
  } catch (err) {
    console.error("Error guardando ruta:", err);
    return { success: false, error: err };
  }
}
