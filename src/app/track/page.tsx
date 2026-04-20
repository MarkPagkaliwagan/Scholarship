'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Search, FileText, Calendar, User, CheckCircle, Clock, XCircle, AlertCircle } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { referenceCodeSchema, ReferenceCodeFormData } from '@/lib/validations';
import { Application, Scholarship } from '@/lib/types';
import { StorageService } from '@/lib/storage';
import { format } from 'date-fns';

export default function TrackPage() {
  const [application, setApplication] = useState<Application | null>(null);
  const [scholarship, setScholarship] = useState<Scholarship | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [searched, setSearched] = useState(false);

  const form = useForm<ReferenceCodeFormData>({
    resolver: zodResolver(referenceCodeSchema),
    mode: 'onChange',
  });

  const onSubmit = async (data: ReferenceCodeFormData) => {
    setIsLoading(true);
    setSearched(true);
    
    try {
     
      const foundApplication = StorageService.getApplicationByReferenceCode(data.referenceCode);
      
      if (foundApplication) {
        setApplication(foundApplication);
        
        // Get scholarship details
        const scholarships = StorageService.getScholarships();
        const foundScholarship = scholarships.find(s => s.id === foundApplication.scholarshipId);
        setScholarship(foundScholarship || null);
      } else {
        setApplication(null);
        setScholarship(null);
      }
    } catch (error) {
      console.error('Error tracking application:', error);
      setApplication(null);
      setScholarship(null);
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'PENDING':
        return <Clock className="h-5 w-5 text-yellow-500" />;
      case 'UNDER_REVIEW':
        return <AlertCircle className="h-5 w-5 text-blue-500" />;
      case 'APPROVED':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'REJECTED':
        return <XCircle className="h-5 w-5 text-red-500" />;
      default:
        return <Clock className="h-5 w-5 text-gray-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'PENDING':
        return 'bg-yellow-500';
      case 'UNDER_REVIEW':
        return 'bg-blue-500';
      case 'APPROVED':
        return 'bg-green-500';
      case 'REJECTED':
        return 'bg-red-500';
      default:
        return 'bg-gray-500';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'PENDING':
        return 'Pending Review';
      case 'UNDER_REVIEW':
        return 'Under Review';
      case 'APPROVED':
        return 'Approved';
      case 'REJECTED':
        return 'Rejected';
      default:
        return 'Unknown';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Track Your Application
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Enter your reference code to check the status of your scholarship application.
          </p>
        </div>

        {/* Search Form */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Find Your Application</CardTitle>
            <CardDescription>
              Enter the reference code you received when you submitted your application.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <div>
                <Label htmlFor="referenceCode">Reference Code</Label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    id="referenceCode"
                    placeholder="SCH-2024-1234"
                    {...form.register('referenceCode')}
                    className="pl-10"
                  />
                </div>
                {form.formState.errors.referenceCode && (
                  <p className="text-red-500 text-sm mt-1">
                    {form.formState.errors.referenceCode.message}
                  </p>
                )}
              </div>
              <Button 
                type="submit" 
                disabled={isLoading}
                className="w-full bg-green-700 hover:bg-green-800"
              >
                {isLoading ? 'Searching...' : 'Track Application'}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Results */}
        {searched && (
          <>
            {application ? (
              <div className="space-y-6">
                {/* Status Card */}
                <Card>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="flex items-center">
                        {getStatusIcon(application.status)}
                        <span className="ml-2">Application Status</span>
                      </CardTitle>
                      <Badge className={`${getStatusColor(application.status)} text-white`}>
                        {getStatusText(application.status)}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <Label className="text-sm text-gray-600">Reference Code</Label>
                          <p className="font-semibold">{application.referenceCode}</p>
                        </div>
                        <div>
                          <Label className="text-sm text-gray-600">Applied On</Label>
                          <p className="font-semibold">
                            {format(new Date(application.createdAt), 'MMM dd, yyyy')}
                          </p>
                        </div>
                        <div>
                          <Label className="text-sm text-gray-600">Last Updated</Label>
                          <p className="font-semibold">
                            {format(new Date(application.updatedAt), 'MMM dd, yyyy')}
                          </p>
                        </div>
                        <div>
                          <Label className="text-sm text-gray-600">Scholarship</Label>
                          <p className="font-semibold">{scholarship?.title || 'Unknown'}</p>
                        </div>
                      </div>

                      {application.adminRemarks && (
                        <div className="bg-gray-50 p-4 rounded-lg">
                          <Label className="text-sm text-gray-600">Admin Remarks</Label>
                          <p className="mt-1 text-gray-800">{application.adminRemarks}</p>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>

                {/* Personal Information */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <User className="h-5 w-5 mr-2" />
                      Personal Information
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label className="text-sm text-gray-600">Name</Label>
                        <p className="font-semibold">
                          {application.personalInfo.firstName} {application.personalInfo.lastName}
                        </p>
                      </div>
                      <div>
                        <Label className="text-sm text-gray-600">Email</Label>
                        <p className="font-semibold">{application.personalInfo.email}</p>
                      </div>
                      <div>
                        <Label className="text-sm text-gray-600">Phone</Label>
                        <p className="font-semibold">{application.personalInfo.phone}</p>
                      </div>
                      <div>
                        <Label className="text-sm text-gray-600">Address</Label>
                        <p className="font-semibold">{application.personalInfo.address}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Academic Information */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <FileText className="h-5 w-5 mr-2" />
                      Academic Information
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label className="text-sm text-gray-600">Institution</Label>
                        <p className="font-semibold">{application.academicInfo.institution}</p>
                      </div>
                      <div>
                        <Label className="text-sm text-gray-600">Major</Label>
                        <p className="font-semibold">{application.academicInfo.major}</p>
                      </div>
                      <div>
                        <Label className="text-sm text-gray-600">GPA</Label>
                        <p className="font-semibold">{application.academicInfo.gpa}</p>
                      </div>
                      <div>
                        <Label className="text-sm text-gray-600">Academic Year</Label>
                        <p className="font-semibold">{application.academicInfo.year}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Uploaded Documents */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <FileText className="h-5 w-5 mr-2" />
                      Uploaded Documents
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      {application.fileNames.map((fileName, index) => (
                        <div key={index} className="flex items-center justify-between bg-gray-50 p-2 rounded">
                          <span className="text-sm">{fileName}</span>
                          <Badge variant="secondary">Uploaded</Badge>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Status Timeline */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Calendar className="h-5 w-5 mr-2" />
                      Application Timeline
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-center">
                        <div className="w-4 h-4 bg-green-500 rounded-full"></div>
                        <div className="ml-4">
                          <p className="font-semibold">Application Submitted</p>
                          <p className="text-sm text-gray-600">
                            {format(new Date(application.createdAt), 'MMM dd, yyyy at h:mm a')}
                          </p>
                        </div>
                      </div>
                      
                      {application.status !== 'PENDING' && (
                        <div className="flex items-center">
                          <div className="w-4 h-4 bg-blue-500 rounded-full"></div>
                          <div className="ml-4">
                            <p className="font-semibold">Application Under Review</p>
                            <p className="text-sm text-gray-600">
                              Your application is being reviewed by the scholarship committee.
                            </p>
                          </div>
                        </div>
                      )}
                      
                      {application.status === 'APPROVED' && (
                        <div className="flex items-center">
                          <div className="w-4 h-4 bg-green-500 rounded-full"></div>
                          <div className="ml-4">
                            <p className="font-semibold">Application Approved</p>
                            <p className="text-sm text-gray-600">
                              Congratulations! Your application has been approved.
                            </p>
                          </div>
                        </div>
                      )}
                      
                      {application.status === 'REJECTED' && (
                        <div className="flex items-center">
                          <div className="w-4 h-4 bg-red-500 rounded-full"></div>
                          <div className="ml-4">
                            <p className="font-semibold">Application Not Approved</p>
                            <p className="text-sm text-gray-600">
                              Your application was not selected for this scholarship.
                            </p>
                          </div>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </div>
            ) : (
              <Card>
                <CardContent className="text-center py-12">
                  <div className="mx-auto w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                    <Search className="h-8 w-8 text-gray-400" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">Application Not Found</h3>
                  <p className="text-gray-600 mb-4">
                    We couldn't find an application with that reference code. Please check the code and try again.
                  </p>
                  <Button 
                    variant="outline" 
                    onClick={() => {
                      setSearched(false);
                      form.reset();
                    }}
                  >
                    Search Again
                  </Button>
                </CardContent>
              </Card>
            )}
          </>
        )}

        {/* Help Section */}
        {!searched && (
          <Card className="mt-8">
            <CardHeader>
              <CardTitle>Need Help?</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold mb-2">Where to find your reference code:</h3>
                  <ul className="list-disc list-inside text-gray-600 space-y-1">
                    <li>Check your email after submitting your application</li>
                    <li>Look for the confirmation page after submission</li>
                    <li>The code format is: SCH-YYYY-XXXX (e.g., SCH-2024-1234)</li>
                  </ul>
                </div>
                <div>
                  <h3 className="font-semibold mb-2">What do the statuses mean?</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center">
                      <div className="w-3 h-3 bg-yellow-500 rounded-full mr-2"></div>
                      <span><strong>Pending:</strong> Your application is waiting to be reviewed</span>
                    </div>
                    <div className="flex items-center">
                      <div className="w-3 h-3 bg-blue-500 rounded-full mr-2"></div>
                      <span><strong>Under Review:</strong> Your application is being evaluated</span>
                    </div>
                    <div className="flex items-center">
                      <div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
                      <span><strong>Approved:</strong> Your application was successful</span>
                    </div>
                    <div className="flex items-center">
                      <div className="w-3 h-3 bg-red-500 rounded-full mr-2"></div>
                      <span><strong>Rejected:</strong> Your application was not selected</span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
