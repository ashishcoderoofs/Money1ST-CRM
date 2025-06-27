
import { Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Users, 
  LayoutDashboard, 
  Shield, 
  TrendingUp, 
  GitBranch, 
  School, 
  FileText, 
  Settings,
  Bug
} from "lucide-react";
import LogoutButton from "@/components/LogoutButton";
import { useAuth } from "@/hooks/useAuth";
import { useUserRole } from "@/hooks/useUserRole";
import { useUserPageAccess } from "@/hooks/usePagePermissions";
import { useMemo } from "react";

const Index = () => {
  const { user } = useAuth();
  const { role, loading: roleLoading } = useUserRole(user?.id ?? null);

  const allSections = [
    {
      title: "Organizational Chart",
      description: "Company structure and hierarchy",
      icon: Users,
      link: "/organizational-chart",
      color: "bg-blue-500 hover:bg-blue-600",
      pageName: "Organizational Chart"
    },
    {
      title: "Dashboard",
      description: "View key metrics and performance indicators",
      icon: LayoutDashboard,
      link: "/dashboard",
      color: "bg-m1f-primary hover:bg-m1f-dark",
      pageName: "Dashboard"
    },
    {
      title: "Securia",
      description: "Total Financial Solution Portal",
      icon: Shield,
      link: "/securia",
      color: "bg-green-600 hover:bg-green-700",
      pageName: "Securia"
    },
    {
      title: "Analytics",
      description: "Market Test Review",
      icon: TrendingUp,
      link: "/analytics",
      color: "bg-purple-500 hover:bg-purple-600",
      pageName: "Analytics"
    },
    {
      title: "Branch Development",
      description: "Branch growth and development tools",
      icon: GitBranch,
      link: "/branch-development",
      color: "bg-indigo-500 hover:bg-indigo-600",
      pageName: "Branch Development"
    },
    {
      title: "FNA Training",
      description: "Financial Needs Analysis training",
      icon: School,
      link: "/fna-training",
      color: "bg-teal-500 hover:bg-teal-600",
      pageName: "FNA Training"
    },
    {
      title: "Reports",
      description: "Analytics and comprehensive reports",
      icon: FileText,
      link: "/reports",
      color: "bg-purple-500 hover:bg-purple-600",
      pageName: "Reports"
    },
    {
      title: "Admin",
      description: "System administration and user management",
      icon: Settings,
      link: "/admin",
      color: "bg-gray-600 hover:bg-gray-700",
      pageName: "Admin"
    },
    {
      title: "Report a Bug",
      description: "Report issues and provide feedback",
      icon: Bug,
      link: "/report-bug",
      color: "bg-red-500 hover:bg-red-600",
      pageName: "Report Bug"
    }
  ];

  // Get access permissions for each section
  const pageAccesses = allSections.map(section => ({
    ...section,
    accessQuery: useUserPageAccess(role, section.pageName)
  }));

  // Filter sections based on permissions
  const accessibleSections = useMemo(() => {
    if (!role) return [];
    
    return pageAccesses.filter(section => {
      // If permission data is loaded, use it
      if (!section.accessQuery.isLoading && section.accessQuery.data !== undefined) {
        return section.accessQuery.data === true;
      }
      
      // While loading, don't show any sections to avoid flashing content
      return false;
    });
  }, [pageAccesses, role]);

  // Show loading while role or permissions are loading
  if (roleLoading || (role && pageAccesses.some(p => p.accessQuery.isLoading))) {
    return (
      <div className="min-h-screen bg-m1f-light">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center mb-12">
            <div className="w-20 h-20 bg-m1f-primary rounded-2xl flex items-center justify-center mx-auto mb-6">
              <span className="text-m1f-gold font-black text-2xl">$1</span>
            </div>
            <h1 className="text-4xl font-bold text-m1f-primary mb-4">
              Money 1st Financial CRM
            </h1>
            <p className="text-xl text-muted-foreground">
              Your comprehensive business management platform
            </p>
          </div>
          
          <div className="flex justify-center items-center py-16">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-m1f-primary"></div>
          </div>

          <div className="flex justify-center mt-8">
            <LogoutButton />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-m1f-light">
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-12">
          <div className="w-20 h-20 bg-m1f-primary rounded-2xl flex items-center justify-center mx-auto mb-6">
            <span className="text-m1f-gold font-black text-2xl">$1</span>
          </div>
          <h1 className="text-4xl font-bold text-m1f-primary mb-4">
            Money 1st Financial CRM
          </h1>
          <p className="text-xl text-muted-foreground">
            Your comprehensive business management platform
          </p>
        </div>

        {accessibleSections.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-xl text-muted-foreground">
              No accessible sections found. Please contact your administrator.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-6">
            {accessibleSections.map((section, index) => (
              <Link key={index} to={section.link} className="group">
                <Card className="h-full transition-all duration-300 hover:shadow-m1f hover:-translate-y-1 border-m1f-primary/20 bg-m1f-card">
                  <CardHeader className="text-center pb-4">
                    <div className={`w-16 h-16 mx-auto rounded-lg ${section.color} flex items-center justify-center mb-4 transition-colors duration-300`}>
                      <section.icon className="w-8 h-8 text-white" />
                    </div>
                    <CardTitle className="text-m1f-primary text-lg">
                      {section.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="text-center">
                    <p className="text-muted-foreground text-sm">
                      {section.description}
                    </p>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        )}

        {/* Logout Button */}
        <div className="flex justify-center mt-8">
          <LogoutButton />
        </div>
      </div>
    </div>
  );
};

export default Index;
