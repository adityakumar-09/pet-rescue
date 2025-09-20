import React, { useState, useEffect } from 'react';
import { AlertCircle, Calendar, Check, X, Loader2 } from 'lucide-react';
import { apiService } from '../../services/api';

// Interface remains the same
interface LostRequest {
  report_id: number;
  report_status: string;
  pet_status: string;
  image?: string;
  pet: {
    id: number;
    name: string;
    pet_type?: string;
    breed?: string;
    age?: number;
    color?: string;
  };
}

const AdminLostRequests: React.FC = () => {
  const [requests, setRequests] = useState<LostRequest[]>([]);
  const [loading, setLoading] = useState(true);
  // actionLoading now holds the report_id of the request being processed
  const [actionLoading, setActionLoading] = useState<number | null>(null);

  useEffect(() => {
    fetchLostRequests();
  }, []);

  const fetchLostRequests = async () => {
    try {
      setLoading(true);
      const response = await apiService.getAdminLostPets();
      // Ensure requests are sorted, maybe by status (Pending first) or report_id
      const sortedRequests = response.lost_pets.sort((a: LostRequest, b: LostRequest) => {
        if (a.report_status === 'Pending' && b.report_status !== 'Pending') return -1;
        if (a.report_status !== 'Pending' && b.report_status === 'Pending') return 1;
        return a.report_id - b.report_id; // Default sort by ID
      });
      setRequests(sortedRequests);
    } catch (error) {
      console.error('Error fetching lost requests:', error);
    } finally {
      setLoading(false);
    }
  };

  // Approval logic now uses report_id for UI feedback instead of pet.id
  // The API still needs petId, which is available via the request object.
  const handleApproval = async (reportId: number, petId: number, action: 'approve' | 'reject') => {
    try {
      setActionLoading(reportId);
      await apiService.adminApproval({
        request_type: 'lost',
        pet_id: petId,
        action: action,
      });
      await fetchLostRequests();
    } catch (error) {
      console.error('Error handling approval:', error);
    } finally {
      setActionLoading(null);
    }
  };

  const handleStatusChange = async (reportId: number, status: 'Resolved' | 'Reunited') => {
    try {
      setActionLoading(reportId);
      await apiService.manageReportStatus(reportId, status);
      await fetchLostRequests();
    } catch (error) {
      console.error('Error updating report status:', error);
    } finally {
      setActionLoading(null);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 border-yellow-300';
      case 'accepted':
        return 'bg-green-100 text-green-800 border-green-300';
      case 'rejected':
        return 'bg-red-100 text-red-800 border-red-300';
      case 'resolved':
        return 'bg-blue-100 text-blue-800 border-blue-300';
      case 'reunited':
        return 'bg-purple-100 text-purple-800 border-purple-300';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center pb-4 border-b border-gray-200">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Lost Pet Requests 🐾</h1>
          <p className="text-gray-600 mt-1">Review and manage reported lost pets.</p>
        </div>
        <div className="bg-red-50 text-red-700 px-4 py-2 rounded-lg font-medium border border-red-300">
          Total Requests: <span className="font-bold">{requests.length}</span>
        </div>
      </div>

      {/* --- */}

      {/* Requests Table */}
      <div className="shadow overflow-hidden border-b border-gray-200 sm:rounded-lg">
        {requests.length > 0 ? (
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Pet Details
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden sm:table-cell"
                >
                  Report ID
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Report Status
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {requests.map((request) => (
                <tr key={request.report_id} className={request.report_status === 'Pending' ? 'bg-yellow-50 hover:bg-yellow-100' : 'hover:bg-gray-50'}>
                  {/* Pet Details */}
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10">
                        {request.image ? (
                          <img
                            className="h-10 w-10 rounded-full object-cover"
                            src={apiService.getImageUrl(request.image)}
                            alt={request.pet.name}
                          />
                        ) : (
                          <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center text-gray-600">
                            <AlertCircle className="w-5 h-5" />
                          </div>
                        )}
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">{request.pet.name}</div>
                        <div className="text-sm text-gray-500">
                          {request.pet.pet_type} • {request.pet.breed}
                        </div>
                        <div className="text-xs text-gray-400">
                          {request.pet.color} | {request.pet.age} yrs
                        </div>
                      </div>
                    </div>
                  </td>

                  {/* Report ID */}
                  <td className="px-6 py-4 whitespace-nowrap hidden sm:table-cell">
                    <span className="text-sm text-gray-500 font-mono">#{request.report_id}</span>
                  </td>

                  {/* Report Status */}
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full border ${getStatusColor(
                        request.report_status
                      )}`}
                    >
                      {request.report_status}
                    </span>
                  </td>

                  {/* Actions */}
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    {request.report_status === 'Pending' && (
                      <div className="flex space-x-2">
                        <button
                          disabled={actionLoading === request.report_id}
                          onClick={() => handleApproval(request.report_id, request.pet.id, 'approve')}
                          className="flex items-center justify-center p-2 text-green-600 border border-green-600 rounded-full hover:bg-green-100 disabled:opacity-50 disabled:cursor-not-allowed transition"
                          title="Accept Request"
                        >
                          {actionLoading === request.report_id ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
                        </button>
                        <button
                          disabled={actionLoading === request.report_id}
                          onClick={() => handleApproval(request.report_id, request.pet.id, 'reject')}
                          className="flex items-center justify-center p-2 text-red-600 border border-red-600 rounded-full hover:bg-red-100 disabled:opacity-50 disabled:cursor-not-allowed transition"
                          title="Reject Request"
                        >
                          {actionLoading === request.report_id ? <Loader2 className="w-4 h-4 animate-spin" /> : <X className="w-4 h-4" />}
                        </button>
                      </div>
                    )}

                    {request.report_status === 'Accepted' && (
                      <div className="flex flex-col space-y-2">
                        <button
                          disabled={actionLoading === request.report_id}
                          onClick={() => handleStatusChange(request.report_id, 'Reunited')}
                          className="flex items-center justify-center px-3 py-1 bg-purple-600 text-white text-xs font-medium rounded-full hover:bg-purple-700 disabled:opacity-50 transition"
                        >
                          {actionLoading === request.report_id ? 'Updating...' : 'Mark Reunited'}
                        </button>
                        <button
                          disabled={actionLoading === request.report_id}
                          onClick={() => handleStatusChange(request.report_id, 'Resolved')}
                          className="flex items-center justify-center px-3 py-1 bg-blue-600 text-white text-xs font-medium rounded-full hover:bg-blue-700 disabled:opacity-50 transition"
                        >
                          {actionLoading === request.report_id ? 'Updating...' : 'Mark Resolved'}
                        </button>
                      </div>
                    )}

                    {(request.report_status === 'Rejected' || request.report_status === 'Resolved' || request.report_status === 'Reunited') && (
                      <span className="text-gray-400 text-xs">No further action</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <div className="text-center py-12 bg-white">
            <AlertCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No lost pet requests</h3>
            <p className="text-gray-600">Lost pet reports will appear here when submitted.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminLostRequests;