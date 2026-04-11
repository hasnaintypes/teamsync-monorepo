import { Button } from "@/components/ui/button";
import { ChevronRight } from "lucide-react";
import { Link } from "react-router-dom";

export default function ContentSection() {
  return (
    <section className="py-16 md:py-32">
      <div className="mx-auto max-w-5xl px-6">
        <div className="grid gap-6 md:grid-cols-2 md:gap-12">
          <h2 className="text-4xl font-medium">
            The TeamSync ecosystem brings together your projects, teams, and
            workflows.
          </h2>
          <div className="space-y-6">
            <p>
              TeamSync is more than just task management. It supports your
              entire workflow — from project planning to team collaboration and
              delivery tracking.
            </p>
            <p>
              Built for modern teams.{" "}
              <span className="font-bold">
                Manage workspaces, assign roles, track priorities
              </span>{" "}
              — and keep everyone aligned from kickoff to launch. Whether
              you're a small startup or a growing organization, TeamSync scales
              with you.
            </p>
            <Button
              asChild
              variant="secondary"
              size="sm"
              className="gap-1 pr-1.5"
            >
              <Link to="/sign-up">
                <span>Get Started</span>
                <ChevronRight className="size-2" />
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
