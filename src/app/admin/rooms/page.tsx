"use client";

import { useEffect, useState } from "react";
import {
  BedDouble,
  Edit,
  RefreshCw,
  X
} from "lucide-react";

export default function AdminRoomsPage() {
  const [rooms, setRooms] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingRoom, setEditingRoom] = useState<any>(null);
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState("");

  const fetchRooms = () => {
    setLoading(true);
    fetch("/ranjhans/api/rooms", { cache: "no-store", headers: { "Cache-Control": "no-cache" } })
      .then((res) => res.json())
      .then((d) => {
        if (d.success) setRooms(d.rooms);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchRooms();
  }, []);

  const handleSaveRoom = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setSaveError("");

    try {
      // Map amenities to strings if they are objects
      const payload = {
        ...editingRoom,
        amenities: Array.isArray(editingRoom.amenities)
          ? editingRoom.amenities.map((a: any) => (typeof a === "string" ? a : a?.amenityName)).filter(Boolean)
          : [],
      };

      const res = await fetch(`/ranjhans/api/rooms/${editingRoom.id}`, {
        method: "PUT",
        cache: "no-store",
        headers: { "Content-Type": "application/json", "Cache-Control": "no-cache" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        setSaveError(data.error || "Failed to update room settings.");
        return;
      }

      if (data.success && data.room) {
        setRooms((prev) => prev.map((r: any) => (r.id === data.room.id ? data.room : r)));
        setEditingRoom(null);
        fetchRooms();
      }
    } catch (error: any) {
      console.error("Failed to save room:", error);
      setSaveError(error?.message || "An unexpected error occurred while saving.");
    } finally {
      setSaving(false);
    }
  };

  const toggleStatus = async (room: any, newStatus: string) => {
    try {
      const res = await fetch(`/ranjhans/api/rooms/${room.id}`, {
        method: "PUT",
        cache: "no-store",
        headers: { "Content-Type": "application/json", "Cache-Control": "no-cache" },
        body: JSON.stringify({ status: newStatus }),
      });
      if (res.ok) fetchRooms();
    } catch (err) {
      console.error("Status toggle error:", err);
    }
  };

  return (
    <div className="space-y-6 font-sans">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-serif text-2xl md:text-3xl font-bold text-slate-900">
            Rooms & Pricing Control
          </h1>
          <p className="text-xs text-slate-500 mt-1 font-medium">
            Update dynamic room tariffs, weekend rates, extra bed costs, amenities, and maintenance states.
          </p>
        </div>
        <button
          onClick={fetchRooms}
          className="p-2.5 rounded-xl border border-slate-300 text-slate-500 hover:bg-slate-100 text-xs flex items-center gap-2 cursor-pointer self-start font-semibold"
        >
          <RefreshCw className={`h-4 w-4 text-slate-700 ${loading ? "animate-spin" : ""}`} /> Refresh
        </button>
      </div>

      {/* Rooms Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {loading ? (
          <div className="col-span-2 py-16 text-center text-slate-700 font-bold">
            <RefreshCw className="h-6 w-6 animate-spin mx-auto mb-2" />
            Loading rooms configuration...
          </div>
        ) : (
          rooms.map((room) => (
            <div
              key={room.id}
              className="p-6 rounded-2xl bg-white border border-slate-200 shadow-2xl space-y-6 flex flex-col justify-between"
            >
              <div className="space-y-4">
                <div className="flex justify-between items-start">
                  <div>
                    <span className="text-[9px] uppercase tracking-widest font-mono text-slate-500 font-bold">
                      {room.type}
                    </span>
                    <h3 className="font-serif text-xl text-slate-900 font-bold">{room.name}</h3>
                  </div>
                  <span
                    className={`px-3 py-1 rounded-full text-[9px] uppercase font-bold tracking-wider ${
                      room.status === "AVAILABLE"
                        ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/40"
                        : room.status === "MAINTENANCE"
                        ? "bg-slate-100 text-slate-700 border border-slate-300"
                        : "bg-rose-500/20 text-rose-300 border border-rose-500/40"
                    }`}
                  >
                    {room.status}
                  </span>
                </div>

                <p className="text-xs text-slate-500 leading-relaxed font-medium">{room.description}</p>

                {/* Pricing Table Summary */}
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 grid grid-cols-2 gap-3 text-xs">
                  <div>
                    <span className="text-[10px] uppercase text-slate-700/70 block font-bold">Single Occupancy</span>
                    <span className="font-mono font-bold text-slate-700 text-sm">₹{room.basePriceSingle.toLocaleString()}</span>
                  </div>
                  <div>
                    <span className="text-[10px] uppercase text-slate-700/70 block font-bold">Double Occupancy</span>
                    <span className="font-mono font-bold text-slate-700 text-sm">₹{room.basePriceDouble.toLocaleString()}</span>
                  </div>
                  <div>
                    <span className="text-[10px] uppercase text-slate-700/70 block font-bold">Weekend Rate</span>
                    <span className="font-mono text-slate-900 font-semibold">
                      {room.weekendPrice ? `₹${room.weekendPrice.toLocaleString()}` : "Standard"}
                    </span>
                  </div>
                  <div>
                    <span className="text-[10px] uppercase text-slate-700/70 block font-bold">GST Rate</span>
                    <span className="font-mono text-slate-900 font-semibold">{room.taxPercentage}%</span>
                  </div>
                </div>

                {/* Amenities Badges */}
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {room.amenities.map((am: any) => (
                    <span key={am.id} className="text-[9px] bg-slate-100 border border-slate-200 text-slate-500 py-1 px-2.5 rounded-md font-semibold">
                      {am.amenityName}
                    </span>
                  ))}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-4 border-t border-slate-200 flex flex-wrap gap-3 items-center justify-between">
                <button
                  onClick={() => toggleStatus(room, room.status === "AVAILABLE" ? "MAINTENANCE" : "AVAILABLE")}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold cursor-pointer border ${
                    room.status === "AVAILABLE"
                      ? "border-amber-500/40 text-slate-700 hover:bg-slate-100"
                      : "border-emerald-500/40 text-emerald-300 hover:bg-emerald-500/20"
                  }`}
                >
                  {room.status === "AVAILABLE" ? "Set Maintenance" : "Set Available"}
                </button>

                <button
                  onClick={() => setEditingRoom({ ...room })}
                  className="bg-slate-900 hover:bg-slate-800 text-white font-bold uppercase tracking-widest text-[10px] py-2 px-4 rounded-xl flex items-center gap-1.5 cursor-pointer shadow-md"
                >
                  <Edit className="h-3.5 w-3.5" /> Edit Pricing & Details
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Edit Room Modal */}
      {editingRoom && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-white border border-slate-300 rounded-2xl max-w-2xl w-full p-6 space-y-6 shadow-2xl relative max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setEditingRoom(null)}
              className="absolute top-4 right-4 p-2 text-slate-500 hover:text-slate-900 rounded-full"
            >
              <X className="h-5 w-5" />
            </button>

            <div className="space-y-1">
              <span className="text-[10px] font-mono text-slate-500 uppercase tracking-widest font-bold">
                Edit Room Configuration
              </span>
              <h2 className="font-serif text-2xl text-slate-900 font-bold">{editingRoom.name}</h2>
            </div>

            <form onSubmit={handleSaveRoom} className="space-y-4">
              {saveError && (
                <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs font-semibold rounded-xl">
                  {saveError}
                </div>
              )}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs uppercase tracking-widest text-slate-700 mb-1 font-bold">
                    Room Name
                  </label>
                  <input
                    type="text"
                    required
                    value={editingRoom.name}
                    onChange={(e) => setEditingRoom({ ...editingRoom, name: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 text-xs text-slate-900 font-medium"
                  />
                </div>

                <div>
                  <label className="block text-xs uppercase tracking-widest text-slate-700 mb-1 font-bold">
                    Status
                  </label>
                  <select
                    value={editingRoom.status}
                    onChange={(e) => setEditingRoom({ ...editingRoom, status: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 text-xs text-slate-900 font-medium"
                  >
                    <option value="AVAILABLE">AVAILABLE</option>
                    <option value="MAINTENANCE">MAINTENANCE</option>
                    <option value="OCCUPIED">OCCUPIED</option>
                    <option value="DEACTIVATED">DEACTIVATED</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs uppercase tracking-widest text-slate-700 mb-1 font-bold">
                    Base Price (Single) ₹
                  </label>
                  <input
                    type="number"
                    required
                    value={editingRoom.basePriceSingle}
                    onChange={(e) => setEditingRoom({ ...editingRoom, basePriceSingle: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 text-xs text-slate-900 font-mono font-bold"
                  />
                </div>

                <div>
                  <label className="block text-xs uppercase tracking-widest text-slate-700 mb-1 font-bold">
                    Base Price (Double) ₹
                  </label>
                  <input
                    type="number"
                    required
                    value={editingRoom.basePriceDouble}
                    onChange={(e) => setEditingRoom({ ...editingRoom, basePriceDouble: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 text-xs text-slate-900 font-mono font-bold"
                  />
                </div>

                <div>
                  <label className="block text-xs uppercase tracking-widest text-slate-700 mb-1 font-bold">
                    Weekend Price ₹
                  </label>
                  <input
                    type="number"
                    value={editingRoom.weekendPrice || ""}
                    onChange={(e) => setEditingRoom({ ...editingRoom, weekendPrice: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 text-xs text-slate-900 font-mono font-bold"
                    placeholder="Leave empty for standard"
                  />
                </div>

                <div>
                  <label className="block text-xs uppercase tracking-widest text-slate-700 mb-1 font-bold">
                    GST Tax Percentage (%)
                  </label>
                  <input
                    type="number"
                    value={editingRoom.taxPercentage}
                    onChange={(e) => setEditingRoom({ ...editingRoom, taxPercentage: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 text-xs text-slate-900 font-mono font-bold"
                  />
                </div>
              </div>

              {Number(editingRoom.basePriceSingle) > Number(editingRoom.basePriceDouble) && (
                <div className="p-3 bg-amber-500/10 border border-amber-500/30 rounded-xl flex items-center justify-between text-xs text-amber-800 font-medium">
                  <span>
                    ⚠️ Base Single tariff (₹{Number(editingRoom.basePriceSingle).toLocaleString()}) is higher than Double tariff (₹{Number(editingRoom.basePriceDouble).toLocaleString()}).
                  </span>
                  <button
                    type="button"
                    onClick={() => setEditingRoom({ ...editingRoom, basePriceSingle: 3090 })}
                    className="ml-2 px-3 py-1 bg-amber-500 text-white text-[10px] font-bold uppercase rounded-lg shadow hover:bg-amber-600 transition-colors cursor-pointer shrink-0"
                  >
                    Reset to ₹3,090
                  </button>
                </div>
              )}

              <div>
                <label className="block text-xs uppercase tracking-widest text-slate-700 mb-1 font-bold">
                  Description
                </label>
                <textarea
                  rows={3}
                  value={editingRoom.description}
                  onChange={(e) => setEditingRoom({ ...editingRoom, description: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 text-xs text-slate-900 resize-none font-medium"
                />
              </div>

              <div className="pt-4 flex justify-end gap-3 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setEditingRoom(null)}
                  className="px-4 py-2 rounded-xl border border-slate-200 text-xs text-slate-500 font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-6 py-2 bg-amber-400 text-stone-950 font-bold uppercase tracking-widest text-xs rounded-xl shadow-lg cursor-pointer"
                >
                  {saving ? "Saving Changes..." : "Save Prices & Details"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
