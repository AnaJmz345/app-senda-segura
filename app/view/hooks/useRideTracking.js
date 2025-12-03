import { useEffect, useRef, useState } from "react";
import * as Location from "expo-location";
import { supabase } from "../lib/supabase";
import { useAuth } from "../context/AuthContext";

function haversineDistanceMeters(p1, p2) {
  const R = 6371000;
  const toRad = (deg) => (deg * Math.PI) / 180;

  const dLat = toRad(p2.latitude - p1.latitude);
  const dLon = toRad(p2.longitude - p1.longitude);
  const lat1 = toRad(p1.latitude);
  const lat2 = toRad(p2.latitude);

  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.sin(dLon / 2) ** 2 * Math.cos(lat1) * Math.cos(lat2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

export function useRideTracking(mapRef, clearSelectedRoute) {
  const { user } = useAuth();

  const [isTracking, setIsTracking] = useState(false);
  const [sessionId, setSessionId] = useState(null);
  const [pathCoords, setPathCoords] = useState([]);
  const [finishedPath, setFinishedPath] = useState([]);
  const [distanceMeters, setDistanceMeters] = useState(0);
  const [elapsedSec, setElapsedSec] = useState(0);

  const watchSubRef = useRef(null);
  const timerRef = useRef(null);
  const startTimeRef = useRef(null);

  const startTimer = () => {
    startTimeRef.current = Date.now();
    setElapsedSec(0);

    timerRef.current = setInterval(() => {
      const diff = Math.floor((Date.now() - startTimeRef.current) / 1000);
      setElapsedSec(diff);
    }, 1000);
  };

  const stopTimer = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  };

  const startTracking = async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        alert("Permiso de ubicación requerido.");
        return;
      }

      const location = await Location.getCurrentPositionAsync({});
      const firstPoint = {
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      };

      const { data, error } = await supabase
        .from("biker_sessions")
        .insert([
          {
            biker_id: user.id,
            status: "active",
            last_location: {
              type: "Point",
              coordinates: [firstPoint.longitude, firstPoint.latitude],
            },
          },
        ])
        .select()
        .single();

      if (error) throw error;

      if (clearSelectedRoute) clearSelectedRoute();

      setFinishedPath([]);
      setSessionId(data.id);
      setPathCoords([firstPoint]);
      setDistanceMeters(0);
      setIsTracking(true);
      startTimer();

      const sub = await Location.watchPositionAsync(
        {
          accuracy: Location.Accuracy.High,
          timeInterval: 3000,
          distanceInterval: 5,
        },
        async (loc) => {
          const newPoint = {
            latitude: loc.coords.latitude,
            longitude: loc.coords.longitude,
          };

          setPathCoords((prev) => {
            if (prev.length === 0) return [newPoint];

            const last = prev[prev.length - 1];
            const segment = haversineDistanceMeters(last, newPoint);
            if (segment < 1) return prev;

            setDistanceMeters((d) => d + segment);

            if (mapRef?.current) {
              mapRef.current.animateCamera({
                center: newPoint,
                zoom: 17,
              });
            }

            return [...prev, newPoint];
          });

          await supabase.from("biker_route_points").insert([
            {
              session_id: data.id,
              biker_id: user.id,
              latitude: newPoint.latitude,
              longitude: newPoint.longitude,
            },
          ]);

          await supabase
            .from("biker_sessions")
            .update({
              last_location: {
                type: "Point",
                coordinates: [newPoint.longitude, newPoint.latitude],
              },
            })
            .eq("id", data.id);
        }
      );

      watchSubRef.current = sub;
    } catch (err) {
      console.error(err);
      alert("No se pudo iniciar la ruta.");
    }
  };

  const stopTracking = async () => {
    try {
      if (watchSubRef.current) {
        watchSubRef.current.remove();
        watchSubRef.current = null;
      }

      stopTimer();

      if (sessionId) {
        await supabase
          .from("biker_sessions")
          .update({
            status: "finished",
            finished_at: new Date().toISOString(),
          })
          .eq("id", sessionId);
      }

      setFinishedPath(pathCoords);
      setPathCoords([]);
      setIsTracking(false);
    } catch (err) {
      console.error(err);
      alert("Error al terminar la ruta.");
    }
  };

  useEffect(() => {
    return () => {
      if (watchSubRef.current) watchSubRef.current.remove();
      stopTimer();
    };
  }, []);

  const distanceKm = distanceMeters / 1000;

  return {
    isTracking,
    sessionId,
    pathCoords,
    finishedPath,
    distanceKm,
    elapsedSec,
    startTracking,
    stopTracking,
  };
}
