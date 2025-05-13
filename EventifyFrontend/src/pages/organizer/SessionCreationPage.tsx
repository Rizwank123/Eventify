import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getEventById } from '../../services/eventService';
import { createSession, getEventSessions, Session } from '../../services/sessionService';
import Input from '../../components/ui/Input';
import TextArea from '../../components/ui/TextArea';
import Button from '../../components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/Card';
import { ChevronLeft, Clock, Plus, Trash } from 'lucide-react';
import { formatDateTime, formatFormDateTime } from '../../utils/dateUtils';

const SessionCreationPage: React.FC = () => {
  const { eventId } = useParams<{ eventId: string }>();
  const navigate = useNavigate();
  
  const [eventTitle, setEventTitle] = useState('');
  const [sessions, setSessions] = useState<Session[]>([]);
  
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [startDate, setStartDate] = useState('');
  const [startTime, setStartTime] = useState('');
  const [endDate, setEndDate] = useState('');
  const [endTime, setEndTime] = useState('');
  
  const [loading, setLoading] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  useEffect(() => {
    const fetchEventAndSessions = async () => {
      if (!eventId) return;

      try {
        setFetchLoading(true);
        
        // Fetch event details
        const event = await getEventById(eventId);
        setEventTitle(event.title);
        
        // Fetch existing sessions
        const sessionData = await getEventSessions(eventId);
        setSessions(sessionData);
      } catch (err) {
        console.error('Failed to fetch data:', err);
        setError('Failed to load event details. Please try again later.');
      } finally {
        setFetchLoading(false);
      }
    };

    fetchEventAndSessions();
  }, [eventId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!eventId) return;
    
    setError(null);
    setSuccessMessage(null);
    
    // Form validation
    if (!title || !description || !startDate || !startTime || !endDate || !endTime) {
      setError('All fields are required');
      return;
    }
    
    // Convert date and time to ISO format
    const startDateTime = formatFormDateTime(startDate, startTime);
    const endDateTime = formatFormDateTime(endDate, endTime);
    
    if (!startDateTime || !endDateTime) {
      setError('Invalid date or time');
      return;
    }
    
    if (new Date(startDateTime) >= new Date(endDateTime)) {
      setError('End time must be after start time');
      return;
    }
    
    try {
      setLoading(true);
      const sessionData = {
        title,
        description,
        startTime: startDateTime,
        endTime: endDateTime,
        eventId,
      };
      
      await createSession(sessionData);
      
      // Clear form
      setTitle('');
      setDescription('');
      setStartDate('');
      setStartTime('');
      setEndDate('');
      setEndTime('');
      
      // Refresh sessions list
      const updatedSessions = await getEventSessions(eventId);
      setSessions(updatedSessions);
      
      setSuccessMessage('Session created successfully');
    } catch (err) {
      console.error('Failed to create session:', err);
      setError(err instanceof Error ? err.message : 'Failed to create session. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (fetchLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6">
        <button 
          onClick={() => navigate('/organizer/events')}
          className="inline-flex items-center text-sm text-gray-600 hover:text-gray-900"
        >
          <ChevronLeft className="h-4 w-4 mr-1" />
          Back to events
        </button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Add Session to {eventTitle}</CardTitle>
            </CardHeader>
            <CardContent>
              {error && (
                <div className="bg-red-50 border-l-4 border-red-400 p-4 mb-6">
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
              )}
              
              {successMessage && (
                <div className="bg-green-50 border-l-4 border-green-400 p-4 mb-6">
                  <div className="flex">
                    <div className="flex-shrink-0">
                      <svg className="h-5 w-5 text-green-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <div className="ml-3">
                      <p className="text-sm text-green-700">{successMessage}</p>
                    </div>
                  </div>
                </div>
              )}
              
              <form onSubmit={handleSubmit}>
                <div className="space-y-4">
                  <Input
                    label="Session Title"
                    id="title"
                    name="title"
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    required
                    placeholder="Enter a title for your session"
                  />
                  
                  <TextArea
                    label="Description"
                    id="description"
                    name="description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    required
                    placeholder="Describe your session"
                    rows={3}
                  />
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <p className="block text-sm font-medium text-gray-700 mb-1">Start Time</p>
                      <div className="grid grid-cols-2 gap-2">
                        <Input
                          label=""
                          id="startDate"
                          name="startDate"
                          type="date"
                          value={startDate}
                          onChange={(e) => setStartDate(e.target.value)}
                          required
                        />
                        
                        <Input
                          label=""
                          id="startTime"
                          name="startTime"
                          type="time"
                          value={startTime}
                          onChange={(e) => setStartTime(e.target.value)}
                          required
                        />
                      </div>
                    </div>
                    
                    <div>
                      <p className="block text-sm font-medium text-gray-700 mb-1">End Time</p>
                      <div className="grid grid-cols-2 gap-2">
                        <Input
                          label=""
                          id="endDate"
                          name="endDate"
                          type="date"
                          value={endDate}
                          onChange={(e) => setEndDate(e.target.value)}
                          required
                        />
                        
                        <Input
                          label=""
                          id="endTime"
                          name="endTime"
                          type="time"
                          value={endTime}
                          onChange={(e) => setEndTime(e.target.value)}
                          required
                        />
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="mt-6">
                  <Button
                    type="submit"
                    isLoading={loading}
                    rightIcon={<Plus className="h-5 w-5" />}
                  >
                    Add Session
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
        
        <div>
          <Card>
            <CardHeader>
              <CardTitle>Existing Sessions</CardTitle>
            </CardHeader>
            <CardContent>
              {sessions.length === 0 ? (
                <div className="text-center py-6">
                  <Clock className="mx-auto h-12 w-12 text-gray-400" />
                  <h3 className="mt-2 text-sm font-medium text-gray-900">No sessions</h3>
                  <p className="mt-1 text-sm text-gray-500">
                    Get started by creating a new session.
                  </p>
                </div>
              ) : (
                <ul className="divide-y divide-gray-200">
                  {sessions.map((session) => (
                    <li key={session.id} className="py-4">
                      <div className="flex justify-between">
                        <div>
                          <h4 className="text-sm font-medium text-gray-900">{session.title}</h4>
                          <p className="mt-1 text-xs text-gray-500">
                            {formatDateTime(session.startTime)} to {formatDateTime(session.endTime)}
                          </p>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default SessionCreationPage;