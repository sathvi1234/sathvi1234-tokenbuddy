'use client';

import { Project } from '@/lib/types';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { Copy, MoreVertical, Trash2, Edit2 } from 'lucide-react';
import { useUIStore } from '@/lib/store/ui-store';
import { useState } from 'react';

interface ProjectCardProps {
  project: Project;
  onDelete?: (id: string) => void;
  onEdit?: (project: Project) => void;
}

export function ProjectCard({ project, onDelete, onEdit }: ProjectCardProps) {
  const { addNotification } = useUIStore();
  const [copied, setCopied] = useState(false);

  const handleCopyApiKey = () => {
    navigator.clipboard.writeText(project.apiKey);
    setCopied(true);
    addNotification({
      id: `notification_${Date.now()}`,
      type: 'success',
      message: 'API key copied to clipboard',
    });
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Card className="glass overflow-hidden transition-all hover:shadow-lg hover:shadow-blue-500/10">
      <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-3">
        <div className="space-y-1">
          <h3 className="font-semibold text-lg">{project.name}</h3>
          <p className="text-sm text-muted-foreground">{project.description}</p>
        </div>
        <Badge variant={project.status === 'active' ? 'default' : 'secondary'}>
          {project.status}
        </Badge>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* API Key */}
        <div>
          <p className="mb-2 text-xs font-medium text-muted-foreground">API Key</p>
          <div className="flex items-center gap-2">
            <code className="flex-1 truncate rounded bg-muted px-2 py-1 text-xs font-mono">
              {project.apiKey}
            </code>
            <Button
              size="sm"
              variant="ghost"
              onClick={handleCopyApiKey}
              className="px-2"
            >
              <Copy className="size-4" />
            </Button>
          </div>
        </div>

        {/* Metrics Grid */}
        <div className="grid grid-cols-3 gap-2 rounded-lg bg-muted/50 p-3">
          <div>
            <p className="text-xs text-muted-foreground">Requests</p>
            <p className="font-semibold">{project.totalRequests.toLocaleString()}</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Monthly Cost</p>
            <p className="font-semibold">${project.monthlyCost.toFixed(2)}</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Cache Hit</p>
            <p className="font-semibold">{project.cacheHitRate.toFixed(1)}%</p>
          </div>
        </div>

        {/* Footer with Actions */}
        <div className="flex items-center justify-between">
          <p className="text-xs text-muted-foreground">
            Created {new Date(project.createdAt).toLocaleDateString()}
          </p>
          <DropdownMenu>
            <DropdownMenuTrigger className="inline-flex size-8 items-center justify-center rounded-md hover:bg-muted text-muted-foreground hover:text-foreground outline-none">
              <MoreVertical className="size-4" />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => onEdit?.(project)}>
                <Edit2 className="mr-2 size-4" />
                Edit
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => onDelete?.(project.id)}
                className="text-destructive"
              >
                <Trash2 className="mr-2 size-4" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardContent>
    </Card>
  );
}
