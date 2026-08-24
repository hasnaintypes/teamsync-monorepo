import { Link } from "react-router-dom";
import Logo from "@/components/logo";
import useTheme from "@/hooks/use-theme";
import { Moon, Sun } from "lucide-react";

export default function Footer() {
  const { theme, toggleTheme } = useTheme();

  return (
    <footer className="border-t py-12">
      <div className="mx-auto max-w-5xl px-6">
        <div className="grid gap-8 sm:grid-cols-2 md:grid-cols-4">
          <div className="sm:col-span-2 md:col-span-1 space-y-4">
            <Link to="/" className="flex items-center gap-2">
              <Logo url="/" />
              <span className="font-semibold">Team Sync.</span>
            </Link>
            <p className="text-sm text-muted-foreground">
              The project management tool that keeps your team in sync.
            </p>
          </div>

          <div className="space-y-3">
            <h4 className="text-sm font-semibold">Product</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><a href="#features" className="hover:text-foreground transition-colors">Features</a></li>
              <li><a href="#faq" className="hover:text-foreground transition-colors">FAQ</a></li>
              <li><Link to="/sign-up" className="hover:text-foreground transition-colors">Get Started</Link></li>
            </ul>
          </div>

          <div className="space-y-3">
            <h4 className="text-sm font-semibold">Connect</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><a href="https://github.com/hasnaintypes/teamsync-monorepo" target="_blank" rel="noopener noreferrer" className="hover:text-foreground transition-colors">GitHub</a></li>
              <li><a href="https://linkedin.com/in/hasnainx" target="_blank" rel="noopener noreferrer" className="hover:text-foreground transition-colors">LinkedIn</a></li>
              <li><a href="https://x.com/bynainee" target="_blank" rel="noopener noreferrer" className="hover:text-foreground transition-colors">Twitter / X</a></li>
            </ul>
          </div>

          <div className="space-y-3">
            <h4 className="text-sm font-semibold">Theme</h4>
            <button
              onClick={toggleTheme}
              className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
            >
              {theme === "dark" ? (
                <>
                  <Sun className="size-4" />
                  <span>Light mode</span>
                </>
              ) : (
                <>
                  <Moon className="size-4" />
                  <span>Dark mode</span>
                </>
              )}
            </button>
          </div>
        </div>

        <div className="mt-12 border-t pt-6 text-center text-sm text-muted-foreground">
          &copy; {new Date().getFullYear()} TeamSync. Built by{" "}
          <a
            href="https://github.com/hasnaintypes"
            target="_blank"
            rel="noopener noreferrer"
            className="font-medium text-foreground hover:underline"
          >
            hasnaintypes
          </a>
        </div>
      </div>
    </footer>
  );
}
