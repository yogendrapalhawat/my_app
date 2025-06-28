import React, { useEffect, useState } from 'react';
import api from '../api';

const Events = () => {
  const [events, setEvents] = useState([]);

  const fetchEvents = async () => {
    try {
      const res = await api.get('/events');
      setEvents(res.data);
    } catch (err) {
      alert('Failed to load events');
    }
  };

  const handleJoin = async (id) => {
    try {
      const token = localStorage.getItem('token');
      await api.post(`/events/${id}/register`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      alert('Registered successfully!');
    } catch (err) {
      alert(err.response?.data?.message || 'Join failed');
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  return (
    <div>
      <h2>Events</h2>
      {events.map(event => (
        <div key={event._id} style={{ border: '1px solid #ccc', margin: '10px', padding: '10px' }}>
          <h3>{event.title}</h3>
          <p>{event.description}</p>
          <button onClick={() => handleJoin(event._id)}>Join</button>
        </div>
      ))}
    </div>
  );
};

export default Events;
