
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useUser } from '@/contexts/UserContext';
import RoleBasedNavigation from '@/components/navigation/RoleBasedNavigation';


const AppointmentManagement = () => {
  const { user, isAdmin } = useUser();

  if (!user) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-2">Access Denied</h2>
          <p className="text-muted-foreground">Please log in to access the appointment system.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <RoleBasedNavigation />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6">
          <h1 className="text-3xl font-bold">
            {isAdmin ? 'Appointment Management' : 'Book Physical Appointment'}
          </h1>
          <p className="text-muted-foreground mt-2">
            {isAdmin 
              ? 'Manage your availability and view appointment bookings' 
              : 'Schedule a physical appointment with your instructor'
            }
          </p>
        </div>

        <Tabs defaultValue={isAdmin ? "availability" : "book"} className="w-full">
          <TabsList className={`grid w-full ${isAdmin ? 'grid-cols-3' : 'grid-cols-2'}`}>
            {isAdmin && (
              <TabsTrigger value="availability">My Availability</TabsTrigger>
            )}
       
      
          </TabsList>

          {/* {isAdmin && (
            <TabsContent value="availability" className="mt-6">
              <SetAvailability />
            </TabsContent>
          )} */}

          
        </Tabs>
      </div>
    </div>
  );
};

export default AppointmentManagement;
