import React, { useState } from 'react';
import { Phone, Heart, Save, Trash, Edit2 } from 'lucide-react';
import { useSafety } from '../../contexts/SafetyContext';

const EmergencyContact = () => {
  const { contacts, addContact, removeContact, updateContact } = useSafety();
  const [isAdding, setIsAdding] = useState(false);
  const [newContact, setNewContact] = useState({
    name: '',
    relationship: '',
    phone: '',
    notes: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    addContact(newContact);
    setNewContact({ name: '', relationship: '', phone: '', notes: '' });
    setIsAdding(false);
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
        <Heart className="text-red-500" />
        Emergency Contacts
      </h2>

      {/* Contact List */}
      <div className="space-y-4 mb-6">
        {contacts.map((contact, index) => (
          <div 
            key={index}
            className="border rounded-lg p-4 bg-gray-50"
          >
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-medium">{contact.name}</h3>
                <p className="text-sm text-gray-600">{contact.relationship}</p>
                <div className="flex items-center gap-2 mt-2">
                  <Phone size={16} className="text-blue-500" />
                  <a 
                    href={`tel:${contact.phone}`}
                    className="text-blue-500 hover:underline"
                  >
                    {contact.phone}
                  </a>
                </div>
                {contact.notes && (
                  <p className="text-sm text-gray-600 mt-2">{contact.notes}</p>
                )}
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => removeContact(index)}
                  className="p-2 text-red-500 hover:bg-red-50 rounded-full"
                >
                  <Trash size={16} />
                </button>
                <button
                  onClick={() => {
                    setNewContact(contact);
                    setIsAdding(true);
                  }}
                  className="p-2 text-blue-500 hover:bg-blue-50 rounded-full"
                >
                  <Edit2 size={16} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Add Contact Form */}
      {isAdding ? (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Name
            </label>
            <input
              type="text"
              value={newContact.name}
              onChange={(e) => setNewContact(prev => ({
                ...prev,
                name: e.target.value
              }))}
              className="w-full p-2 border rounded-md"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Relationship
            </label>
            <input
              type="text"
              value={newContact.relationship}
              onChange={(e) => setNewContact(prev => ({
                ...prev,
                relationship: e.target.value
              }))}
              className="w-full p-2 border rounded-md"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Phone Number
            </label>
            <input
              type="tel"
              value={newContact.phone}
              onChange={(e) => setNewContact(prev => ({
                ...prev,
                phone: e.target.value
              }))}
              className="w-full p-2 border rounded-md"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Additional Notes
            </label>
            <textarea
              value={newContact.notes}
              onChange={(e) => setNewContact(prev => ({
                ...prev,
                notes: e.target.value
              }))}
              className="w-full p-2 border rounded-md h-24 resize-none"
            />
          </div>

          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={() => setIsAdding(false)}
              className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-md"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
            >
              <Save size={16} className="inline-block mr-2" />
              Save Contact
            </button>
          </div>
        </form>
      ) : (
        <button
          onClick={() => setIsAdding(true)}
          className="w-full p-3 border-2 border-dashed border-gray-300 text-gray-600 rounded-lg hover:border-blue-500 hover:text-blue-500 transition-colors"
        >
          + Add Emergency Contact
        </button>
      )}
    </div>
  );
};

export default EmergencyContact;