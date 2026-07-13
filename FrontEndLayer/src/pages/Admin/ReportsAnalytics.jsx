import { useState, useEffect } from "react";
import {
  BarChart3, Download, TrendingUp, TrendingDown,
  Calendar, Filter, Users, Award, Percent, ChevronUp, ChevronDown
} from "lucide-react";
import {
  ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid
} from "recharts";
import { getReports } from "../../services/adminService";

const ReportsAnalytics = () => {
  const [viewMode, setViewMode] = useState("FACULTY");
  const [timeRange, setTimeRange] = useState("MULTI-YEAR");
  const [reports, setReports] = useState({ kpis: [], enrollmentTrends: [], gpaByDepartment: [], institutionalGrowth: [] });

  useEffect(() => {
    getReports().then((result) => {
      if (result.success && result.data) {
        setReports(result.data);
      }
    });
  }, []);

  const { kpis: metrics, enrollmentTrends, gpaByDepartment, institutionalGrowth } = reports;

  return (
    <div className="space-y-6 pb-12 animate-in fade-in duration-200">
      {/* Top Header Bar */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-[#424754] pb-6">
        <div>
          <h1 className="font-heading font-semibold text-2xl text-[#E0E3E5] tracking-[-0.24px] m-0">
            Reports & Analytics
          </h1>
          <p className="font-heading text-sm text-[#C2C6D6] mt-1 m-0">
            Comprehensive institutional performance metrics, enrollment trends, and academic analytics.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setTimeRange(timeRange === "MULTI-YEAR" ? "2023-24 ONLY" : "MULTI-YEAR")}
            className="px-3.5 py-2 bg-[#1D2022] hover:bg-[#272A2C] border border-[#424754] rounded text-[#E0E3E5] font-heading font-bold text-[11px] uppercase tracking-[0.55px] cursor-pointer transition-colors flex items-center gap-2 shadow-sm"
          >
            <Calendar size={14} className="text-[#ADC6FF]" />
            <span>{timeRange}</span>
          </button>

          <button
            onClick={() => alert("Generating & exporting comprehensive Annual Institutional Report (PDF/Excel)...")}
            className="flex items-center gap-2 px-4 py-2 bg-[#ADC6FF] hover:bg-[#8CAEFF] text-[#002E6A] font-heading font-bold text-[11px] uppercase tracking-[0.55px] rounded border-none cursor-pointer shadow-lg shadow-[#ADC6FF]/20 transition-all transform active:scale-95 whitespace-nowrap"
          >
            <Download size={15} strokeWidth={2.5} />
            <span>Export Annual Report</span>
          </button>
        </div>
      </div>

      {/* Quick Metric Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Total Enrollment */}
        <div className="bg-[#1D2022] border border-[#424754] rounded p-4 flex flex-col justify-between h-[94px] shadow-lg">
          <div className="font-heading font-bold text-[11px] text-[#C2C6D6] uppercase tracking-[0.55px]">
            Total Enrollment
          </div>
          <div className="flex justify-between items-baseline">
            <span className="font-heading font-bold text-3xl text-[#ADC6FF] leading-tight">
              {metrics.totalEnrollment.value}
            </span>
            <span className="flex items-center gap-0.5 font-mono text-xs text-[#4CD7F6] font-semibold">
              <ChevronUp size={14} strokeWidth={3} />
              {metrics.totalEnrollment.change}
            </span>
          </div>
        </div>

        {/* Card 2: Avg GPA */}
        <div className="bg-[#1D2022] border border-[#424754] rounded p-4 flex flex-col justify-between h-[94px] shadow-lg">
          <div className="font-heading font-bold text-[11px] text-[#C2C6D6] uppercase tracking-[0.55px]">
            Avg GPA
          </div>
          <div className="flex justify-between items-baseline">
            <span className="font-heading font-bold text-3xl text-[#4CD7F6] leading-tight">
              {metrics.avgGpa.value}
            </span>
            <span className="flex items-center gap-0.5 font-mono text-xs text-[#ADC6FF] font-semibold">
              <ChevronUp size={14} strokeWidth={3} />
              {metrics.avgGpa.change}
            </span>
          </div>
        </div>

        {/* Card 3: Retention Rate */}
        <div className="bg-[#1D2022] border border-[#424754] rounded p-4 flex flex-col justify-between h-[94px] shadow-lg">
          <div className="font-heading font-bold text-[11px] text-[#C2C6D6] uppercase tracking-[0.55px]">
            Retention Rate
          </div>
          <div className="flex justify-between items-baseline">
            <span className="font-heading font-bold text-3xl text-[#ADC6FF] leading-tight">
              {metrics.retentionRate.value}
            </span>
            <span className="flex items-center gap-0.5 font-mono text-xs text-[#4CD7F6] font-semibold">
              <ChevronUp size={14} strokeWidth={3} />
              {metrics.retentionRate.change}
            </span>
          </div>
        </div>

        {/* Card 4: Graduation Rate */}
        <div className="bg-[#1D2022] border border-[#424754] rounded p-4 flex flex-col justify-between h-[94px] shadow-lg">
          <div className="font-heading font-bold text-[11px] text-[#C2C6D6] uppercase tracking-[0.55px]">
            Graduation Rate
          </div>
          <div className="flex justify-between items-baseline">
            <span className="font-heading font-bold text-3xl text-[#E0E3E5] leading-tight">
              {metrics.graduationRate.value}
            </span>
            <span className="flex items-center gap-0.5 font-mono text-xs text-[#FFB4AB] font-semibold">
              <ChevronDown size={14} strokeWidth={3} />
              {metrics.graduationRate.change}
            </span>
          </div>
        </div>
      </div>

      {/* Middle Section Bento Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Col: Enrollment Trends Chart */}
        <div className="lg:col-span-7 bg-[#1D2022] border border-[#424754] rounded-lg p-6 shadow-xl flex flex-col justify-between min-h-[400px]">
          <div className="flex justify-between items-start mb-6">
            <div>
              <h3 className="font-heading font-semibold text-lg text-[#E0E3E5] m-0">
                Enrollment Trends
              </h3>
              <p className="font-heading text-xs text-[#C2C6D6] mt-0.5 m-0">
                Growth metrics across last 5 academic years
              </p>
            </div>
            <span className="px-2.5 py-1 bg-[#101415] border border-[#424754] rounded font-mono text-[10px] text-[#E0E3E5] uppercase tracking-wider">
              Multi-Year
            </span>
          </div>

          {/* Recharts Area Chart */}
          <div className="w-full h-[280px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={enrollmentTrends} margin={{ top: 10, right: 10, left: -15, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorStudents" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#4D8EFF" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#4D8EFF" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#424754/40" vertical={false} />
                <XAxis
                  dataKey="year"
                  stroke="#C2C6D6"
                  fontSize={11}
                  tickLine={false}
                  axisLine={{ stroke: "#424754" }}
                />
                <YAxis
                  stroke="#C2C6D6"
                  fontSize={11}
                  tickLine={false}
                  axisLine={false}
                  tickFormatter={(val) => `${(val / 1000).toFixed(0)}k`}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#101415",
                    borderColor: "#424754",
                    borderRadius: "6px",
                    color: "#E0E3E5",
                    fontSize: "12px",
                    fontFamily: "Hanken Grotesk, sans-serif",
                  }}
                  formatter={(val) => [`${val.toLocaleString()} Students`, "Enrollment"]}
                />
                <Area
                  type="monotone"
                  dataKey="students"
                  stroke="#4D8EFF"
                  strokeWidth={3}
                  fillOpacity={1}
                  fill="url(#colorStudents)"
                  dot={{ r: 5, fill: "#4D8EFF", stroke: "#1D2022", strokeWidth: 2 }}
                  activeDot={{ r: 7, fill: "#ADC6FF", stroke: "#002E6A", strokeWidth: 2 }}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Right Col: GPA by Department */}
        <div className="lg:col-span-5 bg-[#1D2022] border border-[#424754] rounded-lg p-6 shadow-xl flex flex-col justify-between">
          <div>
            <h3 className="font-heading font-semibold text-lg text-[#E0E3E5] m-0">
              GPA by Department
            </h3>
            <p className="font-heading text-xs text-[#C2C6D6] mt-0.5 m-0 mb-6">
              Weighted average distribution
            </p>

            <div className="space-y-5 font-heading">
              {gpaByDepartment.map((dept, idx) => (
                <div key={idx} className="space-y-1.5">
                  <div className="flex justify-between items-center text-xs">
                    <span className="font-bold text-[#E0E3E5] tracking-wide">
                      {dept.name}
                    </span>
                    <span className="font-mono font-bold text-[#4CD7F6]">
                      {dept.gpa.toFixed(2)}
                    </span>
                  </div>
                  <div className="w-full bg-[#323537] h-2 rounded-full overflow-hidden relative">
                    <div
                      className="bg-[#4CD7F6] h-full rounded-full transition-all duration-700 shadow-[0_0_8px_rgba(76,215,246,0.5)]"
                      style={{ width: `${dept.width}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="pt-4 border-t border-[#424754]/60 mt-6 flex justify-between items-center text-xs text-[#C2C6D6] font-heading">
            <span>Institutional Target: <strong className="text-[#ADC6FF]">3.50+</strong></span>
            <span className="text-[#4CD7F6]">All Depts Above Target</span>
          </div>
        </div>
      </div>

      {/* Bottom Section Bento Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Col: Retention Analysis Donut Ring */}
        <div className="lg:col-span-5 bg-[#1D2022] border border-[#424754] rounded-lg p-6 shadow-xl flex flex-col justify-between">
          <div>
            <h3 className="font-heading font-semibold text-lg text-[#E0E3E5] m-0">
              Retention Analysis
            </h3>
            <p className="font-heading text-xs text-[#C2C6D6] mt-0.5 m-0 mb-6">
              Cohort retention mapping
            </p>

            {/* Circular Donut Visual */}
            <div className="flex flex-col items-center justify-center py-6">
              <div className="relative w-44 h-44 flex items-center justify-center">
                {/* Outer concentric SVG ring */}
                <svg className="w-full h-full transform -rotate-90">
                  <circle
                    cx="88"
                    cy="88"
                    r="72"
                    stroke="#323537"
                    strokeWidth="14"
                    fill="transparent"
                  />
                  <circle
                    cx="88"
                    cy="88"
                    r="72"
                    stroke="#4CD7F6"
                    strokeWidth="14"
                    strokeDasharray="452"
                    strokeDashoffset="22" // ~95% filled
                    strokeLinecap="round"
                    fill="transparent"
                    className="transition-all duration-1000 shadow-[0_0_12px_rgba(76,215,246,0.6)]"
                  />
                  {/* Inner secondary ring */}
                  <circle
                    cx="88"
                    cy="88"
                    r="52"
                    stroke="#101415"
                    strokeWidth="8"
                    fill="transparent"
                  />
                  <circle
                    cx="88"
                    cy="88"
                    r="52"
                    stroke="#ADC6FF"
                    strokeWidth="8"
                    strokeDasharray="326"
                    strokeDashoffset="40" // ~88% filled
                    strokeLinecap="round"
                    fill="transparent"
                  />
                </svg>

                {/* Center text */}
                <div className="absolute inset-0 flex flex-col items-center justify-center text-center font-heading">
                  <span className="text-3xl font-bold text-[#E0E3E5] tracking-tight">
                    95%
                  </span>
                  <span className="text-[10px] font-bold text-[#C2C6D6] uppercase tracking-wider mt-0.5">
                    Retention
                  </span>
                </div>
              </div>

              {/* Legend */}
              <div className="flex items-center justify-center gap-8 text-xs font-heading mt-6">
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full bg-[#4CD7F6] shadow-[0_0_6px_rgba(76,215,246,0.6)]" />
                  <span className="text-[#E0E3E5] font-semibold">First Year</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full bg-[#ADC6FF]" />
                  <span className="text-[#C2C6D6]">Final Year</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Col: Institutional Growth Table */}
        <div className="lg:col-span-7 bg-[#1D2022] border border-[#424754] rounded-lg p-6 shadow-xl flex flex-col justify-between">
          <div>
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-6">
              <h3 className="font-heading font-semibold text-lg text-[#E0E3E5] m-0">
                Institutional Growth
              </h3>

              {/* View Switcher */}
              <div className="flex items-center gap-1 bg-[#101415] border border-[#424754] p-1 rounded font-heading text-[10px] uppercase tracking-wider">
                <button
                  onClick={() => setViewMode("FACULTY")}
                  className={`px-3 py-1 rounded font-bold cursor-pointer transition-colors border-none ${
                    viewMode === "FACULTY"
                      ? "bg-[#ADC6FF] text-[#002E6A] shadow-sm"
                      : "bg-transparent text-[#C2C6D6] hover:text-[#E0E3E5]"
                  }`}
                >
                  Faculty View
                </button>
                <button
                  onClick={() => setViewMode("DEPARTMENT")}
                  className={`px-3 py-1 rounded font-bold cursor-pointer transition-colors border-none ${
                    viewMode === "DEPARTMENT"
                      ? "bg-[#ADC6FF] text-[#002E6A] shadow-sm"
                      : "bg-transparent text-[#C2C6D6] hover:text-[#E0E3E5]"
                  }`}
                >
                  Department View
                </button>
              </div>
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse min-w-[480px]">
                <thead>
                  <tr className="bg-[#191C1E] border-b border-[#424754] font-heading text-[10px] uppercase font-bold text-[#C2C6D6] tracking-[0.55px]">
                    <th className="py-3 px-4">Faculty</th>
                    <th className="py-3 px-4">Students</th>
                    <th className="py-3 px-4">Grad Rate</th>
                    <th className="py-3 px-4 text-right">Trend</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#424754]/40 font-heading text-sm">
                  {institutionalGrowth.map((row) => (
                    <tr key={row.id} className="hover:bg-[#272A2C]/40 transition-colors">
                      <td className="py-4 px-4 font-semibold text-[#E0E3E5]">
                        {viewMode === "FACULTY" ? row.faculty : `Dept. of ${row.faculty.replace("Faculty of ", "").replace("School of ", "")}`}
                      </td>
                      <td className="py-4 px-4 font-mono text-[#C2C6D6]">
                        {row.students}
                      </td>
                      <td className="py-4 px-4 font-mono font-bold text-[#ADC6FF]">
                        {row.gradRate}
                      </td>
                      <td className="py-4 px-4 text-right">
                        <span
                          className={`inline-flex items-center gap-1 font-mono text-xs font-bold px-2 py-0.5 rounded-full ${
                            row.isPositive
                              ? "bg-[#4CD7F6]/10 text-[#4CD7F6]"
                              : "bg-[#FFB4AB]/10 text-[#FFB4AB]"
                          }`}
                        >
                          {row.isPositive ? <ChevronUp size={14} strokeWidth={3} /> : <ChevronDown size={14} strokeWidth={3} />}
                          {row.trend}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="pt-4 border-t border-[#424754]/60 mt-6 flex justify-between items-center text-xs text-[#C2C6D6] font-heading">
            <span>Overall Institutional Health: <strong className="text-[#4CD7F6]">Optimal</strong></span>
            <span className="text-[#ADC6FF] cursor-pointer hover:underline" onClick={() => alert("Opening full growth analytics breakdown...")}>
              View Comprehensive Breakdown →
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReportsAnalytics;
