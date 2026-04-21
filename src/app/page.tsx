'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { GraduationCap, FileText, Search, CheckCircle, Users, Clock } from 'lucide-react';
import { initializeMockData } from '@/lib/mock-data';
import { useEffect } from 'react';

const features = [
  {
    icon: FileText,
    title: 'Easy Application',
    description: 'Simple, intuitive application forms with step-by-step guidance.',
  },
  {
    icon: Search,
    title: 'Track Progress',
    description: 'Monitor your application status with a unique reference code.',
  },
  {
    icon: CheckCircle,
    title: 'Document Upload',
    description: 'Securely upload all required documents in various formats.',
  },
  {
    icon: Users,
    title: 'Multiple Scholarships',
    description: 'Apply for various scholarships tailored to your needs.',
  },
  {
    icon: Clock,
    title: 'Real-time Updates',
    description: 'Get instant updates on your application status.',
  },
];

export default function Home() {
  useEffect(() => {
    initializeMockData();
  }, []);

  return (
    <div className="min-h-screen">

      {/* ── Hero Section ── */}
      <section className="relative min-h-screen flex flex-col justify-center bg-gradient-to-br from-green-50 to-emerald-100 pt-16 border-b border-green-200/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
          <div className="text-center">
            <div className="flex justify-center mb-8">
              <div className="p-5 bg-white/60 rounded-3xl shadow-sm backdrop-blur-md animate-bounce-slow">
                <GraduationCap className="h-20 w-20 text-green-700" />
              </div>
            </div>
            <h1 className="text-5xl md:text-7xl font-extrabold text-gray-900 mb-6 tracking-tight">
              San Pablo Scholarship 
              <span className="block text-green-700 mt-2">Management System</span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-600 mb-12 max-w-3xl mx-auto leading-relaxed">
              Apply for scholarships, track your applications, and manage your
              educational funding journey all in one place.
            </p>
            <div className="flex flex-col sm:flex-row gap-6 justify-center">
              <Link href="/scholarships">
                <Button size="lg" className="bg-green-700 text-white hover:bg-green-800 px-10 h-16 text-xl rounded-full shadow-lg transition-transform hover:scale-105">
                  Register Now
                </Button>
              </Link>
            </div>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 animate-bounce hidden md:block">
            <div className="w-1 h-12 rounded-full bg-green-700/20 flex items-end justify-center pb-1">
                <div className="w-1.5 h-1.5 rounded-full bg-green-700"></div>
            </div>
        </div>
      </section>

      {/* ── Features Section (Linked to 'About') ── */}
      {/* Added id="about" so the header link can find it */}
      {/* Added scroll-mt-24 to prevent the fixed header from overlapping the title */}
      <section id="about" className="py-32 bg-white scroll-mt-14">
        <div className="max-w-7xl mx-auto px-24 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <h2 className="text-3xl md:text-5xl font-bold text-gray-900 mb-6">
              Everything You Need in One Platform
            </h2>
            <div className="w-20 h-1.5 bg-green-600 mx-auto mb-6 rounded-full"></div>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Our comprehensive scholarship management system streamlines the entire application process from discovery to award.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            {features.map((feature, index) => (
              <Card key={index} className="border-none shadow-md hover:shadow-xl transition-all duration-300 group">
                <CardHeader>
                  <div className="mb-4 p-4 bg-green-50 group-hover:bg-green-700 transition-colors duration-300 rounded-2xl w-fit">
                    <feature.icon className="h-8 w-8 text-green-700 group-hover:text-white transition-colors duration-300" />
                  </div>
                  <CardTitle className="text-2xl font-bold">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-gray-600 text-base leading-relaxed">
                    {feature.description}
                  </CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* ── Stats Section ── */}
      <section className="py-24 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-12 text-center">
            <div>
              <div className="text-5xl font-extrabold text-green-700 mb-2">500+</div>
              <div className="text-sm font-semibold uppercase tracking-wider text-gray-500">Active Scholarships</div>
            </div>
            <div>
              <div className="text-5xl font-extrabold text-green-700 mb-2">10k+</div>
              <div className="text-sm font-semibold uppercase tracking-wider text-gray-500">Applications</div>
            </div>
            <div>
              <div className="text-5xl font-extrabold text-green-700 mb-2">$2M+</div>
              <div className="text-sm font-semibold uppercase tracking-wider text-gray-500">Awards Distributed</div>
            </div>
            <div>
              <div className="text-5xl font-extrabold text-green-700 mb-2">95%</div>
              <div className="text-sm font-semibold uppercase tracking-wider text-gray-500">Success Rate</div>
            </div>
          </div>
        </div>
      </section>

      {/* ── CTA Section ── */}
      <section className="py-24 bg-green-800">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold text-white mb-6">
            Ready to Start Your Journey?
          </h2>
          <p className="text-xl text-green-100 mb-10 opacity-90">
            Take the first step towards securing your educational funding. Browse
            available scholarships and apply today.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/scholarships">
              <Button size="lg" variant="secondary" className="bg-white text-green-800 hover:bg-gray-100 font-bold px-12 h-14">
                Explore Scholarships
              </Button>
            </Link>
            <Link href="/track">
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-green-800 font-bold px-12 h-14">
                Track Application
              </Button>
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
}