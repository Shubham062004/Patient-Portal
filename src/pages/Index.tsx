
import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import PatientRegistration from '@/components/PatientRegistration';
import LabTestsCatalog from '@/components/LabTestsCatalog';
import BookingHistory from '@/components/BookingHistory';
import { User, FileText, Calendar } from 'lucide-react';

const Index = () => {
  const [currentPatient, setCurrentPatient] = useState(null);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-teal-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-slate-800 mb-2">
            HealthLab Portal
          </h1>
          <p className="text-xl text-slate-600">
            Book lab tests and access your results securely
          </p>
        </div>

        {/* Main Portal */}
        <Card className="max-w-6xl mx-auto shadow-xl border-0 bg-white/80 backdrop-blur-sm">
          <Tabs defaultValue="register" className="w-full">
            <TabsList className="grid w-full grid-cols-3 mb-8 bg-slate-100">
              <TabsTrigger 
                value="register" 
                className="flex items-center gap-2 data-[state=active]:bg-blue-600 data-[state=active]:text-white"
              >
                <User className="w-4 h-4" />
                Register
              </TabsTrigger>
              <TabsTrigger 
                value="tests" 
                className="flex items-center gap-2 data-[state=active]:bg-blue-600 data-[state=active]:text-white"
              >
                <FileText className="w-4 h-4" />
                Lab Tests
              </TabsTrigger>
              <TabsTrigger 
                value="bookings" 
                className="flex items-center gap-2 data-[state=active]:bg-blue-600 data-[state=active]:text-white"
              >
                <Calendar className="w-4 h-4" />
                My Bookings
              </TabsTrigger>
            </TabsList>

            <TabsContent value="register" className="mt-0">
              <PatientRegistration 
                onRegistration={setCurrentPatient}
                currentPatient={currentPatient}
              />
            </TabsContent>

            <TabsContent value="tests" className="mt-0">
              <LabTestsCatalog currentPatient={currentPatient} />
            </TabsContent>

            <TabsContent value="bookings" className="mt-0">
              <BookingHistory currentPatient={currentPatient} />
            </TabsContent>
          </Tabs>
        </Card>

        {/* Footer */}
        <div className="text-center mt-8 text-slate-500">
          <p className="text-sm">
            Secure • HIPAA Compliant • 24/7 Support Available
          </p>
        </div>
      </div>
    </div>
  );
};

export default Index;
