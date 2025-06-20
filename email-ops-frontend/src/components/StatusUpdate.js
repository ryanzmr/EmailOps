import React, { useState } from 'react';
import { postUpdateOperationStatus } from '../services/api'; // Use actual API function
import { CheckCircleIcon, XCircleIcon } from '@heroicons/react/24/solid'; // Import icons

const StatusUpdate = ({ selectedEmail, onStatusUpdated, onClearSelection }) => {
  const [statusMessage, setStatusMessage] = useState({ message: '', type: '' });
  const [isUpdating, setIsUpdating] = useState(false);

  const handleUpdateStatus = async (newStatus) => {
    if (!selectedEmail || !selectedEmail.id) {
      setStatusMessage({ message: 'No email selected or email ID is missing.', type: 'error' });
      return;
    }
    setIsUpdating(true);
    setStatusMessage({ message: '', type: '' });
    try {
      const response = await postUpdateOperationStatus(selectedEmail.id, newStatus); // Use actual API function
      setStatusMessage({ message: response.message, type: 'success' });
      if (onStatusUpdated) {
        onStatusUpdated(selectedEmail.id, newStatus);
      }
    } catch (error) {
      setStatusMessage({ message: error.message || 'Failed to update status.', type: 'error' });
    } finally {
      setIsUpdating(false);
    }
  };

  if (!selectedEmail) { return null; }

  return (
    <div className="p-6 sm:p-8 bg-slate-800/70 backdrop-blur-md rounded-xl shadow-xl border border-slate-700 mt-6">
      <h2 className="text-2xl font-semibold text-sky-300 mb-4">Update Status</h2>
      <div>
        <p className="text-slate-300 mb-1"><span className="font-medium text-sky-200">Company:</span> {selectedEmail.companyName}</p>
        <p className="text-slate-300 mb-1"><span className="font-medium text-sky-200">Email:</span> {selectedEmail.companyEmail}</p>
        <p className="text-slate-300 mb-4">
          <span className="font-medium text-sky-200">Current Status:</span>
          <span className={`ml-2 font-semibold ${
            selectedEmail.status === 'Pending' ? 'text-yellow-400' :
            selectedEmail.status === 'Completed' || selectedEmail.status === 'Sent' ? 'text-green-400' :
            selectedEmail.status === 'Failed' ? 'text-red-400' : 'text-slate-300'
          }`}>
            {selectedEmail.status}
          </span>
        </p>

        <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-3">
          <button
            onClick={() => handleUpdateStatus('Completed')}
            disabled={isUpdating || selectedEmail.status === 'Completed' || selectedEmail.status === 'Sent'}
            className="flex-1 py-2.5 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-800 focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center"
          >
            <CheckCircleIcon className="h-5 w-5 mr-2"/>
            {isUpdating ? 'Updating...' : 'Mark as Completed'}
          </button>
          <button
            onClick={() => handleUpdateStatus('Failed')}
            disabled={isUpdating || selectedEmail.status === 'Failed'}
            className="flex-1 py-2.5 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-800 focus:ring-red-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center"
          >
            <XCircleIcon className="h-5 w-5 mr-2"/>
            {isUpdating ? 'Updating...' : 'Mark as Failed'}
          </button>
          {onClearSelection && (
            <button
              type="button"
              onClick={onClearSelection}
              disabled={isUpdating}
              className="py-2.5 px-4 border border-slate-600 rounded-lg shadow-sm text-sm font-medium text-sky-200 hover:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-800 focus:ring-sky-500 disabled:opacity-50 transition-colors"
            >
              Deselect
            </button>
          )}
        </div>
        {statusMessage.message && (
          <div className={`mt-4 p-3 rounded-md text-sm ${statusMessage.type === 'success' ? 'bg-green-700/50 text-green-300' : 'bg-red-700/50 text-red-300'}`}>
            {statusMessage.message}
          </div>
        )}
      </div>
    </div>
  );
};
export default StatusUpdate;
