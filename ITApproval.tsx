
import React, { useState } from 'react';
import { 
  CheckBadgeIcon, 
  CalendarIcon, 
  ExclamationTriangleIcon,
  BeakerIcon,
  ShieldCheckIcon,
  InformationCircleIcon,
  UserCircleIcon
} from '@heroicons/react/24/outline';
import { ChangeRequest, CRStatus, ITApproval, User, UserRole } from './types';

interface ITApprovalProps {
  crs: ChangeRequest[];
  onApprove: (crId: string, approval: ITApproval) => void;
  currentUser: User;
  allUsers: User[];
}

const ITApprovalPortal: React.FC<ITApprovalProps> = ({ crs, onApprove, currentUser, allUsers }) => {
  const pendingCrs = crs.filter(cr => cr.status === CRStatus.RISK_REVIEWED || cr.status === CRStatus.AWAITING_IT_APPROVAL);
  const [selectedCr, setSelectedCr] = useState<ChangeRequest | null>(null);
  const [approvalData, setApprovalData] = useState({
    comments: '',
    deploymentEngineerId: '',
    plannedDate: ''
  });

  const engineers = allUsers.filter(u => u.roles.includes(UserRole.DEPLOYMENT_ENGINEER));

  const getTesterName = (id: string) => {
    return allUsers.find(u => u.id === id)?.name || `ID: ${id}`;
  };

  const handleAction = (approved: boolean) => {
    if (!selectedCr) return;
    onApprove(selectedCr.id, {
      approved,
      comments: approvalData.comments,
      approvedBy: currentUser.name,
      deploymentEngineerId: approvalData.deploymentEngineerId,
      plannedDeploymentDate: approvalData.plannedDate,
      timestamp: new Date().toISOString()
    });
    setSelectedCr(null);
    setApprovalData({ comments: '', deploymentEngineerId: '', plannedDate: '' });
  };

  return (
    <div className="space-y-6 text-black">
      <header>
        <h2 className="text-3xl font-bold">Head of IT Approval</h2>
        <p className="text-black/60 font-medium italic">Executive oversight and production authorization.</p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        <div className="lg:col-span-1 space-y-4">
           <h3 className="text-[10px] font-black text-black/40 uppercase tracking-[0.2em] ml-1">Validated Change Queue</h3>
           <div className="space-y-3">
             {pendingCrs.map(cr => (
               <div 
                key={cr.id}
                onClick={() => setSelectedCr(cr)}
                className={`p-5 rounded-2xl border cursor-pointer transition-all ${
                  selectedCr?.id === cr.id 
                    ? 'border-brand-orange bg-white shadow-xl shadow-orange-900/5 ring-1 ring-brand-orange' 
                    : 'bg-white border-slate-200 hover:border-brand-orange/50'
                }`}
               >
                 <div className="flex justify-between items-start mb-2">
                   <h4 className="font-black text-black text-sm">{cr.id}</h4>
                   <span className="text-[9px] font-black text-brand-orange bg-orange-50 px-2 py-0.5 rounded-full border border-orange-100 uppercase">Risk Passed</span>
                 </div>
                 <p className="text-xs text-black/70 font-bold line-clamp-2 leading-relaxed">{cr.title}</p>
                 <div className="mt-4 pt-3 border-t border-slate-50 flex items-center justify-between">
                    <span className="text-[9px] text-black/30 font-bold uppercase">{cr.vendorName} {cr.versionNumber}</span>
                    <div className="w-1.5 h-1.5 rounded-full bg-brand-orange animate-pulse"></div>
                 </div>
               </div>
             ))}
             {pendingCrs.length === 0 && (
               <div className="text-center py-12 px-4 bg-white rounded-3xl border border-dashed border-slate-200">
                 <p className="text-xs font-bold text-black/30 uppercase tracking-widest leading-loose">No changes awaiting<br/>executive sign-off</p>
               </div>
             )}
           </div>
        </div>

        <div className="lg:col-span-3">
          {selectedCr ? (
            <div className="space-y-6 animate-fadeIn pb-20">
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white p-6 rounded-3xl border border-orange-100 shadow-sm">
                  <h4 className="text-xs font-black uppercase tracking-widest text-black/40 mb-4 flex items-center gap-2">
                    <BeakerIcon className="w-4 h-4 text-brand-orange" /> Technical Testing Insights
                  </h4>
                  <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
                    {selectedCr.features.map(f => (
                      <div key={f.id} className="p-4 bg-orange-50/30 rounded-2xl border border-orange-100/50">
                        <div className="flex justify-between items-start">
                          <p className="text-xs font-black text-black">{f.name}</p>
                          <span className={`text-[9px] font-black px-2 py-0.5 rounded-full ${f.testResult === 'Pass' ? 'bg-emerald-100 text-emerald-700 border border-emerald-200' : 'bg-red-100 text-red-700 border border-red-200'}`}>
                            {f.testResult?.toUpperCase()}
                          </span>
                        </div>
                        <p className="text-[11px] text-black/60 mt-2 italic leading-relaxed">
                          "{f.testObservations || 'No technical observations recorded.'}"
                        </p>
                        <div className="mt-3 flex items-center gap-2 pt-2 border-t border-orange-100/30">
                           <UserCircleIcon className="w-3 h-3 text-brand-orange" />
                           <span className="text-[9px] text-black/40 font-bold uppercase">Certified By: {getTesterName(f.assignedTesterId)}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-emerald-50/30 p-6 rounded-3xl border border-emerald-100 shadow-sm">
                  <h4 className="text-xs font-black uppercase tracking-widest text-black/40 mb-4 flex items-center gap-2">
                    <ShieldCheckIcon className="w-4 h-4 text-emerald-600" /> Compliance & Risk Validation
                  </h4>
                  <div className="space-y-4">
                    <div className="flex gap-3">
                      <div className="flex-1 bg-white p-3 rounded-xl border border-emerald-100 shadow-sm">
                        <p className="text-[9px] font-black text-black/30 uppercase">Operational</p>
                        <p className="text-xs font-bold text-black">{selectedCr.riskAssessment?.operationalRisk || 'N/A'}</p>
                      </div>
                      <div className="flex-1 bg-white p-3 rounded-xl border border-emerald-100 shadow-sm">
                        <p className="text-[9px] font-black text-black/30 uppercase">Compliance</p>
                        <p className="text-xs font-bold text-black">{selectedCr.riskAssessment?.complianceRisk || 'N/A'}</p>
                      </div>
                    </div>
                    <div className="bg-white p-5 rounded-2xl border border-emerald-100 shadow-sm">
                      <p className="text-[10px] font-black text-emerald-600 uppercase mb-2">Risk Team Comments</p>
                      <p className="text-xs font-medium text-black leading-relaxed italic">
                        "{selectedCr.riskAssessment?.comments || 'No specific risk commentary provided.'}"
                      </p>
                      <div className="mt-4 pt-4 border-t border-emerald-50 flex items-center justify-between">
                         <span className="text-[9px] text-black/30 font-bold uppercase">Validator: {selectedCr.riskAssessment?.assessedBy}</span>
                         <span className="text-[9px] font-black text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-100">
                           {selectedCr.riskAssessment?.decision?.toUpperCase()}ED
                         </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-xl space-y-8">
                <div className="flex items-center gap-3 border-b border-slate-50 pb-6">
                   <div className="p-2 bg-brand-orange text-white rounded-lg">
                      <InformationCircleIcon className="w-6 h-6" />
                   </div>
                   <div>
                      <h4 className="text-sm font-black text-black uppercase tracking-tight">Executive Authorization Portal</h4>
                      <p className="text-[11px] text-black/40 font-medium">Verify deployment parameters below to finalize.</p>
                   </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                   <div className="space-y-6">
                      <div className="space-y-2">
                        <label className="text-[10px] font-black text-black/50 uppercase tracking-[0.2em] ml-1">Authorized Deployment Engineer</label>
                        <select 
                          required
                          className="w-full border-2 border-slate-100 p-4 rounded-2xl outline-none focus:ring-4 focus:ring-brand-orange/5 focus:border-brand-orange text-sm font-bold text-black transition-all bg-slate-50/50"
                          value={approvalData.deploymentEngineerId}
                          onChange={e => setApprovalData({...approvalData, deploymentEngineerId: e.target.value})}
                        >
                          <option value="">Select Official Personnel...</option>
                          {engineers.map(u => (
                            <option key={u.id} value={u.id}>{u.name} ({u.unit})</option>
                          ))}
                        </select>
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-black text-black/50 uppercase tracking-[0.2em] ml-1">Planned Production Window</label>
                        <div className="relative">
                          <CalendarIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-black/20" />
                          <input 
                            type="datetime-local"
                            className="w-full border-2 border-slate-100 p-4 pl-12 rounded-2xl outline-none focus:ring-4 focus:ring-brand-orange/5 focus:border-brand-orange text-sm font-bold text-black transition-all bg-slate-50/50"
                            value={approvalData.plannedDate}
                            onChange={e => setApprovalData({...approvalData, plannedDate: e.target.value})}
                          />
                        </div>
                      </div>
                   </div>

                   <div className="space-y-2">
                      <label className="text-[10px] font-black text-black/50 uppercase tracking-[0.2em] ml-1">Executive Sign-off Comments</label>
                      <textarea 
                         className="w-full border-2 border-slate-100 rounded-3xl p-5 min-h-[160px] outline-none focus:ring-4 focus:ring-brand-orange/5 focus:border-brand-orange text-black text-sm font-medium transition-all bg-slate-50/50"
                         placeholder="Enter executive directions, constraints, or final rationale..."
                         value={approvalData.comments}
                         onChange={e => setApprovalData({...approvalData, comments: e.target.value})}
                      />
                   </div>
                </div>

                <div className="flex gap-4">
                  <button 
                    onClick={() => handleAction(false)}
                    className="flex-1 border-2 border-red-100 text-red-600 font-black py-5 rounded-3xl hover:bg-red-50 flex items-center justify-center gap-3 transition-all uppercase text-[10px] tracking-[0.2em]"
                  >
                    <ExclamationTriangleIcon className="w-5 h-5" /> Reject Update
                  </button>
                  <button 
                    onClick={() => handleAction(true)}
                    disabled={!approvalData.deploymentEngineerId}
                    className="flex-[2] bg-brand-orange text-white font-black py-5 rounded-3xl hover:bg-orange-600 shadow-2xl shadow-orange-900/20 flex items-center justify-center gap-3 transition-all uppercase text-[10px] tracking-[0.2em] disabled:opacity-30 disabled:grayscale disabled:cursor-not-allowed"
                  >
                    <CheckBadgeIcon className="w-5 h-5" /> Authorize Production Release
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="h-[600px] flex flex-col items-center justify-center text-black/20 bg-white border border-slate-200 border-dashed rounded-[3rem] p-12 text-center">
              <div className="w-24 h-24 bg-slate-50 rounded-full flex items-center justify-center mb-6">
                <CheckBadgeIcon className="w-12 h-12 text-black/10" />
              </div>
              <p className="font-black uppercase tracking-[0.3em] text-xs">Awaiting Selection</p>
              <p className="text-[10px] font-medium text-black/30 mt-2 max-w-xs">Select a change request from the queue to review testing evidence and risk metrics for authorization.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ITApprovalPortal;
