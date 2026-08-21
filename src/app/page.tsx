import Link from 'next/link';

export default function Home() {
  return (
    <div className="bg-gray-50 min-h-[calc(100vh-64px)]">
      {/* Hero Section */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
        <h1 className="text-5xl font-extrabold text-gray-900 tracking-tight mb-6">
          Automate your <span className="text-blue-600">PhD Outreach</span> with AI
        </h1>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-10">
          Upload your resume, select your research interests, and let our AI find the best professors globally, read their latest papers, and draft personalized cold emails for you.
        </p>
        <div className="flex justify-center gap-4">
          <Link href="/dashboard" className="bg-blue-600 text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-blue-700 transition shadow-lg">
            Start Free Trial
          </Link>
          <Link href="#how-it-works" className="bg-white text-gray-700 border border-gray-300 px-8 py-4 rounded-lg text-lg font-semibold hover:bg-gray-50 transition shadow-sm">
            How it works
          </Link>
        </div>
      </main>

      {/* Features Section */}
      <section id="how-it-works" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 border-t">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          <div className="bg-white p-8 rounded-xl shadow-sm border">
            <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-lg flex items-center justify-center text-2xl font-bold mb-6">1</div>
            <h3 className="text-xl font-bold text-gray-900 mb-3">Upload Profile</h3>
            <p className="text-gray-600">Upload your CV and transcripts. Our AI builds a comprehensive profile of your skills and research interests.</p>
          </div>
          <div className="bg-white p-8 rounded-xl shadow-sm border">
            <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-lg flex items-center justify-center text-2xl font-bold mb-6">2</div>
            <h3 className="text-xl font-bold text-gray-900 mb-3">AI Matching</h3>
            <p className="text-gray-600">We scrape Google Scholar to find professors currently publishing in your exact niche.</p>
          </div>
          <div className="bg-white p-8 rounded-xl shadow-sm border">
            <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-lg flex items-center justify-center text-2xl font-bold mb-6">3</div>
            <h3 className="text-xl font-bold text-gray-900 mb-3">Send Emails</h3>
            <p className="text-gray-600">Review the AI-drafted highly personalized emails and send them directly via your Gmail account.</p>
          </div>
        </div>
      </section>
    </div>
  );
}
