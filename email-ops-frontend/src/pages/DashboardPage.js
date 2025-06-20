import React from 'react';
import { useDashboard } from '../contexts/DashboardContext';
import { ArrowPathIcon } from '@heroicons/react/24/outline'; // Import icon

const StatCard = ({ title, count, bgColor, textColor, description, isLoading }) => {
  // Optional: Add icons to StatCards if desired, e.g., ClockIcon, CheckCircleIcon, XCircleIcon
  return (
    <div className={`shadow-lg rounded-xl p-6 ${bgColor} ${textColor}`}>
      <h3 className="text-2xl font-semibold">{title}</h3>
      {isLoading ? (
        <div className="animate-pulse my-2">
          <div className="h-10 bg-slate-700 rounded w-3/4 mx-auto"></div>
        </div>
      ) : (
        <p className="text-5xl font-bold my-2">{count}</p>
      )}
      <p className="text-sm opacity-80">{description}</p>
    </div>
  );
};

const DashboardPage = () => {
  const { stats, loading, error, refreshStats } = useDashboard();

  return (
    <div className="min-h-screen bg-slate-900 text-white p-4 sm:p-8">
      <header className="mb-10">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl sm:text-4xl font-bold text-sky-300">Email Operations Dashboard</h1>
          <button
            onClick={refreshStats}
            disabled={loading}
            className="px-4 py-2.5 bg-sky-600 hover:bg-sky-700 text-white font-medium rounded-lg shadow-md focus:outline-none focus:ring-2 focus:ring-sky-500 focus:ring-offset-2 focus:ring-offset-slate-900 transition-colors duration-150 flex items-center disabled:opacity-70 disabled:cursor-wait"
          >
            <ArrowPathIcon className={`h-5 w-5 mr-2 ${loading ? 'animate-spin' : ''}`} />
            {loading ? 'Refreshing...' : 'Refresh'}
          </button>
        </div>
      </header>

      {error && (
        <div className="mb-6 p-4 text-center bg-red-800/50 border border-red-700 text-red-300 rounded-lg">
          <p>{error} Please try refreshing.</p>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <StatCard
          title="Pending"
          count={stats.pending}
          bgColor="bg-yellow-500/20 backdrop-blur-md border border-yellow-500/30"
          textColor="text-yellow-300"
          description="Emails awaiting processing."
          isLoading={loading && stats.pending === 'N/A'}
        />
        <StatCard
          title="Success"
          count={stats.success}
          bgColor="bg-green-500/20 backdrop-blur-md border border-green-500/30"
          textColor="text-green-300"
          description="Emails successfully sent."
          isLoading={loading && stats.success === 'N/A'}
        />
        <StatCard
          title="Failed"
          count={stats.failed}
          bgColor="bg-red-500/20 backdrop-blur-md border border-red-500/30"
          textColor="text-red-300"
          description="Emails that failed to send."
          isLoading={loading && stats.failed === 'N/A'}
        />
      </div>
    </div>
  );
};
export default DashboardPage;
