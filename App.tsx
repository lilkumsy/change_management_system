
import React, { useState, useEffect } from 'react';
import Layout from './components/Layout';
import Login from './components/Login';
import CRDashboard from './components/CRDashboard';
import CRCreate from './components/CRCreate';
import TesterInterface from './components/TesterInterface';
import RiskReview from './components/RiskReview';
import ITApprovalPortal from './components/ITApproval';
import DeploymentPortal from './components/DeploymentPortal';
import UserManagement from './components/UserManagement';
import HelpFAQ from './components/HelpFAQ';
import ReportsPortal from './components/ReportsPortal';
import {
  ChangeRequest,
  User,
  CRStatus,
  UserRole,
  RiskAssessment,
  ITApproval,
  ChangeFeature,
  AppNotification
} from './types';
import { MOCK_USERS, MOCK_CR_DATA } from './constants';
import { draftNotificationEmail } from './services/geminiService';
import { EmailService } from './services/emailService';

const App: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [activeView, setActiveView] = useState('dashboard');
  const [users, setUsers] = useState<User[]>(() => {
    const saved = localStorage.getItem('nor_cms_users');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        localStorage.removeItem('nor_cms_users');
      }
    }
    return MOCK_USERS;
  });
  const [crs, setCrs] = useState<ChangeRequest[]>(() => {
    const saved = localStorage.getItem('nor_cms_crs');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        localStorage.removeItem('nor_cms_crs');
      }
    }
    return MOCK_CR_DATA as any;
  });
  const [notifications, setNotifications] = useState<AppNotification[]>(() => {
    const saved = localStorage.getItem('nor_cms_notifications');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        localStorage.removeItem('nor_cms_notifications');
      }
    }
    return [];
  });
  const [editingCR, setEditingCR] = useState<ChangeRequest | null>(null);

  useEffect(() => {
    const savedUser = localStorage.getItem('nor_cms_user');
    if (savedUser) {
      try {
        const user = JSON.parse(savedUser);
        setCurrentUser(user);
        setIsAuthenticated(true);
      } catch (e) {
        localStorage.removeItem('nor_cms_user');
      }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('nor_cms_users', JSON.stringify(users));
  }, [users]);

  useEffect(() => {
    localStorage.setItem('nor_cms_crs', JSON.stringify(crs));
  }, [crs]);

  useEffect(() => {
    localStorage.setItem('nor_cms_notifications', JSON.stringify(notifications));
  }, [notifications]);

  const handleLogin = (user: User) => {
    setCurrentUser(user);
    setIsAuthenticated(true);
    localStorage.setItem('nor_cms_user', JSON.stringify(user));
  };

  const handleRegister = (user: User) => {
    setUsers([...users, user]);
    handleLogin(user);
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setCurrentUser(null);
    localStorage.removeItem('nor_cms_user');
    setActiveView('dashboard');
  };

  const addAuditLog = (crId: string, action: string, details: string) => {
    if (!currentUser) return;
    setCrs(prev => prev.map(cr => {
      if (cr.id === crId) {
        return {
          ...cr,
          auditLogs: [
            { id: `audit-${Date.now()}`, action, user: currentUser.name, timestamp: new Date().toISOString(), details },
            ...(cr.auditLogs || [])
          ]
        };
      }
      return cr;
    }));
  };

  const addInAppNotification = (userId: string, title: string, message: string, type: AppNotification['type']) => {
    const newNotif: AppNotification = {
      id: `notif-${Date.now()}-${Math.random()}`,
      userId,
      title,
      message,
      timestamp: new Date().toISOString(),
      read: false,
      type
    };
    setNotifications(prev => [newNotif, ...prev]);
  };

  const handleLifecycleNotification = async (crId: string, targetRole: UserRole | string, title: string, message: string, type: AppNotification['type']) => {
    const targets = users.filter(u => u.roles.includes(targetRole as any) || u.id === targetRole);
    const associatedCR = crs.find(c => c.id === crId);
    const crTitle = associatedCR ? associatedCR.title : 'System Request';

    for (const target of targets) {
      addInAppNotification(target.id, title, message, type);

      try {
        const body = `
          <div style="font-family: sans-serif; color: #333; max-width: 600px; border: 1px solid #eee; border-radius: 20px; overflow: hidden;">
            <div style="background: #7a1d00; padding: 30px; text-align: center; color: white;">
              <h1 style="margin: 0; font-size: 20px; letter-spacing: 2px;">NORRENPENSIONS</h1>
              <p style="margin: 5px 0 0; font-size: 10px; opacity: 0.6; text-transform: uppercase;">Governance Alert Hub</p>
            </div>
            <div style="padding: 40px;">
              <h2 style="font-size: 18px; color: #000;">${title}</h2>
              <p style="line-height: 1.6; font-size: 14px;">Dear ${target.name},</p>
              <p style="line-height: 1.6; font-size: 14px;">This is an automated notification from the Norrenpensions Change Management System regarding Change Request: <strong>${crId} - ${crTitle}</strong>.</p>
              <div style="background: #fdf2f0; padding: 20px; border-radius: 12px; border-left: 4px solid #f53900; margin: 25px 0;">
                <p style="margin: 0; font-size: 13px; font-weight: bold;">${message}</p>
              </div>
              <p style="font-size: 14px; margin-top: 30px;">
                <a href="http://192.168.110.207:3000/" style="display: inline-block; padding: 12px 24px; background-color: #f53900; color: white; text-decoration: none; border-radius: 6px; font-weight: bold; letter-spacing: 0.5px;">Log in to Portal to Act</a>
              </p>
              <p style="font-size: 12px; color: #999; margin-top: 15px;">Please log in to the portal via the link above to review the request details and perform your part within the change management process.</p>
            </div>
            <div style="background: #f9f9f9; padding: 20px; text-align: center; font-size: 10px; color: #bbb;">
              &copy; 2025 Norrenpensions ICT. Internal Audit Evidence.
            </div>
          </div>
        `;
        await EmailService.sendEmail(target.email, `${title} [${crId}]`, body);
        console.log(`[Notification] Email dispatched to ${target.email}`);
      } catch (err) {
        console.error(`[Notification] Email failure for ${target.email}:`, err);
      }
    }
  };

  const handleCreateCR = async (newCR: ChangeRequest) => {
    const crWithCreatorId = { ...newCR, creatorId: currentUser?.id };
    setCrs([crWithCreatorId, ...crs]);
    setActiveView('dashboard');
    addAuditLog(newCR.id, 'CR Initiation', 'Official governance request recorded.');

    for (const feature of newCR.features) {
      const tester = users.find(u => u.id === feature.assignedTesterId);
      if (tester) {
        const draft = await draftNotificationEmail(tester.name, newCR.id, feature.name);
        handleLifecycleNotification(tester.id, tester.id, draft.subject, `New Assignment: ${feature.name}. Please conduct UAT and certify outcomes.`, 'assignment');
      }
    }
  };

  const handleUpdateCR = (updatedCR: ChangeRequest) => {
    setCrs(prev => prev.map(c => c.id === updatedCR.id ? updatedCR : c));
    addAuditLog(updatedCR.id, 'CR Updated', 'Initiator refined parameters.');
    setEditingCR(null);
    setActiveView('dashboard');
  };

  const handleDeleteCR = (id: string) => setCrs(prev => prev.filter(c => c.id !== id));

  const handleEditCR = (cr: ChangeRequest) => {
    setEditingCR(cr);
    setActiveView('create-cr');
  };

  const handleUpdateFeature = (crId: string, featureId: string, updates: Partial<ChangeFeature>) => {
    setCrs(prev => prev.map(cr => {
      if (cr.id === crId) {
        const newFeatures = cr.features.map(f => f.id === featureId ? { ...f, ...updates } : f);
        const allTested = newFeatures.every(f => f.status === 'Tested');
        const nextStatus = allTested ? CRStatus.TESTING_COMPLETED : cr.status;

        if (allTested && cr.status !== CRStatus.TESTING_COMPLETED) {
          handleLifecycleNotification(cr.id, UserRole.RISK_TEAM, 'Testing Completed: Ready for Risk Review', 'All features have been tested and certified. Risk Team evaluation is now required.', 'approval');
        }

        return { ...cr, features: newFeatures, status: nextStatus };
      }
      return cr;
    }));
  };

  const handleAssessRisk = (crId: string, assessment: RiskAssessment) => {
    setCrs(prev => prev.map(cr => {
      if (cr.id === crId) {
        handleLifecycleNotification(crId, UserRole.HEAD_OF_IT, 'Risk Certified: Ready for IT Approval', `Risk Team has ${assessment.decision}ed the change. Final executive authorization required.`, 'approval');
        return { ...cr, riskAssessment: assessment, status: CRStatus.RISK_REVIEWED };
      }
      return cr;
    }));
    addAuditLog(crId, 'Risk Certified', `Outcome: ${assessment.decision}`);
  };

  const handleApproveIT = (crId: string, approval: ITApproval) => {
    setCrs(prev => prev.map(cr => {
      if (cr.id === crId) {
        if (approval.approved && approval.deploymentEngineerId) {
          handleLifecycleNotification(crId, approval.deploymentEngineerId, 'Action Required: Production Release', 'Head of IT has authorized deployment. Proceed with production migration.', 'deployment');
        }
        return { ...cr, itApproval: approval, status: approval.approved ? CRStatus.APPROVED_FOR_DEPLOYMENT : CRStatus.INITIATED };
      }
      return cr;
    }));
    addAuditLog(crId, 'Executive Approval', approval.approved ? 'Authorized for Production' : 'Rejected');
  };

  const handleDeploy = (crId: string, success: boolean) => {
    const newStatus = success ? CRStatus.DEPLOYED : CRStatus.DEPLOYMENT_FAILED;
    setCrs(prev => prev.map(cr => {
      if (cr.id === crId) {
        if (cr.creatorId) {
          handleLifecycleNotification(cr.id, cr.creatorId, `Production ${success ? 'Successful' : 'Failed'}`, `Deployment execution for ${cr.id} is complete. You can now download the Audit Certificate.`, success ? 'deployment' : 'alert');
        }
        return {
          ...cr,
          status: newStatus,
          deployedBy: currentUser?.name,
          deployedAt: new Date().toISOString()
        };
      }
      return cr;
    }));
    addAuditLog(crId, 'Production Execution', success ? 'Migration Successful' : 'Migration Failed - Incident Logged');
  };

  const handleAddUser = (user: User) => setUsers([...users, user]);
  const handleUpdateUser = (updatedUser: User) => {
    setUsers(users.map(u => u.id === updatedUser.id ? updatedUser : u));
    if (currentUser?.id === updatedUser.id) {
      setCurrentUser(updatedUser);
      localStorage.setItem('nor_cms_user', JSON.stringify(updatedUser));
    }
  };
  const handleDeleteUser = (id: string) => setUsers(users.filter(u => u.id !== id));

  if (!isAuthenticated || !currentUser) return <Login onLogin={handleLogin} onRegister={handleRegister} allUsers={users} onUpdateUser={handleUpdateUser} />;

  return (
    <Layout
      currentUser={currentUser}
      onLogout={handleLogout}
      onNavigate={setActiveView}
      activeView={activeView}
      notifications={notifications}
      onMarkNotificationRead={(id) => setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n))}
    >
      {activeView === 'dashboard' && <CRDashboard crs={crs} onSelectCR={() => { }} onEditCR={handleEditCR} onDeleteCR={handleDeleteCR} currentUser={currentUser} allUsers={users} />}
      {activeView === 'create-cr' && <CRCreate currentUser={currentUser} onCreate={handleCreateCR} onUpdate={handleUpdateCR} onCancel={() => setActiveView('dashboard')} allUsers={users} editingCR={editingCR} />}
      {activeView === 'tester-view' && <TesterInterface crs={crs} currentUser={currentUser} onUpdateFeature={handleUpdateFeature} />}
      {activeView === 'risk-view' && <RiskReview crs={crs} currentUser={currentUser} onAssessRisk={handleAssessRisk} />}
      {activeView === 'it-approval' && <ITApprovalPortal crs={crs} currentUser={currentUser} onApprove={handleApproveIT} allUsers={users} />}
      {activeView === 'deployment' && <DeploymentPortal crs={crs} currentUser={currentUser} onDeploy={handleDeploy} />}
      {activeView === 'reports' && <ReportsPortal crs={crs} allUsers={users} currentUser={currentUser} />}
      {activeView === 'user-management' && <UserManagement users={users} currentUser={currentUser} onAddUser={handleAddUser} onUpdateUser={handleUpdateUser} onDeleteUser={handleDeleteUser} />}
      {activeView === 'help-faq' && <HelpFAQ />}
    </Layout>
  );
};

export default App;
