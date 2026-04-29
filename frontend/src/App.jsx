import { useState } from "react";
import axios from "axios";

function App() {
  // 🌓 State for Dark Mode Toggle
  const [isDark, setIsDark] = useState(false);
  
  const [form, setForm] = useState({
    gre: "",
    toefl: "",
    rating: "",
    cgpa: "",
    research: ""
  });

  const [sopAnswers, setSopAnswers] = useState({
    quality: "",
    hasProjects: false,
    usedTemplate: false,
    reviewed: false
  });

  const [lorAnswers, setLorAnswers] = useState({
    strength: "",
    knowsYouWell: false,
    professorLevel: false,
    genericLetter: false
  });

  const [result, setResult] = useState(null);
  const [status, setStatus] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // 🔹 Input change handlers
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSopChange = (e) => {
    const { name, value, type, checked } = e.target;
    setSopAnswers({
      ...sopAnswers,
      [name]: type === "checkbox" ? checked : value
    });
  };

  const handleLorChange = (e) => {
    const { name, value, type, checked } = e.target;
    setLorAnswers({
      ...lorAnswers,
      [name]: type === "checkbox" ? checked : value
    });
  };

  // 🔥 Scoring Logic
  const calculateSOP = () => {
    let score = 0;
    if (sopAnswers.quality === "A") score += 1;
    if (sopAnswers.quality === "B") score += 2;
    if (sopAnswers.quality === "C") score += 3;
    if (sopAnswers.quality === "D") score += 5;
    if (sopAnswers.hasProjects) score += 1;
    if (sopAnswers.reviewed) score += 1;
    if (sopAnswers.usedTemplate) score -= 1;
    return Math.max(1, Math.min(5, score));
  };

  const calculateLOR = () => {
    let score = 0;
    if (lorAnswers.strength === "A") score += 1;
    if (lorAnswers.strength === "B") score += 2;
    if (lorAnswers.strength === "C") score += 3;
    if (lorAnswers.strength === "D") score += 5;
    if (lorAnswers.knowsYouWell) score += 1;
    if (lorAnswers.professorLevel) score += 1;
    if (lorAnswers.genericLetter) score -= 1;
    return Math.max(1, Math.min(5, score));
  };

  // 🔥 Predict Function
  const predict = async () => {
    setIsLoading(true);
    const sopScore = calculateSOP();
    const lorScore = calculateLOR();

    try {
      const res = await axios.post("http://127.0.0.1:5000/predict", {
        gre: Number(form.gre),
        toefl: Number(form.toefl),
        rating: Number(form.rating),
        sop: sopScore,
        lor: lorScore,
        cgpa: Number(form.cgpa),
        research: Number(form.research)
      });

      const percent = res.data.prediction_percent;
      setResult(percent);

      if (percent > 80) setStatus("High Chance ✅");
      else if (percent > 60) setStatus("Moderate Chance ⚠️");
      else setStatus("Low Chance ❌");

    } catch {
      alert("Error connecting to backend");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={`min-h-screen transition-colors duration-500 flex justify-center items-center p-4 sm:p-8 font-sans ${isDark ? "bg-gradient-to-br from-gray-950 via-gray-900 to-slate-900" : "bg-gradient-to-br from-indigo-100 via-slate-50 to-purple-100"}`}>
        
      <div className={`relative backdrop-blur-xl p-8 sm:p-10 rounded-[2.5rem] shadow-2xl w-full max-w-2xl transition-all duration-500 ${isDark ? "bg-gray-800/90 border border-gray-700" : "bg-white/90 border border-white/50"}`}>
        
        {/* ☀️/🌙 Theme Toggle Button */}
        <button 
          onClick={() => setIsDark(!isDark)}
          className={`absolute top-6 right-6 p-3 rounded-full hover:scale-110 transition-transform shadow-md flex items-center justify-center ${isDark ? "bg-gray-700 text-yellow-400" : "bg-slate-200 text-slate-800"}`}
          title="Toggle Dark Mode"
        >
          {isDark ? (
            // Sun Icon for Dark Mode (Click to go Light)
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4.22 4.22a1 1 0 011.415 0l.708.708a1 1 0 01-1.414 1.414l-.708-.708a1 1 0 010-1.414zM18 10a1 1 0 01-1 1h-1a1 1 0 110-2h1a1 1 0 011 1zM14.93 15.636a1 1 0 010 1.414l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 0zM10 16a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zm-4.22-.707a1 1 0 010-1.414l.707-.707a1 1 0 011.414 1.414l-.707.707a1 1 0 01-1.414 0zM4 10a1 1 0 01-1 1H2a1 1 0 110-2h1a1 1 0 011 1zm1.636-4.93a1 1 0 011.414 0l.707.707a1 1 0 01-1.414 1.414l-.707-.707a1 1 0 010-1.414zM10 5a5 5 0 100 10 5 5 0 000-10z" clipRule="evenodd" /></svg>
          ) : (
            // Moon Icon for Light Mode (Click to go Dark)
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20"><path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" /></svg>
          )}
        </button>

        <div className="text-center mb-8 pr-12">
          <h1 className={`text-3xl sm:text-4xl font-extrabold text-transparent bg-clip-text mb-2 ${isDark ? "bg-gradient-to-r from-indigo-400 to-purple-400" : "bg-gradient-to-r from-indigo-600 to-purple-600"}`}>
            🎓 Admission Predictor
          </h1>
          <p className={`font-medium transition-colors ${isDark ? "text-gray-400" : "text-slate-500"}`}>
            Evaluate your full profile instantly.
          </p>
        </div>

        <div className="space-y-6">
          
          {/* Academic Inputs */}
          <div className={`p-6 rounded-2xl border transition-colors ${isDark ? "bg-gray-900/50 border-gray-700/50" : "bg-slate-50 border-slate-200"}`}>
            <h2 className={`text-lg font-bold mb-4 flex items-center gap-2 ${isDark ? "text-gray-100" : "text-slate-800"}`}>📊 Academic Stats</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input isDark={isDark} label="GRE Score (260–340)" name="gre" min="260" max="340" handleChange={handleChange} placeholder="e.g. 320" />
              <Input isDark={isDark} label="TOEFL Score (0–120)" name="toefl" min="0" max="120" handleChange={handleChange} placeholder="e.g. 105" />
              <Input isDark={isDark} label="University Rating (1–5)" name="rating" min="1" max="5" handleChange={handleChange} placeholder="e.g. 4" />
              <Input isDark={isDark} label="CGPA (0–10)" name="cgpa" min="0" max="10" step="0.1" handleChange={handleChange} placeholder="e.g. 8.5" />
            </div>
            <div className="mt-4">
              <label className={`block text-sm font-semibold mb-1 transition-colors ${isDark ? "text-gray-300" : "text-slate-700"}`}>Research Experience</label>
              <select name="research" onChange={handleChange} className={`w-full p-3 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition-colors ${isDark ? "bg-gray-800 border-gray-600 text-gray-200" : "bg-white border-slate-200 text-slate-700"}`}>
                <option value="" disabled selected>Select option</option>
                <option value="1">Yes, I have research experience</option>
                <option value="0">No research experience</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {/* SOP Section */}
            <div className={`p-5 rounded-2xl border transition-colors ${isDark ? "bg-gray-900/50 border-gray-700/50" : "bg-indigo-50/50 border-indigo-100"}`}>
              <h2 className={`font-bold mb-3 transition-colors ${isDark ? "text-gray-100" : "text-slate-800"}`}>✍️ SOP Evaluation</h2>
              <select name="quality" onChange={handleSopChange} className={`w-full p-2.5 rounded-lg mb-4 outline-none focus:ring-2 focus:ring-indigo-500 transition-colors ${isDark ? "bg-gray-800 border-gray-600 text-gray-200" : "bg-white border-indigo-200 text-slate-700"}`}>
                <option value="" disabled selected>Select SOP Quality</option>
                <option value="A">Template based</option>
                <option value="B">Self written</option>
                <option value="C">Improved with feedback</option>
                <option value="D">Highly personalized</option>
              </select>
              <div className="space-y-2">
                <Checkbox isDark={isDark} label="Included personal projects" name="hasProjects" onChange={handleSopChange} />
                <Checkbox isDark={isDark} label="Reviewed by mentor" name="reviewed" onChange={handleSopChange} />
                <Checkbox isDark={isDark} label="Used generic templates" name="usedTemplate" onChange={handleSopChange} />
              </div>
            </div>

            {/* LOR Section */}
            <div className={`p-5 rounded-2xl border transition-colors ${isDark ? "bg-gray-900/50 border-gray-700/50" : "bg-purple-50/50 border-purple-100"}`}>
              <h2 className={`font-bold mb-3 transition-colors ${isDark ? "text-gray-100" : "text-slate-800"}`}>📜 LOR Evaluation</h2>
              <select name="strength" onChange={handleLorChange} className={`w-full p-2.5 rounded-lg mb-4 outline-none focus:ring-2 focus:ring-purple-500 transition-colors ${isDark ? "bg-gray-800 border-gray-600 text-gray-200" : "bg-white border-purple-200 text-slate-700"}`}>
                <option value="" disabled selected>Select LOR Strength</option>
                <option value="A">Generic letter</option>
                <option value="B">Basic recommendation</option>
                <option value="C">Strong recommendation</option>
                <option value="D">Excellent personalized</option>
              </select>
              <div className="space-y-2">
                <Checkbox isDark={isDark} label="Recommender knows you well" name="knowsYouWell" onChange={handleLorChange} />
                <Checkbox isDark={isDark} label="From Senior Professor" name="professorLevel" onChange={handleLorChange} />
                <Checkbox isDark={isDark} label="Generic template used" name="genericLetter" onChange={handleLorChange} />
              </div>
            </div>
          </div>

          {/* Predict Button */}
          <button
            onClick={predict}
            disabled={isLoading}
            className={`mt-6 w-full text-white font-bold text-lg p-4 rounded-xl shadow-lg hover:shadow-indigo-500/30 transform hover:-translate-y-0.5 transition-all duration-200 active:scale-95 flex justify-center items-center ${isDark ? "bg-gradient-to-r from-indigo-600 to-purple-700" : "bg-gradient-to-r from-indigo-500 to-purple-600"}`}
          >
            {isLoading ? "Predicting..." : "Predict My Chances 🚀"}
          </button>

          {/* Result Box */}
          {result !== null && (
            <div className={`mt-6 p-6 rounded-2xl border text-center transition-all duration-500 ${isDark ? "bg-gray-900 border-gray-700" : "bg-slate-50 border-slate-200"}`}>
              <p className={`text-sm font-semibold uppercase tracking-wider mb-1 ${isDark ? "text-gray-400" : "text-slate-500"}`}>Prediction Result</p>
              <h2 className={`text-5xl font-black mb-2 transition-colors ${isDark ? "text-white" : "text-slate-800"}`}>
                {result.toFixed(1)}<span className={`text-2xl ${isDark ? "text-gray-400" : "text-slate-500"}`}>%</span>
              </h2>
              <p className={`text-lg font-bold ${
                result > 80 ? "text-emerald-500" : result > 60 ? "text-amber-500" : "text-rose-500"
              }`}>
                {status}
              </p>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}

/* Reusable Components (Pass isDark state as prop) */

function Input({ label, name, min, max, step="1", handleChange, placeholder, isDark }) {
  return (
    <div>
      <label className={`block text-sm font-semibold mb-1 transition-colors ${isDark ? "text-gray-300" : "text-slate-700"}`}>{label}</label>
      <input
        type="number"
        name={name}
        min={min}
        max={max}
        step={step}
        placeholder={placeholder}
        onChange={handleChange}
        className={`w-full p-3 border rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition-colors ${isDark ? "bg-gray-800 border-gray-600 text-gray-100 placeholder-gray-500" : "bg-white border-slate-200 text-slate-800 placeholder-slate-400"}`}
      />
    </div>
  );
}

function Checkbox({ label, name, onChange, isDark }) {
  return (
    <label className="flex items-center gap-3 cursor-pointer group">
      <input 
        type="checkbox" 
        name={name} 
        onChange={onChange}
        className={`w-5 h-5 rounded focus:ring-indigo-500 cursor-pointer transition-colors ${isDark ? "border-gray-600 bg-gray-800 text-indigo-600" : "border-slate-300 bg-white text-indigo-600"}`}
      />
      <span className={`text-sm font-medium transition-colors ${isDark ? "text-gray-300 group-hover:text-white" : "text-slate-600 group-hover:text-slate-900"}`}>
        {label}
      </span>
    </label>
  );
}

export default App;