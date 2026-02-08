import { useState, useEffect } from 'react';
import { useGetRegistrantCount } from '../hooks/useQueries';
import { useCurrentUser } from '../hooks/useCurrentUser';
import AuthControls from '../components/AuthControls';
import PlanetWorldScene from '../components/world/PlanetWorldScene';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Users, Globe, AlertCircle } from 'lucide-react';

export default function WorldPage() {
  const { isAuthenticated } = useCurrentUser();
  const { data: count, isLoading, isError, error } = useGetRegistrantCount();
  const [previousCount, setPreviousCount] = useState(0);

  useEffect(() => {
    if (count !== undefined && count > previousCount) {
      setPreviousCount(count);
    }
  }, [count]);

  if (!isAuthenticated) {
    return (
      <div className="container py-16">
        <div className="max-w-2xl mx-auto">
          <Card>
            <CardHeader className="text-center">
              <div className="flex justify-center mb-4">
                <Globe className="h-16 w-16 text-primary" />
              </div>
              <CardTitle className="text-3xl">Digital World</CardTitle>
              <CardDescription className="text-base">
                Sign in to explore our growing community planet
              </CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col items-center gap-6">
              <p className="text-center text-muted-foreground">
                Each member of our community appears as an inhabitant on our digital planet.
                Sign in to see how our world grows with every new registration.
              </p>
              <AuthControls />
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-8">
      <div className="mb-8 text-center">
        <h1 className="text-4xl font-bold mb-3 flex items-center justify-center gap-3">
          <Globe className="h-10 w-10 text-primary" />
          Digital World
        </h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Watch our community grow in real-time. Each point of light represents a member who has joined our Web3 journey.
        </p>
      </div>

      {isError && (
        <Alert variant="destructive" className="mb-6 max-w-2xl mx-auto">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Unable to load inhabitant count. {error instanceof Error ? error.message : 'Please try again later.'}
          </AlertDescription>
        </Alert>
      )}

      <div className="grid lg:grid-cols-[1fr_300px] gap-6">
        <Card className="overflow-hidden">
          <CardContent className="p-0">
            <div className="w-full h-[600px] bg-black">
              {isLoading ? (
                <div className="w-full h-full flex items-center justify-center">
                  <Skeleton className="w-32 h-32 rounded-full" />
                </div>
              ) : (
                <PlanetWorldScene inhabitantCount={count ?? 0} />
              )}
            </div>
          </CardContent>
        </Card>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                Community Stats
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Total Inhabitants</p>
                  {isLoading ? (
                    <Skeleton className="h-10 w-24" />
                  ) : (
                    <p className="text-4xl font-bold text-primary">{count ?? 0}</p>
                  )}
                </div>
                <div className="pt-4 border-t">
                  <p className="text-xs text-muted-foreground">
                    Each light on the planet represents a unique member of our Web3 community.
                    The count updates automatically every few seconds.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">How to Navigate</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="text-sm text-muted-foreground space-y-2">
                <li>• <strong>Rotate:</strong> Click and drag</li>
                <li>• <strong>Zoom:</strong> Scroll or pinch</li>
                <li>• <strong>Auto-rotate:</strong> Enabled by default</li>
                <li>• <strong>New members:</strong> Appear with animation</li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
