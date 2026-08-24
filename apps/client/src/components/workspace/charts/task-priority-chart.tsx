import { useMemo } from "react";
import { Bar, BarChart, XAxis, YAxis, Cell, LabelList } from "recharts";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TaskType } from "@/types/api.type";

const PRIORITY_CONFIG = {
  count: { label: "Tasks" },
  LOW: { label: "Low", color: "hsl(215, 14%, 55%)" },
  MEDIUM: { label: "Medium", color: "hsl(45, 93%, 47%)" },
  HIGH: { label: "High", color: "hsl(24, 95%, 53%)" },
} satisfies ChartConfig;

const PRIORITY_ORDER = ["HIGH", "MEDIUM", "LOW"] as const;

const TaskPriorityChart = ({ tasks }: { tasks: TaskType[] }) => {
  const data = useMemo(() => {
    const counts: Record<string, number> = {};
    for (const task of tasks) {
      counts[task.priority] = (counts[task.priority] || 0) + 1;
    }
    return PRIORITY_ORDER.map((key) => ({
      priority: key,
      label: PRIORITY_CONFIG[key].label,
      count: counts[key] || 0,
      fill: PRIORITY_CONFIG[key].color,
    }));
  }, [tasks]);

  const hasData = data.some((d) => d.count > 0);

  return (
    <Card className="shadow-none flex flex-col">
      <CardHeader className="pb-0">
        <CardTitle className="text-sm font-medium">
          Tasks by Priority
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-4 flex-1 flex flex-col justify-center">
        {!hasData ? (
          <p className="text-sm text-muted-foreground text-center py-8">
            No tasks yet
          </p>
        ) : (
          <div className="space-y-4">
            {data.map((item) => {
              const max = Math.max(...data.map((d) => d.count), 1);
              const pct = (item.count / max) * 100;
              return (
                <div key={item.priority} className="space-y-1.5">
                  <div className="flex items-center justify-between text-sm">
                    <span className="font-medium">{item.label}</span>
                    <span className="text-muted-foreground tabular-nums">
                      {item.count}
                    </span>
                  </div>
                  <div className="h-3 w-full rounded-full bg-muted overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-500"
                      style={{
                        width: `${Math.max(pct, item.count > 0 ? 8 : 0)}%`,
                        backgroundColor: item.fill,
                      }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default TaskPriorityChart;
