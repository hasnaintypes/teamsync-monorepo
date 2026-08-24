import { useMemo } from "react";
import { Label, Pie, PieChart } from "recharts";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TaskType } from "@/types/api.type";

const STATUS_CONFIG = {
  BACKLOG: { label: "Backlog", color: "hsl(220, 9%, 46%)" },
  TODO: { label: "Todo", color: "hsl(217, 91%, 60%)" },
  IN_PROGRESS: { label: "In Progress", color: "hsl(45, 93%, 47%)" },
  IN_REVIEW: { label: "In Review", color: "hsl(271, 91%, 65%)" },
  DONE: { label: "Done", color: "hsl(142, 71%, 45%)" },
} satisfies ChartConfig;

const TaskStatusChart = ({ tasks }: { tasks: TaskType[] }) => {
  const { data, total } = useMemo(() => {
    const counts: Record<string, number> = {};
    for (const task of tasks) {
      counts[task.status] = (counts[task.status] || 0) + 1;
    }
    const chartData = Object.entries(STATUS_CONFIG).map(([key, config]) => ({
      status: key,
      label: config.label,
      count: counts[key] || 0,
      fill: config.color,
    }));
    return { data: chartData, total: tasks.length };
  }, [tasks]);

  const hasData = total > 0;

  return (
    <Card className="shadow-none">
      <CardHeader className="pb-0">
        <CardTitle className="text-sm font-medium">Tasks by Status</CardTitle>
      </CardHeader>
      <CardContent className="pt-0">
        {!hasData ? (
          <p className="text-sm text-muted-foreground text-center py-8">
            No tasks yet
          </p>
        ) : (
          <div className="flex flex-col items-center">
            <ChartContainer
              config={STATUS_CONFIG}
              className="mx-auto aspect-square max-h-[220px] w-full"
            >
              <PieChart>
                <ChartTooltip
                  content={<ChartTooltipContent nameKey="status" hideLabel />}
                />
                <Pie
                  data={data.filter((d) => d.count > 0)}
                  dataKey="count"
                  nameKey="status"
                  innerRadius={55}
                  outerRadius={85}
                  paddingAngle={2}
                  strokeWidth={2}
                  stroke="hsl(var(--background))"
                >
                  <Label
                    content={({ viewBox }) => {
                      if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                        return (
                          <text
                            x={viewBox.cx}
                            y={viewBox.cy}
                            textAnchor="middle"
                            dominantBaseline="middle"
                          >
                            <tspan
                              x={viewBox.cx}
                              y={viewBox.cy}
                              className="fill-foreground text-3xl font-bold"
                            >
                              {total}
                            </tspan>
                            <tspan
                              x={viewBox.cx}
                              y={(viewBox.cy || 0) + 20}
                              className="fill-muted-foreground text-xs"
                            >
                              Tasks
                            </tspan>
                          </text>
                        );
                      }
                    }}
                  />
                </Pie>
              </PieChart>
            </ChartContainer>
            <div className="flex flex-wrap justify-center gap-x-4 gap-y-2 pt-2">
              {data.map((item) => (
                <div
                  key={item.status}
                  className="flex items-center gap-1.5 text-xs"
                >
                  <span
                    className="size-2.5 rounded-full shrink-0"
                    style={{ backgroundColor: item.fill }}
                  />
                  <span className="text-muted-foreground">
                    {item.label}
                  </span>
                  <span className="font-medium tabular-nums">{item.count}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default TaskStatusChart;
