import React, { useState, useEffect } from 'react';

function App() {
  const [events, setEvents] = useState([]);
  const [eventPair, setEventPair] = useState([]);
  const [message, setMessage] = useState('');
  const [showButtons, setShowButtons] = useState(false);
  const [showYears, setShowYears] = useState(false);

  useEffect(() => {
    fetch(`${process.env.PUBLIC_URL}/events2.json`)
      .then(response => response.json())
      .then(data => {
        setEvents(data);
        setEventPair(getRandomEvents(data));
      });
  }, []);

  function getCentury(year) {
    return Math.floor(year / 100) + 1;
  }

  function getRandomEvents(events) {
    const randomEvent = events[Math.floor(Math.random() * events.length)];
    const century = getCentury(randomEvent.year);
    const filteredEvents = events.filter(event => {
      const eventCentury = getCentury(event.year);
      return eventCentury >= century - 1 && eventCentury <= century + 1;
    });

    let eventPair;
    if (filteredEvents.length >= 2) {
      const shuffled = filteredEvents.sort(() => 0.5 - Math.random());
      eventPair = [shuffled[0], shuffled[1]];
    } else {
      const anotherRandomEvent = events[Math.floor(Math.random() * events.length)];
      eventPair = [randomEvent, anotherRandomEvent];
    }

    if (eventPair[0].year === eventPair[1].year) {
      return getRandomEvents(events);
    }

    return eventPair;
  }

  const handleSelection = (selectedEvent) => {
    const [event1, event2] = eventPair;
    const correctEvent = event1.year < event2.year ? event1 : event2;

    if (selectedEvent.name === correctEvent.name) {
      setMessage('Correct!');
    } else {
      setMessage('Wrong!');
    }

    setShowYears(true);
    setShowButtons(true);
  };

  const handleNextQuestion = () => {
    setEventPair(getRandomEvents(events));
    setMessage('');
    setShowButtons(false);
    setShowYears(false);
  };

  const handleRepeatQuestion = () => {
    setMessage('');
    setShowButtons(false);
    setShowYears(false);
  };

  return (
    <div className='flex flex-col items-center justify-center w-full min-h-screen bg-gray-800'>
      <div className="flex flex-col items-center mx-auto">      
        <h1 className="text-2xl font-bold mb-4 text-white">Which event came first?</h1>
        <div className="cards flex justify-center space-x-4 mx-2">
          {eventPair.map((event) => (
            <div
              key={event.name}
              className="card p-4 bg-white shadow-md rounded-lg cursor-pointer hover:bg-gray-200 transition"
              onClick={() => handleSelection(event)}
            >
              <h2 className="text-xl font-semibold">{event.name}</h2>
              {showYears && <p className="text-gray-600">{event.year}</p>}
            </div>
          ))}
        </div>
        {message && <p className="mt-4 text-lg text-white">{message}</p>}
        {showButtons && (
          <div className="mt-4 space-x-4">
            <button
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-700 transition"
              onClick={handleNextQuestion}
            >
              Next Question
            </button>
            <button
              className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-700 transition"
              onClick={handleRepeatQuestion}
            >
              Repeat Question
            </button>
          </div>
        )}
        
      </div>
    </div>
  );
}

export default App;