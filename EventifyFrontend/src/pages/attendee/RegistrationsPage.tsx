import React, { useEffect, useState } from 'react';
import { getUserRegistrations, cancelRegistration, Registration } from '../../services/rsvpService';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import { Calendar, X, CheckCircle, AlertCircle } from 'lucide-react';

const RegistrationsPage: React.FC = () => {
  const [registrations, setRegistrations] = useState<Registration[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [cancelLoading, setCancelLoading] = useState<string | null>(null);

  useEffect(() => {
    fetchRegistrations();
  }, []);

  const fetchRegistrations = async () => {
    try {
      setLoading(true);
      const data = await getUserRegistrations();
      setRegistrations(data);
    } catch (err) {
      console.error('Failed to fetch registrations:', err);
      setError('Failed to load your registrations. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const handleCancelRegistration = async (registrationId: string) => {
    if (!confirm('Are you sure you want to cancel this registration?')) {
      return;
    }

    try {
      setCancelLoading(registrationId);
      await cancelRegistration(registrationId);
      
      // Update the local state
      setRegistrations(registrations.map(reg =>
        reg.registrationId === registrationId ? { ...reg, cancelled: true } : reg
      ));
    } catch (err) {
      console.error('Failed to cancel registration:', err);
      alert('Failed to cancel registration. Please try again.');
    } finally {
      setCancelLoading(null);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border-l-4 border-red-400 p-4 my-6">
        <div className="flex">
          <div className="flex-shrink-0">
            <svg className="h-5 w-5 text-red-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
          </div>
          <div className="ml-3">
            <p className="text-sm text-red-700">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  const activeRegistrations = registrations.filter(reg => !reg.cancelled);
  const cancelledRegistrations = registrations.filter(reg => reg.cancelled);

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">My Registrations</h1>
        <p className="text-gray-600 mt-1">View and manage your event registrations</p>
      </div>

      {registrations.length === 0 ? (
        <div className="bg-white p-8 rounded-lg shadow-sm text-center">
          <Calendar className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-lg font-medium text-gray-900">No registrations found</h3>
          <p className="mt-1 text-gray-500">
            You haven't registered for any events yet.
          </p>
          <Button
            variant="outline"
            className="mt-4"
            onClick={() => window.location.href = '/attendee/events'}
          >
            Browse Events
          </Button>
        </div>
      ) : (
        <div className="space-y-6">
          {activeRegistrations.length > 0 && (
            <Card>
              <CardHeader className="bg-green-50">
                <div className="flex items-center">
                  <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
                  <CardTitle>Active Registrations</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <ul className="divide-y divide-gray-200">
                  {activeRegistrations.map((registration) => (
                    <li key={registration.registrationId} className="py-4 flex justify-between items-center">
                      <div>
                        <h3 className="text-sm font-medium text-gray-900">{registration.eventTitle}</h3>
                        <p className="text-sm text-gray-500">{registration.sessionTitle}</p>
                      </div>
                      <div>
                        <Button
                          variant="outline"
                          size="sm"
                          isLoading={cancelLoading === registration.registrationId}
                          onClick={() => handleCancelRegistration(registration.registrationId)}
                          className="text-red-600 border-red-200 hover:bg-red-50"
                          leftIcon={<X className="h-4 w-4" />}
                        >
                          Cancel
                        </Button>
                      </div>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          )}

          {cancelledRegistrations.length > 0 && (
            <Card>
              <CardHeader className="bg-gray-50">
                <div className="flex items-center">
                  <AlertCircle className="h-5 w-5 text-gray-400 mr-2" />
                  <CardTitle>Cancelled Registrations</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <ul className="divide-y divide-gray-200">
                  {cancelledRegistrations.map((registration) => (
                    <li key={registration.registrationId} className="py-4">
                      <div className="opacity-60">
                        <h3 className="text-sm font-medium text-gray-900">{registration.eventTitle}</h3>
                        <p className="text-sm text-gray-500">{registration.sessionTitle}</p>
                        <span className="inline-flex items-center mt-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                          Cancelled
                        </span>
                      </div>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          )}
        </div>
      )}
    </div>
  );
};

export default RegistrationsPage;