import api from './api';

export interface Event {
  id: string;
  title: string;
  description: string;
  location: string;
  dateTime: string;
  status: 'ACTIVE' | 'ARCHIVED';
  organizerUsername: string;
}

export interface EventFormData {
  title: string;
  description: string;
  location: string;
  dateTime: string;
}

// Get all events (for attendees)
export const getEvents = async (): Promise<Event[]> => {
  const response = await api.get<Event[]>('/events/all');
  return response.data;
};

// Get events for organizer
export const getOrganizerEvents = async (): Promise<Event[]> => {
  const response = await api.get<Event[]>('/events');
  return response.data;
};

// Get a single event by ID
export const getEventById = async (id: string): Promise<Event> => {
  const response = await api.get<Event>(`/events/${id}`);
  return response.data;
};

// Create a new event
export const createEvent = async (eventData: EventFormData): Promise<Event> => {
  const response = await api.post<Event>('/events', eventData);
  return response.data;
};

// Update an event
export const updateEvent = async (id: string, eventData: EventFormData): Promise<Event> => {
  const response = await api.put<Event>(`/events/${id}`, eventData);
  return response.data;
};

// Archive an event
export const archiveEvent = async (id: string): Promise<Event> => {
  const response = await api.put<Event>(`/events/${id}/archive`);
  return response.data;
};