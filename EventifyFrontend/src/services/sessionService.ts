import api from './api';

export interface Session {
  id: string;
  title: string;
  description: string;
  startTime: string;
  endTime: string;
  eventId: string;
}

export interface SessionFormData {
  title: string;
  description: string;
  startTime: string;
  endTime: string;
  eventId: string;
}

// Get sessions for a specific event
export const getEventSessions = async (eventId: string): Promise<Session[]> => {
  const response = await api.get<Session[]>(`/sessions/event/${eventId}`);
  return response.data;
};

// Create a new session
export const createSession = async (sessionData: SessionFormData): Promise<string> => {
  const response = await api.post<string>('/sessions/create', sessionData);
  return response.data;
};

// Get a single session by ID
export const getSessionById = async (id: string): Promise<Session> => {
  const response = await api.get<Session>(`/sessions/${id}`);
  return response.data;
};