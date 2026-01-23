// File: admin/src/pages/BookingManagement.jsx
import React, { useState } from 'react';
import { CheckCircle, XCircle } from 'lucide-react';

const DUMMY_BOOKINGS = [
  { _id: 'BK101', user: 'Rahul Sharma', car: 'Mercedes-Benz G63', date: '2024-03-01', total: 100000, status: 'active' },
  { _id: 'BK102', user: 'Amit Verma', car: 'Skoda Kylaq', date: '2024-03-10', total: 5000, status: 'pending' },
  { _id: 'BK103', user: 'Sneha Gupta', car: 'Audi e-tron', date: '2024-02-20', total: 24000, status: 'completed' },
];

const BookingManagement = () => {
  const [bookings, setBookings] = useState(DUMMY_BOOKINGS);

  const updateStatus = (id, status) => {
    setBookings(bookings.map(b => b._id === id ? { ...b, status } : b));
  };

  return (
    <div className="p-8">
      <h1 className="text-3xl font-black text-gray-900 mb-8">Bookings</h1>
      <div className="bg-white rounded-3xl border shadow-sm overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="p-6 text-xs font-black uppercase text-gray-400">ID</th>
              <th className="p-6 text-xs font-black uppercase text-gray-400">User</th>
              <th className="p-6 text-xs font-black uppercase text-gray-400">Car</th>
              <th className="p-6 text-xs font-black uppercase text-gray-400">Total</th>
              <th className="p-6 text-xs font-black uppercase text-gray-400">Status</th>
              <th className="p-6 text-xs font-black uppercase text-gray-400 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {bookings.map((booking) => (
              <tr key={booking._id} className="hover:bg-gray-50">
                <td className="p-6 font-mono text-xs">{booking._id}</td>
                <td className="p-6 font-bold">{booking.user}</td>
                <td className="p-6 text-blue-600">{booking.car}</td>
                <td className="p-6 font-bold">₹{booking.total.toLocaleString()}</td>
                <td className="p-6">
                    <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase ${
                        booking.status === 'active' ? 'bg-blue-100 text-blue-700' :
                        booking.status === 'completed' ? 'bg-green-100 text-green-700' :
                        'bg-yellow-100 text-yellow-700'
                    }`}>
                        {booking.status}
                    </span>
                </td>
                <td className="p-6 text-right flex justify-end gap-2">
                    <button onClick={() => updateStatus(booking._id, 'completed')} className="p-2 text-green-600 hover:bg-green-50 rounded"><CheckCircle size={18}/></button>
                    <button onClick={() => updateStatus(booking._id, 'cancelled')} className="p-2 text-red-600 hover:bg-red-50 rounded"><XCircle size={18}/></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default BookingManagement;
