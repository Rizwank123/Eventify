import React, { useEffect, useState } from 'react';
import { getEvents, Event } from '../../services/eventService';
import { getEventSessions, Session } from '../../services/sessionService';
import { registerForSession } from '../../services/rsvpService';
import EventCard from '../../components/ui/EventCard';
import Button from '../../components/ui/Button';
import { Search, Filter, Calendar } from 'lucide-react';
import Input from '../../components/ui/Input';

const EventListingPage: React.FC = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [sessions, setSessions] = useState<{ [eventId: string]: Session[] }>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [showArchived, setShowArchived] = useState(false);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        setLoading(true);
        const data = await getEvents();
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

  const handleRegister = async (eventId: string, sessionId: string) => {
    try {
      await registerForSession({ eventId, sessionId });
      alert('Registration successful!');
    } catch (err) {
      console.error('Failed to register:', err);
      alert(err instanceof Error ? err.message : 'Failed to register. Please try again.');
    }
  };

  const filteredEvents = events
    .filter(event => !searchTerm ||
      event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      event.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      event.location.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .filter(event => showArchived || event.status === 'ACTIVE');

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
          <h1 className="text-2xl font-bold text-gray-900">Discover Events</h1>
          <p className="text-gray-600 mt-1">Find and register for exciting events</p>
        </div>
      </div>

      <div className="mb-6 flex flex-col md:flex-row gap-4">
        <div className="relative flex-grow">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-gray-400" />
          </div>
          <Input
            type="text"
            placeholder="Search events by title, description, or location"
            className="pl-10"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="flex items-center">
          <button
            onClick={() => setShowArchived(!showArchived)}
            className={`flex items-center space-x-2 px-4 py-2 rounded-md text-sm font-medium ${showArchived ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
          >
            <Filter className="h-4 w-4" />
            <span>Show Archived</span>
          </button>
        </div>
      </div>

      {filteredEvents.length === 0 ? (
        <div className="bg-white p-8 rounded-lg shadow-sm text-center">
          <Calendar className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-lg font-medium text-gray-900">No events found</h3>
          <p className="mt-1 text-gray-500">
            {searchTerm
              ? "No events match your search criteria. Try different keywords."
              : "There are no events available at the moment. Check back later!"}
          </p>
          {searchTerm && (
            <Button
              variant="outline"
              className="mt-4"
              onClick={() => setSearchTerm('')}
            >
              Clear Search
            </Button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredEvents.map((event) => (
            <EventCard
              key={event.id}
              event={event}
              sessions={sessions[event.id] || []}
              role="ATTENDEE"
              onRegister={handleRegister}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default EventListingPage;