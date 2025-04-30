import { PracticeEvent } from '../types/index';
import { apiRequest } from '../config/api';

/**
 * Fetch all practice events for a user
 */
export const fetchEvents = async (userId: string): Promise<PracticeEvent[]> => {
  try {
    const data = await apiRequest<PracticeEvent[]>(`/calendar/${userId}`);

    return data.map(event => ({
      ...event,
      startTime: new Date(event.startTime),
      endTime: new Date(event.endTime)
    }));
  } catch (error) {
    console.error('Error fetching practice events:', error);
    throw error;
  }
};

/**
 * Add a new practice event
 */
export const addEvent = async (userId: string, event: Omit<PracticeEvent, 'id'>): Promise<PracticeEvent> => {
  try {
    // Ensure event type is set
    const eventType = event.type || 'practice';
    
    const data = await apiRequest<PracticeEvent>(`/calendar/${userId}`, {
      method: 'POST',
      body: JSON.stringify({
        title: event.title,
        description: event.description || '',
        startTime: event.startTime.toISOString(),
        endTime: event.endTime.toISOString(),
        isCompleted: event.isCompleted || false,
        sheetMusicId: event.sheetMusicId,
        color: event.color || '#3B82F6',
        type: eventType
      })
    });

    return {
      ...data,
      startTime: new Date(data.startTime),
      endTime: new Date(data.endTime)
    };
  } catch (error) {
    console.error('Error adding practice event:', error);
    throw error;
  }
};

/**
 * Update an existing practice event
 */
export const updateEvent = async (userId: string, event: PracticeEvent): Promise<void> => {
  try {
    await apiRequest(`/calendar/${userId}/${event.id}`, {
      method: 'PUT',
      body: JSON.stringify({
        title: event.title,
        description: event.description,
        startTime: event.startTime.toISOString(),
        endTime: event.endTime.toISOString(),
        isCompleted: event.isCompleted,
        sheetMusicId: event.sheetMusicId,
        color: event.color,
        type: event.type
      })
    });
  } catch (error) {
    console.error('Error updating practice event:', error);
    throw error;
  }
};

/**
 * Delete a practice event
 */
export const deleteEvent = async (userId: string, eventId: string): Promise<void> => {
  try {
    await apiRequest(`/calendar/${userId}/${eventId}`, {
      method: 'DELETE'
    });
  } catch (error) {
    console.error('Error deleting practice event:', error);
    throw error;
  }
};

/**
 * Toggle the completion status of a practice event
 */
export const toggleEventCompletion = async (userId: string, eventId: string, isCompleted: boolean): Promise<void> => {
  try {
    await apiRequest(`/calendar/${userId}/${eventId}/toggle-completion`, {
      method: 'PATCH',
      body: JSON.stringify({ isCompleted })
    });
  } catch (error) {
    console.error('Error toggling practice event completion:', error);
    throw error;
  }
}; 