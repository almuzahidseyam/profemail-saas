import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "ProfEmail SaaS - Automate Your PhD Outreach",
  description: "AI-powered platform to find professors and generate personalized cold emails.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <nav className="border-b bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between h-16">
              <div className="flex items-center">
                <span className="text-2xl font-bold text-blue-600">ProfEmail</span>
              </div>
              <div className="flex items-center space-x-4">
                <a href="#" className="text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium">Features</a>
                <a href="#" className="text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium">Pricing</a>
                <a href="/dashboard" className="bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-blue-700 transition">Go to Dashboard</a>
              </div>
            </div>
          </div>
        </nav>
        {children}
      </body>
    </html>
  );
}
