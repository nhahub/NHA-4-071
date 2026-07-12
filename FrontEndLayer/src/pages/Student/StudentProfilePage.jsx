import { useEffect, useState } from "react";
import { useStudent } from "../../hooks/useStudent";
import { useAuth } from "../../hooks/useAuth";
import PageHeader from "../../shared/components/PageHeader";
import KPICard from "../../shared/components/KPICard";
import LoadingSkeleton from "../../shared/components/LoadingSkeleton";
import { User, BookOpen, Award, Calendar, Edit3, Save, X } from "lucide-react";

const StudentProfilePage = () => {
  const { profile, loadProfile, saveProfile, loading, updating, error } = useStudent();
  const { user } = useAuth();
  const [editing, setEditing] = useState(false);
  const [nameValue, setNameValue] = useState("");

  useEffect(() => {
    loadProfile();
  }, []);

  useEffect(() => {
    if (profile) {
      setNameValue(profile.name || "");
    }
  }, [profile]);

  const handleSave = async () => {
    if (!nameValue.trim()) return;
    await saveProfile({ name: nameValue.trim() });
    setEditing(false);
  };

  const handleCancel = () => {
    setNameValue(profile?.name || "");
    setEditing(false);
  };

  const displayName = profile?.name || user?.name || "\u2014";
  const displayEmail = profile?.email || user?.email || "\u2014";
  const displayInitial = displayName.charAt(0)?.toUpperCase() || "U";

  if (loading) return <LoadingSkeleton count={3} />;

  return (
    <div className="flex flex-col gap-6 md:gap-8 max-w-[960px] mx-auto">
      <PageHeader title="My Profile" subtitle="Manage your personal information" />

      {error && (
        <div className="p-4 bg-danger/10 border border-danger rounded-lg text-danger font-heading text-sm">{error}</div>
      )}

      <div className="flex flex-col lg:flex-row gap-4 md:gap-6">
        {/* Sidebar - Read Only */}
        <div className="w-full lg:w-[240px] flex flex-col items-center gap-4 p-6 sm:p-8 bg-white border border-border-color rounded-xl shadow-sm lg:self-start">
          <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full border-2 border-primary bg-[#E6E0E9] flex items-center justify-center">
            <span className="text-3xl sm:text-4xl font-heading font-bold text-primary">
              {displayInitial}
            </span>
          </div>
          <div className="text-center">
            <h3 className="font-heading font-semibold text-lg sm:text-xl m-0 text-text-primary">
              {displayName}
            </h3>
            <p className="font-heading text-sm text-text-muted mt-1 break-all">
              {displayEmail}
            </p>
          </div>
          <div className="flex flex-col items-center gap-1 mt-2">
            <span className="font-heading text-xs text-text-secondary uppercase tracking-wider">
              Student ID
            </span>
            <span className="font-heading font-semibold text-sm text-text-primary">
              {profile?.universityId || user?.universityId || "\u2014"}
            </span>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 flex flex-col gap-3 sm:gap-4">
          {/* Personal Information */}
          <div className="bg-white border border-border-color rounded-xl p-4 sm:p-6 shadow-sm">
            <div className="flex justify-between items-center mb-4">
              <h4 className="font-heading font-semibold text-sm sm:text-base m-0 text-text-primary">
                Personal Information
              </h4>
              {!editing ? (
                <button onClick={() => setEditing(true)} className="flex items-center gap-1 text-primary font-body text-sm cursor-pointer bg-transparent border-none">
                  <Edit3 size={14} /> Edit
                </button>
              ) : (
                <div className="flex gap-2">
                  <button onClick={handleSave} disabled={updating || !nameValue.trim()} className="flex items-center gap-1 px-3 py-1 bg-primary text-white rounded-lg font-body text-sm cursor-pointer border-none disabled:opacity-50">
                    <Save size={14} /> {updating ? "Saving..." : "Save"}
                  </button>
                  <button onClick={handleCancel} className="flex items-center gap-1 px-3 py-1 border border-text-muted rounded-lg font-body text-sm cursor-pointer bg-transparent text-text-muted">
                    <X size={14} /> Cancel
                  </button>
                </div>
              )}
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
              {/* Name - Editable */}
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-bg-light flex items-center justify-center shrink-0">
                  <User size={18} color="#4F378A" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="font-heading text-[10px] sm:text-xs text-text-muted m-0 tracking-wider uppercase">
                    Full Name
                  </p>
                  {editing ? (
                    <input
                      value={nameValue}
                      onChange={(e) => setNameValue(e.target.value)}
                      className="w-full p-1.5 border border-border rounded-lg font-heading text-sm sm:text-base mt-0.5"
                      placeholder="Your full name"
                    />
                  ) : (
                    <p className="font-heading text-sm sm:text-base text-text-primary m-0 truncate">
                      {displayName}
                    </p>
                  )}
                </div>
              </div>
              {/* Email - Read Only */}
              <ProfileField icon={User} label="Email" value={displayEmail} />
              {/* Department - Read Only */}
              <ProfileField icon={BookOpen} label="Department" value={profile?.departmentName || "\u2014"} />
              {/* Program - Read Only */}
              <ProfileField icon={Award} label="Program" value={profile?.program || "\u2014"} />
              {/* Level - Read Only */}
              <ProfileField icon={Calendar} label="Level" value={profile?.level != null ? `Level ${profile.level}` : "\u2014"} />
              {/* GPA - Read Only */}
              <ProfileField icon={Award} label="GPA" value={profile?.GPA?.toFixed(2) || "\u2014"} />
            </div>
          </div>

          {/* Summary KPI Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
            <KPICard label="STUDENT ID" value={profile?.universityId || user?.universityId || "\u2014"} borderColor="#4F378A" />
            <KPICard label="EMAIL" borderColor="#63597C">
              <span className="font-body text-sm text-text-secondary break-all">
                {displayEmail}
              </span>
            </KPICard>
          </div>
        </div>
      </div>
    </div>
  );
};

const ProfileField = ({ icon: Icon, label, value }) => (
  <div className="flex items-center gap-3">
    <div className="w-9 h-9 rounded-lg bg-bg-light flex items-center justify-center shrink-0">
      <Icon size={18} color="#4F378A" />
    </div>
    <div className="min-w-0">
      <p className="font-heading text-[10px] sm:text-xs text-text-muted m-0 tracking-wider uppercase">
        {label}
      </p>
      <p className="font-heading text-sm sm:text-base text-text-primary m-0 truncate">
        {value}
      </p>
    </div>
  </div>
);

export default StudentProfilePage;
