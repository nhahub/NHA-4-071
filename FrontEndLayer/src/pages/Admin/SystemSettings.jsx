import { useState, useEffect } from "react";
import {
  Key, Shield, CheckCircle2, XCircle, Globe, Database,
  Copy, Eye, EyeOff, Upload, RefreshCw, Check, Save,
  AlertCircle, Lock, History
} from "lucide-react";
import { getSettings, updateSettings } from "../../services/adminService";

const SystemSettings = () => {
  const [settingsData, setSettingsData] = useState({});
  const [apiKey, setApiKey] = useState("");
  const [showKey, setShowKey] = useState(true);
  const [copied, setCopied] = useState(false);
  const [rateLimit, setRateLimit] = useState("");
  const [webhookUrl, setWebhookUrl] = useState("");

  // Toggles
  const [mfaEnforced, setMfaEnforced] = useState(false);
  const [sessionTimeout, setSessionTimeout] = useState(false);

  // RBAC Matrix
  const [rbacMatrix, setRbacMatrix] = useState([]);

  // Branding
  const [institutionName, setInstitutionName] = useState("");
  const [primaryColor, setPrimaryColor] = useState("");
  const [accentColor, setAccentColor] = useState("");

  useEffect(() => {
    getSettings().then((result) => {
      if (result.success && result.data) {
        const grouped = { apiGateway: {}, securityProtocol: {}, notifications: {}, integrations: {} };
        Object.entries(result.data).forEach(([key, value]) => {
          if (key.startsWith('apiGateway.')) grouped.apiGateway[key.replace('apiGateway.', '')] = value;
          else if (key.startsWith('securityProtocol.')) grouped.securityProtocol[key.replace('securityProtocol.', '')] = value;
          else if (key.startsWith('notifications.')) grouped.notifications[key.replace('notifications.', '')] = value;
          else if (key.startsWith('integrations.')) grouped.integrations[key.replace('integrations.', '')] = value;
          else grouped.apiGateway[key] = value;
        });
        setSettingsData(grouped);
        setApiKey(grouped.apiGateway.masterKey || "");
        setRateLimit(grouped.apiGateway.rateLimit || "");
        setWebhookUrl(grouped.apiGateway.webhookUrl || "");
        setMfaEnforced(grouped.securityProtocol.mfaEnforced || false);
        setSessionTimeout(grouped.securityProtocol.sessionAutoTimeout || false);
        setInstitutionName(grouped.apiGateway.institutionName || "");
        setPrimaryColor(grouped.apiGateway.primaryColor || "");
        setAccentColor(grouped.apiGateway.accentColor || "");
      }
    });
  }, []);

  const handleCopyKey = () => {
    navigator.clipboard.writeText(apiKey);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleGenerateKey = () => {
    const randomHex = Math.random().toString(36).substring(2, 12) + Math.random().toString(36).substring(2, 12);
    const newKey = `msk_live_${randomHex}_prod`;
    setApiKey(newKey);
    alert("New Production Master Key generated successfully! Make sure to update your API integrations.");
  };

  const togglePermission = (rowId, roleKey) => {
    setRbacMatrix((prev) =>
      prev.map((row) =>
        row.id === rowId ? { ...row, [roleKey]: !row[roleKey] } : row
      )
    );
  };

  const handleSaveChanges = async () => {
    const payload = {
      "apiGateway.masterKey": apiKey,
      "apiGateway.rateLimit": rateLimit,
      "apiGateway.webhookUrl": webhookUrl,
      "securityProtocol.mfaEnforced": mfaEnforced,
      "securityProtocol.sessionAutoTimeout": sessionTimeout,
      "globalBranding.institutionName": institutionName,
      "globalBranding.primaryColor": primaryColor,
      "globalBranding.accentColor": accentColor,
    };
    const result = await updateSettings(payload);
    if (result.success) {
      alert("System settings and RBAC permission overrides saved successfully!");
    } else {
      alert("Failed to save settings. Please try again.");
    }
  };

  return (
    <div className="space-y-6 pb-12 animate-in fade-in duration-200">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-[#424754] pb-6">
        <div>
          <h1 className="font-heading font-semibold text-2xl text-[#E0E3E5] tracking-[-0.24px] m-0">
            System Settings
          </h1>
          <p className="font-heading text-sm text-[#C2C6D6] mt-1 m-0">
            Configure global API gateways, security protocols, RBAC permissions, and disaster recovery.
          </p>
        </div>
      </div>

      {/* Top Row: API & Security Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Card: API Gateway & Integration (Col Span 8) */}
        <div className="lg:col-span-8 bg-[#1D2022] border border-[#424754] rounded-lg p-6 shadow-xl flex flex-col justify-between">
          <div>
            {/* Header */}
            <div className="flex justify-between items-center mb-6">
              <div className="flex items-center gap-2.5">
                <Key size={18} className="text-[#ADC6FF]" />
                <h3 className="font-heading font-semibold text-lg text-[#E0E3E5] m-0">
                  API Gateway & Integration
                </h3>
              </div>
              <button
                type="button"
                onClick={handleGenerateKey}
                className="px-4 py-2 bg-[#ADC6FF] hover:bg-[#8CAEFF] text-[#002E6A] font-heading font-bold text-[11px] uppercase tracking-[0.55px] rounded cursor-pointer border-none shadow-md transition-all transform active:scale-95"
              >
                Generate Key
              </button>
            </div>

            {/* Master Key Box */}
            <div className="bg-[#101415] border border-[#424754] rounded p-4 mb-6 space-y-1.5">
              <label className="block font-heading text-[11px] uppercase font-bold text-[#C2C6D6] tracking-wider">
                Production Master Key
              </label>
              <div className="flex justify-between items-center gap-4">
                <span className="font-mono text-sm text-[#4CD7F6] truncate select-all">
                  {showKey ? apiKey : "msk_live_••••••••••••••••••••••••••••••••••••••••••••"}
                </span>
                <div className="flex items-center gap-3 shrink-0">
                  <button
                    type="button"
                    onClick={() => setShowKey(!showKey)}
                    title={showKey ? "Hide key" : "Show key"}
                    className="text-[#C2C6D6] hover:text-[#E0E3E5] cursor-pointer border-none bg-transparent p-1"
                  >
                    {showKey ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                  <button
                    type="button"
                    onClick={handleCopyKey}
                    title="Copy key to clipboard"
                    className="text-[#C2C6D6] hover:text-[#E0E3E5] cursor-pointer border-none bg-transparent p-1 flex items-center gap-1"
                  >
                    {copied ? <Check size={16} className="text-[#4CD7F6]" /> : <Copy size={16} />}
                  </button>
                </div>
              </div>
            </div>

            {/* Inputs Row */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block font-heading text-[11px] uppercase font-bold text-[#C2C6D6] tracking-wider mb-1.5">
                  Rate Limit (req/sec)
                </label>
                <input
                  type="number"
                  value={rateLimit}
                  onChange={(e) => setRateLimit(e.target.value)}
                  className="bg-[#101415] border border-[#424754] rounded px-3.5 py-2.5 text-[#E0E3E5] text-sm font-mono w-full focus:outline-none focus:border-[#4D8EFF] transition-colors"
                />
              </div>
              <div>
                <label className="block font-heading text-[11px] uppercase font-bold text-[#C2C6D6] tracking-wider mb-1.5">
                  Webhook URL
                </label>
                <input
                  type="text"
                  value={webhookUrl}
                  onChange={(e) => setWebhookUrl(e.target.value)}
                  className="bg-[#101415] border border-[#424754] rounded px-3.5 py-2.5 text-[#E0E3E5] text-sm font-mono w-full focus:outline-none focus:border-[#4D8EFF] transition-colors"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Right Card: Security Protocol (Col Span 4) */}
        <div className="lg:col-span-4 bg-[#1D2022] border border-[#424754] rounded-lg p-6 shadow-xl flex flex-col justify-between">
          <div>
            {/* Header */}
            <div className="flex items-center gap-2.5 mb-6">
              <Shield size={18} className="text-[#ADC6FF]" />
              <h3 className="font-heading font-semibold text-lg text-[#E0E3E5] m-0">
                Security Protocol
              </h3>
            </div>

            {/* Toggle 1: MFA */}
            <div className="flex justify-between items-center pb-5 border-b border-[#424754]/60">
              <div>
                <div className="font-heading font-bold text-[11px] uppercase text-[#E0E3E5] tracking-wider">
                  Enforce Multi-Factor (MFA)
                </div>
                <div className="font-heading text-xs text-[#C2C6D6] mt-0.5">
                  Require TOTP for all administrative roles
                </div>
              </div>
              {/* Toggle Switch */}
              <button
                type="button"
                onClick={() => setMfaEnforced(!mfaEnforced)}
                className={`w-12 h-6 rounded-full p-1 flex items-center transition-colors cursor-pointer border-none ${
                  mfaEnforced ? "bg-[#4D8EFF] justify-end" : "bg-[#323537] justify-start"
                }`}
              >
                <span className="w-4 h-4 rounded-full bg-white shadow-sm" />
              </button>
            </div>

            {/* Toggle 2: Session Timeout */}
            <div className="flex justify-between items-center py-5 border-b border-[#424754]/60">
              <div>
                <div className="font-heading font-bold text-[11px] uppercase text-[#E0E3E5] tracking-wider">
                  Session Auto-Timeout
                </div>
                <div className="font-heading text-xs text-[#C2C6D6] mt-0.5">
                  Logout after 15 minutes of inactivity
                </div>
              </div>
              {/* Toggle Switch */}
              <button
                type="button"
                onClick={() => setSessionTimeout(!sessionTimeout)}
                className={`w-12 h-6 rounded-full p-1 flex items-center transition-colors cursor-pointer border-none ${
                  sessionTimeout ? "bg-[#4D8EFF] justify-end" : "bg-[#323537] justify-start"
                }`}
              >
                <span className="w-4 h-4 rounded-full bg-[#8C909F] shadow-sm" />
              </button>
            </div>

            {/* Password Policy Badges */}
            <div className="pt-5 space-y-3">
              <div className="font-heading font-bold text-[11px] uppercase text-[#C2C6D6] tracking-wider">
                Password Policy
              </div>
              <div className="flex flex-wrap gap-2 font-heading text-xs font-bold">
                <span className="bg-[#323537] border border-[#424754] text-[#E0E3E5] px-2.5 py-1 rounded">
                  12+ Chars
                </span>
                <span className="bg-[#323537] border border-[#424754] text-[#E0E3E5] px-2.5 py-1 rounded">
                  Special Symbols
                </span>
                <span className="bg-[#4D8EFF]/20 border border-[#ADC6FF]/40 text-[#ADC6FF] px-2.5 py-1 rounded">
                  Enforced
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Middle Row: Role-Based Access Control (RBAC) Matrix */}
      <div className="bg-[#1D2022] border border-[#424754] rounded-lg p-6 shadow-xl">
        {/* Header Bar */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <div>
            <h3 className="font-heading font-semibold text-lg text-[#E0E3E5] m-0">
              Role-Based Access Control (RBAC) Matrix
            </h3>
            <p className="font-heading text-xs text-[#C2C6D6] mt-0.5 m-0">
              Global permission overrides for system modules (click icons to toggle access)
            </p>
          </div>

          <div className="flex items-center gap-2 font-heading">
            <button
              type="button"
              onClick={() => alert("Opening comprehensive security & RBAC audit logs...")}
              className="px-3.5 py-2 bg-transparent hover:bg-[#272A2C] border border-[#424754] rounded text-[#C2C6D6] hover:text-[#E0E3E5] font-bold text-[11px] uppercase tracking-[0.55px] cursor-pointer transition-colors flex items-center gap-1.5"
            >
              <History size={14} />
              <span>Audit Logs</span>
            </button>
            <button
              type="button"
              onClick={handleSaveChanges}
              className="px-4 py-2 bg-[#ADC6FF] hover:bg-[#8CAEFF] text-[#002E6A] font-bold text-[11px] uppercase tracking-[0.55px] rounded cursor-pointer border-none shadow-md transition-all transform active:scale-95 flex items-center gap-1.5"
            >
              <Save size={14} />
              <span>Save Changes</span>
            </button>
          </div>
        </div>

        {/* Permission Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[640px] font-heading">
            <thead>
              <tr className="bg-[#272A2C] border-b border-[#424754] text-[11px] uppercase font-bold text-[#C2C6D6] tracking-[0.55px]">
                <th className="py-3.5 px-6 border-r border-[#424754]/60">Module / Role</th>
                <th className="py-3.5 px-6 text-center">Super Admin</th>
                <th className="py-3.5 px-6 text-center">Registrar</th>
                <th className="py-3.5 px-6 text-center">Department Head</th>
                <th className="py-3.5 px-6 text-center">Faculty Lead</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#424754]/60 text-sm">
              {rbacMatrix.map((row) => (
                <tr key={row.id} className="hover:bg-[#272A2C]/30 transition-colors">
                  {/* Module Name */}
                  <td className="py-4 px-6 font-semibold text-[#E0E3E5] border-r border-[#424754]/60">
                    {row.module}
                  </td>

                  {/* Super Admin */}
                  <td className="py-4 px-6 text-center">
                    <button
                      type="button"
                      onClick={() => togglePermission(row.id, "superAdmin")}
                      className="bg-transparent border-none cursor-pointer p-1 transition-transform active:scale-125"
                    >
                      {row.superAdmin ? (
                        <CheckCircle2 size={22} className="text-[#4CD7F6] fill-[#4CD7F6]/20 mx-auto" />
                      ) : (
                        <XCircle size={22} className="text-[#8C909F] fill-[#8C909F]/10 mx-auto" />
                      )}
                    </button>
                  </td>

                  {/* Registrar */}
                  <td className="py-4 px-6 text-center">
                    <button
                      type="button"
                      onClick={() => togglePermission(row.id, "registrar")}
                      className="bg-transparent border-none cursor-pointer p-1 transition-transform active:scale-125"
                    >
                      {row.registrar ? (
                        <CheckCircle2 size={22} className="text-[#4CD7F6] fill-[#4CD7F6]/20 mx-auto" />
                      ) : (
                        <XCircle size={22} className="text-[#8C909F] fill-[#8C909F]/10 mx-auto" />
                      )}
                    </button>
                  </td>

                  {/* Dept Head */}
                  <td className="py-4 px-6 text-center">
                    <button
                      type="button"
                      onClick={() => togglePermission(row.id, "deptHead")}
                      className="bg-transparent border-none cursor-pointer p-1 transition-transform active:scale-125"
                    >
                      {row.deptHead ? (
                        <CheckCircle2 size={22} className="text-[#4CD7F6] fill-[#4CD7F6]/20 mx-auto" />
                      ) : (
                        <XCircle size={22} className="text-[#8C909F] fill-[#8C909F]/10 mx-auto" />
                      )}
                    </button>
                  </td>

                  {/* Faculty Lead */}
                  <td className="py-4 px-6 text-center">
                    <button
                      type="button"
                      onClick={() => togglePermission(row.id, "facultyLead")}
                      className="bg-transparent border-none cursor-pointer p-1 transition-transform active:scale-125"
                    >
                      {row.facultyLead ? (
                        <CheckCircle2 size={22} className="text-[#4CD7F6] fill-[#4CD7F6]/20 mx-auto" />
                      ) : (
                        <XCircle size={22} className="text-[#8C909F] fill-[#8C909F]/10 mx-auto" />
                      )}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Bottom Row: Branding & Disaster Recovery */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Card: Global Branding (Col Span 6) */}
        <div className="lg:col-span-6 bg-[#1D2022] border border-[#424754] rounded-lg p-6 shadow-xl flex flex-col justify-between">
          <div>
            {/* Header */}
            <div className="flex items-center gap-2.5 mb-6">
              <Globe size={18} className="text-[#ADC6FF]" />
              <h3 className="font-heading font-semibold text-lg text-[#E0E3E5] m-0">
                Global Branding
              </h3>
            </div>

            {/* Content Row */}
            <div className="flex flex-col sm:flex-row gap-6 items-start">
              {/* Logo Upload Box */}
              <div
                onClick={() => alert("Logo file uploader dialog opened (PNG / SVG max 2MB)...")}
                className="w-28 h-28 shrink-0 bg-[#101415] border border-dashed border-[#424754] hover:border-[#ADC6FF] rounded-lg flex flex-col items-center justify-center gap-2 cursor-pointer transition-colors text-[#C2C6D6] hover:text-[#E0E3E5] shadow-sm group"
              >
                <Upload size={22} className="group-hover:-translate-y-0.5 transition-transform text-[#ADC6FF]" />
                <span className="font-heading font-bold text-[10px] uppercase tracking-wider">
                  Logo (PNG)
                </span>
              </div>

              {/* Form Settings */}
              <div className="flex-1 space-y-4 w-full font-heading">
                <div>
                  <label className="block text-[11px] uppercase font-bold text-[#C2C6D6] tracking-wider mb-1.5">
                    Institution Name
                  </label>
                  <input
                    type="text"
                    value={institutionName}
                    onChange={(e) => setInstitutionName(e.target.value)}
                    className="bg-[#101415] border border-[#424754] rounded px-3.5 py-2 text-[#E0E3E5] text-sm w-full focus:outline-none focus:border-[#4D8EFF] transition-colors"
                  />
                </div>

                {/* Color Pickers */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[11px] uppercase font-bold text-[#C2C6D6] tracking-wider mb-1.5">
                      Primary Color
                    </label>
                    <div className="flex items-center gap-2 bg-[#101415] border border-[#424754] rounded px-3 py-2 font-mono text-xs text-[#E0E3E5]">
                      <span className="w-4 h-4 rounded bg-[#ADC6FF] shrink-0 shadow-sm" />
                      <span>{primaryColor}</span>
                    </div>
                  </div>
                  <div>
                    <label className="block text-[11px] uppercase font-bold text-[#C2C6D6] tracking-wider mb-1.5">
                      Accent Color
                    </label>
                    <div className="flex items-center gap-2 bg-[#101415] border border-[#424754] rounded px-3 py-2 font-mono text-xs text-[#E0E3E5]">
                      <span className="w-4 h-4 rounded bg-[#4CD7F6] shrink-0 shadow-sm" />
                      <span>{accentColor}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Card: Disaster Recovery (Col Span 6) */}
        <div className="lg:col-span-6 bg-[#1D2022] border border-[#424754] rounded-lg p-6 shadow-xl flex flex-col justify-between font-heading">
          <div>
            {/* Header */}
            <div className="flex items-center gap-2.5 mb-6">
              <Database size={18} className="text-[#ADC6FF]" />
              <h3 className="font-heading font-semibold text-lg text-[#E0E3E5] m-0">
                Disaster Recovery
              </h3>
            </div>

            {/* Status Card */}
            <div className="bg-[#101415] border border-[#424754] rounded p-4 mb-6 space-y-3">
              <div className="flex justify-between items-center">
                <span className="font-bold text-sm text-[#E0E3E5]">
                  Auto-Backup Enabled
                </span>
                <span className="bg-[#03B5D3]/20 border border-[#03B5D3]/40 text-[#4CD7F6] font-mono text-[10px] font-bold px-2.5 py-0.5 rounded tracking-wider">
                  HEALTHY
                </span>
              </div>

              <div className="text-xs text-[#C2C6D6] font-mono">
                Last successful: 2h ago (Region: EU-West-1)
              </div>

              {/* Progress Bar */}
              <div className="w-full bg-[#323537] h-2 rounded-full overflow-hidden">
                <div className="bg-[#4CD7F6] h-full w-[92%] rounded-full shadow-[0_0_8px_rgba(76,215,246,0.5)] transition-all duration-1000" />
              </div>
            </div>

            {/* Action Buttons */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
              <button
                type="button"
                onClick={() => alert("Selecting restore point from EU-West-1 encrypted vault...")}
                className="py-2.5 px-4 bg-[#1D2022] hover:bg-[#272A2C] border border-[#424754] text-[#C2C6D6] hover:text-[#E0E3E5] font-bold text-xs uppercase tracking-wider rounded flex items-center justify-center gap-2 cursor-pointer transition-colors"
              >
                <RefreshCw size={14} />
                <span>Restore Point</span>
              </button>
              <button
                type="button"
                onClick={() => alert("Triggering immediate manual snapshot across EU-West-1 cluster...")}
                className="py-2.5 px-4 bg-[#4D8EFF] hover:bg-[#68A0FF] text-[#00285D] font-bold text-xs uppercase tracking-wider rounded flex items-center justify-center gap-2 cursor-pointer border-none shadow-lg shadow-[#4D8EFF]/20 transition-transform active:scale-95"
              >
                <Database size={14} />
                <span>Trigger Backup</span>
              </button>
            </div>
          </div>

          {/* Footer Note */}
          <div className="text-center text-[11px] text-[#C2C6D6] pt-3 border-t border-[#424754]/40 flex items-center justify-center gap-1.5">
            <Lock size={12} className="text-[#4CD7F6]" />
            <span>All backups are encrypted with AES-256 by default.</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SystemSettings;
