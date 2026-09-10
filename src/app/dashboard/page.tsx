'use client';
import { useState } from 'react';

export default function Dashboard() {
  const [step, setStep] = useState(1);
  const [researchField, setResearchField] = useState('');
  
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Outreach Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        {[
          { title: 'Upload Resume', step: 1 },
          { title: 'Find Professors', step: 2 },
          { title: 'Draft Emails', step: 3 },
          { title: 'Send via Gmail', step: 4 }
        ].map((item) => (
          <div key={item.step} className={`p-4 rounded-lg border ${step >= item.step ? 'bg-blue-50 border-blue-200' : 'bg-white border-gray-200'} flex items-center space-x-3`}>
            <div className={`w-8 h-8 flex items-center justify-center rounded-full ${step >= item.step ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-400'}`}>
              {item.step}
            </div>
            <span className={`font-medium ${step >= item.step ? 'text-blue-900' : 'text-gray-500'}`}>{item.title}</span>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-xl shadow-sm border p-8">
        {step === 1 && (
          <div className="text-center py-10">
            <h2 className="text-2xl font-semibold mb-2">Upload your Academic Profile</h2>
            <p className="text-gray-500 mb-6">Upload your Resume/CV to let AI understand your background.</p>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-10 bg-gray-50 cursor-pointer hover:bg-gray-100 transition">
              <p className="text-gray-600">Drag & drop your PDF here, or click to browse</p>
            </div>
            <div className="mt-8 text-left max-w-md mx-auto">
              <label className="block text-sm font-medium text-gray-700 mb-2">Primary Research Interest</label>
              <input 
                type="text" 
                placeholder="e.g. Machine Learning, NLP, Robotics" 
                value={researchField}
                onChange={(e) => setResearchField(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <button onClick={() => setStep(2)} className="mt-8 bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition">
              Analyze Profile
            </button>
          </div>
        )}
        
        {step === 2 && (
          <div className="py-10">
            <h2 className="text-2xl font-semibold mb-6">Found 3 Matching Professors</h2>
            <div className="space-y-4">
              {['Dr. Andrew Ng (Stanford)', 'Dr. Yann LeCun (NYU)', 'Dr. Fei-Fei Li (Stanford)'].map((prof, i) => (
                <div key={i} className="p-4 border rounded-lg flex justify-between items-center bg-gray-50">
                  <div>
                    <h4 className="font-bold text-lg text-gray-800">{prof}</h4>
                    <p className="text-gray-500 text-sm">Matching Score: 95% - Active in {researchField || 'AI'}</p>
                  </div>
                  <button className="text-blue-600 font-medium hover:underline">View Scholar</button>
                </div>
              ))}
            </div>
            <div className="mt-8 flex justify-between">
              <button onClick={() => setStep(1)} className="text-gray-600 px-6 py-2 border rounded-lg hover:bg-gray-50">Back</button>
              <button onClick={() => setStep(3)} className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700">Generate Drafts</button>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="py-10">
            <h2 className="text-2xl font-semibold mb-6">Review Email Drafts</h2>
            <div className="p-6 border rounded-lg bg-gray-50 mb-6">
              <div className="flex justify-between items-center mb-4 border-b pb-4">
                <span className="font-semibold">To: Dr. Andrew Ng</span>
                <span className="text-sm bg-blue-100 text-blue-800 px-2 py-1 rounded">High Match</span>
              </div>
              <p className="text-gray-700 whitespace-pre-wrap">
                {`Dear Prof. Ng,\n\nI recently read your paper on Data-Centric AI and was deeply fascinated by your approach to improving model performance without altering architectures. I am reaching out to express my interest in joining your lab for a PhD in Fall 2027.\n\nMy background in ${researchField || 'Machine Learning'} aligns closely with your current work. Please find my CV attached.\n\nBest regards,\nCandidate`}
              </p>
            </div>
            <div className="flex justify-between">
              <button onClick={() => setStep(2)} className="text-gray-600 px-6 py-2 border rounded-lg hover:bg-gray-50">Back</button>
              <button onClick={() => setStep(4)} className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700">Approve & Next</button>
            </div>
          </div>
        )}

        {step === 4 && (
          <div className="text-center py-20">
            <h2 className="text-3xl font-bold mb-4">Emails Ready to Send</h2>
            <p className="text-gray-500 mb-8">You have 3 approved emails. Connect your Gmail account to dispatch them automatically.</p>
            <button className="bg-red-600 text-white px-8 py-3 rounded-lg font-bold text-lg hover:bg-red-700 transition flex items-center justify-center mx-auto space-x-2">
              <span>Connect Gmail & Send</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
