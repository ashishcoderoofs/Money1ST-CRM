import React from 'react';
import { useUsers } from '@/hooks/users';
import { OrgNode } from './OrgNode';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Building, Users } from 'lucide-react';
import './OrgChart.css';

interface User {
  id: string;
  first_name: string;
  last_name: string;
  role: string;
  manager_id?: string;
  email: string;
}

interface TreeNode {
  user: User;
  children: TreeNode[];
}

export function OrgChart() {
  const { data: users = [], isLoading } = useUsers();

  const buildTree = (users: User[]): TreeNode[] => {
    // Create a map for quick lookup
    const userMap = new Map<string, TreeNode>();
    
    // Initialize all users as nodes
    users.forEach(user => {
      userMap.set(user.id, { user, children: [] });
    });

    const roots: TreeNode[] = [];

    // Build the tree structure
    users.forEach(user => {
      const node = userMap.get(user.id)!;
      
      if (user.manager_id && userMap.has(user.manager_id)) {
        // This user has a manager, add them as a child
        const parentNode = userMap.get(user.manager_id)!;
        parentNode.children.push(node);
      } else {
        // This user has no manager or manager not found, they're a root
        roots.push(node);
      }
    });

    return roots;
  };

  if (isLoading) {
    return (
      <Card className="shadow-powerbi">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Building className="h-5 w-5" />
            Organizational Chart
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-powerbi-primary"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  const orgTree = buildTree(users);

  if (users.length === 0) {
    return (
      <Card className="shadow-powerbi">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Building className="h-5 w-5" />
            Organizational Chart
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">No users found</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="shadow-powerbi">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Building className="h-5 w-5" />
          Organizational Chart
        </CardTitle>
        <p className="text-sm text-muted-foreground mt-1">
          Company hierarchy and reporting structure
        </p>
      </CardHeader>
      <CardContent>
        <div className="org-chart-container overflow-auto p-4">
          <div className="flex flex-col items-center space-y-8">
            {orgTree.map((rootNode, index) => (
              <OrgNode key={rootNode.user.id} node={rootNode} isRoot={true} />
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
