import { Metadata } from 'next';
import Link from 'next/link';
import { buttonVariants } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { DemoUserButton } from '@/components/landing/DemoUserButton';
import {
  Zap,
  ShieldCheck,
  Wand2,
  ArrowRight,
  CheckCircle2,
  Sparkles,
  Heart,
  Sliders,
  DollarSign,
} from 'lucide-react';

export const metadata: Metadata = {
  title: 'TokenBuddy - Save tokens. Save context. Keep your AI private.',
  description: 'Save tokens. Save context. Keep your AI private. Built for developers using AI coding assistants.',
};

export default function HomePage() {
  return (
    <div className="min-h-[calc(100vh-4rem)]">
      {/* Hero Section */}
      <section className="relative overflow-hidden py-12 md:py-20 lg:py-24">
        {/* Background Gradient */}
        <div className="absolute inset-0 -z-10 bg-gradient-to-b from-blue-500/5 via-transparent to-transparent" />
        <div className="absolute -right-40 -top-40 -z-10 h-80 w-80 rounded-full bg-purple-500/10 blur-3xl" />

        <div className="container max-w-7xl space-y-8 px-4 text-center md:space-y-12">
          <div className="space-y-4">
            <div className="inline-flex items-center gap-2 rounded-full border border-blue-500/20 bg-blue-500/10 px-4 py-1.5 text-sm font-medium text-blue-600 dark:text-blue-400">
              <Heart className="size-4 text-rose-500 fill-rose-500" />
              <span>Hacktoberfest Weekend Challenge: Built for a Friend</span>
            </div>
            
            <h1 className="text-4xl font-extrabold tracking-tight md:text-5xl lg:text-6xl">
              <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                Save tokens. Save context.
              </span>
              <br />
              <span className="text-foreground">Keep your AI private.</span>
            </h1>

            <p className="mx-auto max-w-2xl text-lg text-muted-foreground md:text-xl leading-relaxed">
              TokenBuddy compresses verbose prompts, trims conversational fluff, and estimates real cost savings before you send requests to LLMs — running 100% deterministically in your browser.
            </p>
          </div>

          <div className="flex flex-col items-center justify-center gap-4">
            <DemoUserButton className="px-8 py-6 text-base font-semibold shadow-lg shadow-blue-500/25" />
          </div>

          {/* Real Friend Story Card */}
          <div className="mx-auto max-w-3xl rounded-xl border border-border/60 bg-muted/30 p-6 text-left shadow-sm backdrop-blur">
            <div className="flex items-start gap-4">
              <div className="rounded-full bg-blue-500/10 p-3 text-blue-600 dark:text-blue-400 shrink-0">
                <Sparkles className="size-6" />
              </div>
              <div className="space-y-2">
                <h3 className="text-base font-semibold text-foreground">
                  The Story Behind TokenBuddy: Built for Alex
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Our friend Alex builds with AI coding assistants daily. Like many developers, Alex was constantly burning through monthly token quotas and context limits because prompts were full of conversational filler (&ldquo;Could you please...&rdquo;, &ldquo;I would appreciate if you could write a comprehensive...&rdquo;). We built TokenBuddy to help Alex strip out non-essential tokens, format compact constraints, and track money saved — with zero privacy compromises.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Core Implemented Capabilities */}
      <section className="border-t border-border/40 py-12 md:py-20">
        <div className="container max-w-7xl space-y-12 px-4">
          <div className="text-center space-y-2">
            <h2 className="text-3xl font-bold md:text-4xl">What TokenBuddy Does Today</h2>
            <p className="text-muted-foreground max-w-xl mx-auto">
              Real, deterministic client-side tools designed to make every prompt leaner and cheaper.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            {/* Feature 1 */}
            <div className="group rounded-xl border border-border/40 bg-background/50 p-6 transition-all hover:border-blue-500/40 hover:bg-accent/40">
              <div className="mb-4 inline-flex rounded-lg bg-blue-500/10 p-3">
                <Wand2 className="size-6 text-blue-600 dark:text-blue-400" />
              </div>
              <h3 className="mb-2 text-lg font-semibold">Multi-Mode Token Optimizer</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Choose between <strong>Lean</strong> (strips filler &amp; pleasantries), <strong>Structured</strong> (converts wordy text into crisp constraints), and <strong>Ultra-short</strong> (maximum keyword density).
              </p>
            </div>

            {/* Feature 2 */}
            <div className="group rounded-xl border border-border/40 bg-background/50 p-6 transition-all hover:border-purple-500/40 hover:bg-accent/40">
              <div className="mb-4 inline-flex rounded-lg bg-purple-500/10 p-3">
                <DollarSign className="size-6 text-purple-600 dark:text-purple-400" />
              </div>
              <h3 className="mb-2 text-lg font-semibold">Real-Time Cost &amp; Token Math</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Calculate estimated tokens before and after, inspect percentage reduced, and see exact dollar savings based on current industry model pricing.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="group rounded-xl border border-border/40 bg-background/50 p-6 transition-all hover:border-emerald-500/40 hover:bg-accent/40">
              <div className="mb-4 inline-flex rounded-lg bg-emerald-500/10 p-3">
                <ShieldCheck className="size-6 text-emerald-600 dark:text-emerald-400" />
              </div>
              <h3 className="mb-2 text-lg font-semibold">100% In-Browser &amp; Private</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Your prompts and confidential code never leave your machine. Optimization is executed locally in client memory with zero external tracking.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits Summary */}
      <section className="border-t border-border/40 py-12 md:py-16 bg-muted/20">
        <div className="container max-w-7xl space-y-10 px-4">
          <div className="text-center">
            <h2 className="text-2xl font-bold md:text-3xl">Why Developers Love TokenBuddy</h2>
          </div>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {[
              { label: 'Instant Token Reduction', desc: 'Trim 20-50% off verbose prompts' },
              { label: 'Save Context Window', desc: 'Fit more code and instructions' },
              { label: 'Zero Setup', desc: 'Open and optimize immediately' },
              { label: '100% Client-Side', desc: 'Zero data leaves your browser' },
            ].map((item, idx) => (
              <div key={idx} className="flex gap-3 rounded-lg border border-border/40 bg-background/60 p-4">
                <CheckCircle2 className="size-5 shrink-0 text-emerald-500" />
                <div>
                  <p className="font-semibold text-sm">{item.label}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="border-t border-border/40 py-12 md:py-20">
        <div className="container max-w-4xl space-y-6 px-4 text-center">
          <h2 className="text-3xl font-bold md:text-4xl">Stop wasting tokens on filler words</h2>
          <p className="text-muted-foreground max-w-xl mx-auto">
            Give your prompts the haircut they deserve. Test out TokenBuddy now.
          </p>
          <div className="flex justify-center">
            <DemoUserButton className="px-8 py-6 text-base font-semibold" />
          </div>
        </div>
      </section>
    </div>
  );
}
