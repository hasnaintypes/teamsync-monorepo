import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";
import { TaskPriorityEnum, TaskStatusEnum } from "@/constant";

const badgeVariants = cva(
  "inline-flex items-center rounded-md border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
  {
    variants: {
      variant: {
        default:
          "border-transparent bg-primary text-primary-foreground shadow hover:bg-primary/80",
        secondary:
          "border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80",
        destructive:
          "border-transparent bg-destructive text-destructive-foreground shadow hover:bg-destructive/80",
        outline: "text-foreground",
        [TaskStatusEnum.BACKLOG]: "bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-300",
        [TaskStatusEnum.TODO]: "bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300",
        [TaskStatusEnum.IN_PROGRESS]: "bg-yellow-100 text-yellow-600 dark:bg-yellow-900/40 dark:text-yellow-300",
        [TaskStatusEnum.IN_REVIEW]: "bg-purple-100 text-purple-500 dark:bg-purple-900/40 dark:text-purple-300",
        [TaskStatusEnum.DONE]: "bg-green-100 text-green-600 dark:bg-green-900/40 dark:text-green-300",
        [TaskPriorityEnum.HIGH]: "bg-orange-100 text-orange-600 dark:bg-orange-900/40 dark:text-orange-300",
        [TaskPriorityEnum.MEDIUM]: "bg-yellow-100 text-yellow-600 dark:bg-yellow-900/40 dark:text-yellow-300",
        [TaskPriorityEnum.LOW]: "bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-300",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  );
}

export { Badge, badgeVariants };
