import React, { useState, useCallback, useEffect } from 'react';
import EmailDataTable from '../components/EmailDataTable';
import EmailComposeForm from '../components/EmailComposeForm';
import StatusUpdate from '../components/StatusUpdate';
import { fetchManualEmailData } from '../services/api';
import { ArrowPathIcon } from '@heroicons/react/24/outline'; // Import icon

const ManualEmailPage = () => {
  const [selectedEmailRows, setSelectedEmailRows] = useState([]);
  const [manualEmailData, setManualEmailData] = useState([]);
  const [isLoadingData, setIsLoadingData] = useState(true);
  const [errorData, setErrorData] = useState(null);
  const [pageStatus, setPageStatus] = useState({ message: '', type: '' });

  const activeSelectedEmail = selectedEmailRows.length > 0 ? selectedEmailRows[0] : null;

  const fetchEmailTableData = useCallback(async () => {
    setIsLoadingData(true);
    setErrorData(null);
    setPageStatus({ message: '', type: '' });
    try {
      const data = await fetchManualEmailData();
      setManualEmailData(data || []);
    } catch (err) {
      const errorMessage = typeof err === 'string' ? err : (err.message || "Failed to load email data.");
      setErrorData(errorMessage);
      setManualEmailData([]);
    } finally {
      setIsLoadingData(false);
    }
  }, []);

  useEffect(() => {
    fetchEmailTableData();
  }, [fetchEmailTableData]);

  const handleSelectedRowsChange = useCallback((selectedRows) => {
    setSelectedEmailRows(selectedRows);
    setPageStatus({ message: '', type: '' });
  }, []);

  const handleClearSelection = useCallback(() => {
    setSelectedEmailRows([]);
  }, []);

  const handleEmailSent = useCallback(async (emailId, newStatus) => {
    setPageStatus({ message: `Email ID: ${emailId} processed. Status: ${newStatus}`, type: 'success' });
    setManualEmailData(prevData => prevData.map(row => row.id === emailId ? { ...row, status: newStatus } : row));
  }, []);

  const handleStatusUpdatedByForm = useCallback(async (emailId, newStatus) => {
    setPageStatus({ message: `Status for email ID: ${emailId} updated to ${newStatus}.`, type: 'success' });
    setManualEmailData(prevData => prevData.map(row => row.id === emailId ? { ...row, status: newStatus } : row));
  }, []);

  return (
    <div className="min-h-screen bg-slate-900 text-white p-4 sm:p-8">
      <header className="mb-10">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl sm:text-4xl font-bold text-sky-300">Manual Email Operations</h1>
          <button
            onClick={fetchEmailTableData}
            disabled={isLoadingData}
            className="px-4 py-2.5 bg-sky-600 hover:bg-sky-700 text-white font-medium rounded-lg shadow-md focus:outline-none focus:ring-2 focus:ring-sky-500 focus:ring-offset-2 focus:ring-offset-slate-900 transition-colors duration-150 flex items-center disabled:opacity-70"
          >
            <ArrowPathIcon className={`h-5 w-5 mr-2 ${isLoadingData ? 'animate-spin' : ''}`} />
            {isLoadingData ? 'Refreshing...' : 'Refresh Data'}
          </button>
        </div>
      </header>

      {pageStatus.message && ( <div className={`mb-4 p-3 rounded-md text-sm text-center ${pageStatus.type === 'success' ? 'bg-green-800/60 text-green-300' : 'bg-red-800/60 text-red-300'}`}>{pageStatus.message}</div> )}

      <EmailDataTable data={manualEmailData} isLoading={isLoadingData} error={errorData} onSelectedRowsChange={handleSelectedRowsChange} />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8">
        <div> {activeSelectedEmail ? <EmailComposeForm key={activeSelectedEmail.id} selectedEmailData={activeSelectedEmail} onEmailSent={handleEmailSent} onClearSelection={handleClearSelection} /> : <div className="p-6 bg-slate-800/70 backdrop-blur-md rounded-xl shadow-xl border border-slate-700 h-full flex items-center justify-center min-h-[200px]"><p className="text-center text-slate-400">Select an email from the table to compose.</p></div>} </div>
        <div> {activeSelectedEmail ? <StatusUpdate key={activeSelectedEmail.id + '-status'} selectedEmail={activeSelectedEmail} onStatusUpdated={handleStatusUpdatedByForm} onClearSelection={handleClearSelection} /> : <div className="p-6 bg-slate-800/70 backdrop-blur-md rounded-xl shadow-xl border border-slate-700 h-full flex items-center justify-center min-h-[200px]"><p className="text-center text-slate-400">Select an email from the table to update its status.</p></div>} </div>
      </div>
    </div>
  );
};
export default ManualEmailPage;
