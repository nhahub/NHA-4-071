import { useEffect, useState } from "react";
import { useSettings } from "../../hooks/useSettings";
import { changePassword } from "../../services/authService";
import PageHeader from "../../shared/components/PageHeader";
import LoadingSkeleton from "../../shared/components/LoadingSkeleton";
import { Eye, Globe, Lock, Save, CheckCircle, EyeOff } from "lucide-react";

const LANGUAGES = [
  { value: "en", label: "English" },
  { value: "ar", label: "العربية" },
  { value: "fr", label: "Français" },
];

const defaultSettings = { showGpa: true, preferredLanguage: "en" };

const SettingsPage = () => {
  const { preferences, loadSettings, saveSettings, loading, saving, error } = useSettings();
  const [local, setLocal] = useState(null),
    [currentPassword, setCurrentPassword] = useState(""),
    [newPassword, setNewPassword] = useState(""),
    [confirmPassword, setConfirmPassword] = useState(""),
    [pwStatus, setPwStatus] = useState(null),
    [pwSaving, setPwSaving] = useState(false),
    [showCurrent, setShowCurrent] = useState(false),
    [showNew, setShowNew] = useState(false),
    [showConfirm, setShowConfirm] = useState(false);

  useEffect(() => { loadSettings(); }, []);

  useEffect(() => {
    if (preferences) setLocal({ ...preferences });
  }, [preferences]);

  const settings = local || preferences || defaultSettings;

  const toggle = (key) => {
    const updated = { ...settings, [key]: !settings[key] };
    setLocal(updated);
    saveSettings(updated);
  };

  const changeLang = (val) => {
    const updated = { ...settings, preferredLanguage: val };
    setLocal(updated);
    saveSettings(updated);
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    setPwStatus(null);
    if (newPassword !== confirmPassword) {
      setPwStatus({ type: "error", msg: "New passwords do not match." });
      return;
    }
    if (newPassword.length < 6) {
      setPwStatus({ type: "error", msg: "New password must be at least 6 characters." });
      return;
    }
    setPwSaving(true);
    const result = await changePassword({ currentPassword, newPassword, confirmPassword });
    setPwSaving(false);
    if (result.success) {
      setPwStatus({ type: "success", msg: "Password changed successfully." });
      setCurrentPassword(""); setNewPassword(""); setConfirmPassword("");
    } else {
      setPwStatus({ type: "error", msg: result.error || "Failed to change password." });
    }
  };

  if (loading) return <LoadingSkeleton count={3} />;

  return (
    <div className="flex flex-col gap-8 max-w-[960px] mx-auto">
      <PageHeader title="Settings" subtitle="Manage your preferences" />

      {error && (
        <div className="p-4 bg-danger/10 border border-danger rounded-lg text-danger font-heading text-sm">{error}</div>
      )}

      <Section icon={Eye} title="Display">
        <ToggleRow label="Show GPA on Dashboard" desc="Display your GPA on the dashboard" on={settings.showGpa} onToggle={() => toggle("showGpa")} />
      </Section>

      <Section icon={Globe} title="Preferences">
        <div className="flex justify-between items-center">
          <div>
            <p className="font-heading text-base text-text-primary m-0">Preferred Language</p>
            <p className="font-heading text-sm text-text-muted m-0 mt-0.5">Choose your interface language</p>
          </div>
          <select
            value={settings.preferredLanguage || "en"}
            onChange={(e) => changeLang(e.target.value)}
            className="px-3 py-2 rounded-lg border border-border-color bg-white font-heading text-sm text-text-primary outline-none cursor-pointer"
          >
            {LANGUAGES.map((l) => <option key={l.value} value={l.value}>{l.label}</option>)}
          </select>
        </div>
      </Section>

      <Section icon={Lock} title="Security">
        <form onSubmit={handleChangePassword} className="flex flex-col gap-4">
          <PasswordField label="Current Password" value={currentPassword} onChange={setCurrentPassword} show={showCurrent} toggleShow={() => setShowCurrent((p) => !p)} />
          <PasswordField label="New Password" value={newPassword} onChange={setNewPassword} show={showNew} toggleShow={() => setShowNew((p) => !p)} />
          <PasswordField label="Confirm New Password" value={confirmPassword} onChange={setConfirmPassword} show={showConfirm} toggleShow={() => setShowConfirm((p) => !p)} />

          {pwStatus && (
            <div className={`flex items-center gap-2 text-sm font-heading ${pwStatus.type === "success" ? "text-[#2E7D32]" : "text-danger"}`}>
              {pwStatus.type === "success" ? <CheckCircle size={16} /> : null}
              {pwStatus.msg}
            </div>
          )}

          <button type="submit" disabled={pwSaving || !currentPassword || !newPassword || !confirmPassword}
            className="flex items-center gap-2 px-4 py-[9px] bg-primary text-white rounded-lg font-body text-base cursor-pointer self-start disabled:opacity-50">
            {pwSaving ? "Saving..." : "Change Password"}
          </button>
        </form>
      </Section>
    </div>
  );
};

const Section = ({ icon: Icon, title, children }) => (
  <div className="bg-white border border-border rounded-xl p-6 shadow-sm">
    <h3 className="font-heading font-semibold text-lg text-text-primary m-0 mb-5 flex items-center gap-2">
      <Icon size={20} color="#4F378A" /> {title}
    </h3>
    <div className="flex flex-col gap-4">{children}</div>
  </div>
);

const ToggleRow = ({ label, desc, on, onToggle }) => (
  <div className="flex justify-between items-center">
    <div>
      <p className="font-heading text-base text-text-primary m-0">{label}</p>
      <p className="font-heading text-sm text-text-muted m-0 mt-0.5">{desc}</p>
    </div>
    <button onClick={onToggle}
      className="w-11 h-6 rounded-full border-none cursor-pointer relative transition-all duration-200"
      style={{ background: on ? "#4F378A" : "#CBC4D2" }}>
      <div className="w-5 h-5 rounded-full bg-white absolute top-0.5 shadow-[0px_1px_3px_rgba(0,0,0,0.2)] transition-all duration-200"
        style={{ left: on ? 22 : 2 }} />
    </button>
  </div>
);

const PasswordField = ({ label, value, onChange, show, toggleShow }) => (
  <div>
    <label className="font-heading text-sm text-text-primary mb-1 block">{label}</label>
    <div className="flex items-center gap-2 px-3 py-2 border border-border-color rounded-lg bg-white">
      <input
        type={show ? "text" : "password"}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="flex-1 border-none outline-none font-heading text-base bg-transparent"
      />
      <button type="button" onClick={toggleShow} className="bg-transparent border-none p-0 cursor-pointer">
        {show ? <EyeOff size={18} color="#7A7582" /> : <Eye size={18} color="#7A7582" />}
      </button>
    </div>
  </div>
);

export default SettingsPage;