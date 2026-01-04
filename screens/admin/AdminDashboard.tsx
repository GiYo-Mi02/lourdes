import React, { useEffect, useState } from 'react';
import { Button } from '../../components/Button';
import { PatientRecord } from '../../types';
import { getPatientRecords, clearRecords, updatePatientStatus, getAssistanceRequests, resolveAssistanceRequest, AssistanceRequest } from '../../services/patientService';
import { handleError } from '../../services/errorService';
import { AdminAnalytics } from './AdminAnalytics';
import { AdminSettings } from './AdminSettings';
import { AdminPinGuard } from '../../components/AdminPinGuard';

interface Props {
  onExit: () => void;
}

type AdminView = 'patients' | 'analytics' | 'settings';

export const AdminDashboard: React.FC<Props> = ({ onExit }) => {
  const [currentView, setCurrentView] = useState<AdminView>('patients');
  
  // Patient List State
  const [patients, setPatients] = useState<PatientRecord[]>([]);
  const [selectedPatient, setSelectedPatient] = useState<PatientRecord | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('All');
  const [lastRefreshed, setLastRefreshed] = useState(new Date());
  const [loading, setLoading] = useState(false);
  const [updatingStatus, setUpdatingStatus] = useState(false);

  // Assistance Requests State
  const [assistanceRequests, setAssistanceRequests] = useState<AssistanceRequest[]>([]);
  const [showAssistancePanel, setShowAssistancePanel] = useState(false);

  const loadData = async () => {
    setLoading(true);
    try {
        const [patientData, assistanceData] = await Promise.all([
          getPatientRecords(),
          getAssistanceRequests()
        ]);
        setPatients(patientData);
        setAssistanceRequests(assistanceData);
        setLastRefreshed(new Date());
    } catch (e) {
        handleError("Failed to load patient records", e);
    } finally {
        setLoading(false);
    }
  };

  const handleResolveAssistance = async (id: string) => {
    try {
      await resolveAssistanceRequest(id);
      setAssistanceRequests(prev => prev.map(r => 
        r.id === id ? { ...r, status: 'resolved' as const } : r
      ));
    } catch (e) {
      handleError("Failed to resolve assistance request", e);
    }
  };

  const pendingAssistance = assistanceRequests.filter(r => r.status === 'pending');

  useEffect(() => {
    loadData();
    
    // Use polling-based updates (5 seconds) since real-time replication is in alpha
    // This provides automatic updates without requiring Supabase real-time features
    const interval = setInterval(loadData, 5000); // Refresh every 5 seconds
    
    return () => clearInterval(interval);
  }, []);

  const handleClearData = async () => {
    if(window.confirm("Are you sure you want to clear all patient records? This cannot be undone.")) {
        try {
            await clearRecords();
            setPatients([]);
            setSelectedPatient(null);
        } catch (e) {
            handleError("Failed to clear data", e);
        }
    }
  };

  const handleStatusUpdate = async (newStatus: PatientRecord['status']) => {
      if (!selectedPatient) return;
      setUpdatingStatus(true);
      try {
          await updatePatientStatus(selectedPatient.id, newStatus);
          
          // Update local state immediately
          setSelectedPatient({...selectedPatient, status: newStatus});
          setPatients(prev => prev.map(p => p.id === selectedPatient.id ? {...p, status: newStatus} : p));
          
      } catch (e) {
          handleError("Failed to update status", e);
      } finally {
          setUpdatingStatus(false);
      }
  };

  const filteredPatients = patients.filter(p => {
      const matchesSearch = 
        p.firstName.toLowerCase().includes(searchTerm.toLowerCase()) || 
        p.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.id.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesStatus = statusFilter === 'All' || p.status === statusFilter;
      
      return matchesSearch && matchesStatus;
  });

  // Stats calculation
  const stats = {
      total: patients.length,
      waiting: patients.filter(p => p.status === 'Waiting').length,
      completed: patients.filter(p => p.status === 'Completed').length,
      attention: patients.filter(p => p.status === 'Assistance Needed').length
  };

  const NavItem = ({ view, icon, label }: { view: AdminView, icon: string, label: string }) => (
      <div 
        onClick={() => setCurrentView(view)}
        className={`flex items-center gap-3 px-4 py-3 rounded-lg font-medium cursor-pointer transition-colors ${
            currentView === view 
            ? 'bg-blue-800 text-white border border-blue-700 shadow-sm' 
            : 'text-blue-300 hover:bg-blue-900 hover:text-white'
        }`}
      >
        <i className={`fas ${icon} w-5`}></i> {label}
      </div>
  );

  return (
    <AdminPinGuard>
      <div className="flex h-screen bg-gray-100 font-sans text-gray-800 animate-fade-in">
      
      {/* Sidebar */}
      <div className="w-64 bg-medical-dark text-white flex flex-col shadow-xl z-20">
        <div className="p-6 border-b border-blue-800 flex items-center gap-3">
            <div className="w-8 h-8 bg-blue-500 rounded flex items-center justify-center shadow-lg">
                <i className="fas fa-hospital-alt text-white"></i>
            </div>
            <div>
                <h1 className="font-bold text-lg leading-tight">Vitalis Admin</h1>
                <p className="text-xs text-blue-300">Staff Portal</p>
            </div>
        </div>
        
        <nav className="flex-1 p-4 space-y-2">
            <NavItem view="patients" icon="fa-users" label="Patients" />
            <NavItem view="analytics" icon="fa-chart-line" label="Analytics" />
            <NavItem view="settings" icon="fa-cog" label="Settings" />
            
            {/* Assistance Alert Button */}
            {pendingAssistance.length > 0 && (
              <button
                onClick={() => setShowAssistancePanel(!showAssistancePanel)}
                className="w-full mt-4 p-3 bg-red-500 hover:bg-red-600 text-white rounded-lg flex items-center justify-between animate-pulse"
              >
                <span className="flex items-center gap-2">
                  <i className="fas fa-bell"></i>
                  <span className="font-semibold">Help Needed</span>
                </span>
                <span className="bg-white text-red-600 px-2 py-0.5 rounded-full text-sm font-bold">
                  {pendingAssistance.length}
                </span>
              </button>
            )}
        </nav>

        <div className="p-4 border-t border-blue-800 bg-blue-900/50">
             <Button variant="outline" fullWidth onClick={onExit} className="border-blue-400 text-blue-100 hover:bg-blue-800 hover:border-blue-300 hover:text-white transition-all">
                <i className="fas fa-sign-out-alt mr-2"></i> Exit Kiosk Mode
             </Button>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col overflow-hidden relative">
        
        {/* Assistance Alert Panel (Overlay) */}
        {showAssistancePanel && pendingAssistance.length > 0 && (
          <div className="absolute inset-0 bg-black/50 z-30 flex items-start justify-center pt-20">
            <div className="bg-white rounded-xl shadow-2xl max-w-lg w-full mx-4 overflow-hidden animate-fade-in">
              <div className="bg-red-500 text-white p-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <i className="fas fa-bell text-2xl"></i>
                  <div>
                    <h3 className="font-bold text-lg">Assistance Requests</h3>
                    <p className="text-sm opacity-90">{pendingAssistance.length} kiosk(s) need help</p>
                  </div>
                </div>
                <button 
                  onClick={() => setShowAssistancePanel(false)}
                  className="w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center"
                >
                  <i className="fas fa-times"></i>
                </button>
              </div>
              <div className="max-h-96 overflow-y-auto">
                {pendingAssistance.map(req => (
                  <div key={req.id} className="p-4 border-b border-gray-100 flex items-center justify-between hover:bg-gray-50">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <i className="fas fa-map-marker-alt text-red-500"></i>
                        <span className="font-bold text-gray-800">{req.kioskId}</span>
                      </div>
                      <p className="text-sm text-gray-500">
                        Requested {new Date(req.timestamp).toLocaleTimeString()}
                      </p>
                    </div>
                    <button
                      onClick={() => handleResolveAssistance(req.id)}
                      className="px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg font-medium text-sm flex items-center gap-2"
                    >
                      <i className="fas fa-check"></i> Resolved
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
        
        {/* Render Views */}
        {currentView === 'analytics' && <AdminAnalytics />}
        {currentView === 'settings' && <AdminSettings />}

        {currentView === 'patients' && (
            <>
                {/* Top Bar */}
                <header className="bg-white shadow-sm p-4 z-10 border-b border-gray-200">
                    <div className="flex justify-between items-center mb-4">
                        <div>
                            <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
                                Patient Intake Queue
                                <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-blue-100 text-blue-700 text-xs font-medium rounded-full">
                                    <i className="fas fa-sync-alt text-[6px] animate-spin"></i> Auto-refresh
                                </span>
                            </h2>
                            <p className="text-xs text-gray-400 mt-1">
                                Last updated: {lastRefreshed.toLocaleTimeString()} • Updates every 5 seconds
                                {loading && <span className="ml-2 text-medical-blue"><i className="fas fa-spinner fa-spin"></i></span>}
                            </p>
                        </div>
                        <div className="flex items-center gap-3">
                            <div className="relative">
                                <i className="fas fa-search absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"></i>
                                <input 
                                    type="text" 
                                    placeholder="Search name or ID..." 
                                    className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-medical-blue focus:outline-none w-64 shadow-sm"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />
                            </div>
                            
                            <select 
                                className="py-2 px-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-medical-blue focus:outline-none shadow-sm text-sm"
                                value={statusFilter}
                                onChange={(e) => setStatusFilter(e.target.value)}
                            >
                                <option value="All">All Statuses</option>
                                <option value="Waiting">Waiting</option>
                                <option value="In Progress">In Progress</option>
                                <option value="Completed">Completed</option>
                                <option value="Assistance Needed">Assistance Needed</option>
                            </select>

                            <div className="h-8 w-px bg-gray-300 mx-2"></div>
                            <Button size="sm" variant="outline" onClick={loadData} title="Refresh List" disabled={loading}>
                                <i className={`fas fa-sync-alt ${loading ? 'fa-spin' : ''}`}></i>
                            </Button>
                            <button onClick={handleClearData} className="text-red-500 hover:text-red-700 text-sm font-medium px-3 py-2 rounded hover:bg-red-50 transition-colors">
                                Clear
                            </button>
                        </div>
                    </div>

                    {/* Quick Stats */}
                    <div className="grid grid-cols-4 gap-4">
                        <div className="bg-blue-50 border border-blue-100 p-3 rounded-lg flex items-center justify-between">
                            <div>
                                <p className="text-xs text-gray-500 uppercase font-semibold">Total</p>
                                <p className="text-xl font-bold text-medical-blue">{stats.total}</p>
                            </div>
                            <i className="fas fa-users text-blue-200 text-2xl"></i>
                        </div>
                        <div className="bg-yellow-50 border border-yellow-100 p-3 rounded-lg flex items-center justify-between">
                            <div>
                                <p className="text-xs text-gray-500 uppercase font-semibold">Waiting</p>
                                <p className="text-xl font-bold text-yellow-600">{stats.waiting}</p>
                            </div>
                            <i className="fas fa-clock text-yellow-200 text-2xl"></i>
                        </div>
                        <div className="bg-green-50 border border-green-100 p-3 rounded-lg flex items-center justify-between">
                            <div>
                                <p className="text-xs text-gray-500 uppercase font-semibold">Completed</p>
                                <p className="text-xl font-bold text-green-600">{stats.completed}</p>
                            </div>
                            <i className="fas fa-check-circle text-green-200 text-2xl"></i>
                        </div>
                        <div className="bg-red-50 border border-red-100 p-3 rounded-lg flex items-center justify-between">
                            <div>
                                <p className="text-xs text-gray-500 uppercase font-semibold">Needs Help</p>
                                <p className="text-xl font-bold text-red-600">{stats.attention}</p>
                            </div>
                            <i className="fas fa-exclamation-circle text-red-200 text-2xl"></i>
                        </div>
                    </div>
                </header>

                {/* Patient List Content */}
                <div className="flex-1 overflow-hidden flex p-6 gap-6 bg-gray-50">
                    
                    {/* List Table */}
                    <div className="flex-1 bg-white rounded-xl shadow-sm border border-gray-200 flex flex-col overflow-hidden">
                        <div className="overflow-y-auto flex-1 custom-scrollbar">
                            <table className="w-full text-left border-collapse">
                                <thead className="bg-gray-50 sticky top-0 z-10 shadow-sm">
                                    <tr>
                                        <th className="p-4 font-semibold text-gray-600 border-b text-sm uppercase tracking-wider">Patient Name</th>
                                        <th className="p-4 font-semibold text-gray-600 border-b text-sm uppercase tracking-wider">ID</th>
                                        <th className="p-4 font-semibold text-gray-600 border-b text-sm uppercase tracking-wider">Check-In Time</th>
                                        <th className="p-4 font-semibold text-gray-600 border-b text-sm uppercase tracking-wider">Status</th>
                                        <th className="p-4 font-semibold text-gray-600 border-b text-sm uppercase tracking-wider"></th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredPatients.length === 0 ? (
                                        <tr>
                                            <td colSpan={5} className="p-12 text-center text-gray-400">
                                                <div className="flex flex-col items-center">
                                                    <i className="fas fa-inbox text-4xl mb-3 opacity-20"></i>
                                                    <p>{loading ? 'Loading records...' : 'No patient records found matching your filters.'}</p>
                                                </div>
                                            </td>
                                        </tr>
                                    ) : (
                                        filteredPatients.map(patient => (
                                            <tr 
                                                key={patient.id} 
                                                onClick={() => setSelectedPatient(patient)}
                                                className={`border-b hover:bg-blue-50 cursor-pointer transition-colors group ${selectedPatient?.id === patient.id ? 'bg-blue-50 border-l-4 border-l-medical-blue' : 'border-l-4 border-l-transparent'}`}
                                            >
                                                <td className="p-4 font-medium text-gray-900">
                                                    {patient.lastName}, {patient.firstName}
                                                </td>
                                                <td className="p-4 text-gray-500 font-mono text-xs">{patient.id}</td>
                                                <td className="p-4 text-gray-500 text-sm">
                                                    {new Date(patient.checkInTime).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                                                </td>
                                                <td className="p-4">
                                                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium 
                                                        ${patient.status === 'Waiting' ? 'bg-yellow-100 text-yellow-800' : 
                                                        patient.status === 'Completed' ? 'bg-green-100 text-green-800' :
                                                        patient.status === 'Assistance Needed' ? 'bg-red-100 text-red-800' : 
                                                        patient.status === 'In Progress' ? 'bg-blue-100 text-blue-800' :
                                                        'bg-gray-100 text-gray-800'}`}>
                                                        {patient.status}
                                                    </span>
                                                </td>
                                                <td className="p-4 text-gray-400 group-hover:text-medical-blue">
                                                    <i className="fas fa-chevron-right"></i>
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* Patient Detail Panel */}
                    <div className="w-96 bg-white rounded-xl shadow-sm border border-gray-200 overflow-y-auto flex flex-col">
                        {selectedPatient ? (
                            <div className="flex flex-col h-full">
                                <div className="p-6 flex-1 overflow-y-auto custom-scrollbar">
                                    <div className="flex items-start justify-between mb-6">
                                        <div>
                                            <h3 className="text-xl font-bold text-gray-900 leading-tight">{selectedPatient.firstName} {selectedPatient.lastName}</h3>
                                            <p className="text-gray-500 text-sm mt-1">DOB: {selectedPatient.dob}</p>
                                        </div>
                                        <div className={`w-12 h-12 rounded-full flex items-center justify-center text-white shadow-md ${selectedPatient.gender === 'Female' ? 'bg-pink-500' : 'bg-blue-500'}`}>
                                            <i className="fas fa-user text-lg"></i>
                                        </div>
                                    </div>

                                    {/* Status Update Control */}
                                    <div className="mb-6 bg-gray-50 p-4 rounded-lg border border-gray-200">
                                        <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Current Status</label>
                                        <div className="relative">
                                            <select 
                                                className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-medical-blue focus:outline-none bg-white font-medium text-gray-800"
                                                value={selectedPatient.status}
                                                disabled={updatingStatus}
                                                onChange={(e) => handleStatusUpdate(e.target.value as PatientRecord['status'])}
                                            >
                                                <option value="Waiting">Waiting</option>
                                                <option value="In Progress">In Progress</option>
                                                <option value="Completed">Completed</option>
                                                <option value="Assistance Needed">Assistance Needed</option>
                                                <option value="Cancelled">Cancelled</option>
                                            </select>
                                            {updatingStatus && (
                                                <div className="absolute right-8 top-2.5">
                                                    <i className="fas fa-spinner fa-spin text-medical-blue"></i>
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    <div className="space-y-6">
                                        <div className="bg-gray-50 p-4 rounded-lg border border-gray-100">
                                            <h4 className="text-xs font-bold text-gray-500 uppercase mb-3 flex items-center">
                                                <i className="fas fa-address-card mr-2"></i> Contact Details
                                            </h4>
                                            <div className="space-y-2 text-sm text-gray-700">
                                                <p><span className="font-semibold w-16 inline-block">Phone:</span> {selectedPatient.phone}</p>
                                                <p><span className="font-semibold w-16 inline-block">City:</span> {selectedPatient.city}, {selectedPatient.state}</p>
                                                {selectedPatient.guardianName && (
                                                    <p className="mt-2 pt-2 border-t border-gray-200 text-xs text-gray-500">
                                                        Guardian: {selectedPatient.guardianName}
                                                    </p>
                                                )}
                                            </div>
                                        </div>

                                        <div>
                                            <h4 className="text-xs font-bold text-gray-500 uppercase mb-3 flex items-center">
                                                <i className="fas fa-heartbeat mr-2"></i> Vital Signs
                                            </h4>
                                            <div className="grid grid-cols-1 gap-3">
                                                {Object.entries(selectedPatient.vitals).map(([key, vital]) => {
                                                    if(!vital) return null;
                                                    return (
                                                        <div key={key} className="flex justify-between items-center p-3 border rounded-lg hover:border-medical-blue transition-colors bg-white shadow-sm">
                                                            <div className="flex items-center gap-3">
                                                                <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center text-medical-blue">
                                                                    <i className={`fas ${getIconForVital(key)} text-sm`}></i>
                                                                </div>
                                                                <div>
                                                                    <p className="text-xs text-gray-500 capitalize">{key.replace(/([A-Z])/g, ' $1').trim()}</p>
                                                                    <p className="font-bold text-gray-800">{vital.value} <span className="text-xs font-normal text-gray-500">{vital.unit}</span></p>
                                                                </div>
                                                            </div>
                                                            <div className={`w-2 h-2 rounded-full ${vital.status === 'Normal' ? 'bg-green-500' : 'bg-red-500'}`}></div>
                                                        </div>
                                                    )
                                                })}
                                                {Object.keys(selectedPatient.vitals).length === 0 && (
                                                    <p className="text-sm text-gray-400 italic">No vitals collected.</p>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                
                                <div className="p-4 border-t border-gray-100 bg-gray-50">
                                    <Button variant="outline" fullWidth onClick={() => setSelectedPatient(null)}>Close Details</Button>
                                </div>
                            </div>
                        ) : (
                            <div className="h-full flex flex-col items-center justify-center text-gray-400 p-6 text-center">
                                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                                    <i className="fas fa-user-check text-2xl text-gray-300"></i>
                                </div>
                                <p className="text-gray-500 font-medium">No Patient Selected</p>
                                <p className="text-sm mt-2">Select a patient from the list to view detailed vital signs and contact information.</p>
                            </div>
                        )}
                    </div>
                </div>
            </>
        )}
      </div>
    </div>
    </AdminPinGuard>
  );
};

const getIconForVital = (key: string) => {
    if(key.includes('respiratory')) return 'fa-lungs';
    if(key.includes('pulse')) return 'fa-heart';
    if(key.includes('spo2')) return 'fa-fingerprint';
    if(key.includes('bp')) return 'fa-compress-alt';
    if(key.includes('temperature')) return 'fa-thermometer-half';
    return 'fa-activity';
};
