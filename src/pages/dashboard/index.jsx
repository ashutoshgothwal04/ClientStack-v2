// import React, { useState, useEffect } from 'react';
// import { useNavigate } from 'react-router-dom';
// import Header from '../../components/ui/Header';
// import Sidebar from '../../components/ui/Sidebar';
// import Breadcrumb from '../../components/ui/Breadcrumb';
// import MetricCard from './components/MetricCard';
// import RevenueChart from './components/RevenueChart';
// import TopClientsCard from './components/TopClientsCard';
// import RecentActivity from './components/RecentActivity';
// import QuickActions from './components/QuickActions';
// import NotificationCenter from './components/NotificationCenter';
// import Icon from '../../components/AppIcon';
// import { toast } from "sonner";

// const Dashboard = () => {
//   const navigate = useNavigate();
//   const [sidebarExpanded, setSidebarExpanded] = useState(false);
//   const [loading, setLoading] = useState(true);
//   const [refreshing, setRefreshing] = useState(false);

//   // Mock data states
//   const [metrics, setMetrics] = useState({
//     monthlyIncome: { value: '$28,450', change: '+12.5%', changeType: 'positive' },
//     activeProjects: { value: '24', change: '+3', changeType: 'positive' },
//     pendingInvoices: { value: '8', change: '-2', changeType: 'positive' },
//     contractsSigned: { value: '15', change: '+5', changeType: 'positive' }
//   });

//   const [notifications, setNotifications] = useState([]);

//   useEffect(() => {
//     // Simulate loading data
//     const loadDashboardData = async () => {
//       setLoading(true);
      
//       // Simulate API call delay
//       await new Promise(resolve => setTimeout(resolve, 1500));
      
//       setLoading(false);
//     };

//     loadDashboardData();
//   }, []);

//   const handleSidebarToggle = () => {
//     setSidebarExpanded(!sidebarExpanded);
//   };

//   const handleRefresh = async () => {
//     setRefreshing(true);
    
//     // Simulate refresh delay
//     await new Promise(resolve => setTimeout(resolve, 1000));
    
//     // Update metrics with new mock data
//     setMetrics(prev => ({
//       ...prev,
//       monthlyIncome: { 
//         value: `$${(28450 + Math.floor(Math.random() * 5000))?.toLocaleString()}`, 
//         change: `+${(12.5 + Math.random() * 5)?.toFixed(1)}%`, 
//         changeType: 'positive' 
//       }
//     }));
    
//     setRefreshing(false);
//   };

//   const handleQuickAction = (actionId) => {
//     console.log(`Quick action triggered: ${actionId}`);
    
//     switch (actionId) {
//       case 'create-project': navigate('/project-management');
//         break;
//       case 'generate-invoice': navigate('/billing-invoices');
//         break;
//       default:
//         break;
//     }
//   };

//   const handleNotificationMarkAsRead = (notificationId) => {
//     setNotifications(prev => 
//       prev?.map(notification => 
//         notification?.id === notificationId 
//           ? { ...notification, read: true }
//           : notification
//       )
//     );
//   };

//   const handleNotificationDismiss = (notificationId) => {
//     setNotifications(prev => 
//       prev?.filter(notification => notification?.id !== notificationId)
//     );
//   };

//   return (
//     <div className="min-h-screen bg-background">
//       <Sidebar isExpanded={sidebarExpanded} onToggle={handleSidebarToggle} />
//       <Header onMenuToggle={handleSidebarToggle} sidebarExpanded={sidebarExpanded} />
//       <main className="lg:ml-60 pt-16">
//         <div className="p-6">
//           {/* Page Header */}
//           <div className="mb-8">
//             <Breadcrumb />
//             <div className="flex items-center justify-between">
//               <div>
//                 <h1 className="text-2xl font-bold text-foreground mb-2">Dashboard</h1>
//                 <p className="text-muted-foreground">
//                   Welcome back! Here's what's happening with your business today.
//                 </p>
//               </div>
              
//               <div className="flex items-center space-x-3">
//                 <button
//                   onClick={handleRefresh}
//                   disabled={refreshing}
//                   className="flex items-center space-x-2 px-4 py-2 text-sm border border-border rounded-lg hover:bg-muted transition-smooth disabled:opacity-50"
//                 >
//                   <Icon 
//                     name="RefreshCw" 
//                     size={16} 
//                     className={refreshing ? 'animate-spin' : ''} 
//                   />
//                   <span>{refreshing ? 'Refreshing...' : 'Refresh'}</span>
//                 </button>
                
//                 <div className="text-sm text-muted-foreground">
//                   Last updated: {new Date()?.toLocaleTimeString()}
//                 </div>
//               </div>
//             </div>
//           </div>

//           {/* Key Metrics Grid */}
//           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
//             <MetricCard
//               title="Monthly Income"
//               value={metrics?.monthlyIncome?.value}
//               change={metrics?.monthlyIncome?.change}
//               changeType={metrics?.monthlyIncome?.changeType}
//               icon="DollarSign"
//               loading={loading}
//             />
            
//             <MetricCard
//               title="Active Projects"
//               value={metrics?.activeProjects?.value}
//               change={metrics?.activeProjects?.change}
//               changeType={metrics?.activeProjects?.changeType}
//               icon="FolderKanban"
//               trend={75}
//               loading={loading}
//             />
            
//             <MetricCard
//               title="Pending Invoices"
//               value={metrics?.pendingInvoices?.value}
//               change={metrics?.pendingInvoices?.change}
//               changeType={metrics?.pendingInvoices?.changeType}
//               icon="Receipt"
//               loading={loading}
//             />
            
//             <MetricCard
//               title="Contracts Signed"
//               value={metrics?.contractsSigned?.value}
//               change={metrics?.contractsSigned?.change}
//               changeType={metrics?.contractsSigned?.changeType}
//               icon="FileCheck"
//               trend={60}
//               loading={loading}
//             />
//           </div>

//           {/* Charts and Analytics */}
//           <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
//             <RevenueChart loading={loading} />
//             <TopClientsCard loading={loading} />
//           </div>

//           {/* Activity and Actions */}
//           <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
//             <div className="lg:col-span-2">
//               <RecentActivity loading={loading} />
//             </div>
//             <div>
//               <QuickActions onActionClick={handleQuickAction} />
//             </div>
//           </div>

//           {/* Notifications */}
//           <div className="mb-8">
//             <NotificationCenter
//               notifications={notifications}
//               onMarkAsRead={handleNotificationMarkAsRead}
//               onDismiss={handleNotificationDismiss}
//             />
//           </div>

//           {/* Footer Stats */}
//           <div className="bg-card border border-border rounded-lg p-6 elevation-2">
//             <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
//               <div className="text-center">
//                 <div className="text-2xl font-bold text-success mb-1">98.5%</div>
//                 <div className="text-sm text-muted-foreground">Client Satisfaction</div>
//               </div>
              
//               <div className="text-center">
//                 <div className="text-2xl font-bold text-primary mb-1">156</div>
//                 <div className="text-sm text-muted-foreground">Total Clients</div>
//               </div>
              
//               <div className="text-center">
//                 <div className="text-2xl font-bold text-accent mb-1">89</div>
//                 <div className="text-sm text-muted-foreground">Completed Projects</div>
//               </div>
              
//               <div className="text-center">
//                 <div className="text-2xl font-bold text-warning mb-1">$2.4M</div>
//                 <div className="text-sm text-muted-foreground">Total Revenue</div>
//               </div>
//             </div>
//           </div>
//         </div>
//       </main>
//     </div>
//   );
// };

// export default Dashboard;































import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import Header from "../../components/ui/Header";
import Sidebar from "../../components/ui/Sidebar";
import Breadcrumb from "../../components/ui/Breadcrumb";
import MetricCard from "./components/MetricCard";
import RevenueChart from "./components/RevenueChart";
import TopClientsCard from "./components/TopClientsCard";
import RecentActivity from "./components/RecentActivity";
import QuickActions from "./components/QuickActions";
import NotificationCenter from "./components/NotificationCenter";
import Icon from "../../components/AppIcon";
import AuthModal from "components/auth/AuthModal";
import { useAuthModal } from "hooks/useAuthModal";
import { useAuth } from "context/AuthContext";

const Dashboard = () => {
  const navigate = useNavigate();

  const { session, setPendingAction } = useAuth();
  const { isOpen, openModal, closeModal } = useAuthModal();

  const [sidebarExpanded, setSidebarExpanded] = useState(false);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  // Mock data
  const [metrics, setMetrics] = useState({
    monthlyIncome: { value: "$28,450", change: "+12.5%", changeType: "positive" },
    activeProjects: { value: "24", change: "+3", changeType: "positive" },
    pendingInvoices: { value: "8", change: "-2", changeType: "positive" },
    contractsSigned: { value: "15", change: "+5", changeType: "positive" },
  });

  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    const loadDashboardData = async () => {
      setLoading(true);
      await new Promise((resolve) => setTimeout(resolve, 1500));
      setLoading(false);
    };

    loadDashboardData();
  }, []);

  const handleSidebarToggle = () => {
    setSidebarExpanded(!sidebarExpanded);
  };

  const handleRefresh = async () => {
    setRefreshing(true);

    await new Promise((resolve) => setTimeout(resolve, 1000));

    setMetrics((prev) => ({
      ...prev,
      monthlyIncome: {
        value: `$${(
          28450 + Math.floor(Math.random() * 5000)
        ).toLocaleString()}`,
        change: `+${(12.5 + Math.random() * 5).toFixed(1)}%`,
        changeType: "positive",
      },
    }));

    setRefreshing(false);
  };

  // 🔐 PROTECTED QUICK ACTION HANDLER
  const handleQuickAction = (actionId) => {
    const runAction = () => {
      if (actionId === "create-project") {
        navigate("/project-management");
      }

      if (actionId === "generate-invoice") {
        navigate("/billing-invoices");
      }
    };

    // If not logged in → save action + open modal
    if (!session) {
      setPendingAction(() => runAction);
      openModal();
      return;
    }

    // If logged in → run immediately
    runAction();
  };

  const handleNotificationMarkAsRead = (notificationId) => {
    setNotifications((prev) =>
      prev.map((notification) =>
        notification.id === notificationId
          ? { ...notification, read: true }
          : notification
      )
    );
  };

  const handleNotificationDismiss = (notificationId) => {
    setNotifications((prev) =>
      prev.filter((notification) => notification.id !== notificationId)
    );
  };

  return (
    <div className="min-h-screen bg-background">
      <Sidebar isExpanded={sidebarExpanded} onToggle={handleSidebarToggle} />
      <Header
        onMenuToggle={handleSidebarToggle}
        sidebarExpanded={sidebarExpanded}
      />

      <main className="lg:ml-60 pt-16">
        <div className="p-6">
          {/* Header */}
          <div className="mb-8">
            <Breadcrumb />

            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold text-foreground mb-2">
                  Dashboard
                </h1>
                <p className="text-muted-foreground">
                  Welcome back! Here's what's happening with your business today.
                </p>
              </div>

              <div className="flex items-center space-x-3">
                <button
                  onClick={handleRefresh}
                  disabled={refreshing}
                  className="flex items-center space-x-2 px-4 py-2 text-sm border border-border rounded-lg hover:bg-muted transition-smooth disabled:opacity-50"
                >
                  <Icon
                    name="RefreshCw"
                    size={16}
                    className={refreshing ? "animate-spin" : ""}
                  />
                  <span>
                    {refreshing ? "Refreshing..." : "Refresh"}
                  </span>
                </button>

                <div className="text-sm text-muted-foreground">
                  Last updated: {new Date().toLocaleTimeString()}
                </div>
              </div>
            </div>
          </div>

          {/* Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <MetricCard
              title="Monthly Income"
              value={metrics.monthlyIncome.value}
              change={metrics.monthlyIncome.change}
              changeType={metrics.monthlyIncome.changeType}
              icon="DollarSign"
              loading={loading}
            />

            <MetricCard
              title="Active Projects"
              value={metrics.activeProjects.value}
              change={metrics.activeProjects.change}
              changeType={metrics.activeProjects.changeType}
              icon="FolderKanban"
              trend={75}
              loading={loading}
            />

            <MetricCard
              title="Pending Invoices"
              value={metrics.pendingInvoices.value}
              change={metrics.pendingInvoices.change}
              changeType={metrics.pendingInvoices.changeType}
              icon="Receipt"
              loading={loading}
            />

            <MetricCard
              title="Contracts Signed"
              value={metrics.contractsSigned.value}
              change={metrics.contractsSigned.change}
              changeType={metrics.contractsSigned.changeType}
              icon="FileCheck"
              trend={60}
              loading={loading}
            />
          </div>

          {/* Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            <RevenueChart loading={loading} />
            <TopClientsCard loading={loading} />
          </div>

          {/* Activity + Quick Actions */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
            <div className="lg:col-span-2">
              <RecentActivity loading={loading} />
            </div>
            <div>
              <QuickActions onActionClick={handleQuickAction} />
            </div>
          </div>

          {/* Notifications */}
          <div className="mb-8">
            <NotificationCenter
              notifications={notifications}
              onMarkAsRead={handleNotificationMarkAsRead}
              onDismiss={handleNotificationDismiss}
            />
          </div>

          {/* Footer Stats */}
          <div className="bg-card border border-border rounded-lg p-6 elevation-2">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 text-center">
              <div>
                <div className="text-2xl font-bold text-success mb-1">
                  98.5%
                </div>
                <div className="text-sm text-muted-foreground">
                  Client Satisfaction
                </div>
              </div>

              <div>
                <div className="text-2xl font-bold text-primary mb-1">
                  156
                </div>
                <div className="text-sm text-muted-foreground">
                  Total Clients
                </div>
              </div>

              <div>
                <div className="text-2xl font-bold text-accent mb-1">
                  89
                </div>
                <div className="text-sm text-muted-foreground">
                  Completed Projects
                </div>
              </div>

              <div>
                <div className="text-2xl font-bold text-warning mb-1">
                  $2.4M
                </div>
                <div className="text-sm text-muted-foreground">
                  Total Revenue
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* 🔐 Login Modal */}
      <AuthModal isOpen={isOpen} onClose={closeModal} />
    </div>
  );
};

export default Dashboard;
