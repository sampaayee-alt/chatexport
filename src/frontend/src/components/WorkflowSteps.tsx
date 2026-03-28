import { Download, Eye, Link2 } from "lucide-react";
import { motion } from "motion/react";

const steps = [
  {
    num: "1",
    icon: Link2,
    title: "Paste Your Link",
    desc: "Copy the shared link from ChatGPT or Grok and paste it in the input above.",
  },
  {
    num: "2",
    icon: Eye,
    title: "Preview Chat",
    desc: "We fetch and parse the full conversation, displaying it with proper formatting.",
  },
  {
    num: "3",
    icon: Download,
    title: "Export Document",
    desc: "Download as a beautifully styled PDF or Word document with all formatting intact.",
  },
];

export function WorkflowSteps() {
  return (
    <section className="py-16 px-4 bg-white" id="features">
      <div className="container mx-auto max-w-4xl">
        <h2
          className="text-2xl font-bold text-center mb-10"
          style={{ color: "oklch(var(--navy))" }}
        >
          How It Works
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {steps.map((step, idx) => (
            <motion.div
              key={step.num}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.12, duration: 0.4 }}
              className="text-center"
            >
              <div
                className="w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4 text-lg font-bold"
                style={{
                  background: "oklch(var(--primary) / 0.1)",
                  color: "oklch(var(--primary))",
                }}
              >
                {step.num}
              </div>
              <step.icon
                className="w-5 h-5 mx-auto mb-2"
                style={{ color: "oklch(var(--primary))" }}
              />
              <h3
                className="font-semibold mb-1"
                style={{ color: "oklch(var(--navy))" }}
              >
                {step.title}
              </h3>
              <p
                className="text-sm"
                style={{ color: "oklch(var(--muted-foreground))" }}
              >
                {step.desc}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
