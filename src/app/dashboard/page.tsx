'use client';
import { useState, useRef } from 'react';
import { UploadCloud, Search, Send, FileText, Loader2 } from 'lucide-react';

export default function Dashboard() {
  const [step, setStep] = useState(1);
  const [researchField, setResearchField] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [professors, setProfessors] = useState<any[]>([]);
  const [selectedProfIndex, setSelectedProfIndex] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleAnalyze = async () => {
    if (!file || !researchField) return alert('Please upload a resume and enter a research field.');
    
    setLoading(true);
    const formData = new FormData();
    formData.append('resume', file);
    formData.append('researchField', researchField);

    try {
      const res = await fetch('/api/generate', {
        method: 'POST',
        body: formData,
      });
      const result = await res.json();
      if (result.success) {
        setProfessors(result.data);
        setStep(2);
      } else {
        alert('Error: ' + result.error);
      }
    } catch (err) {
      alert('Failed to connect to AI server.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Outreach Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        {[
          { icon: UploadCloud, title: 'Upload Resume', step: 1 },
          { icon: Search, title: 'Find Professors', step: 2 },
          { icon: FileText, title: 'Draft Emails', step: 3 },
          { icon: Send, title: 'Send via Gmail', step: 4 }
        ].map((item) => (
          <div key={item.step} className={`p-4 rounded-lg border ${step >= item.step ? 'bg-blue-50 border-blue-200' : 'bg-white border-gray-200'} flex items-center space-x-3`}>
            <div className={`p-2 rounded-full flex items-center justify-center ${step >= item.step ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-400'}`}>
              <item.icon className="w-5 h-5" />
            </div>
            <span className={`font-medium ${step >= item.step ? 'text-blue-900' : 'text-gray-500'}`}>{item.title}</span>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-xl shadow-sm border p-8">
        {step === 1 && (
          <div className="text-center py-10">
            <UploadCloud className="w-16 h-16 mx-auto text-blue-500 mb-4" />
            <h2 className="text-2xl font-semibold mb-2">Upload your Academic Profile</h2>
            <p className="text-gray-500 mb-6">Upload your Resume/CV (PDF) to let AI understand your background.</p>
            
            <input type="file" accept=".pdf" ref={fileInputRef} onChange={handleFileChange} className="hidden" />
            
            <div 
              onClick={() => fileInputRef.current?.click()}
              className="border-2 border-dashed border-blue-300 rounded-lg p-10 bg-blue-50 cursor-pointer hover:bg-blue-100 transition"
            >
              <p className="text-blue-700 font-medium">{file ? file.name : "Click to browse and upload PDF"}</p>
            </div>

            <div className="mt-8 text-left max-w-md mx-auto">
              <label className="block text-sm font-medium text-gray-700 mb-2">Primary Research Interest</label>
              <input 
                type="text" 
                placeholder="e.g. Machine Learning, Computer Vision" 
                value={researchField}
                onChange={(e) => setResearchField(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            
            <button 
              onClick={handleAnalyze} 
              disabled={loading || !file || !researchField}
              className="mt-8 bg-blue-600 text-white px-8 py-3 rounded-lg font-medium hover:bg-blue-700 transition disabled:opacity-50 flex items-center justify-center mx-auto space-x-2"
            >
              {loading && <Loader2 className="w-5 h-5 animate-spin" />}
              <span>{loading ? 'Analyzing & Matching...' : 'Analyze Profile'}</span>
            </button>
          </div>
        )}
        
        {step === 2 && (
          <div className="py-10">
            <h2 className="text-2xl font-semibold mb-6">Found {professors.length} Matching Professors</h2>
            <div className="space-y-4">
              {professors.map((prof, i) => (
                <div key={i} className="p-4 border rounded-lg flex justify-between items-center bg-gray-50 hover:bg-gray-100 transition">
                  <div>
                    <h4 className="font-bold text-lg text-gray-800">{prof.name} ({prof.university})</h4>
                    <p className="text-gray-500 text-sm">Matching Score: <span className="text-green-600 font-bold">{prof.match_score}%</span></p>
                  </div>
                  <button onClick={() => { setSelectedProfIndex(i); setStep(3); }} className="text-blue-600 font-medium border border-blue-600 px-4 py-1 rounded hover:bg-blue-50">Review Draft</button>
                </div>
              ))}
            </div>
            <div className="mt-8 flex justify-between">
              <button onClick={() => setStep(1)} className="text-gray-600 px-6 py-2 border rounded-lg hover:bg-gray-50">Back</button>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="py-10">
            <h2 className="text-2xl font-semibold mb-6">Review Email Draft</h2>
            <div className="p-6 border rounded-lg bg-gray-50 mb-6">
              <div className="flex justify-between items-center mb-4 border-b pb-4">
                <span className="font-semibold text-lg">To: {professors[selectedProfIndex]?.name}</span>
                <span className="text-sm bg-blue-100 text-blue-800 px-3 py-1 rounded-full font-medium">Match: {professors[selectedProfIndex]?.match_score}%</span>
              </div>
              <p className="text-gray-700 whitespace-pre-wrap leading-relaxed text-lg">
                {professors[selectedProfIndex]?.email_draft}
              </p>
            </div>
            <div className="flex justify-between">
              <button onClick={() => setStep(2)} className="text-gray-600 px-6 py-2 border rounded-lg hover:bg-gray-50">Back to List</button>
              <button onClick={() => setStep(4)} className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 font-medium">Approve Email</button>
            </div>
          </div>
        )}

        {step === 4 && (
          <div className="text-center py-20">
            <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
              <Send className="w-10 h-10" />
            </div>
            <h2 className="text-3xl font-bold mb-4">Email Approved & Ready</h2>
            <p className="text-gray-500 mb-8 max-w-xl mx-auto">Click below to open your local email client (Gmail/Outlook) with the recipient, subject, and drafted message pre-filled.</p>
            
            <a 
              href={`mailto:${professors[selectedProfIndex]?.email}?subject=${encodeURIComponent("Prospective PhD Student Fall 2027")}&body=${encodeURIComponent(professors[selectedProfIndex]?.email_draft)}`}
              className="bg-red-600 text-white px-8 py-4 rounded-lg font-bold text-lg hover:bg-red-700 transition inline-flex items-center space-x-3 shadow-lg"
            >
              <svg className="w-6 h-6 bg-white rounded-sm p-1 text-red-600" viewBox="0 0 24 24" fill="currentColor"><path d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z"/></svg>
              <span>Send via Email Client</span>
            </a>
            
            <div className="mt-8">
              <button onClick={() => setStep(2)} className="text-blue-600 hover:underline">Draft another email</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
