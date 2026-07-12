export const studentSettings = {
  _id: "settings001",
  studentId: "stu001",
  showGpa: true,
  preferredLanguage: "en",
};

export const systemSettingsData = {
  apiGateway: {
    masterKey: "msk_live_729xK923B_00v29_Xp9LzQwN841YtL_prod",
    rateLimit: "1000",
    webhookUrl: "https://api.morshed.edu/webhooks/v1",
  },
  securityProtocol: {
    mfaEnforced: true,
    sessionAutoTimeout: false,
    passwordPolicy: {
      minChars: "12+ Chars",
      specialSymbols: "Special Symbols",
      status: "Enforced",
    },
  },
  rbacMatrix: [
    { id: 1, module: "Financial Records", superAdmin: true, registrar: false, deptHead: false, facultyLead: false },
    { id: 2, module: "Academic Configuration", superAdmin: true, registrar: true, deptHead: false, facultyLead: false },
    { id: 3, module: "User Onboarding", superAdmin: true, registrar: true, deptHead: true, facultyLead: false },
    { id: 4, module: "System Reporting", superAdmin: true, registrar: true, deptHead: true, facultyLead: true },
  ],
  globalBranding: {
    institutionName: "Morshed National University",
    primaryColor: "#ADC6FF",
    accentColor: "#4CD7F6",
  },
  disasterRecovery: {
    autoBackup: true,
    lastSuccessful: "2h ago (Region: EU-West-1)",
    status: "HEALTHY",
    encryption: "All backups are encrypted with AES-256 by default.",
  },
};
