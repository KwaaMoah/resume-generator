// pages/index.js
import { useState } from 'react';
import Head from 'next/head';

export default function Home() {
  const [jsonInput, setJsonInput] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState('');

  const sampleJson = {
    "optimized_resume": {
      "contact_info": {
        "name": "JOSHUA KWAKU AMOAH ANSAH",
        "location": "Leicester, UK",
        "phone": "+447909105376",
        "email": "j.ansah.prof@gmail.com",
        "linkedin": "linkedin.com/in/joshua-k-a-ansah"
      },
      "role_title": "CORPORATE DELIVERY PROJECT MANAGER",
      "professional_summary": [
        "Strategic Project Manager with 6+ years' experience delivering complex projects and organizational improvements across public and private sectors",
        "Proven track record managing £10M+ project portfolios with 99% on-time delivery success"
      ],
      "skills": {
        "technical_skills": "Project Portfolio Management, Change Management, Stakeholder Engagement",
        "tools_technologies": "Excel, PowerBI, Jira, Python, SQL"
      },
      "work_experience": [
        {
          "role": "Programme Management Office Lead",
          "company": "Distributed",
          "location": "Remote",
          "duration": "Mar. 2022 – Present",
          "achievements": [
            "Delivered exceptional project governance across 35+ concurrent projects",
            "Achieved £187K+ annual cost savings through process automation"
          ]
        }
      ],
      "education": [
        {
          "program": "McKinsey Forward Programme",
          "institution": "McKinsey Inc",
          "duration": "May 2021 – Sep. 2021"
        }
      ],
      "certifications": [
        {
          "name": "Lean Six Sigma Yellow Belt",
          "date": "Dec. 2022"
        }
      ]
    }
  };

  const handleGeneratePDF = async () => {
    setIsGenerating(true);
    setError('');

    try {
      const parsedJson = JSON.parse(jsonInput);
      
      const response = await fetch('/api/generate-pdf', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(parsedJson),
      });

      if (!response.ok) {
        throw new Error('Failed to generate PDF');
      }

      // Download the PDF
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'resume.pdf';
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);

    } catch (err) {
      setError(err.message);
    } finally {
      setIsGenerating(false);
    }
  };

  const loadSample = () => {
    setJsonInput(JSON.stringify(sampleJson, null, 2));
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <Head>
        <title>Resume Generator - JSON to PDF</title>
        <meta name="description" content="Convert JSON resume data to professional PDF" />
      </Head>

      <div className="max-w-6xl mx-auto px-4">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Resume Generator
          </h1>
          <p className="text-lg text-gray-600">
            Paste your JSON resume data and get a professionally formatted PDF
          </p>
        </div>

        {/* Tool Options */}
        <div className="mb-8 text-center">
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Choose Your Interface
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 border border-gray-200 rounded-lg">
                <h3 className="font-medium text-gray-900 mb-2">Current Interface</h3>
                <p className="text-sm text-gray-600 mb-4">React-based interface with API generation</p>
                <div className="text-sm text-gray-500">You're currently using this interface</div>
              </div>
              <div className="p-4 border border-blue-200 rounded-lg bg-blue-50">
                <h3 className="font-medium text-gray-900 mb-2">Improved Interface</h3>
                <p className="text-sm text-gray-600 mb-4">Clean, minimal design with better UX</p>
                <a 
                  href="/resume-tool.html" 
                  className="inline-block px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors text-sm font-medium"
                >
                  Try New Interface
                </a>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Input Section */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-gray-900">
                JSON Input
              </h2>
              <button
                onClick={loadSample}
                className="px-4 py-2 text-sm bg-blue-100 text-blue-700 rounded-md hover:bg-blue-200 transition-colors"
              >
                Load Sample
              </button>
            </div>
            
            <textarea
              value={jsonInput}
              onChange={(e) => setJsonInput(e.target.value)}
              placeholder="Paste your resume JSON here..."
              className="w-full h-96 p-4 border border-gray-300 rounded-md font-mono text-sm resize-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />

            {error && (
              <div className="mt-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded-md">
                <strong>Error:</strong> {error}
              </div>
            )}

            <button
              onClick={handleGeneratePDF}
              disabled={!jsonInput.trim() || isGenerating}
              className="mt-4 w-full py-3 px-4 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors font-medium"
            >
              {isGenerating ? 'Generating PDF...' : 'Generate PDF Resume'}
            </button>
          </div>

          {/* Instructions Section */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              How It Works
            </h2>
            
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <div className="flex-shrink-0 w-8 h-8 bg-blue-100 text-blue-700 rounded-full flex items-center justify-center font-semibold">
                  1
                </div>
                <div>
                  <h3 className="font-medium text-gray-900">Paste JSON Data</h3>
                  <p className="text-gray-600 text-sm">
                    Copy your resume JSON from Claude and paste it in the text area
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <div className="flex-shrink-0 w-8 h-8 bg-blue-100 text-blue-700 rounded-full flex items-center justify-center font-semibold">
                  2
                </div>
                <div>
                  <h3 className="font-medium text-gray-900">Click Generate</h3>
                  <p className="text-gray-600 text-sm">
                    The app will process your data and create a professional PDF
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <div className="flex-shrink-0 w-8 h-8 bg-blue-100 text-blue-700 rounded-full flex items-center justify-center font-semibold">
                  3
                </div>
                <div>
                  <h3 className="font-medium text-gray-900">Download PDF</h3>
                  <p className="text-gray-600 text-sm">
                    Your formatted resume will automatically download
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-md">
              <h4 className="font-medium text-yellow-800 mb-2">Features:</h4>
              <ul className="text-sm text-yellow-700 space-y-1">
                <li>• Professional font formatting</li>
                <li>• Proper section headers with underlines</li>
                <li>• ATS-friendly layout</li>
                <li>• Matches your original CV structure</li>
                <li>• No local software installation required</li>
              </ul>
            </div>

            <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-md">
              <h4 className="font-medium text-green-800 mb-2">Quick Start:</h4>
              <p className="text-sm text-green-700">
                Click "Load Sample" to see the expected JSON format, then replace with your own data.
              </p>
            </div>

            <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-md">
              <h4 className="font-medium text-blue-800 mb-2">New!</h4>
              <p className="text-sm text-blue-700 mb-3">
                Try our improved interface with better UX and cleaner design.
              </p>
              <a 
                href="/resume-tool.html" 
                className="inline-block px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors text-sm font-medium"
              >
                Switch to New Interface →
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
