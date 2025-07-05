import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";

interface Participant {
  id: string;
  name: string;
  email: string;
  phone?: string;
}

export default function ParticipantsRealtime() {
  const [participants, setParticipants] = useState<Participant[]>([]);

  useEffect(() => {
    // Initial fetch
    const fetchParticipants = async () => {
      const { data } = await supabase.from("participants").select("*");
      setParticipants(data || []);
    };
    fetchParticipants();

    // Subscribe to inserts
    const channel = supabase
      .channel("public:participants")
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "participants" },
        (payload) => {
          setParticipants((prev) => [...prev, payload.new as Participant]);
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
      <h2 className="text-lg font-bold mb-2">Live Participants</h2>
      <ul className="space-y-1">
        {participants.map((p) => (
          <li key={p.id} className="bg-white/10 rounded p-2">
            <span className="font-semibold">{p.name}</span> (<span className="text-blue-200">{p.email}</span>)
          </li>
        ))}
      </ul>
    </div>
  );
} 