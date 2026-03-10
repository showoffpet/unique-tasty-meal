import React from "react";

export default function CheckoutLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="bg-[#f8f6f6] min-h-screen flex flex-col font-sans antialiased text-slate-900">
      {/* Main Content Area */}
      <main className="flex-grow w-full max-w-7xl mx-auto px-4 py-8 lg:px-12 lg:py-12">
        {children}
      </main>

      {/* Simplified Footer */}
      <footer className="mt-auto border-t border-[#f3f1f1] bg-white py-8">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <p className="text-slate-500 text-sm">
            © {new Date().getFullYear()} Unique Tasty Meals. All rights
            reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
