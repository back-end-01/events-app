import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

interface Volunteer {
  id: string;
  name: string;
  email: string;
  phone?: string;
}

export default function VolunteersRealtime() {
  const [volunteers, setVolunteers] = useState<Volunteer[]>([]);

  useEffect(() => {
    // Initial fetch
    const fetchVolunteers = async () => {
      const { data } = await supabase.from("volunteers").select("*");
      setVolunteers(data || []);
    };
    fetchVolunteers();

    // Subscribe to inserts
    const channel = supabase
      .channel("public:volunteers")
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "volunteers" },
        (payload) => {
          setVolunteers((prev) => [...prev, payload.new as Volunteer]);
        }
      )
      .subscribe();

    // Cleanup on unmount
    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  return (
    <div>
      <h2 className="text-lg font-bold mb-2">Live Volunteers</h2>
      <ul className="space-y-1">
        {volunteers.map((v) => (
          <li key={v.id} className="bg-white/10 rounded p-2">
            <span className="font-semibold">{v.name}</span> (<span className="text-blue-200">{v.email}</span>)
          </li>
        ))}
      </ul>
    </div>
  );
} 