
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { FileText, User } from 'lucide-react';

interface LabTest {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  preparationInstructions: string;
  turnaroundTime: string;
}

interface LabTestsCatalogProps {
  currentPatient: any;
}

const LabTestsCatalog = ({ currentPatient }: LabTestsCatalogProps) => {
  const { toast } = useToast();
  const [tests, setTests] = useState<LabTest[]>([]);
  const [loading, setLoading] = useState(true);

  // Mock lab tests data
  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      const mockTests: LabTest[] = [
        {
          id: '1',
          name: 'Complete Blood Count (CBC)',
          description: 'Comprehensive blood analysis including red blood cells, white blood cells, and platelets',
          price: 45.00,
          category: 'Hematology',
          preparationInstructions: 'No special preparation required',
          turnaroundTime: '1-2 business days'
        },
        {
          id: '2',
          name: 'Lipid Panel',
          description: 'Cholesterol and triglyceride levels to assess cardiovascular health',
          price: 65.00,
          category: 'Chemistry',
          preparationInstructions: 'Fast for 12 hours before test',
          turnaroundTime: '1-2 business days'
        },
        {
          id: '3',
          name: 'Comprehensive Metabolic Panel',
          description: 'Kidney function, liver function, blood sugar, and electrolyte levels',
          price: 85.00,
          category: 'Chemistry',
          preparationInstructions: 'Fast for 8-12 hours before test',
          turnaroundTime: '1-2 business days'
        },
        {
          id: '4',
          name: 'Thyroid Function (TSH, T3, T4)',
          description: 'Complete thyroid hormone evaluation',
          price: 120.00,
          category: 'Endocrinology',
          preparationInstructions: 'No special preparation required',
          turnaroundTime: '2-3 business days'
        },
        {
          id: '5',
          name: 'Vitamin D',
          description: '25-hydroxyvitamin D blood test',
          price: 75.00,
          category: 'Nutrition',
          preparationInstructions: 'No special preparation required',
          turnaroundTime: '1-2 business days'
        },
        {
          id: '6',
          name: 'HbA1c (Diabetes Screening)',
          description: 'Average blood sugar levels over the past 2-3 months',
          price: 55.00,
          category: 'Diabetes',
          preparationInstructions: 'No fasting required',
          turnaroundTime: '1-2 business days'
        }
      ];
      setTests(mockTests);
      setLoading(false);
    }, 1000);
  }, []);

  const handleBookTest = (test: LabTest) => {
    if (!currentPatient) {
      toast({
        title: "Registration Required",
        description: "Please register first before booking a lab test.",
        variant: "destructive"
      });
      return;
    }

    // Create booking
    const booking = {
      id: Date.now().toString(),
      patientId: currentPatient.id,
      testId: test.id,
      testName: test.name,
      price: test.price,
      status: 'Scheduled',
      bookingDate: new Date().toISOString(),
      scheduledDate: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(), // Tomorrow
    };

    // Store booking in localStorage
    const existingBookings = JSON.parse(localStorage.getItem('patientBookings') || '[]');
    existingBookings.push(booking);
    localStorage.setItem('patientBookings', JSON.stringify(existingBookings));

    toast({
      title: "Test Booked Successfully!",
      description: `${test.name} has been scheduled. Check your bookings for details.`,
    });
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
            Please register as a patient first to view and book lab tests.
          </p>
        </CardContent>
      </Card>
    );
  }

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[...Array(6)].map((_, i) => (
          <Card key={i} className="animate-pulse">
            <CardHeader>
              <div className="h-4 bg-slate-200 rounded w-3/4"></div>
              <div className="h-3 bg-slate-200 rounded w-1/2"></div>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="h-3 bg-slate-200 rounded"></div>
                <div className="h-3 bg-slate-200 rounded w-2/3"></div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-slate-800 mb-2">Available Lab Tests</h2>
        <p className="text-slate-600">Choose from our comprehensive range of diagnostic tests</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {tests.map((test) => (
          <Card key={test.id} className="hover:shadow-lg transition-shadow duration-200">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <CardTitle className="text-lg text-slate-800 line-clamp-2">
                  {test.name}
                </CardTitle>
                <Badge variant="secondary" className="ml-2 shrink-0">
                  {test.category}
                </Badge>
              </div>
              <p className="text-2xl font-bold text-blue-600">
                ${test.price.toFixed(2)}
              </p>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="space-y-3">
                <p className="text-sm text-slate-600 line-clamp-3">
                  {test.description}
                </p>
                
                <div className="space-y-2 text-xs text-slate-500">
                  <p><strong>Preparation:</strong> {test.preparationInstructions}</p>
                  <p><strong>Results:</strong> {test.turnaroundTime}</p>
                </div>

                <Button 
                  onClick={() => handleBookTest(test)}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                >
                  <FileText className="w-4 h-4 mr-2" />
                  Book Test
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default LabTestsCatalog;
