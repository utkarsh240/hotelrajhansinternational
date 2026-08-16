"use client";

import { useEffect, useState } from "react";
import { RefreshCw } from "lucide-react";

export default function AdminPaymentsPage() {
  const [payments, setPayments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchPayments = () => {
    setLoading(true);
    fetch("/api/reports")
      .then((res) => res.json())
      .then((d) => {
        if (d.success && d.recentBookings) {
          const list: any[] = [];
          d.recentBookings.forEach((b: any) => {
            if (b.payments && b.payments.length > 0) {
              b.payments.forEach((p: any) => list.push({ ...p, bookingRef: b.referenceId, customerName: b.customer?.name }));
            }
          });
          setPayments(list);
        }
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchPayments();
  }, []);

  return (
    <div className="space-y-6 font-sans">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-serif text-2xl md:text-3xl font-bold text-slate-900">
            Payment Audit Transactions
          </h1>
          <p className="text-xs text-slate-500 mt-1 font-medium">
            Real-time Razorpay payment logs, transaction verification, and gateway responses.
          </p>
        </div>
        <button
          onClick={fetchPayments}
          className="p-2.5 rounded-xl border border-slate-300 text-slate-500 hover:bg-slate-100 text-xs flex items-center gap-2 cursor-pointer self-start font-semibold"
        >
          <RefreshCw className={`h-4 w-4 text-slate-700 ${loading ? "animate-spin" : ""}`} /> Refresh Log
        </button>
      </div>

      <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-amber-500/20 text-slate-700 uppercase tracking-widest text-[10px] font-bold">
                <th className="py-3.5 px-4">Razorpay Payment ID</th>
                <th className="py-3.5 px-4">Booking Ref</th>
                <th className="py-3.5 px-4">Guest Name</th>
                <th className="py-3.5 px-4">Method</th>
                <th className="py-3.5 px-4">Amount</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-amber-500/10 text-slate-900">
              {loading ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-slate-700 font-bold">
                    <RefreshCw className="h-6 w-6 animate-spin mx-auto mb-2" />
                    Loading payment audit transactions...
                  </td>
                </tr>
              ) : payments.length > 0 ? (
                payments.map((p) => (
                  <tr key={p.id} className="hover:bg-slate-100 transition-colors">
                    <td className="py-3.5 px-4 font-mono text-slate-700 font-bold">{p.razorpayPaymentId || p.id}</td>
                    <td className="py-3.5 px-4 font-mono font-bold text-slate-900">{p.bookingRef}</td>
                    <td className="py-3.5 px-4 font-bold text-white">{p.customerName}</td>
                    <td className="py-3.5 px-4 font-mono text-[10px] uppercase font-bold text-slate-500">{p.method}</td>
                    <td className="py-3.5 px-4 font-mono font-bold text-slate-700 text-sm">₹{p.amount.toLocaleString()}</td>
                    <td className="py-3.5 px-4">
                      <span className="inline-block px-2.5 py-0.5 rounded-full text-[9px] uppercase font-bold tracking-wider bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                        {p.status}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-slate-500/70 text-[11px] font-mono">{new Date(p.createdAt).toLocaleString()}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-slate-500 text-xs">
                    No payment gateway transactions recorded yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
