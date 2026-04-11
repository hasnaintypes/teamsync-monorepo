export default function StatsSection() {
  return (
    <section className="py-12 md:py-20">
      <div className="mx-auto max-w-5xl space-y-8 px-6 md:space-y-16">
        <div className="relative z-10 mx-auto max-w-xl space-y-6 text-center">
          <h2 className="text-4xl font-medium lg:text-5xl">
            TeamSync in numbers
          </h2>
          <p className="text-muted-foreground">
            Trusted by teams of all sizes to plan, track, and deliver projects
            on time.
          </p>
        </div>

        <div className="grid gap-12 divide-y *:text-center md:grid-cols-3 md:gap-2 md:divide-x md:divide-y-0">
          <div className="space-y-4 pt-8 md:pt-0">
            <div className="text-5xl font-bold">10K+</div>
            <p className="text-muted-foreground">Tasks Managed</p>
          </div>
          <div className="space-y-4 pt-8 md:pt-0">
            <div className="text-5xl font-bold">500+</div>
            <p className="text-muted-foreground">Active Teams</p>
          </div>
          <div className="space-y-4 pt-8 md:pt-0">
            <div className="text-5xl font-bold">99.9%</div>
            <p className="text-muted-foreground">Uptime</p>
          </div>
        </div>
      </div>
    </section>
  );
}
