import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const faqItems = [
  {
    id: "item-1",
    question: "What is TeamSync?",
    answer:
      "TeamSync is a project management platform that helps teams collaborate, organize tasks, track progress, and deliver projects on time. It brings everything your team needs into one place.",
  },
  {
    id: "item-2",
    question: "How do workspaces work?",
    answer:
      "Workspaces are separate environments for different teams or organizations. Each workspace has its own projects, tasks, and members. You can create multiple workspaces and switch between them.",
  },
  {
    id: "item-3",
    question: "Can I invite team members?",
    answer:
      "Yes! You can invite team members via shareable invite links. Members can be assigned roles with different permission levels to control what they can view and modify.",
  },
  {
    id: "item-4",
    question: "What task management features are available?",
    answer:
      "TeamSync supports task creation with statuses (Backlog, Todo, In Progress, In Review, Done), priority levels (Low, Medium, High), due dates, assignees, and project organization.",
  },
  {
    id: "item-5",
    question: "Is TeamSync free to use?",
    answer:
      "TeamSync offers a free tier that includes workspace creation, project management, and team collaboration features. Premium features may be available in future plans.",
  },
];

export default function FAQSection() {
  return (
    <section id="faq" className="py-16 md:py-24">
      <div className="mx-auto max-w-5xl px-4 md:px-6">
        <div className="mx-auto max-w-xl text-center">
          <h2 className="text-balance text-3xl font-bold md:text-4xl lg:text-5xl">
            Frequently Asked Questions
          </h2>
          <p className="text-muted-foreground mt-4 text-balance">
            Discover quick and comprehensive answers to common questions about
            our platform, services, and features.
          </p>
        </div>

        <div className="mx-auto mt-12 max-w-xl">
          <Accordion
            type="single"
            collapsible
            className="bg-muted dark:bg-muted/50 w-full rounded-2xl p-1"
          >
            {faqItems.map((item) => (
              <div className="group" key={item.id}>
                <AccordionItem
                  value={item.id}
                  className="data-[state=open]:bg-card dark:data-[state=open]:bg-muted peer rounded-xl border-none px-7 py-1 data-[state=open]:border-none data-[state=open]:shadow-sm"
                >
                  <AccordionTrigger className="cursor-pointer text-base hover:no-underline">
                    {item.question}
                  </AccordionTrigger>
                  <AccordionContent>
                    <p className="text-base">{item.answer}</p>
                  </AccordionContent>
                </AccordionItem>
                <hr className="mx-7 border-dashed group-last:hidden peer-data-[state=open]:opacity-0" />
              </div>
            ))}
          </Accordion>
        </div>
      </div>
    </section>
  );
}
