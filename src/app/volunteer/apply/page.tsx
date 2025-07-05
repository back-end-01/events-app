"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState } from "react";

const duties = [
  { id: "scanning", title: "Scanning Desk Management" },
  { id: "registration", title: "Registration Desk" },
  { id: "food", title: "Food Distribution" },
  { id: "programs", title: "Cultural Programs Assistance" },
];

export default function VolunteerApplyPage() {
  const { data: session } = useSession();
  const router = useRouter();
  const [duty, setDuty] = useState("");
  const [reason, setReason] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    const res = await fetch("/api/volunteer-applications", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        duty_id: duty,
        reason,
      }),
    });
    setIsSubmitting(false);
    if (res.ok) {
      setSuccess(true);
    } else {
      alert("Failed to submit application. Please try again.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900">
      <div className="bg-white/10 p-8 rounded-xl w-full max-w-md space-y-6">
        {success && (
          <div className="mb-6 text-center">
            <h2 className="text-2xl font-bold text-white mb-2">Your application has been received.</h2>
            <p className="text-blue-200">The admin will review it soon.</p>
            <p className="text-blue-200 mt-4">You can review and change your response below.</p>
          </div>
        )}
        <form onSubmit={handleSubmit} className="space-y-6">
          <h2 className="text-2xl font-bold text-white mb-4 text-center">Volunteer Application</h2>
          <div>
            <label className="block text-blue-200 mb-2">Select Duty</label>
            <select
              value={duty}
              onChange={e => setDuty(e.target.value)}
              required
              className="w-full p-2 rounded bg-white/20 text-white"
            >
              <option value="" disabled>Select a duty</option>
              {duties.map(d => (
                <option key={d.id} value={d.id}>{d.title}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-blue-200 mb-2">Why do you want this duty?</label>
            <textarea
              value={reason}
              onChange={e => setReason(e.target.value)}
              required
              className="w-full p-2 rounded bg-white/20 text-white min-h-[80px]"
            />
          </div>
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-yellow-500 hover:bg-yellow-600 text-white py-3 px-4 rounded-lg font-semibold transition-colors"
          >
            {isSubmitting ? (success ? "Resubmitting..." : "Submitting...") : (success ? "Resubmit Application" : "Submit Application")}
          </button>
        </form>
      </div>
    </div>
  );
} 