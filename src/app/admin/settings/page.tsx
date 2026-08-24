"use client";

import { useEffect, useState } from "react";
import { Save, CheckCircle, RefreshCw } from "lucide-react";

export default function AdminSettingsPage() {
  const [settings, setSettings] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");

  const fetchSettings = () => {
    setLoading(true);
    fetch("/api/cms")
      .then((res) => res.json())
      .then((d) => {
        if (d.success) setSettings(d.settings);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchSettings();
  }, []);

  const handleChange = (key: string, value: string) => {
    setSettings((prev) => ({ ...prev, [key]: value }));
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setSuccessMsg("");
    try {
      const res = await fetch("/api/cms", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ settings }),
      });

      const data = await res.json();
      if (data.success) {
        setSuccessMsg("System configuration & financial settings updated.");
        setTimeout(() => setSuccessMsg(""), 4000);
      }
    } catch (err) {
      console.error("Save Settings Error:", err);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-slate-700 space-y-4 font-sans">
        <RefreshCw className="h-8 w-8 animate-spin" />
        <p className="text-xs uppercase tracking-widest font-mono font-bold">Loading System Configurations...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 font-sans">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-serif text-2xl md:text-3xl font-bold text-slate-900">
            System & Tax Parameters
          </h1>
          <p className="text-xs text-slate-500 mt-1 font-medium">
            Super Admin operational rules, GSTIN number, check-in/out policies, and Cashfree configurations.
          </p>
        </div>
      </div>

      {successMsg && (
        <div className="p-4 bg-emerald-900/40 border border-emerald-500/40 rounded-xl text-emerald-300 text-xs flex items-center gap-2 font-bold">
          <CheckCircle className="h-4 w-4 text-emerald-400" /> {successMsg}
        </div>
      )}

      <form onSubmit={handleSave} className="space-y-6">
        <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-2xl space-y-4">
          <h3 className="font-serif text-lg text-slate-900 font-bold border-b border-slate-200 pb-2">
            Taxation & Financial Parameters
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs uppercase tracking-widest text-slate-700 font-bold mb-1">Official GSTIN Number</label>
              <input
                type="text"
                value={settings.gstin || "10AAAAA0000A1Z5"}
                onChange={(e) => handleChange("gstin", e.target.value)}
                className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 text-xs text-slate-900 font-mono font-bold"
              />
            </div>

            <div>
              <label className="block text-xs uppercase tracking-widest text-slate-700 font-bold mb-1">Cashfree Client ID</label>
              <input
                type="text"
                value="Configured in deployment environment"
                disabled
                className="w-full bg-slate-50/70 border border-slate-200 rounded-xl p-2.5 text-xs text-slate-500 font-mono font-bold"
              />
            </div>
          </div>
        </div>

        <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-2xl space-y-4">
          <h3 className="font-serif text-lg text-slate-900 font-bold border-b border-slate-200 pb-2">
            Stay & Policy Parameters
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs uppercase tracking-widest text-slate-700 font-bold mb-1">Standard Check-In Time</label>
              <input
                type="text"
                value={settings.check_in_time || "12:00 PM"}
                onChange={(e) => handleChange("check_in_time", e.target.value)}
                className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 text-xs text-slate-900 font-medium"
              />
            </div>

            <div>
              <label className="block text-xs uppercase tracking-widest text-slate-700 font-bold mb-1">Standard Check-Out Time</label>
              <input
                type="text"
                value={settings.check_out_time || "11:00 AM"}
                onChange={(e) => handleChange("check_out_time", e.target.value)}
                className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 text-xs text-slate-900 font-medium"
              />
            </div>
          </div>
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            disabled={saving}
            className="bg-slate-900 hover:bg-slate-800 text-white font-bold uppercase tracking-widest text-xs py-3 px-8 rounded-xl shadow-xl flex items-center gap-2 cursor-pointer"
          >
            <Save className="h-4 w-4" /> {saving ? "Saving Config..." : "Save System Config"}
          </button>
        </div>
      </form>
    </div>
  );
}
