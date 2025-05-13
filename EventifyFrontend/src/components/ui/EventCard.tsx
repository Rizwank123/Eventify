import React from 'react';
import { Link } from 'react-router-dom';
import { formatDateTime } from '../../utils/dateUtils';
import { Calendar, MapPin, Clock, Users } from 'lucide-react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from './Card';
import Button from './Button';
import { Event } from '../../services/eventService';
import { Session } from '../../services/sessionService';

interface EventCardProps {
  event: Event;
  sessions?: Session[];
  role: 'ORGANIZER' | 'ATTENDEE';
  onRegister?: (eventId: string, sessionId: string) => void;
}

const EventCard: React.FC<EventCardProps> = ({
  event,
  sessions = [],
  role,
  onRegister,
}) => {
  const statusBadgeClass = event.status === 'ACTIVE'
    ? 'bg-green-100 text-green-800'
    : 'bg-gray-100 text-gray-800';

  return (
    <Card className="h-full flex flex-col transition-all duration-300 hover:shadow-md">
      <CardHeader>
        <div className="flex justify-between items-start">
          <CardTitle>{event.title}</CardTitle>
          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusBadgeClass}`}>
            {event.status}
          </span>
        </div>
        <div className="flex items-center mt-2 text-sm text-gray-500">
          <Calendar className="h-4 w-4 mr-1" />
          <span>{formatDateTime(event.dateTime)}</span>
        </div>
        <div className="flex items-center mt-1 text-sm text-gray-500">
          <MapPin className="h-4 w-4 mr-1" />
          <span>{event.location}</span>
        </div>
      </CardHeader>
      
      <CardContent className="flex-grow">
        <p className="text-gray-600 mb-4">{event.description}</p>
        
        {sessions.length > 0 && (
          <div className="mt-4">
            <h4 className="text-sm font-medium text-gray-900 mb-2">Sessions</h4>
            <ul className="space-y-2">
              {sessions.map((session) => (
                <li key={session.id} className="bg-gray-50 p-3 rounded-md">
                  <div className="flex justify-between">
                    <h5 className="font-medium text-gray-900">{session.title}</h5>
                    {role === 'ATTENDEE' && onRegister && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => onRegister(event.id, session.id)}
                        className="text-xs"
                      >
                        Register
                      </Button>
                    )}
                  </div>
                  <div className="text-xs text-gray-500 mt-1 flex items-center">
                    <Clock className="h-3 w-3 mr-1" />
                    {formatDateTime(session.startTime)} - {formatDateTime(session.endTime)}
                  </div>
                </li>
              ))}
            </ul>
          </div>
        )}
      </CardContent>
      
      <CardFooter className="flex justify-between items-center">
        <div className="text-sm text-gray-500 flex items-center">
          <Users className="h-4 w-4 mr-1" />
          <span>By {event.organizerUsername}</span>
        </div>
        
        {role === 'ORGANIZER' ? (
          <div className="flex space-x-2">
            <Link to={`/organizer/sessions/${event.id}`}>
              <Button variant="outline" size="sm">
                Manage Sessions
              </Button>
            </Link>
            <Link to={`/organizer/events/update/${event.id}`}>
              <Button size="sm">
                Edit
              </Button>
            </Link>
          </div>
        ) : (
          sessions.length === 0 && onRegister && (
            <Button
              onClick={() => onRegister(event.id, '')}
              size="sm"
            >
              Register
            </Button>
          )
        )}
      </CardFooter>
    </Card>
  );
};

export default EventCard;