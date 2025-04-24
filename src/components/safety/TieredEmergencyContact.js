// src/components/safety/TieredEmergencyContact.js
import React, { useState } from 'react';
import { Phone, Heart, Save, Trash, Edit2, Lock } from 'lucide-react';
import { useSafety } from '../../contexts/SafetyContext';
import { useSubscription } from '../../contexts/SubscriptionContext';
import TierContentManager from '../subscription/TierContentManager';

export const TieredEmergencyContact = () => {
  const { hasTierAccess } = useSubscription();
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

  // Get contacts with tier restriction
  const visibleContacts = hasTierAccess('premium') 
    ? contacts 
    : contacts.slice(0, 1); // Basic tier only gets 1 contact

  // Basic tier preview content
  const BasicContactPreview = () => (
    <div className="space-y-4 mb-6">
      {visibleContacts.map((contact, index) => (
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
                <a className="text-blue-500 hover:underline">{contact.phone}</a>
              </div>
            </div>
          </div>
        </div>
      ))}

      {hasTierAccess('basic') && visibleContacts.length < 1 && (
        <div className="border rounded-lg p-4 bg-gray-50 text-center">
          <p className="text-gray-600">No emergency contacts added yet.</p>
        </div>
      )}
    </div>
  );

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
        <Heart className="text-red-500" />
        Emergency Contacts
      </h2>

      {/* Basic Tier - Limited to 1 contact */}
      <TierContentManager
        requiredTier="basic"
        featureName="emergency contact"
      >
        <div className="space-y-4 mb-6">
          {visibleContacts.map((contact, index) => (
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

          {hasTierAccess('basic') && visibleContacts.length < 1 && (
            <div className="border rounded-lg p-4 bg-gray-50 text-center">
              <p className="text-gray-600">No emergency contacts added yet.</p>
            </div>
          )}
        </div>

        {/* Premium upgrade prompt if Basic has 1 contact already */}
        {visibleContacts.length >= 1 && !hasTierAccess('premium') && (
          <div className="mb-4 bg-indigo-50 border border-indigo-100 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <Lock className="text-indigo-600 flex-shrink-0 mt-1" />
              <div>
                <p className="font-medium text-indigo-700">Premium Feature</p>
                <p className="text-sm text-indigo-600 mb-2">
                  Upgrade to Premium or Elite to add multiple emergency contacts.
                </p>
                <a 
                  href="/subscription/plans" 
                  className="text-sm font-medium text-indigo-600 hover:text-indigo-800"
                >
                  View upgrade options →
                </a>
              </div>
            </div>
          </div>
        )}

        {/* Add Contact Form - Basic tier */}
        {visibleContacts.length < 1 ? (
          isAdding ? (
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
          )
        ) : null}
      </TierContentManager>

      {/* Premium Tier - Multiple contacts with notes */}
      <TierContentManager
        requiredTier="premium"
        featureName="advanced emergency contacts"
        preview={true}
        previewContent={<BasicContactPreview />}
      >
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

          {contacts.length === 0 && (
            <div className="border rounded-lg p-4 bg-gray-50 text-center">
              <p className="text-gray-600">No emergency contacts added yet.</p>
            </div>
          )}
        </div>

        {/* Add Contact Form - Premium tier */}
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
      </TierContentManager>
    </div>
  );
};