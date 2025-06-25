
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { Calendar, Download, FileText, User } from 'lucide-react';

interface Booking {
  id: string;
  patientId: string;
  testId: string;
  testName: string;
  price: number;
  status: string;
  bookingDate: string;
  scheduledDate: string;
}

interface BookingHistoryProps {
  currentPatient: any;
}

const BookingHistory = ({ currentPatient }: BookingHistoryProps) => {
  const { toast } = useToast();
  const [bookings, setBookings] = useState<Booking[]>([]);

  useEffect(() => {
    if (currentPatient) {
      const allBookings = JSON.parse(localStorage.getItem('patientBookings') || '[]');
      const patientBookings = allBookings.filter((booking: Booking) => 
        booking.patientId === currentPatient.id
      );
      setBookings(patientBookings);
    }
  }, [currentPatient]);

  const handleDownloadReport = (booking: Booking) => {
    // Generate dummy PDF content
    const pdfContent = `
HEALTHLAB PORTAL - LAB REPORT
================================

Patient: ${currentPatient.firstName} ${currentPatient.lastName}
Test: ${booking.testName}
Date: ${new Date(booking.scheduledDate).toLocaleDateString()}
Report Generated: ${new Date().toLocaleString()}

TEST RESULTS
============

${getTestResults(booking.testName)}

REFERENCE RANGES
================

Values within normal limits unless otherwise noted.

INTERPRETATION
==============

Results reviewed and approved by medical staff.
Please consult with your healthcare provider for interpretation.

This is a sample report for demonstration purposes.
    `;

    // Create and download file
    const blob = new Blob([pdfContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${booking.testName.replace(/\s+/g, '_')}_Report_${booking.id}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    toast({
      title: "Report Downloaded",
      description: "Your lab report has been downloaded successfully.",
    });
  };

  const getTestResults = (testName: string) => {
    const results: Record<string, string> = {
      'Complete Blood Count (CBC)': `
White Blood Cell Count: 6.8 K/uL (Normal: 4.0-11.0)
Red Blood Cell Count: 4.5 M/uL (Normal: 4.2-5.4)
Hemoglobin: 14.2 g/dL (Normal: 12.0-16.0)
Hematocrit: 42.1% (Normal: 36-46)
Platelet Count: 275 K/uL (Normal: 150-450)`,
      'Lipid Panel': `
Total Cholesterol: 185 mg/dL (Normal: <200)
LDL Cholesterol: 115 mg/dL (Normal: <100)
HDL Cholesterol: 55 mg/dL (Normal: >40)
Triglycerides: 120 mg/dL (Normal: <150)`,
      'Comprehensive Metabolic Panel': `
Glucose: 95 mg/dL (Normal: 70-100)
BUN: 15 mg/dL (Normal: 7-20)
Creatinine: 1.0 mg/dL (Normal: 0.6-1.2)
Sodium: 140 mEq/L (Normal: 136-145)
Potassium: 4.2 mEq/L (Normal: 3.5-5.0)`,
      'Thyroid Function (TSH, T3, T4)': `
TSH: 2.1 mIU/L (Normal: 0.4-4.0)
Free T4: 1.3 ng/dL (Normal: 0.8-1.8)
Free T3: 3.2 pg/mL (Normal: 2.3-4.2)`,
      'Vitamin D': `
25-Hydroxyvitamin D: 32 ng/mL (Normal: 30-100)
Status: Adequate`,
      'HbA1c (Diabetes Screening)': `
HbA1c: 5.4% (Normal: <5.7%)
Estimated Average Glucose: 108 mg/dL`
    };
    
    return results[testName] || 'Results within normal ranges.';
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'scheduled':
        return 'bg-blue-100 text-blue-800';
      case 'in progress':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (!currentPatient) {
    return (
      <Card className="max-w-2xl mx-auto">
        <CardContent className="p-8 text-center">
          <User className="w-16 h-16 text-slate-400 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-slate-700 mb-2">
            Registration Required
          </h3>
          <p className="text-slate-600">
            Please register as a patient first to view your booking history.
          </p>
        </CardContent>
      </Card>
    );
  }

  if (bookings.length === 0) {
    return (
      <Card className="max-w-2xl mx-auto">
        <CardContent className="p-8 text-center">
          <Calendar className="w-16 h-16 text-slate-400 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-slate-700 mb-2">
            No Bookings Yet
          </h3>
          <p className="text-slate-600">
            You haven't booked any lab tests yet. Visit the Lab Tests tab to get started.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-slate-800 mb-2">My Lab Test Bookings</h2>
        <p className="text-slate-600">Track your scheduled tests and download reports</p>
      </div>

      <div className="grid gap-4">
        {bookings.map((booking) => (
          <Card key={booking.id} className="hover:shadow-md transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <CardTitle className="text-lg text-slate-800">
                  {booking.testName}
                </CardTitle>
                <Badge className={getStatusColor(booking.status)}>
                  {booking.status}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
                <div className="space-y-1">
                  <p className="text-sm text-slate-500">Booking Date</p>
                  <p className="font-medium">
                    {new Date(booking.bookingDate).toLocaleDateString()}
                  </p>
                </div>
                
                <div className="space-y-1">
                  <p className="text-sm text-slate-500">Scheduled Date</p>
                  <p className="font-medium">
                    {new Date(booking.scheduledDate).toLocaleDateString()}
                  </p>
                </div>
                
                <div className="space-y-1">
                  <p className="text-sm text-slate-500">Price</p>
                  <p className="font-bold text-blue-600">
                    ${booking.price.toFixed(2)}
                  </p>
                </div>
              </div>
              
              <div className="mt-4 flex gap-2">
                <Button
                  onClick={() => handleDownloadReport(booking)}
                  variant="outline"
                  className="flex items-center gap-2"
                >
                  <Download className="w-4 h-4" />
                  Download Report
                </Button>
                
                {booking.status.toLowerCase() === 'scheduled' && (
                  <Button
                    variant="outline"
                    className="flex items-center gap-2 text-blue-600 border-blue-200 hover:bg-blue-50"
                  >
                    <FileText className="w-4 h-4" />
                    View Details
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default BookingHistory;
