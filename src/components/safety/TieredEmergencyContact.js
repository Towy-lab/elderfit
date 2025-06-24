// src/components/safety/TieredEmergencyContact.js
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card.js';
import { Button } from '../../components/ui/button.js';
import { Input } from '../../components/ui/input.js';
import { Label } from '../../components/ui/label.js';
import { Badge } from '../../components/ui/badge.js';
import { Phone, User, Mail, Plus, Trash2, Shield, Lock, Edit2 } from 'lucide-react';
import { useSafety } from '../../contexts/SafetyContext.js';
import { useSubscription } from '../../contexts/SubscriptionContext.js';
import TierContentManager from '../subscription/TierContentManager.js';

export const TieredEmergencyContact = () => {
  const { contacts, addContact, removeContact, updateContact } = useSafety();
  const { hasAccess } = useSubscription();
  const [isAdding, setIsAdding] = useState(false);
  const [editingIndex, setEditingIndex] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    relationship: '',
    phone: '',
    email: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (editingIndex !== null) {
      updateContact(editingIndex, formData);
      setEditingIndex(null);
    } else {
      addContact(formData);
    }
    setFormData({ name: '', relationship: '', phone: '', email: '' });
    setIsAdding(false);
  };

  const handleEdit = (index) => {
    setFormData(contacts[index]);
    setEditingIndex(index);
    setIsAdding(true);
  };

  const handleDelete = (index) => {
    removeContact(index);
  };

  // Preview content for basic tier
  const BasicEmergencyContactPreview = () => (
    <div>
      <p className="text-gray-600 mb-4">
        Keep your emergency contacts up to date for your safety.
      </p>
      <div className="space-y-3 opacity-50">
        <div className="p-4 bg-gray-50 rounded-lg">
          <div className="flex items-center gap-3">
            <User className="text-gray-400" size={20} />
            <div>
              <p className="font-medium">John Doe</p>
              <p className="text-sm text-gray-500">Spouse</p>
            </div>
          </div>
          <div className="mt-2 flex items-center gap-2 text-sm text-gray-500">
            <Phone size={16} />
            <span>(555) 123-4567</span>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
        <Phone className="text-red-500" />
        Emergency Contacts
      </h2>

      <TierContentManager
        requiredTier="premium"
        featureName="emergency contacts"
        preview={true}
        previewContent={<BasicEmergencyContactPreview />}
      >
        {/* Contact List */}
        <div className="space-y-3 mb-6">
          {contacts.map((contact, index) => (
            <div key={index} className="p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <User className="text-gray-600" size={20} />
                  <div>
                    <p className="font-medium">{contact.name}</p>
                    <p className="text-sm text-gray-500">{contact.relationship}</p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleEdit(index)}
                    className="p-1 text-gray-600 hover:text-blue-600"
                  >
                    <Edit2 size={16} />
                  </button>
                  <button
                    onClick={() => handleDelete(index)}
                    className="p-1 text-gray-600 hover:text-red-600"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
              <div className="mt-2 space-y-1">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Phone size={16} />
                  <span>{contact.phone}</span>
                </div>
                {contact.email && (
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Mail size={16} />
                    <span>{contact.email}</span>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Add/Edit Form */}
        {isAdding ? (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Name
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
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
                value={formData.relationship}
                onChange={(e) => setFormData({ ...formData, relationship: e.target.value })}
                className="w-full p-2 border rounded-md"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Phone
              </label>
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="w-full p-2 border rounded-md"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email (Optional)
              </label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full p-2 border rounded-md"
              />
            </div>
            <div className="flex gap-2">
              <button
                type="submit"
                className="flex-1 p-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
              >
                {editingIndex !== null ? 'Update Contact' : 'Add Contact'}
              </button>
              <button
                type="button"
                onClick={() => {
                  setIsAdding(false);
                  setEditingIndex(null);
                  setFormData({ name: '', relationship: '', phone: '', email: '' });
                }}
                className="p-2 border border-gray-300 rounded-md hover:bg-gray-50"
              >
                Cancel
              </button>
            </div>
          </form>
        ) : (
          <button
            onClick={() => setIsAdding(true)}
            className="w-full p-3 border-2 border-dashed border-gray-300 rounded-lg text-gray-600 hover:border-gray-400 hover:text-gray-700 flex items-center justify-center gap-2"
          >
            <Plus size={20} />
            Add Emergency Contact
          </button>
        )}

        {/* Elite Upgrade Promo */}
        {!hasAccess('elite') && (
          <div className="mt-6 bg-purple-50 border border-purple-100 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <Lock className="text-purple-600 flex-shrink-0 mt-1" />
              <div>
                <p className="font-medium text-purple-700">Elite Feature</p>
                <p className="text-sm text-purple-600 mb-2">
                  Upgrade to Elite for advanced emergency contact management and direct communication with healthcare providers.
                </p>
                <a 
                  href="/subscription/plans" 
                  className="text-sm font-medium text-purple-600 hover:text-purple-800"
                  aria-label="Upgrade to Elite subscription for advanced emergency contact features"
                >
                  Upgrade to Elite →
                </a>
              </div>
            </div>
          </div>
        )}
      </TierContentManager>
    </div>
  );
};

export default TieredEmergencyContact;