'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { GraduationCap, Menu, X } from 'lucide-react';
import { useState, useEffect } from 'react';

const navigation = [
  { name: 'Home', href: '/#' },
  { name: 'About', href: '/#about' },
  { name: 'How to Apply?', href: '/#how-to-apply' },
  { name: 'Track Application', href: '/#track' },
  { name: 'Contact', href: '/#contact' },
];

export function Header() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [hash, setHash] = useState('');

  // This effect listens for hash changes (like clicking #about)
  useEffect(() => {
    const handleHashChange = () => setHash(window.location.hash);
    window.addEventListener('hashchange', handleHashChange);
    // Set initial hash
    setHash(window.location.hash);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md shadow-sm border-b transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          
          {/* Logo Container */}
          <Link href="/" onClick={() => setHash('')} className="flex items-center gap-3 shrink-0 group">
            <div className="bg-green-50 p-2 rounded-xl group-hover:bg-green-100 transition-colors">
              <GraduationCap className="h-9 w-9 text-green-700" />
            </div>
            <div className="flex flex-col justify-center">
              <span className="text-xl font-black leading-none tracking-tight text-gray-900 uppercase">
                Scholarship Office
              </span>
              <span className="text-[13px] font-semibold leading-tight text-gray-500 mt-0.5">
                City Government of San Pablo
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-8 h-full">
            {navigation.map((item) => {
              // LOGIC: Active if pathname matches exactly, OR if the hash matches the anchor
              const isActive = 
                pathname === item.href || 
                (item.href.startsWith('/#') && hash === item.href.replace('/', ''));

              return (
                <Link
                  key={item.name}
                  href={item.href}
                  onClick={() => item.href.startsWith('/#') && setHash(item.href.replace('/', ''))}
                  className={cn(
                    'inline-flex items-center text-sm font-semibold transition-all duration-300 h-full border-b-2',
                    isActive
                      ? 'text-green-700 border-green-700'
                      : 'text-gray-600 border-transparent hover:text-green-700'
                  )}
                >
                  {item.name}
                </Link>
              );
            })}
          </nav>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <Button
              variant="ghost"
              size="icon"
              className="text-gray-600"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 space-y-1 bg-white border-t">
            {navigation.map((item) => {
              const isActive = pathname === item.href || (item.href.startsWith('/#') && hash === item.href.replace('/', ''));
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={cn(
                    'block px-3 py-3 text-base font-medium rounded-md',
                    isActive
                      ? 'text-green-700 bg-green-50 border-l-4 border-green-700'
                      : 'text-gray-600'
                  )}
                  onClick={() => {
                    setMobileMenuOpen(false);
                    if(item.href.startsWith('/#')) setHash(item.href.replace('/', ''));
                  }}
                >
                  {item.name}
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </header>
  );
}