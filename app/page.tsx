import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Sparkles, Zap, Users, Brain } from 'lucide-react';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <div className="container mx-auto px-4 py-16">
        {/* Header */}
        <header className="flex justify-between items-center mb-20">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-gradient-to-br from-purple-600 to-blue-600 rounded-lg flex items-center justify-center">
              <Sparkles className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
              Bloom AI
            </h1>
          </div>
          <div className="flex gap-4">
            <Link href="/login">
              <Button variant="outline">Sign In</Button>
            </Link>
            <Link href="/register">
              <Button>Get Started</Button>
            </Link>
          </div>
        </header>

        {/* Hero Section */}
        <div className="text-center max-w-4xl mx-auto mb-20">
          <h2 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-purple-600 via-blue-600 to-purple-600 bg-clip-text text-transparent">
            Your Visual AI Workspace for Content Creation
          </h2>
          <p className="text-xl text-muted-foreground mb-8">
            Connect your messy thoughts from videos, voice notes, and documents.
            Let AI organize and transform them into brilliant content.
          </p>
          <div className="flex gap-4 justify-center">
            <Link href="/register">
              <Button size="lg">Start Creating Free</Button>
            </Link>
            <Link href="/dashboard">
              <Button size="lg" variant="outline">View Dashboard</Button>
            </Link>
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-20">
          <FeatureCard
            icon={<Brain className="w-8 h-8" />}
            title="Multi-Modal AI"
            description="Analyze videos, PDFs, images, and web pages with GPT-4 and Claude"
          />
          <FeatureCard
            icon={<Sparkles className="w-8 h-8" />}
            title="Visual Canvas"
            description="Mind-mapping interface to connect ideas and see relationships"
          />
          <FeatureCard
            icon={<Zap className="w-8 h-8" />}
            title="Instant Insights"
            description="Summarize hours of content in minutes with AI assistance"
          />
          <FeatureCard
            icon={<Users className="w-8 h-8" />}
            title="Real-Time Collaboration"
            description="Work together with your team on the same board"
          />
        </div>

        {/* How It Works */}
        <div className="max-w-4xl mx-auto">
          <h3 className="text-3xl font-bold text-center mb-12">How It Works</h3>
          <div className="space-y-8">
            <StepCard
              number={1}
              title="Import Your Content"
              description="Drop in videos, PDFs, images, articles, or voice notes onto your canvas"
            />
            <StepCard
              number={2}
              title="AI Analyzes Everything"
              description="Automatic transcription, summarization, and extraction of key insights"
            />
            <StepCard
              number={3}
              title="Create & Collaborate"
              description="Use AI to generate content, scripts, or posts based on your research"
            />
          </div>
        </div>

        {/* CTA Section */}
        <div className="mt-20 text-center">
          <div className="bg-gradient-to-r from-purple-600 to-blue-600 rounded-2xl p-12 text-white">
            <h3 className="text-3xl font-bold mb-4">
              Ready to Transform Your Workflow?
            </h3>
            <p className="text-lg mb-8 opacity-90">
              Join thousands of creators using Bloom AI to create better content faster
            </p>
            <Link href="/register">
              <Button size="lg" variant="secondary">Start Free Trial</Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

function FeatureCard({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-border">
      <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900 rounded-lg flex items-center justify-center mb-4 text-purple-600 dark:text-purple-300">
        {icon}
      </div>
      <h4 className="text-lg font-semibold mb-2">{title}</h4>
      <p className="text-muted-foreground text-sm">{description}</p>
    </div>
  );
}

function StepCard({
  number,
  title,
  description,
}: {
  number: number;
  title: string;
  description: string;
}) {
  return (
    <div className="flex gap-6 items-start">
      <div className="w-12 h-12 bg-gradient-to-br from-purple-600 to-blue-600 rounded-full flex items-center justify-center text-white font-bold text-xl flex-shrink-0">
        {number}
      </div>
      <div>
        <h4 className="text-xl font-semibold mb-2">{title}</h4>
        <p className="text-muted-foreground">{description}</p>
      </div>
    </div>
  );
}
