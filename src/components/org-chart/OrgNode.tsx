
import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ChevronDown, ChevronRight, Mail, User } from 'lucide-react';
import { cn } from '@/lib/utils';

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

interface OrgNodeProps {
  node: TreeNode;
  isRoot?: boolean;
  level?: number;
}

const getRoleColor = (role: string) => {
  switch (role) {
    case 'Admin':
      return 'bg-red-100 text-red-800 border-red-200';
    case 'Field Builder':
      return 'bg-blue-100 text-blue-800 border-blue-200';
    case 'Field Trainer':
      return 'bg-green-100 text-green-800 border-green-200';
    case 'Sr. BMA':
      return 'bg-purple-100 text-purple-800 border-purple-200';
    case 'BMA':
      return 'bg-orange-100 text-orange-800 border-orange-200';
    case 'IBA':
      return 'bg-gray-100 text-gray-800 border-gray-200';
    default:
      return 'bg-gray-100 text-gray-800 border-gray-200';
  }
};

export function OrgNode({ node, isRoot = false, level = 0 }: OrgNodeProps) {
  const [isExpanded, setIsExpanded] = useState(level < 2); // Auto-expand first 2 levels
  const { user, children } = node;
  const hasChildren = children.length > 0;

  const fullName = [user.first_name, user.last_name].filter(Boolean).join(' ') || 'Unknown User';

  return (
    <div className="org-node flex flex-col items-center">
      {/* User Card */}
      <Card className={cn(
        "relative transition-all duration-200 hover:shadow-lg",
        isRoot ? "border-2 border-powerbi-primary" : "border",
        level === 0 ? "min-w-[280px]" : "min-w-[240px]"
      )}>
        <CardContent className="p-4">
          <div className="flex items-center space-x-3">
            <div className="flex-shrink-0">
              <div className={cn(
                "w-10 h-10 rounded-full flex items-center justify-center",
                isRoot ? "bg-powerbi-primary text-white" : "bg-gray-200 text-gray-600"
              )}>
                <User className="h-5 w-5" />
              </div>
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-sm truncate">{fullName}</h3>
              <Badge variant="outline" className={cn("text-xs mt-1", getRoleColor(user.role))}>
                {user.role}
              </Badge>
              <div className="flex items-center text-xs text-muted-foreground mt-1">
                <Mail className="h-3 w-3 mr-1" />
                <span className="truncate">{user.email}</span>
              </div>
            </div>
            {hasChildren && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsExpanded(!isExpanded)}
                className="flex-shrink-0 h-8 w-8 p-0"
              >
                {isExpanded ? (
                  <ChevronDown className="h-4 w-4" />
                ) : (
                  <ChevronRight className="h-4 w-4" />
                )}
              </Button>
            )}
          </div>
          {hasChildren && (
            <div className="mt-2 text-xs text-muted-foreground">
              {children.length} direct report{children.length !== 1 ? 's' : ''}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Connection Line */}
      {hasChildren && isExpanded && (
        <div className="org-connection relative">
          {/* Vertical line from parent */}
          <div className="w-px h-6 bg-border mx-auto"></div>
          
          {/* Horizontal line */}
          <div className="relative h-px bg-border" style={{ width: `${Math.max(children.length * 280, 280)}px` }}>
            {/* Vertical lines to children */}
            {children.map((_, index) => {
              const totalWidth = Math.max(children.length * 280, 280);
              const spacing = totalWidth / children.length;
              const position = spacing * index + spacing / 2;
              
              return (
                <div
                  key={index}
                  className="absolute w-px h-6 bg-border"
                  style={{ left: `${position}px`, top: '0px' }}
                ></div>
              );
            })}
          </div>
        </div>
      )}

      {/* Children */}
      {hasChildren && isExpanded && (
        <div className="org-children flex space-x-8 mt-6">
          {children.map((childNode) => (
            <OrgNode
              key={childNode.user.id}
              node={childNode}
              level={level + 1}
            />
          ))}
        </div>
      )}
    </div>
  );
}
