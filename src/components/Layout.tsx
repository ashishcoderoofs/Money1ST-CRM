
import LogoutButton from "./LogoutButton";
import { useAuth } from "@/hooks/useAuth";
import { useUserRole } from "@/hooks/useUserRole";
import { useUserPageAccess } from "@/hooks/usePagePermissions";
import { usePopulatePermissions } from "@/hooks/usePopulatePermissions";
import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Settings, Home } from "lucide-react";
import { useEffect, useMemo } from "react";

const pages = [
  { to: "/home", label: "Home", pageName: "Home", requiresPermission: false },
  { to: "/organizational-chart", label: "Organizational Chart", pageName: "Organizational Chart" },
  { to: "/dashboard", label: "Dashboard", pageName: "Dashboard" },
  { to: "/securia", label: "Securia", pageName: "Securia" },
  { to: "/analytics", label: "Analytics", pageName: "Analytics" },
  { to: "/branch-development", label: "Branch Development", pageName: "Branch Development" },
  { to: "/fna-training", label: "FNA Training", pageName: "FNA Training" },
  { to: "/reports", label: "Reports", pageName: "Reports" },
  { to: "/admin", label: "Admin", pageName: "Admin" }
];

export default function Layout({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const { role, loading: roleLoading } = useUserRole(user?.id ?? null);
  const location = useLocation();
  const populatePermissions = usePopulatePermissions();

  // Get access permissions for each page that requires permission
  const pageAccesses = pages.map(page => ({
    ...page,
    accessQuery: page.requiresPermission === false ? 
      { isLoading: false, data: true } : 
      useUserPageAccess(role, page.pageName)
  }));

  // Calculate accessible pages based on actual permission data
  const accessiblePages = useMemo(() => {
    if (!role) return [];
    
    return pageAccesses.filter(page => {
      // If permission data is loaded, use it
      if (!page.accessQuery.isLoading && page.accessQuery.data !== undefined) {
        return page.accessQuery.data === true;
      }
      
      // While loading, don't show any pages to avoid flashing content
      return false;
    });
  }, [pageAccesses, role]);

  // Initialize permissions when user role is loaded - but only once per role
  useEffect(() => {
    if (role && role === 'Admin' && !populatePermissions.isPending) {
      console.log("Ensuring permissions exist for admin role:", role);
      populatePermissions.mutate({ forceRefresh: false });
    }
  }, [role]);

  // Show loading only if role is loading or permissions are loading
  if (roleLoading || (role && pageAccesses.some(p => p.accessQuery.isLoading))) {
    return (
      <div className="min-h-screen flex bg-m1f-card">
        <aside className="w-60 bg-m1f-card px-4 py-8 border-r border-m1f-primary/20 text-m1f-primary flex flex-col gap-8 shadow-m1f">
          <Link to="/home" className="flex items-center gap-3">
            <div className="w-10 h-10 bg-m1f-primary rounded-lg flex items-center justify-center flex-shrink-0">
              <span className="text-m1f-gold font-black text-sm">$1</span>
            </div>
            <div className="font-bold text-lg text-m1f-primary">Money 1st Financial CRM</div>
          </Link>
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-m1f-primary"></div>
          </div>
        </aside>
        <main className="flex-1 min-h-screen bg-m1f-light flex flex-col">
          <section className="px-4 py-8 w-full flex-1 flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-m1f-primary"></div>
          </section>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex bg-m1f-card">
      <aside className="w-60 bg-m1f-card px-4 py-8 border-r border-m1f-primary/20 text-m1f-primary flex flex-col gap-8 shadow-m1f">
        <Link to="/home" className="flex items-center gap-3">
          <div className="w-10 h-10 bg-m1f-primary rounded-lg flex items-center justify-center flex-shrink-0">
            <span className="text-m1f-gold font-black text-sm">$1</span>
          </div>
          <div className="font-bold text-lg text-m1f-primary">Money 1st Financial CRM</div>
        </Link>
        
        <nav className="flex flex-col gap-2">
          {accessiblePages.map(page => (
            <Link
              key={page.to}
              to={page.to}
              className={`p-3 rounded-lg transition-all duration-200 flex items-center gap-2 ${
                location.pathname === page.to
                  ? "bg-m1f-primary text-white font-semibold shadow-m1f"
                  : "hover:bg-m1f-primary/10 hover:text-m1f-primary"
              }`}
            >
              {page.to === "/home" && <Home className="h-4 w-4" />}
              {page.label}
            </Link>
          ))}
        </nav>

        {/* Show initialize button for admins */}
        {role === 'Admin' && (
          <div className="mt-4">
            <Button
              onClick={() => populatePermissions.mutate({ forceRefresh: true })}
              disabled={populatePermissions.isPending}
              className="w-full bg-m1f-primary hover:bg-m1f-dark text-white"
              variant="outline"
            >
              <Settings className="h-4 w-4 mr-2" />
              {populatePermissions.isPending ? "Initializing..." : "Reset Permissions"}
            </Button>
          </div>
        )}
        
        <div className="mt-auto">
          <LogoutButton />
        </div>
      </aside>

      <main className="flex-1 min-h-screen bg-m1f-light flex flex-col">
        {/* Mobile header - disabled since sidebar is always visible */}
        {/* 
        <header className="md:hidden p-4 flex items-center justify-between border-b border-m1f-primary/20 bg-m1f-card">
          <Link to="/home" className="flex items-center gap-3">
            <div className="w-8 h-8 bg-m1f-primary rounded-lg flex items-center justify-center flex-shrink-0">
              <span className="text-m1f-gold font-black text-xs">$1</span>
            </div>
            <div className="font-bold text-m1f-primary">Money 1st Financial CRM</div>
          </Link>
          <LogoutButton />
        </header>
        */}
        <section className="px-4 py-8 w-full flex-1">{children}</section>
      </main>
    </div>
  );
}
