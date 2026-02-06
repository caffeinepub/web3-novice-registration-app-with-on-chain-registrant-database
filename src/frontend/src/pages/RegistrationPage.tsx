import { useState, useEffect } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { useCurrentUser } from '../hooks/useCurrentUser';
import { useAddRegistrant, useGetRegistrant } from '../hooks/useQueries';
import { useGetUserBadge } from '../hooks/useUserBadge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Loader2, CheckCircle2, X, AlertCircle, IdCard, Award } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Skeleton } from '@/components/ui/skeleton';

const SKILL_LEVELS = ['Beginner', 'Intermediate', 'Advanced'];

const INTEREST_OPTIONS = [
  'DeFi', 'NFTs', 'DAOs', 'Smart Contracts', 'Blockchain Development',
  'Cryptocurrency Trading', 'Web3 Gaming', 'Metaverse', 'Token Economics',
  'Decentralized Storage', 'Layer 2 Solutions', 'Cross-chain Bridges'
];

export default function RegistrationPage() {
  const navigate = useNavigate();
  const { isAuthenticated, principal, isLoading: userLoading } = useCurrentUser();
  const existingRegistrant = useGetRegistrant(principal);
  const addRegistrant = useAddRegistrant();
  const { data: userBadge, isLoading: badgeLoading, isError: badgeError } = useGetUserBadge();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [skillLevel, setSkillLevel] = useState('');
  const [interests, setInterests] = useState<string[]>([]);
  const [bio, setBio] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [showSuccess, setShowSuccess] = useState(false);

  useEffect(() => {
    if (existingRegistrant.data) {
      setName(existingRegistrant.data.name);
      setEmail(existingRegistrant.data.email);
      setSkillLevel(existingRegistrant.data.skillLevel);
      setInterests(existingRegistrant.data.interests);
      setBio(existingRegistrant.data.id); // Using id field for bio
    }
  }, [existingRegistrant.data]);

  const toggleInterest = (interest: string) => {
    setInterests(prev =>
      prev.includes(interest)
        ? prev.filter(i => i !== interest)
        : [...prev, interest]
    );
  };

  const validate = () => {
    const newErrors: Record<string, string> = {};

    if (!name.trim()) {
      newErrors.name = 'Name is required';
    }

    if (!email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (!skillLevel) {
      newErrors.skillLevel = 'Please select your skill level';
    }

    if (interests.length === 0) {
      newErrors.interests = 'Please select at least one interest';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setShowSuccess(false);

    if (!validate()) {
      return;
    }

    try {
      await addRegistrant.mutateAsync({
        id: bio || 'Web3 enthusiast',
        name: name.trim(),
        email: email.trim(),
        skillLevel,
        interests,
      });
      setShowSuccess(true);
      setTimeout(() => {
        navigate({ to: '/directory' });
      }, 2000);
    } catch (error: any) {
      setErrors({ submit: error.message || 'Failed to save registration. Please try again.' });
    }
  };

  if (userLoading) {
    return (
      <div className="container py-16 flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="container py-16">
        <Card className="max-w-2xl mx-auto">
          <CardHeader>
            <CardTitle>Sign In Required</CardTitle>
            <CardDescription>
              Please sign in with Internet Identity to register as a Web3 novice and receive your unique ID.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                Click the "Sign In" button in the header to get started.
              </AlertDescription>
            </Alert>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container py-16">
      <div className="max-w-3xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">
            {existingRegistrant.data ? 'Update Your Profile' : 'Join the Community'}
          </h1>
          <p className="text-lg text-muted-foreground">
            {existingRegistrant.data
              ? 'Keep your information up to date'
              : 'Tell us about yourself and receive your unique Web3 ID'}
          </p>
        </div>

        {/* User Badge Display */}
        {isAuthenticated && (
          <Card className="mb-6 border-primary/20 bg-primary/5">
            <CardContent className="pt-6">
              <div className="flex items-start gap-4">
                <div className="rounded-full bg-primary/10 p-3">
                  <Award className="h-6 w-6 text-primary" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold mb-2 flex items-center gap-2">
                    <IdCard className="h-4 w-4" />
                    Your Web3 Identity
                  </h3>
                  {badgeLoading ? (
                    <div className="space-y-2">
                      <Skeleton className="h-4 w-48" />
                      <Skeleton className="h-4 w-64" />
                    </div>
                  ) : badgeError ? (
                    <Alert variant="destructive" className="mt-2">
                      <AlertCircle className="h-4 w-4" />
                      <AlertDescription>
                        Unable to load your badge. Please try refreshing the page.
                      </AlertDescription>
                    </Alert>
                  ) : userBadge ? (
                    <div className="space-y-1">
                      <p className="text-sm">
                        <span className="font-medium">Unique ID:</span>{' '}
                        <span className="text-primary font-mono">{userBadge.uniqueId}</span>
                      </p>
                      <p className="text-sm">
                        <span className="font-medium">Badge:</span>{' '}
                        <span className="text-muted-foreground font-mono">{userBadge.badge}</span>
                      </p>
                      <p className="text-xs text-muted-foreground mt-2">
                        This is your unique identifier on the ICP network. Keep it safe!
                      </p>
                    </div>
                  ) : null}
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {showSuccess && (
          <Alert className="mb-6 border-green-500 bg-green-50 dark:bg-green-950">
            <CheckCircle2 className="h-4 w-4 text-green-600" />
            <AlertDescription className="text-green-600">
              Registration saved successfully! Redirecting to directory...
            </AlertDescription>
          </Alert>
        )}

        <Card>
          <CardContent className="pt-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="name">Display Name *</Label>
                <Input
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Enter your display name"
                  disabled={addRegistrant.isPending}
                />
                {errors.name && (
                  <p className="text-sm text-destructive">{errors.name}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email Address *</Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your.email@example.com"
                  disabled={addRegistrant.isPending}
                />
                {errors.email && (
                  <p className="text-sm text-destructive">{errors.email}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="skillLevel">Skill Level *</Label>
                <Select value={skillLevel} onValueChange={setSkillLevel} disabled={addRegistrant.isPending}>
                  <SelectTrigger id="skillLevel">
                    <SelectValue placeholder="Select your skill level" />
                  </SelectTrigger>
                  <SelectContent>
                    {SKILL_LEVELS.map((level) => (
                      <SelectItem key={level} value={level}>
                        {level}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.skillLevel && (
                  <p className="text-sm text-destructive">{errors.skillLevel}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label>Interests * (Select all that apply)</Label>
                <div className="flex flex-wrap gap-2 p-4 border rounded-lg bg-muted/30">
                  {INTEREST_OPTIONS.map((interest) => (
                    <Badge
                      key={interest}
                      variant={interests.includes(interest) ? 'default' : 'outline'}
                      className="cursor-pointer hover:bg-primary/80 transition-colors"
                      onClick={() => !addRegistrant.isPending && toggleInterest(interest)}
                    >
                      {interest}
                      {interests.includes(interest) && (
                        <X className="ml-1 h-3 w-3" />
                      )}
                    </Badge>
                  ))}
                </div>
                {errors.interests && (
                  <p className="text-sm text-destructive">{errors.interests}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="bio">Bio (Optional)</Label>
                <Textarea
                  id="bio"
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  placeholder="Tell us a bit about yourself and your Web3 journey..."
                  rows={4}
                  disabled={addRegistrant.isPending}
                />
              </div>

              {errors.submit && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{errors.submit}</AlertDescription>
                </Alert>
              )}

              <div className="flex gap-4">
                <Button
                  type="submit"
                  disabled={addRegistrant.isPending}
                  className="flex-1"
                >
                  {addRegistrant.isPending ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Saving...
                    </>
                  ) : existingRegistrant.data ? (
                    'Update Profile'
                  ) : (
                    'Complete Registration'
                  )}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => navigate({ to: '/directory' })}
                  disabled={addRegistrant.isPending}
                >
                  Cancel
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
