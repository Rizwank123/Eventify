import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getUserRegistrations, Registration } from '../../services/rsvpService';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import { CheckCircle, Calendar, List } from 'lucide-react';

const AttendeeDashboard: React.FC = () => {
  const [registrations, setRegistrations] = useState<Registration[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchRegistrations = async () => {
      try {
        setLoading(true);
        const data = await getUserRegistrations();
        setRegistrations(data.filter(reg => !reg.cancelled));
      } catch (err) {
        console.error('Failed to fetch registrations:', err);
        setError('Failed to load your registrations. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchRegistrations();
  }, []);

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

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Attendee Dashboard</h1>
          <p className="text-gray-600 mt-1">Manage your event registrations</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card className="bg-blue-50 border border-blue-100">
          <CardContent className="pt-6">
            <div className="flex items-center">
              <Calendar className="h-8 w-8 text-blue-600" />
              <div className="ml-4">
                <h3 className="text-lg font-medium text-gray-900">Upcoming Events</h3>
                <p className="text-gray-600">Discover and register for events</p>
                <Link to="/attendee/events">
                  <Button variant="outline" className="mt-4">
                    Browse Events
                  </Button>
                </Link>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-purple-50 border border-purple-100">
          <CardContent className="pt-6">
            <div className="flex items-center">
              <CheckCircle className="h-8 w-8 text-purple-600" />
              <div className="ml-4">
                <h3 className="text-lg font-medium text-gray-900">My Registrations</h3>
                <p className="text-gray-600">View and manage your registrations</p>
                <Link to="/attendee/registrations">
                  <Button variant="outline" className="mt-4">
                    View Registrations
                  </Button>
                </Link>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recent Registrations</CardTitle>
          </CardHeader>
          <CardContent>
            {registrations.length === 0 ? (
              <div className="text-center py-4">
                <List className="mx-auto h-10 w-10 text-gray-400" />
                <p className="mt-2 text-sm text-gray-500">No registrations found</p>
                <Link to="/attendee/events">
                  <Button variant="outline" size="sm" className="mt-2">
                    Find Events
                  </Button>
                </Link>
              </div>
            ) : (
              <ul className="divide-y divide-gray-200">
                {registrations.slice(0, 3).map((registration) => (
                  <li key={registration.registrationId} className="py-3">
                    <p className="text-sm font-medium text-gray-900">{registration.eventTitle}</p>
                    <p className="text-xs text-gray-500">{registration.sessionTitle}</p>
                  </li>
                ))}
                {registrations.length > 3 && (
                  <li className="pt-3">
                    <Link to="/attendee/registrations" className="text-sm text-blue-600 hover:text-blue-800">
                      View all registrations
                    </Link>
                  </li>
                )}
              </ul>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AttendeeDashboard;