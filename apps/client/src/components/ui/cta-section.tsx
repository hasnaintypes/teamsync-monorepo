import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

export default function CTASection() {
  return (
    <section className="py-16 md:py-32">
      <div className="mx-auto max-w-5xl px-6">
        <div className="text-center">
          <h2 className="text-balance text-4xl font-semibold lg:text-5xl">
            Ready to get started?
          </h2>
          <p className="mt-4 text-muted-foreground">
            Join teams already using TeamSync to ship faster and stay organized.
          </p>

          <div className="mt-12 flex flex-wrap justify-center gap-4">
            <Button asChild size="lg">
              <Link to="/sign-up">
                Get Started
                <ArrowRight className="ml-1 size-4" />
              </Link>
            </Button>

            <Button asChild size="lg" variant="outline">
              <Link to="/sign-in">Sign in</Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
