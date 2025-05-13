import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getOrganizerEvents, Event } from '../../services/eventService';
import EventCard from '../../components/ui/EventCard';
import Button from '../../components/ui/Button';
import { getEventSessions, Session } from '../../services/sessionService';
import { PlusCircle, Calendar } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';

const OrganizerDashboard: React.FC = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [sessions, setSessions] = useState<{ [eventId: string]: Session[] }>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<'ACTIVE' | 'ARCHIVED' | 'ALL'>('ACTIVE');
  const { user } = useAuth();

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        setLoading(true);
        const data = await getOrganizerEvents();
        setEvents(data);

        // Fetch sessions for each event
        const sessionsMap: { [eventId: string]: Session[] } = {};
        await Promise.all(
          data.map(async (event) => {
            try {
              const sessionData = await getEventSessions(event.id);
              sessionsMap[event.id] = sessionData;
            } catch (err) {
              console.error(`Failed to fetch sessions for event ${event.id}:`, err);
            }
          })
        );

        setSessions(sessionsMap);
      } catch (err) {
        console.error('Failed to fetch events:', err);
        setError('Failed to load events. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  const filteredEvents = filter === 'ALL'
    ? events
    : events.filter(event => event.status === filter);

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
          <h1 className="text-2xl font-bold text-gray-900">My Events</h1>
          <p className="text-gray-600 mt-1">Manage your events and sessions</p>
        </div>
        <Link to="/organizer/events/create">
          <Button leftIcon={<PlusCircle className="h-5 w-5" />}>
            Create New Event
          </Button>
        </Link>
      </div>

      <div className="mb-6">
        <div className="flex space-x-2 overflow-x-auto pb-2">
          <button
            onClick={() => setFilter('ACTIVE')}
            className={`px-4 py-2 rounded-md text-sm font-medium ${filter === 'ACTIVE'
              ? 'bg-blue-100 text-blue-800'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
          >
            Active Events
          </button>
          <button
            onClick={() => setFilter('ARCHIVED')}
            className={`px-4 py-2 rounded-md text-sm font-medium ${filter === 'ARCHIVED'
              ? 'bg-blue-100 text-blue-800'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
          >
            Archived Events
          </button>
          <button
            onClick={() => setFilter('ALL')}
            className={`px-4 py-2 rounded-md text-sm font-medium ${filter === 'ALL'
              ? 'bg-blue-100 text-blue-800'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
          >
            All Events
          </button>
        </div>
      </div>

      {filteredEvents.length === 0 ? (
        <div className="bg-white p-8 rounded-lg shadow-sm text-center">
          <Calendar className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-lg font-medium text-gray-900">No events found</h3>
          <p className="mt-1 text-gray-500">
            {filter === 'ACTIVE'
              ? "You don't have any active events. Create a new event to get started!"
              : filter === 'ARCHIVED'
                ? "You don't have any archived events."
                : "You haven't created any events yet. Create your first event to get started!"}
          </p>
          {filter !== 'ACTIVE' && (
            <Button
              variant="outline"
              className="mt-4"
              onClick={() => setFilter('ACTIVE')}
            >
              View Active Events
            </Button>
          )}
          {filter !== 'ALL' && (
            <Link to="/organizer/events/create">
              <Button className="mt-4 ml-2">Create New Event</Button>
            </Link>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredEvents.map((event) => (
            <EventCard
              key={event.id}
              event={event}
              sessions={sessions[event.id] || []}
              role="ORGANIZER"
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default OrganizerDashboard;