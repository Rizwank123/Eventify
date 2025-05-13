import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getEventById, updateEvent, archiveEvent } from '../../services/eventService';
import Input from '../../components/ui/Input';
import TextArea from '../../components/ui/TextArea';
import Button from '../../components/ui/Button';
import { ChevronLeft, Save, Archive } from 'lucide-react';
import { formatFormDateTime } from '../../utils/dateUtils';

const EventUpdatePage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [location, setLocation] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [status, setStatus] = useState<'ACTIVE' | 'ARCHIVED'>('ACTIVE');
  
  const [loading, setLoading] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [archiveLoading, setArchiveLoading] = useState(false);

  useEffect(() => {
    const fetchEvent = async () => {
      if (!id) return;

      try {
        setFetchLoading(true);
        const event = await getEventById(id);
        
        setTitle(event.title);
        setDescription(event.description);
        setLocation(event.location);
        setStatus(event.status);
        
        // Parse date and time from ISO string
        const dateObj = new Date(event.dateTime);
        setDate(dateObj.toISOString().split('T')[0]);
        setTime(dateObj.toTimeString().slice(0, 5));
      } catch (err) {
        console.error('Failed to fetch event:', err);
        setError('Failed to load event details. Please try again later.');
      } finally {
        setFetchLoading(false);
      }
    };

    fetchEvent();
  }, [id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!id) return;
    
    setError(null);
    
    // Form validation
    if (!title || !description || !location || !date || !time) {
      setError('All fields are required');
      return;
    }
    
    // Convert date and time to ISO format
    const dateTime = formatFormDateTime(date, time);
    if (!dateTime) {
      setError('Invalid date or time');
      return;
    }
    
    try {
      setLoading(true);
      const eventData = {
        title,
        description,
        location,
        dateTime,
      };
      
      await updateEvent(id, eventData);
      navigate('/organizer/events');
    } catch (err) {
      console.error('Failed to update event:', err);
      setError(err instanceof Error ? err.message : 'Failed to update event. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleArchive = async () => {
    if (!id) return;
    
    if (!confirm('Are you sure you want to archive this event? This will hide it from attendees.')) {
      return;
    }
    
    try {
      setArchiveLoading(true);
      await archiveEvent(id);
      navigate('/organizer/events');
    } catch (err) {
      console.error('Failed to archive event:', err);
      setError(err instanceof Error ? err.message : 'Failed to archive event. Please try again.');
    } finally {
      setArchiveLoading(false);
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
      
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
          <h1 className="text-xl font-bold text-gray-900">Update Event</h1>
          <div className="flex items-center">
            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
              status === 'ACTIVE' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
            }`}>
              {status}
            </span>
          </div>
        </div>
        
        <div className="p-6">
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
          
          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4 md:col-span-2">
                <Input
                  label="Event Title"
                  id="title"
                  name="title"
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                  placeholder="Enter a title for your event"
                />
                
                <TextArea
                  label="Description"
                  id="description"
                  name="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  required
                  placeholder="Describe your event"
                  rows={4}
                />
              </div>
              
              <Input
                label="Location"
                id="location"
                name="location"
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                required
                placeholder="Enter the event location"
              />
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  label="Date"
                  id="date"
                  name="date"
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  required
                />
                
                <Input
                  label="Time"
                  id="time"
                  name="time"
                  type="time"
                  value={time}
                  onChange={(e) => setTime(e.target.value)}
                  required
                />
              </div>
            </div>
            
            <div className="mt-8 flex flex-wrap justify-between">
              {status === 'ACTIVE' && (
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleArchive}
                  isLoading={archiveLoading}
                  leftIcon={<Archive className="h-5 w-5" />}
                  className="text-amber-700 border-amber-200 hover:bg-amber-50"
                >
                  Archive Event
                </Button>
              )}
              
              <div className="flex space-x-4 ml-auto">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => navigate('/organizer/events')}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  isLoading={loading}
                  rightIcon={<Save className="h-5 w-5" />}
                >
                  Save Changes
                </Button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EventUpdatePage;