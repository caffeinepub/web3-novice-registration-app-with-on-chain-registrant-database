import { Link } from '@tanstack/react-router';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Users, BookOpen, Shield, Sparkles, ExternalLink } from 'lucide-react';
import { useCurrentUser } from '../hooks/useCurrentUser';

export default function LandingPage() {
  const { isAuthenticated } = useCurrentUser();

  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-background to-muted/30">
        <div className="container py-16 md:py-24 lg:py-32">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <div className="inline-block">
                <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium">
                  <Sparkles className="h-4 w-4" />
                  Welcome to Web3
                </span>
              </div>
              
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight">
                Building an{' '}
                <span className="text-primary">ICP Real-World Network</span>
              </h1>
              
              <p className="text-lg md:text-xl text-muted-foreground max-w-2xl">
                Join a safe network designed for crypto-friendly users and Web3 novices. 
                This is Step 1: Create your unique ID and become part of the decentralized future.
              </p>

              <div className="flex items-center gap-2 p-4 rounded-lg bg-muted/50 border border-border">
                <ExternalLink className="h-5 w-5 text-primary flex-shrink-0" />
                <p className="text-sm">
                  Learn more about our mission at{' '}
                  <a 
                    href="https://www.dmc-technologies.fr" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="font-medium text-primary hover:underline"
                  >
                    www.dmc-technologies.fr
                  </a>
                </p>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-4">
                {isAuthenticated ? (
                  <Button asChild size="lg" className="text-lg px-8">
                    <Link to="/register">Complete Your Profile</Link>
                  </Button>
                ) : (
                  <Button asChild size="lg" className="text-lg px-8">
                    <Link to="/register">Get Started</Link>
                  </Button>
                )}
                <Button asChild variant="outline" size="lg" className="text-lg px-8">
                  <Link to="/directory">Browse Community</Link>
                </Button>
              </div>
            </div>
            
            <div className="relative">
              <img
                src="/assets/generated/web3-novice-hero.dim_1600x900.png"
                alt="Web3 Learning Community"
                className="w-full h-auto rounded-2xl shadow-2xl"
                width={1600}
                height={900}
              />
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 md:py-24">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Why Join Our Network?
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              We're creating an ICP real-world network that's safe, secure, and accessible for everyone—from crypto experts to complete beginners.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <Card className="border-2 hover:border-primary/50 transition-colors">
              <CardContent className="pt-6">
                <div className="rounded-full bg-primary/10 w-12 h-12 flex items-center justify-center mb-4">
                  <Users className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Connect with Peers</h3>
                <p className="text-muted-foreground">
                  Find other Web3 novices with similar interests and skill levels. Learn together and share experiences in a safe environment.
                </p>
              </CardContent>
            </Card>

            <Card className="border-2 hover:border-primary/50 transition-colors">
              <CardContent className="pt-6">
                <div className="rounded-full bg-primary/10 w-12 h-12 flex items-center justify-center mb-4">
                  <BookOpen className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Get Your Unique ID</h3>
                <p className="text-muted-foreground">
                  Receive a unique identifier and badge when you join. This is the first step in building your Web3 identity on the Internet Computer.
                </p>
              </CardContent>
            </Card>

            <Card className="border-2 hover:border-primary/50 transition-colors">
              <CardContent className="pt-6">
                <div className="rounded-full bg-primary/10 w-12 h-12 flex items-center justify-center mb-4">
                  <Shield className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Decentralized & Secure</h3>
                <p className="text-muted-foreground">
                  Built on the Internet Computer with Internet Identity. Your data is secure, decentralized, and truly yours.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 md:py-24 bg-muted/30">
        <div className="container">
          <div className="max-w-3xl mx-auto text-center space-y-6">
            <h2 className="text-3xl md:text-4xl font-bold">
              Ready to Start Your Web3 Journey?
            </h2>
            <p className="text-lg text-muted-foreground">
              Join our growing network of learners exploring the decentralized web. 
              It's free, secure, and takes less than a minute to get your unique ID.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild size="lg" className="text-lg px-8">
                <Link to="/register">Join Now</Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="text-lg px-8">
                <Link to="/events">What's Next?</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
