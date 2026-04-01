import { useEffect, useState } from 'react';

const baseUrl =
  'https://express-guest-list-api-memor-mvv826e67e1k.sela891.deno.net';

export default function App() {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [guestList, setGuestList] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchGuests() {
      const response = await fetch(`${baseUrl}/guests`);
      const allGuests = await response.json();
      setGuestList(allGuests);
      setIsLoading(false);
    }
    fetchGuests().catch((error) => {
      console.error('Failed to load guests:', error);
      setIsLoading(false);
    });
  }, []);

  const handleAddGuest = async (event) => {
    event.preventDefault();
    if (firstName.trim() === '' || lastName.trim() === '') return;

    const response = await fetch(`${baseUrl}/guests`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        firstName: firstName,
        lastName: lastName,
        attending: false,
      }),
    });
    const createdGuest = await response.json();

    setGuestList([createdGuest, ...guestList]);
    setFirstName('');
    setLastName('');
  };

  const toggleCheck = async (id, currentStatus) => {
    const response = await fetch(`${baseUrl}/guests/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ attending: !currentStatus }),
    });
    const updatedGuest = await response.json();

    setGuestList(
      guestList.map((guest) => (guest.id === id ? updatedGuest : guest)),
    );
  };

  const removeGuest = async (id) => {
    const response = await fetch(`${baseUrl}/guests/${id}`, {
      method: 'DELETE',
    });
    const deletedGuest = await response.json();

    const remainingGuests = guestList.filter((guest) => guest.id !== id);
    setGuestList(remainingGuests);
    console.log('Successfully removed:', deletedGuest);
  };

  if (isLoading) return <h1>Loading...</h1>;

  return (
    <div
      style={{
        padding: '20px',
        fontFamily: 'sans-serif',
        textAlign: 'center',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <h1>Guest List</h1>

      <div style={{ margin: '10px' }}>
        <label>
          First name:
          <input
            style={{ margin: '10px' }}
            value={firstName}
            onChange={(event) => setFirstName(event.currentTarget.value)}
          />
        </label>
      </div>

      <div style={{ margin: '10px' }}>
        <label style={{ margin: '10px' }}>
          Last name:
          <input
            style={{ margin: '10px' }}
            value={lastName}
            onChange={(event) => setLastName(event.currentTarget.value)}
          />
        </label>
      </div>

      <div style={{ margin: '10px' }}>
        <button
          style={{ width: '200px' }}
          type="button"
          onClick={handleAddGuest}
        >
          Return
        </button>
      </div>

      <div>
        <p>
          <strong>Guests</strong>
        </p>
        <div>
          {guestList.map((guest) => (
            <div
              key={`guest-${guest.id}`}
              data-test-id="guest"
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '10px',
                margin: '10px 0',
              }}
            >
              <input
                type="checkbox"
                checked={guest.attending}
                aria-label={`${guest.firstName} ${guest.lastName} attending status`}
                onChange={() => toggleCheck(guest.id, guest.attending)}
              />
              <span>
                {guest.firstName} {guest.lastName}
              </span>
              <button
                aria-label={`Remove ${guest.firstName} ${guest.lastName}`}
                onClick={() => removeGuest(guest.id)}
              >
                Remove
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
