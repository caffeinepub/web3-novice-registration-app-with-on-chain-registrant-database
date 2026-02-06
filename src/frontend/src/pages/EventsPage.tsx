import { Link } from '@tanstack/react-router';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Calendar, Rocket, ExternalLink, CheckCircle2, Clock } from 'lucide-react';

export default function EventsPage() {
  return (
    <div className="container py-16">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
            <Calendar className="h-4 w-4" />
            Coming Soon
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            The Next Step of Web3 is Coming
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            You've completed Step 1 by creating your unique ID. Stay tuned for exciting new features and opportunities in our ICP real-world network.
          </p>
        </div>

        {/* Current Step */}
        <Card className="mb-8 border-primary/20 bg-primary/5">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CheckCircle2 className="h-5 w-5 text-primary" />
              Step 1: Create Your ID (Completed)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              Congratulations! You've taken the first step in building your Web3 identity on the Internet Computer. 
              Your unique ID and badge are now part of our decentralized network.
            </p>
          </CardContent>
        </Card>

        {/* Next Steps */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-primary" />
              What's Next?
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex gap-4">
              <div className="rounded-full bg-primary/10 w-10 h-10 flex items-center justify-center flex-shrink-0">
                <Rocket className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold mb-1">Enhanced Community Features</h3>
                <p className="text-sm text-muted-foreground">
                  Connect with other members, participate in discussions, and collaborate on Web3 projects.
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="rounded-full bg-primary/10 w-10 h-10 flex items-center justify-center flex-shrink-0">
                <Rocket className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold mb-1">Learning Resources</h3>
                <p className="text-sm text-muted-foreground">
                  Access curated educational content, tutorials, and workshops to advance your Web3 knowledge.
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="rounded-full bg-primary/10 w-10 h-10 flex items-center justify-center flex-shrink-0">
                <Rocket className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold mb-1">Real-World Applications</h3>
                <p className="text-sm text-muted-foreground">
                  Participate in real-world ICP network activities and contribute to the decentralized ecosystem.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Learn More */}
        <Card className="border-2 border-primary/20">
          <CardContent className="pt-6">
            <div className="flex items-start gap-4">
              <div className="rounded-full bg-primary/10 p-3">
                <ExternalLink className="h-6 w-6 text-primary" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold mb-2">Learn More About Our Mission</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Visit our website to discover more about the ICP real-world network we're building and how you can be part of this exciting journey.
                </p>
                <Button asChild variant="outline">
                  <a 
                    href="https://www.dmc-technologies.fr" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2"
                  >
                    Visit DMC Technologies
                    <ExternalLink className="h-4 w-4" />
                  </a>
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* CTA */}
        <div className="mt-12 text-center">
          <p className="text-muted-foreground mb-4">
            In the meantime, complete your profile and connect with the community
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg">
              <Link to="/register">Complete Your Profile</Link>
            </Button>
            <Button asChild variant="outline" size="lg">
              <Link to="/directory">Browse Community</Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
