import './globals.css';
import type { Metadata } from 'next';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import CartDrawer from '../components/CartDrawer';
import { CartProvider } from '../context/CartContext';
import { AuthProvider } from '../context/AuthContext';

export const metadata: Metadata = {
  title: 'Quecto - Revolutionizing Local Neighborhood Commerce',
  description:
    'Discover and order directly from verified local grocery stores, dairy bakeries, and farm markets in your neighborhood with zero predatory fees.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className="min-h-screen relative bg-slate-950 text-slate-100 selection:bg-emerald-500 selection:text-white antialiased overflow-x-hidden">
        {/* Ambient 3D Glass Light Orbs */}
        <div className="fixed top-0 left-1/4 -translate-y-1/2 -translate-x-1/2 w-[650px] h-[650px] bg-emerald-500/15 rounded-full blur-[140px] pointer-events-none -z-10 animate-pulse-glow" />
        <div className="fixed top-1/3 right-0 translate-x-1/3 w-[500px] h-[500px] bg-indigo-500/15 rounded-full blur-[130px] pointer-events-none -z-10 animate-float-slow" />
        <div className="fixed bottom-10 left-10 w-[550px] h-[550px] bg-teal-500/10 rounded-full blur-[120px] pointer-events-none -z-10" />

        {/* Global Grid Overlay for 3D Technical Depth */}
        <div className="fixed inset-0 bg-grid-pattern opacity-40 pointer-events-none -z-10" />

        <AuthProvider>
          <CartProvider>
            <div className="flex flex-col min-h-screen">
              <Navbar />
              <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-8 py-6">
                {children}
              </main>
              <Footer />
              <CartDrawer />
            </div>
          </CartProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
