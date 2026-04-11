import {
  Cpu,
  Fingerprint,
  Pencil,
  Settings2,
  Sparkles,
  Zap,
} from "lucide-react";

const features = [
  {
    icon: Zap,
    title: "Lightning Fast",
    description:
      "Real-time updates and instant task syncing across your entire team, no refresh needed.",
  },
  {
    icon: Cpu,
    title: "Powerful Analytics",
    description:
      "Track progress with visual dashboards, charts, and insights to keep projects on course.",
  },
  {
    icon: Fingerprint,
    title: "Role-Based Access",
    description:
      "Fine-grained permissions ensure the right people have the right level of access.",
  },
  {
    icon: Pencil,
    title: "Customizable Workflows",
    description:
      "Create projects with custom statuses and priorities that match the way your team works.",
  },
  {
    icon: Settings2,
    title: "Workspace Control",
    description:
      "Manage multiple workspaces, invite members, and configure settings all in one place.",
  },
  {
    icon: Sparkles,
    title: "Built for Teams",
    description:
      "Assign tasks, track deadlines, and collaborate seamlessly with your entire organization.",
  },
];

export default function FeaturesSection() {
  return (
    <section id="features" className="py-12 md:py-20">
      <div className="mx-auto max-w-5xl space-y-8 px-6 md:space-y-16">
        <div className="relative z-10 mx-auto max-w-xl space-y-6 text-center md:space-y-12">
          <h2 className="text-balance text-4xl font-medium lg:text-5xl">
            Everything your team needs to ship faster
          </h2>
          <p className="text-muted-foreground">
            TeamSync brings together task management, team collaboration, and
            project tracking into one seamless platform built for modern teams.
          </p>
        </div>

        <div className="relative mx-auto grid max-w-4xl divide-x divide-y border *:p-12 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((feature) => (
            <div key={feature.title} className="space-y-3">
              <div className="flex items-center gap-2">
                <feature.icon className="size-4" />
                <h3 className="text-sm font-medium">{feature.title}</h3>
              </div>
              <p className="text-sm text-muted-foreground">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
