import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function ClientManagementHeader() {
  const navigate = useNavigate();

  return (
    <div className="bg-[#3b4a5a] px-8 py-6 rounded-b-lg mb-8">
      <div className="flex items-center justify-between">
        <button
          className="flex items-center text-white font-semibold hover:underline"
          onClick={() => navigate(-1)}
        >
          <ArrowLeft className="mr-2" /> Back to Securia
        </button>
        <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-xs font-semibold">
          <span className="inline-block w-2 h-2 bg-green-500 rounded-full mr-1"></span>
          Authenticated
        </span>
      </div>
      <h1 className="text-4xl font-bold text-white mt-4">Client Management</h1>
      <p className="text-gray-200 mt-2 text-lg">Comprehensive client tracking system</p>
    </div>
  );
} 