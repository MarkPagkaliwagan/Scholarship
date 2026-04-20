'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { GraduationCap, FileText, Search, CheckCircle, Users, Clock } from 'lucide-react';
import { initializeMockData } from '@/lib/mock-data';
import { useEffect } from 'react';

export default function Home() {
  useEffect(() => {
    initializeMockData();
  }, []);

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

  return (
    <div className="min-h-screen">
      <section className="bg-gradient-to-br from-green-50 to-green-100 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="flex justify-center mb-6">
              <GraduationCap className="h-16 w-16 text-green-700" />
            </div>
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
              Scholarship Management
              <span className="block text-green-700">Made Simple</span>
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
              Apply for scholarships, track your applications, and manage your educational funding journey all in one place.
            </p>

          </div>
        </div>
      </section>
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Everything You Need in One Platform
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Our comprehensive scholarship management system streamlines the entire application process.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="text-center hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="mx-auto mb-4 p-3 bg-green-100 rounded-full w-fit">
                    <feature.icon className="h-8 w-8 text-green-700" />
                  </div>
                  <CardTitle className="text-xl">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-gray-600">
                    {feature.description}
                  </CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Join Thousands of Students
            </h2>
            <p className="text-lg text-gray-600">
              See how our platform is helping students achieve their educational goals.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-4xl font-bold text-green-700 mb-2">500+</div>
              <div className="text-gray-600">Active Scholarships</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-green-700 mb-2">10,000+</div>
              <div className="text-gray-600">Applications Submitted</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-green-700 mb-2">$2M+</div>
              <div className="text-gray-600">Awards Distributed</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-green-700 mb-2">95%</div>
              <div className="text-gray-600">Satisfaction Rate</div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-green-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Ready to Start Your Journey?
          </h2>
          <p className="text-xl text-green-100 mb-8 max-w-2xl mx-auto">
            Take the first step towards securing your educational funding. Browse available scholarships and apply today.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/scholarships">
              <Button size="lg" variant="secondary" className="bg-white text-green-700 hover:bg-gray-100">
                Explore Scholarships
              </Button>
            </Link>
            <Link href="/track">
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-green-700">
                Track Application
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
