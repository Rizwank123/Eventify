import api from './api';

export interface Registration {
  registrationId: string;
  eventTitle: string;
  sessionTitle: string;
  cancelled: boolean;
}

export interface RegistrationRequest {
  eventId: string;
  sessionId: string;
}

// Register for an event/session
export const registerForSession = async (data: RegistrationRequest): Promise<Registration> => {
  const response = await api.post<Registration>('/rsvp/register', data);
  return response.data;
};

// Cancel a registration
export const cancelRegistration = async (id: string): Promise<void> => {
  await api.put(`/rsvp/cancel/${id}`);
};

// Get user's registrations
export const getUserRegistrations = async (): Promise<Registration[]> => {
  const response = await api.get<Registration[]>('/rsvp/my');
  return response.data;
};