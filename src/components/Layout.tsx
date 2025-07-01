import LogoutButton from "./LogoutButton";
import { useAuth } from "@/hooks/useAuth";
import { useUserRole } from "@/hooks/useUserRole";
import { useUserPagePermissions } from "@/hooks/usePagePermissionsAPI";
import { usePopulatePermissions } from "@/hooks/usePopulatePermissions";
import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { 
  Settings, 
  Home, 
  BarChart3, 
  Users, 
  Handshake, 
  CheckSquare, 
  FileText, 
  Shield,
  ChevronLeft,
  ChevronRight,
  Bell,
  Search,
  User,
  DollarSign
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";

const pages = [
  { to: "/home", label: "Home", pageName: "Home", requiresPermission: false, icon: Home },
  { to: "/dashboard", label: "Dashboard", pageName: "Dashboard", icon: BarChart3 },
  { to: "/contacts", label: "Contacts", pageName: "Contacts", icon: Users },
  { to: "/deals", label: "Deals", pageName: "Deals", icon: Handshake },
  { to: "/tasks", label: "Tasks", pageName: "Tasks", icon: CheckSquare },
  { to: "/reports", label: "Reports", pageName: "Reports", icon: FileText },
  { to: "/admin", label: "Admin", pageName: "User Management", icon: Settings },
  { to: "/securia", label: "Securia Access", pageName: "Securia", icon: Shield }
];

export default function Layout({ children }: { children: React.ReactNode }) {
  const { user, loading: authLoading } = useAuth();
  const { role, loading: roleLoading } = useUserRole(user?.id ?? null);
  const location = useLocation();
  const populatePermissions = usePopulatePermissions();
  const [isCollapsed, setIsCollapsed] = useState(false);

  // Get user's page permissions from the API
  const { data: userPermissions, isLoading: permissionsLoading, error: permissionsError } = useUserPagePermissions();

  // Debug logging
  console.log('Layout Debug:', {
    role,
    userPermissions,
    permissionsLoading,
    permissionsError,
    authLoading,
    roleLoading
  });

  // Calculate accessible pages based on actual permission data
  const accessiblePages = useMemo(() => {
    console.log('Calculating accessible pages:', { role, userPermissions, permissionsLoading, permissionsError });
    
    if (!role) {
      console.log('No role, returning empty array');
      return [];
    }
    
    // TEMPORARY: Always show all pages for Admin as fallback until API is working
    if (role === 'Admin') {
      console.log('Admin user detected, showing all pages');
      return pages;
    }
    
    // If permissions are still loading or error, use fallback logic
    if (permissionsLoading || permissionsError) {
      console.log('Permissions loading or error, using fallback logic for non-admin');
      return [pages[0]]; // Just show Home page for non-admin
    }
    
    if (!userPermissions) {
      console.log('No userPermissions data for non-admin');
      return [pages[0]]; // Just show Home page
    }
    
    const filtered = pages.filter(page => {
      // Home page is always accessible
      if (page.requiresPermission === false) {
        return true;
      }
      
      // Check if user has permission for this page
      const hasPermission = userPermissions.permissions[page.pageName] === true;
      console.log(`Page ${page.pageName}: ${hasPermission}`);
      return hasPermission;
    });
    
    console.log('Final accessible pages:', filtered);
    return filtered;
  }, [role, userPermissions, permissionsLoading, permissionsError]);

  // Initialize permissions when user role is loaded - but only once per role
  useEffect(() => {
    // DISABLED: Permissions API is not working, causing errors
    // if (!authLoading && user && role && role === 'Admin' && !populatePermissions.isPending) {
    //   console.log("Ensuring permissions exist for admin role:", role);
    //   populatePermissions.mutate({ forceRefresh: false });
    // }
  }, [authLoading, user, role]);

  // Show loading only if auth or role are loading (not permissions, as we have fallback logic)
  if (authLoading || roleLoading) {
    return (
      <div className="min-h-screen flex bg-gradient-to-br from-slate-50 to-slate-100">
        <aside className={`${isCollapsed ? 'w-20' : 'w-72'} bg-white border-r border-slate-200 flex flex-col transition-all duration-300 shadow-xl`}>
          <div className="p-6 border-b border-slate-200">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-blue-700 rounded-xl flex items-center justify-center shadow-lg">
                <DollarSign className="h-6 w-6 text-white font-bold" />
              </div>
              {!isCollapsed && (
                <div>
                  <div className="font-bold text-lg text-slate-800">Money 1st</div>
                  <div className="text-sm text-slate-500">Financial CRM</div>
                </div>
              )}
            </div>
          </div>
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        </aside>
        <main className="flex-1 min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex flex-col">
          <section className="px-4 py-8 w-full flex-1 flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </section>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex bg-gradient-to-br from-slate-50 to-slate-100">
      <aside className={`${isCollapsed ? 'w-20' : 'w-72'} bg-white border-r border-slate-200 flex flex-col transition-all duration-300 shadow-xl relative`}>
        
        {/* Collapse Toggle Button */}
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="absolute -right-3 top-8 bg-white border border-slate-200 rounded-full p-1.5 shadow-lg hover:shadow-xl transition-all duration-200 z-10 hover:bg-slate-50"
        >
          {isCollapsed ? (
            <ChevronRight className="h-4 w-4 text-slate-600" />
          ) : (
            <ChevronLeft className="h-4 w-4 text-slate-600" />
          )}
        </button>

        {/* Logo Section - Enhanced */}
        <div className="p-6 border-b border-slate-200">
          <Link to="/home" className="flex items-center gap-3 hover:opacity-80 transition-opacity duration-200">
            <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-blue-700 rounded-xl flex items-center justify-center shadow-lg">
              <DollarSign className="h-6 w-6 text-white font-bold" />
            </div>
            {!isCollapsed && (
              <div>
                <div className="font-bold text-lg text-slate-800">Money 1st</div>
                <div className="text-sm text-slate-500">Financial CRM</div>
              </div>
            )}
          </Link>
        </div>

        {/* User Profile Section */}
        {!isCollapsed && user && (
          <div className="p-4 border-b border-slate-200">
            <div className="flex items-center gap-3 p-3 rounded-xl bg-gradient-to-r from-slate-50 to-slate-100 hover:from-slate-100 hover:to-slate-200 transition-all duration-200">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg flex items-center justify-center">
                <User className="h-5 w-5 text-white" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="font-semibold text-slate-800 truncate">{user?.name || 'User'}</div>
                <div className="text-xs text-slate-500 truncate">{role}</div>
              </div>
              <Bell className="h-4 w-4 text-slate-400 hover:text-slate-600 cursor-pointer transition-colors duration-200" />
            </div>
          </div>
        )}
        
        {/* Enhanced Navigation */}
        <nav className="flex-1 p-4 space-y-2">
          {accessiblePages.map(page => {
            const IconComponent = page.icon;
            const isActive = location.pathname === page.to;
            
            return (
              <Link
                key={page.to}
                to={page.to}
                className={`w-full p-3 rounded-xl transition-all duration-200 flex items-center gap-3 group relative overflow-hidden ${
                  isActive
                    ? "bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-lg transform scale-105"
                    : "hover:bg-slate-100 text-slate-700 hover:text-slate-900 hover:transform hover:scale-102"
                }`}
              >
                {/* Active indicator */}
                {isActive && (
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-400/20 to-blue-600/20 animate-pulse" />
                )}
                
                <div className={`p-2 rounded-lg ${isActive ? 'bg-white/20' : 'bg-slate-200 group-hover:bg-slate-300'} transition-colors duration-200 flex-shrink-0`}>
                  <IconComponent className={`h-4 w-4 ${isActive ? 'text-white' : 'text-slate-600'}`} />
                </div>
                
                {!isCollapsed && (
                  <span className="font-medium">{page.label}</span>
                )}

                {/* Tooltip for collapsed state */}
                {isCollapsed && (
                  <div className="absolute left-full ml-2 px-2 py-1 bg-slate-800 text-white text-sm rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap z-50">
                    {page.label}
                  </div>
                )}
              </Link>
            );
          })}
        </nav>

        {/* Show initialize button for admins - Enhanced */}
        {role === 'Admin' && false && (
          <div className="p-4 border-t border-slate-200">
            <Button
              onClick={() => populatePermissions.mutate({ forceRefresh: true })}
              disabled={populatePermissions.isPending}
              className="w-full bg-gradient-to-r from-slate-600 to-slate-700 hover:from-slate-700 hover:to-slate-800 text-white shadow-lg hover:shadow-xl transition-all duration-200"
              variant="outline"
            >
              <Settings className="h-4 w-4 mr-2" />
              {populatePermissions.isPending ? "Initializing..." : "Reset Permissions"}
            </Button>
          </div>
        )}
        
        {/* Enhanced Logout Section */}
        <div className="p-4 border-t border-slate-200">
          <div className={`${isCollapsed ? 'flex justify-center' : ''}`}>
            <LogoutButton />
          </div>
        </div>
      </aside>

      <main className="flex-1 min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex flex-col">
        {/* Main Content */}
        <section className="px-4 py-8 w-full flex-1">{children}</section>
      </main>
    </div>
  );
}