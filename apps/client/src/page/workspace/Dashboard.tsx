import { Plus } from "lucide-react";
import { useQuery } from "@tanstack/react-query";

import { Button } from "@/components/ui/button";
import useCreateProjectDialog from "@/hooks/use-create-project-dialog";
import useWorkspaceId from "@/hooks/use-workspace-id";
import WorkspaceAnalytics from "@/components/workspace/workspace-analytics";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import RecentProjects from "@/components/workspace/project/recent-projects";
import RecentTasks from "@/components/workspace/task/recent-tasks";
import RecentMembers from "@/components/workspace/member/recent-members";
import TaskStatusChart from "@/components/workspace/charts/task-status-chart";
import TaskPriorityChart from "@/components/workspace/charts/task-priority-chart";
import { getAllTasksQueryFn } from "@/lib/api";
import { TaskType } from "@/types/api.type";

const WorkspaceDashboard = () => {
  const { onOpen } = useCreateProjectDialog();
  const workspaceId = useWorkspaceId();

  const { data: taskData } = useQuery({
    queryKey: ["all-tasks", workspaceId],
    queryFn: () => getAllTasksQueryFn({ workspaceId }),
    staleTime: 0,
    enabled: !!workspaceId,
  });

  const tasks: TaskType[] = taskData?.tasks || [];

  return (
    <main className="flex flex-1 flex-col py-4 md:pt-3">
      <div className="flex items-center justify-between space-y-2 mb-6">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">
            Workspace Overview
          </h2>
          <p className="text-muted-foreground">
            Here&apos;s an overview for this workspace!
          </p>
        </div>
        <Button onClick={onOpen}>
          <Plus />
          New Project
        </Button>
      </div>
      <WorkspaceAnalytics />
      <div className="mt-4 grid gap-4 lg:grid-cols-2">
        <TaskStatusChart tasks={tasks} />
        <TaskPriorityChart tasks={tasks} />
      </div>
      <div className="mt-4">
        <Tabs defaultValue="projects" className="w-full border rounded-lg p-2">
          <TabsList className="w-full justify-start border-0 bg-muted px-1 h-12">
            <TabsTrigger className="py-2" value="projects">
              Recent Projects
            </TabsTrigger>
            <TabsTrigger className="py-2" value="tasks">
              Recent Tasks
            </TabsTrigger>
            <TabsTrigger className="py-2" value="members">
              Recent Members
            </TabsTrigger>
          </TabsList>
          <TabsContent value="projects">
            <RecentProjects />
          </TabsContent>
          <TabsContent value="tasks">
            <RecentTasks />
          </TabsContent>
          <TabsContent value="members">
            <RecentMembers />
          </TabsContent>
        </Tabs>
      </div>
    </main>
  );
};

export default WorkspaceDashboard;
