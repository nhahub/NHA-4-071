import { useEffect, useState } from "react";
import { usePayment } from "../../hooks/usePayment";
import { useSemester } from "../../hooks/useSemester";
import PageHeader from "../../shared/components/PageHeader";
import StatusBadge from "../../shared/components/StatusBadge";
import KPICard from "../../shared/components/KPICard";
import LoadingSkeleton from "../../shared/components/LoadingSkeleton";
import { CreditCard, Check, ArrowLeft, AlertTriangle } from "lucide-react";
import { format } from "date-fns";

const PAYMENT_METHODS = [
  { value: "credit_card", label: "Credit Card" },
  { value: "debit_card", label: "Debit Card" },
  { value: "bank_transfer", label: "Bank Transfer" },
  { value: "online", label: "Online Payment" },
  { value: "cash", label: "Cash" },
];

const PaymentPage = () => {
  const { payments, summary, lastPaymentResult, loadPayments, loadSummary, pay, clearResult, loading, error } = usePayment();
  const { currentSemester, loadCurrentSemester } = useSemester();
  const [showPayForm, setShowPayForm] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState("credit_card");
  const [payError, setPayError] = useState("");
  const [step, setStep] = useState("form");

  useEffect(() => {
    loadPayments();
    loadSummary();
    loadCurrentSemester();
  }, []);

  useEffect(() => {
    if (lastPaymentResult) {
      setStep("confirmation");
      loadPayments();
      loadSummary();
    }
  }, [lastPaymentResult]);

  const pendingPayments = payments?.filter((p) => p.status === "pending" || p.status === "overdue") || [];
  const paidPayments = payments?.filter((p) => p.status === "paid") || [];

  const handleSelectPayment = (payment) => {
    setSelectedPayment(payment);
    setPaymentMethod("credit_card");
    setPayError("");
    setStep("form");
    setShowPayForm(true);
  };

  const handlePay = async () => {
    setPayError("");
    await pay({
      semesterId: selectedPayment.semesterId,
      paymentMethod,
    });
  };

  const handleBackToForm = () => {
    setShowPayForm(false);
    setSelectedPayment(null);
    setStep("form");
    clearResult();
  };

  if (loading && !payments?.length) return <LoadingSkeleton count={3} />;

  return (
    <div className="flex flex-col gap-6 md:gap-8 max-w-[960px] mx-auto">
      <PageHeader title="Payments" subtitle="Manage your tuition and fee payments" />

      {error && (
        <div className="flex items-start gap-3 p-4 bg-danger/10 border border-danger/30 rounded-lg">
          <AlertTriangle size={18} color="#BA1A1A" className="mt-0.5 shrink-0" />
          <span className="font-heading text-sm text-danger">{error}</span>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
        <KPICard label="OUTSTANDING BALANCE" borderColor="#765B00">
          <span className="font-heading font-semibold text-2xl sm:text-[36px] leading-tight sm:leading-[36px] text-text-primary">
            ${(summary?.totalDue || 0).toFixed(2)}
          </span>
          {summary?.nextDueDate && (
            <span className="font-heading text-xs text-text-secondary mt-1">
              Due by {format(new Date(summary.nextDueDate), "MMM dd, yyyy")}
            </span>
          )}
        </KPICard>
        <KPICard label="TOTAL PAID" borderColor="#4F378A">
          <span className="font-heading font-semibold text-2xl sm:text-[36px] leading-tight sm:leading-[36px] text-primary">
            ${(summary?.totalPaid || 0).toFixed(2)}
          </span>
          <span className="font-heading text-xs text-text-secondary mt-1">
            {summary?.paymentCount || 0} transaction{summary?.paymentCount !== 1 ? "s" : ""}
          </span>
        </KPICard>
        <KPICard label="SEMESTER FEE" borderColor="#63597C">
          <span className="font-heading font-semibold text-2xl sm:text-[36px] leading-tight sm:leading-[36px] text-text-primary">
            ${(summary?.semesterFee || 5000).toFixed(2)}
          </span>
          <span className="font-heading text-xs text-text-secondary mt-1">
            {currentSemester?.name || "Current semester"}
          </span>
        </KPICard>
      </div>

      {lastPaymentResult && step === "confirmation" && (
        <div className="bg-white border border-primary rounded-xl p-6 sm:p-8 shadow-sm">
          <div className="flex flex-col items-center text-center gap-4">
            <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
              <Check size={32} color="#4F378A" />
            </div>
            <h3 className="font-heading font-semibold text-xl m-0 text-text-primary">
              Payment Successful
            </h3>
            <div className="flex flex-col gap-2 w-full max-w-sm">
              <div className="flex justify-between py-2 border-b border-bg-light">
                <span className="font-heading text-sm text-text-secondary">Transaction ID</span>
                <span className="font-heading text-sm font-semibold text-primary">{lastPaymentResult.transactionId}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-bg-light">
                <span className="font-heading text-sm text-text-secondary">Semester</span>
                <span className="font-heading text-sm font-semibold text-text-primary">
                  {lastPaymentResult.payment?.semesterName || "-"}
                </span>
              </div>
              <div className="flex justify-between py-2 border-b border-bg-light">
                <span className="font-heading text-sm text-text-secondary">Description</span>
                <span className="font-heading text-sm font-semibold text-text-primary">
                  {lastPaymentResult.payment?.description || "Tuition Fee"}
                </span>
              </div>
              <div className="flex justify-between py-2 border-b border-bg-light">
                <span className="font-heading text-sm text-text-secondary">Amount Paid</span>
                <span className="font-heading text-sm font-semibold text-text-primary">
                  ${lastPaymentResult.payment?.amount?.toFixed(2) || "0.00"}
                </span>
              </div>
              <div className="flex justify-between py-2 border-b border-bg-light">
                <span className="font-heading text-sm text-text-secondary">Payment Method</span>
                <span className="font-heading text-sm font-semibold text-text-primary capitalize">
                  {(lastPaymentResult.payment?.paymentMethod || "-").replace(/_/g, " ")}
                </span>
              </div>
              <div className="flex justify-between py-2 border-b border-bg-light">
                <span className="font-heading text-sm text-text-secondary">Status</span>
                <StatusBadge status={lastPaymentResult.payment?.status || "paid"} />
              </div>
            </div>
            <p className="font-heading text-sm text-text-secondary m-0">{lastPaymentResult.message}</p>
            <button
              onClick={handleBackToForm}
              className="flex items-center gap-2 px-4 py-2 bg-primary text-white border-none rounded-lg font-body text-sm cursor-pointer"
            >
              <ArrowLeft size={16} /> Back to Payments
            </button>
          </div>
        </div>
      )}

      {step === "form" && showPayForm && selectedPayment && (
        <div className="bg-white border border-primary rounded-xl p-4 sm:p-6 shadow-sm">
          <h4 className="font-heading font-semibold text-sm sm:text-base m-0 mb-4 text-text-primary">
            Pay {selectedPayment.description || "Tuition Fee"}
          </h4>

          <div className="flex flex-col gap-3 mb-4">
            <div className="flex justify-between py-2 border-b border-bg-light">
              <span className="font-heading text-sm text-text-secondary">Semester</span>
              <span className="font-heading text-sm font-semibold text-text-primary">{selectedPayment.semesterName}</span>
            </div>
            <div className="flex justify-between py-2 border-b border-bg-light">
              <span className="font-heading text-sm text-text-secondary">Amount Due</span>
              <span className="font-heading text-sm font-semibold text-danger">${selectedPayment.amount.toFixed(2)}</span>
            </div>
            {selectedPayment.dueDate && (
              <div className="flex justify-between py-2 border-b border-bg-light">
                <span className="font-heading text-sm text-text-secondary">Due Date</span>
                <span className="font-heading text-sm font-semibold text-text-primary">
                  {format(new Date(selectedPayment.dueDate), "MMM dd, yyyy")}
                </span>
              </div>
            )}
          </div>

          <div className="mb-4">
            <label className="font-heading text-xs text-text-secondary uppercase tracking-wider block mb-2">
              Payment Method
            </label>
            <div className="flex flex-wrap gap-2">
              {PAYMENT_METHODS.map((m) => (
                <button
                  key={m.value}
                  onClick={() => setPaymentMethod(m.value)}
                  className={`px-3 py-2 rounded-lg font-heading text-xs sm:text-sm border cursor-pointer transition-colors ${
                    paymentMethod === m.value
                      ? "bg-primary text-white border-primary"
                      : "bg-white text-text-secondary border-border-color hover:border-primary"
                  }`}
                >
                  {m.label}
                </button>
              ))}
            </div>
          </div>

          {payError && (
            <p className="mb-3 font-heading text-sm text-danger m-0">{payError}</p>
          )}

          <div className="flex gap-3">
            <button
              onClick={() => { setShowPayForm(false); setSelectedPayment(null); }}
              className="px-4 py-2 border border-text-muted rounded-lg bg-transparent text-text-secondary font-body text-sm cursor-pointer"
            >
              Cancel
            </button>
            <button
              onClick={handlePay}
              disabled={loading}
              className={`flex items-center gap-2 px-4 py-2 border-none rounded-lg text-white font-body text-sm ${
                loading ? "bg-border-color cursor-not-allowed" : "bg-primary cursor-pointer"
              }`}
            >
              <CreditCard size={16} />
              {loading ? "Processing..." : `Pay $${selectedPayment.amount.toFixed(2)}`}
            </button>
          </div>
        </div>
      )}

      {pendingPayments.length > 0 && step === "form" && !showPayForm && (
        <div>
          <h3 className="font-heading font-semibold text-lg sm:text-xl m-0 mb-4 text-text-primary">
            Pending Payments
          </h3>
          <div className="flex flex-col gap-3">
            {pendingPayments.map((p) => (
              <div key={p._id} className="bg-white border border-border-color rounded-xl p-4 sm:p-6 shadow-sm">
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-heading font-semibold text-sm sm:text-base text-text-primary">
                        {p.semesterName || "Semester"}
                      </span>
                      <StatusBadge status={p.status} />
                    </div>
                    <p className="font-heading text-xs sm:text-sm text-text-secondary m-0">
                      {p.description || "Tuition Fee"}
                    </p>
                    {p.dueDate && (
                      <p className="font-heading text-xs text-text-muted m-0 mt-1">
                        Due: {format(new Date(p.dueDate), "MMM dd, yyyy")}
                      </p>
                    )}
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="font-heading font-bold text-lg sm:text-xl text-danger">
                      ${p.amount.toFixed(2)}
                    </span>
                    <button
                      onClick={() => handleSelectPayment(p)}
                      className="flex items-center gap-2 px-4 py-2 bg-primary text-white border-none rounded-lg font-body text-sm cursor-pointer shrink-0"
                    >
                      <CreditCard size={16} />
                      Pay
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {pendingPayments.length === 0 && !showPayForm && step === "form" && (
        <div className="bg-white border border-border-color rounded-xl p-8 text-center shadow-sm">
          <Check size={48} color="#4F378A" className="mx-auto mb-3" />
          <p className="font-heading font-semibold text-base text-text-primary m-0">
            All Caught Up!
          </p>
          <p className="font-heading text-sm text-text-secondary m-0 mt-1">
            You have no outstanding payments.
          </p>
        </div>
      )}

      <div>
        <h3 className="font-heading font-semibold text-lg sm:text-xl m-0 mb-4 text-text-primary">
          Payment History
        </h3>
        {paidPayments.length === 0 ? (
          <div className="bg-white border border-border-color rounded-xl p-8 text-center shadow-sm">
            <p className="font-heading text-text-muted text-sm m-0">No payment records yet.</p>
          </div>
        ) : (
          <div className="bg-white border border-border-color rounded-xl overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full border-collapse min-w-[500px]">
                <thead>
                  <tr className="border-b border-border-color bg-bg-light">
                    <th className="text-left px-4 sm:px-6 py-3 font-heading font-semibold text-[10px] sm:text-xs tracking-wider uppercase text-text-secondary">
                      Date
                    </th>
                    <th className="text-left px-4 sm:px-6 py-3 font-heading font-semibold text-[10px] sm:text-xs tracking-wider uppercase text-text-secondary">
                      Semester
                    </th>
                    <th className="text-left px-4 sm:px-6 py-3 font-heading font-semibold text-[10px] sm:text-xs tracking-wider uppercase text-text-secondary">
                      Method
                    </th>
                    <th className="text-left px-4 sm:px-6 py-3 font-heading font-semibold text-[10px] sm:text-xs tracking-wider uppercase text-text-secondary">
                      Transaction
                    </th>
                    <th className="text-right px-4 sm:px-6 py-3 font-heading font-semibold text-[10px] sm:text-xs tracking-wider uppercase text-text-secondary">
                      Amount
                    </th>
                    <th className="text-center px-4 sm:px-6 py-3 font-heading font-semibold text-[10px] sm:text-xs tracking-wider uppercase text-text-secondary">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {paidPayments.map((p, i) => (
                    <tr key={p._id} className={i > 0 ? "border-t border-border-color" : ""}>
                      <td className="px-4 sm:px-6 py-3 font-heading text-sm text-text-primary">
                        {p.paidAt ? format(new Date(p.paidAt), "MMM dd, yyyy") : p.createdAt ? format(new Date(p.createdAt), "MMM dd, yyyy") : "-"}
                      </td>
                      <td className="px-4 sm:px-6 py-3 font-heading text-sm text-text-primary">
                        {p.semesterName || "-"}
                      </td>
                      <td className="px-4 sm:px-6 py-3 font-heading text-sm text-text-secondary capitalize">
                        {(p.paymentMethod || "-").replace(/_/g, " ")}
                      </td>
                      <td className="px-4 sm:px-6 py-3 font-body text-xs text-text-muted">
                        {p.transactionId || "-"}
                      </td>
                      <td className="px-4 sm:px-6 py-3 font-heading font-bold text-sm text-right text-primary">
                        ${p.amount?.toFixed(2)}
                      </td>
                      <td className="px-4 sm:px-6 py-3 text-center">
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
