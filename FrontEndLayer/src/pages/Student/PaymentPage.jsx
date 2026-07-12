import { useEffect, useState } from "react";
import { usePayment } from "../../hooks/usePayment";
import PageHeader from "../../shared/components/PageHeader";
import StatusBadge from "../../shared/components/StatusBadge";
import KPICard from "../../shared/components/KPICard";
import LoadingSkeleton from "../../shared/components/LoadingSkeleton";
import { CreditCard } from "lucide-react";
import { format } from "date-fns";

const PaymentPage = () => {
  const { payments, loadPayments, pay, loading, error } = usePayment();
  const [showPayForm, setShowPayForm] = useState(false);
  const [amount, setAmount] = useState("");
  const [payError, setPayError] = useState("");

  useEffect(() => {
    loadPayments();
  }, []);

  const totalDue = payments?.reduce((sum, p) => (p.status === "pending" || p.status === "overdue" ? sum + p.amount : sum), 0) || 0;

  const handlePay = async () => {
    setPayError("");
    const parsed = parseFloat(amount);
    if (!amount || isNaN(parsed) || parsed <= 0) {
      setPayError("Please enter a valid amount greater than 0.");
      return;
    }
    if (parsed > totalDue) {
      setPayError(`Amount cannot exceed the outstanding balance of $${totalDue.toFixed(2)}.`);
      return;
    }
    await pay({ amount: parsed, semesterId: "current" });
    setAmount("");
    setShowPayForm(false);
    loadPayments();
  };

  if (loading) return <LoadingSkeleton count={3} />;

  return (
    <div className="flex flex-col gap-6 md:gap-8 max-w-[960px] mx-auto">
      <PageHeader title="Payments" subtitle="Manage your tuition and fee payments" />

      {error && (
        <div className="p-4 bg-danger/10 border border-danger rounded-lg text-danger font-heading text-sm">{error}</div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
        <KPICard label="OUTSTANDING BALANCE" borderColor="#765B00">
          <div className="flex items-end gap-2 w-full">
            <span className="font-heading font-semibold text-2xl sm:text-[36px] leading-tight sm:leading-[36px] text-text-primary">
              ${totalDue.toFixed(2)}
            </span>
          </div>
        </KPICard>
        <KPICard label="PAYMENTS MADE" value={payments?.filter((p) => p.status === "paid").length || 0} subtitle="completed" borderColor="#4F378A" />
      </div>

      <div>
        <div className="flex justify-between items-center mb-4">
          <h3 className="font-heading font-semibold text-lg sm:text-xl m-0 text-text-primary">
            Payment History
          </h3>
          <button
            onClick={() => setShowPayForm(!showPayForm)}
            className="flex items-center gap-2 p-[9px_12px] sm:p-[9px_16px] bg-primary border-none rounded-lg text-white font-body text-sm sm:text-base cursor-pointer"
          >
            <CreditCard size={16} />
            <span className="hidden sm:inline">{showPayForm ? "Cancel" : "Make Payment"}</span>
          </button>
        </div>

        {showPayForm && (
          <div className="bg-white border border-primary rounded-xl p-4 sm:p-6 mb-4 shadow-sm">
            <h4 className="font-heading font-semibold text-sm sm:text-base m-0 mb-4 text-text-primary">
              Make a Payment
            </h4>
            <input
              type="number"
              placeholder="Amount ($)"
              value={amount}
              onChange={(e) => { setAmount(e.target.value); setPayError(""); }}
              min={1}
              className="w-full p-[10px_12px] border border-border-color rounded-lg font-heading text-sm sm:text-base box-border"
            />
            {payError && (
              <p className="mt-2 font-heading text-sm text-danger m-0">{payError}</p>
            )}
            <button
              onClick={handlePay}
              disabled={!amount}
              className={`mt-3 p-[9px_16px] border-none rounded-lg text-white font-body text-sm sm:text-base ${amount ? "bg-primary cursor-pointer" : "bg-border-color cursor-not-allowed"}`}
            >
              Pay Now
            </button>
          </div>
        )}

        {(!payments || payments.length === 0) ? (
          <div className="p-8 text-center font-heading text-text-muted">
            No payment records found.
          </div>
        ) : (
          <div className="bg-white border border-border-color rounded-xl overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full border-collapse min-w-[400px]">
                <thead>
                  <tr className="border-b border-border-color bg-bg-light">
                    <th className="text-left px-4 sm:px-8 py-3 sm:py-4 font-heading font-semibold text-[10px] sm:text-xs tracking-wider uppercase text-text-secondary">
                      Date
                    </th>
                    <th className="text-left px-4 sm:px-8 py-3 sm:py-4 font-heading font-semibold text-[10px] sm:text-xs tracking-wider uppercase text-text-secondary">
                      Semester
                    </th>
                    <th className="text-right px-4 sm:px-8 py-3 sm:py-4 font-heading font-semibold text-[10px] sm:text-xs tracking-wider uppercase text-text-secondary">
                      Amount
                    </th>
                    <th className="text-center px-4 sm:px-8 py-3 sm:py-4 font-heading font-semibold text-[10px] sm:text-xs tracking-wider uppercase text-text-secondary">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {payments.map((p, i) => (
                    <tr key={p._id} className={i > 0 ? "border-t border-border-color" : ""}>
                      <td className="px-4 sm:px-8 py-3 sm:py-4 font-heading text-sm sm:text-base text-text-primary">
                        {p.createdAt ? format(new Date(p.createdAt), "MMM dd, yyyy") : "-"}
                      </td>
                      <td className="px-4 sm:px-8 py-3 sm:py-4 font-heading text-sm sm:text-base text-text-primary">
                        {p.semesterName || p.semesterId || "-"}
                      </td>
                      <td className="px-4 sm:px-8 py-3 sm:py-4 font-heading font-bold text-sm sm:text-base text-right text-text-primary">
                        ${p.amount?.toFixed(2)}
                      </td>
                      <td className="px-4 sm:px-8 py-3 sm:py-4 text-center">
                        <StatusBadge status={p.status} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PaymentPage;
