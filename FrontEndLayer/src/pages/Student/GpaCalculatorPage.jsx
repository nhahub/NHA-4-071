import { useState } from "react";
import PageHeader from "../../shared/components/PageHeader";
import KPICard from "../../shared/components/KPICard";
import { Trash2, Plus, Calculator } from "lucide-react";

const gradePoints = { A: 4.0, "A-": 3.7, "B+": 3.3, B: 3.0, "B-": 2.7, "C+": 2.3, C: 2.0, "C-": 1.7, "D+": 1.3, D: 1.0, F: 0.0 };

const GpaCalculatorPage = () => {
  const [courses, setCourses] = useState([{ name: "", credits: "3", grade: "A" }]);
  const [currentGpa, setCurrentGpa] = useState("");
  const [currentCredits, setCurrentCredits] = useState("");

  const addCourse = () => setCourses([...courses, { name: "", credits: "3", grade: "A" }]);
  const removeCourse = (i) => { if (courses.length > 1) setCourses(courses.filter((_, idx) => idx !== i)); };
  const update = (i, field, value) => { const updated = [...courses]; updated[i][field] = value; setCourses(updated); };

  const totalCredits = courses.reduce((s, c) => s + (parseFloat(c.credits) || 0), 0);
  const totalPoints = courses.reduce((s, c) => s + (parseFloat(c.credits) || 0) * (gradePoints[c.grade] || 0), 0);
  const semesterGpa = totalCredits > 0 ? (totalPoints / totalCredits) : 0;
  const cumulativeGpa = (() => {
    const prevGpa = parseFloat(currentGpa) || 0;
    const prevCredits = parseFloat(currentCredits) || 0;
    if (prevCredits <= 0) return semesterGpa;
    return (prevGpa * prevCredits + totalPoints) / (prevCredits + totalCredits);
  })();

  return (
    <div className="flex flex-col gap-6 md:gap-8 max-w-[960px] mx-auto">
      <PageHeader title="GPA Calculator" subtitle="Calculate your semester and cumulative GPA" />

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
        <KPICard label="SEMESTER GPA" borderColor="#4F378A">
          <span className="font-heading font-normal text-3xl sm:text-4xl text-primary">{semesterGpa.toFixed(2)}</span>
        </KPICard>
        <KPICard label="CUMULATIVE GPA" borderColor="#63597C">
          <span className="font-heading font-normal text-3xl sm:text-4xl" style={{ color: "#63597C" }}>{cumulativeGpa.toFixed(2)}</span>
        </KPICard>
        <KPICard label="TOTAL CREDITS" value={totalCredits} borderColor="#CFBCFF" />
      </div>

      <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 bg-bg-light p-3 sm:p-4 rounded-xl items-end">
        <div className="flex-1 w-full">
          <label className="font-heading text-xs text-text-secondary uppercase tracking-wider">Current Cumulative GPA</label>
          <input value={currentGpa} onChange={(e) => setCurrentGpa(e.target.value)} placeholder="3.5"
            className="w-full p-3 border border-border rounded-lg font-heading text-sm box-border mt-1" />
        </div>
        <div className="flex-1 w-full">
          <label className="font-heading text-xs text-text-secondary uppercase tracking-wider">Completed Credits</label>
          <input value={currentCredits} onChange={(e) => setCurrentCredits(e.target.value)} placeholder="60"
            className="w-full p-3 border border-border rounded-lg font-heading text-sm box-border mt-1" />
        </div>
      </div>

      <div className="bg-white border border-border rounded-xl overflow-hidden">
        {/* Desktop table header */}
        <div className="hidden sm:flex px-6 py-4 border-b border-border bg-bg-light">
          <span className="flex-[2] font-heading font-semibold text-xs tracking-wider uppercase text-text-secondary">Course</span>
          <span className="flex-1 font-heading font-semibold text-xs tracking-wider uppercase text-text-secondary">Credits</span>
          <span className="flex-1 font-heading font-semibold text-xs tracking-wider uppercase text-text-secondary">Grade</span>
          <span className="flex-1" />
        </div>
        {courses.map((c, i) => (
          <div key={i} className="flex flex-col sm:flex-row px-4 sm:px-6 py-3 items-stretch sm:items-center border-b border-border gap-2 sm:gap-0">
            <input value={c.name} onChange={(e) => update(i, "name", e.target.value)} placeholder="Course name"
              className="sm:flex-[2] p-2 border border-border rounded-md font-heading text-sm sm:mr-3" />
            <div className="flex gap-2 sm:contents">
              <input value={c.credits} onChange={(e) => update(i, "credits", e.target.value)} placeholder="Credits"
                className="sm:flex-1 p-2 border border-border rounded-md font-heading text-sm sm:mr-3 w-1/3" />
              <select value={c.grade} onChange={(e) => update(i, "grade", e.target.value)}
                className="sm:flex-1 p-2 border border-border rounded-md font-heading text-sm sm:mr-3 w-1/3">
                {Object.keys(gradePoints).map((g) => <option key={g} value={g}>{g}</option>)}
              </select>
              <button onClick={() => removeCourse(i)}
                className="flex items-center justify-center gap-2 p-2 bg-transparent text-danger cursor-pointer w-1/3 sm:w-auto sm:flex-none">
                <Trash2 size={18} />
              </button>
            </div>
          </div>
        ))}
      </div>

      <button onClick={addCourse}
        className="flex items-center gap-2 px-4 py-[9px] bg-bg-light text-primary rounded-lg font-body text-sm sm:text-base cursor-pointer self-start">
        <Plus size={16} /> Add Course
      </button>

      <div className="bg-white border border-border rounded-xl p-4 sm:p-6 flex items-center gap-3 sm:gap-4">
        <Calculator size={24} color="#4F378A" className="shrink-0" />
        <span className="font-heading text-sm sm:text-base text-text-primary">
          Your semester GPA is <strong>{semesterGpa.toFixed(2)}</strong>{" "}
          {totalCredits > 0 && `based on ${totalCredits} credits.`}
          {parseFloat(currentCredits) > 0 && ` Cumulative GPA: ${cumulativeGpa.toFixed(2)}`}
        </span>
      </div>
    </div>
  );
};

export default GpaCalculatorPage;
