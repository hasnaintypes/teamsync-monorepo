import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const testimonials = [
  {
    quote:
      "TeamSync completely changed how our team collaborates. The intuitive task management, role-based permissions, and real-time updates have made project delivery seamless. We shipped 40% faster in our first month. It's become an essential part of our daily workflow.",
    name: "Sarah Chen",
    role: "Engineering Lead",
    avatar: "SC",
    featured: true,
  },
  {
    quote:
      "Finally a project management tool that doesn't get in the way. Clean UI, fast, and exactly what our team needed.",
    name: "Marcus Rodriguez",
    role: "Product Manager",
    avatar: "MR",
  },
  {
    quote:
      "The workspace system is brilliant. Managing multiple client projects with different teams has never been easier.",
    name: "Aisha Patel",
    role: "Freelance Developer",
    avatar: "AP",
  },
  {
    quote:
      "We migrated from three different tools to just TeamSync. Task tracking, team management, and analytics all in one place.",
    name: "David Kim",
    role: "Startup Founder",
    avatar: "DK",
  },
];

export default function TestimonialsSection() {
  return (
    <section className="py-16 md:py-32">
      <div className="mx-auto max-w-6xl space-y-8 px-6 md:space-y-16">
        <div className="relative z-10 mx-auto max-w-xl space-y-6 text-center md:space-y-12">
          <h2 className="text-4xl font-medium lg:text-5xl">
            Loved by teams everywhere
          </h2>
          <p className="text-muted-foreground">
            See what developers and teams are saying about how TeamSync
            transformed their workflow.
          </p>
        </div>

        <div className="*:bg-muted grid gap-4 *:border-none *:shadow-none sm:grid-cols-2 md:grid-cols-4 lg:grid-rows-2">
          <Card className="grid grid-rows-[1fr_auto] gap-8 sm:col-span-2 sm:p-6 lg:row-span-2">
            <CardContent className="pt-6">
              <blockquote className="grid h-full grid-rows-[1fr_auto] gap-6">
                <p className="text-xl font-medium">{testimonials[0].quote}</p>
                <div className="grid grid-cols-[auto_1fr] items-center gap-3">
                  <Avatar className="size-12 border">
                    <AvatarFallback>{testimonials[0].avatar}</AvatarFallback>
                  </Avatar>
                  <div>
                    <cite className="text-sm font-medium not-italic">
                      {testimonials[0].name}
                    </cite>
                    <span className="text-muted-foreground block text-sm">
                      {testimonials[0].role}
                    </span>
                  </div>
                </div>
              </blockquote>
            </CardContent>
          </Card>
          {testimonials.slice(1).map((t, i) => (
            <Card key={i} className={i === 0 ? "md:col-span-2" : ""}>
              <CardContent className="h-full pt-6">
                <blockquote className="grid h-full grid-rows-[1fr_auto] gap-6">
                  <p className={i === 0 ? "text-xl font-medium" : ""}>
                    {t.quote}
                  </p>
                  <div className="grid grid-cols-[auto_1fr] items-center gap-3">
                    <Avatar className="size-12 border">
                      <AvatarFallback>{t.avatar}</AvatarFallback>
                    </Avatar>
                    <div>
                      <cite className="text-sm font-medium not-italic">
                        {t.name}
                      </cite>
                      <span className="text-muted-foreground block text-sm">
                        {t.role}
                      </span>
                    </div>
                  </div>
                </blockquote>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
