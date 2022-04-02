import { useContext, useEffect, useState } from 'react';
import { ApiContext } from '../../utils/api_context';
import { Button } from '../common/button';
import { Link, Route, Routes } from 'react-router-dom';
import { Rooms } from './rooms';
import { Room } from './room';
import { ChatRoom } from '../chat_room/_chat_room';
import { NewRoomModal } from './new_room_modal';

export const Home = () => {
  const api = useContext(ApiContext);
  const [chatRooms, setChatRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [isOpen, setIsOpen] = useState(false);
  const [location, setLocation] = useState(null);

  //TODO: fix css
  //TODO: check reqs
  //TODO: clear messages between chatRooms

  useEffect(async () => {
    const res = await api.get('/users/me');
    const { chatRooms } = await api.get('/chat_rooms');
    // console.log(chatRooms);
    setChatRooms(chatRooms);
    setUser(res.user);

    navigator.geolocation.getCurrentPosition(
      (location) => {
        // console.log('currLocation: ' + location);
        // console.log(location.coords);
        setLocation(location.coords);
      },
      (err) => {
        console.log('error: ' + err);
      },
    );

    setLoading(false);
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  const createRoom = async (name) => {
    setIsOpen(false);
    const body = {
      name: name,
      lat: location.latitude,
      lon: location.longitude,
    };
    // console.log(body.lat + ' ' + body.lon);
    const { chatRoom } = await api.post('/chat_rooms', body);
    // console.log(chatRoom);
    setChatRooms([...chatRooms, chatRoom]);
  };

  const isInRange = (lat1, lon1) => {
    if (location == null) {
      return false;
    }
    const lat2 = location.latitude;
    const lon2 = location.longitude;
    const R = 6371;
    const dLat = deg2rad(lat2 - lat1);
    const dLon = deg2rad(lon2 - lon1);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const d = R * c;

    if (d <= 8) return true;
    return false;
  };

  const deg2rad = (deg) => {
    return deg * (Math.PI / 180);
  };

  return (
    <div className="app-container">
      <Rooms>
        {chatRooms.map((room) => {
          // console.log(room);
          if (isInRange(room.lat, room.lon)) {
            return (
              <Room key={room.id} to={`chat_rooms/${room.id}`}>
                {room.name}
              </Room>
            );
          }
        })}
        <Room action={() => setIsOpen(true)}>+</Room>
      </Rooms>
      <div className="chat-window">
        <Routes>
          <Route path="chat_rooms/:id" element={<ChatRoom />} />
          <Route
            path="/*"
            element={<div>Select a room to get started. Fun Fact! Only chat rooms in a 5 mile radius are shown! </div>}
          />
        </Routes>
      </div>
      {isOpen ? <NewRoomModal createRoom={createRoom} /> : null}
    </div>
  );
};
