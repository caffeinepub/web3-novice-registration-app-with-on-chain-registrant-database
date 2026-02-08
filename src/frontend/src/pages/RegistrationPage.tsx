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
  const [facebook, setFacebook] = useState('');
  const [instagram, setInstagram] = useState('');
  const [telegram, setTelegram] = useState('');
  const [website, setWebsite] = useState('');
  const [cryptoAddress, setCryptoAddress] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [showSuccess, setShowSuccess] = useState(false);

  useEffect(() => {
    if (existingRegistrant.data) {
      setName(existingRegistrant.data.name);
      setEmail(existingRegistrant.data.email);
      setSkillLevel(existingRegistrant.data.skillLevel);
      setInterests(existingRegistrant.data.interests);
      setBio(existingRegistrant.data.id); // Using id field for bio
      setFacebook(existingRegistrant.data.facebook || '');
      setInstagram(existingRegistrant.data.instagram || '');
      setTelegram(existingRegistrant.data.telegram || '');
      setWebsite(existingRegistrant.data.website || '');
      setCryptoAddress(existingRegistrant.data.cryptoAddress || '');
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
        facebook: facebook.trim() || undefined,
        instagram: instagram.trim() || undefined,
        telegram: telegram.trim() || undefined,
        website: website.trim() || undefined,
        cryptoAddress: cryptoAddress.trim() || undefined,
      });
      setShowSuccess(true);
      setTimeout(() => {
        navigate({ to: '/directory' });
      }, 2000);
    } catch (error: any) {
      setErrors({ submit: error.message || 'Failed to save registration' });
    }
  };

  if (userLoading || existingRegistrant.isLoading) {
    return (
      <div className="container py-16 flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="container py-16">
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Please log in to register or update your profile.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="container py-16 max-w-3xl">
      {/* User Badge Display */}
      {isAuthenticated && (
        <div className="mb-8 flex items-center justify-center">
          <Card className="w-full max-w-md">
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <div className="flex-shrink-0">
                  <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center">
                    <IdCard className="h-8 w-8 text-primary" />
                  </div>
                </div>
                <div className="flex-1">
                  <p className="text-sm text-muted-foreground mb-1">Your Unique ID</p>
                  {badgeLoading ? (
                    <Skeleton className="h-6 w-32" />
                  ) : badgeError ? (
                    <p className="text-sm text-destructive">Badge unavailable</p>
                  ) : userBadge ? (
                    <>
                      <p className="text-lg font-bold text-primary">{userBadge.uniqueId}</p>
                      <Badge variant="secondary" className="mt-1">
                        <Award className="h-3 w-3 mr-1" />
                        {userBadge.badge}
                      </Badge>
                    </>
                  ) : null}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      <Card>
        <CardHeader>
          <CardTitle className="text-3xl">
            {existingRegistrant.data ? 'Update Your Profile' : 'Join the Community'}
          </CardTitle>
          <CardDescription>
            {existingRegistrant.data
              ? 'Update your information to keep your profile current'
              : 'Register to connect with other Web3 learners'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Name */}
            <div className="space-y-2">
              <Label htmlFor="name">
                Name <span className="text-destructive">*</span>
              </Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Your full name"
                className={errors.name ? 'border-destructive' : ''}
              />
              {errors.name && (
                <p className="text-sm text-destructive">{errors.name}</p>
              )}
            </div>

            {/* Email */}
            <div className="space-y-2">
              <Label htmlFor="email">
                Email <span className="text-destructive">*</span>
              </Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your.email@example.com"
                className={errors.email ? 'border-destructive' : ''}
              />
              {errors.email && (
                <p className="text-sm text-destructive">{errors.email}</p>
              )}
            </div>

            {/* Skill Level */}
            <div className="space-y-2">
              <Label htmlFor="skillLevel">
                Skill Level <span className="text-destructive">*</span>
              </Label>
              <Select value={skillLevel} onValueChange={setSkillLevel}>
                <SelectTrigger className={errors.skillLevel ? 'border-destructive' : ''}>
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

            {/* Interests */}
            <div className="space-y-2">
              <Label>
                Interests <span className="text-destructive">*</span>
              </Label>
              <div className="flex flex-wrap gap-2">
                {INTEREST_OPTIONS.map((interest) => (
                  <Badge
                    key={interest}
                    variant={interests.includes(interest) ? 'default' : 'outline'}
                    className="cursor-pointer hover:bg-primary/80"
                    onClick={() => toggleInterest(interest)}
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

            {/* Bio */}
            <div className="space-y-2">
              <Label htmlFor="bio">Bio</Label>
              <Textarea
                id="bio"
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                placeholder="Tell us about yourself and your Web3 journey..."
                rows={4}
              />
            </div>

            {/* Social Media & Contact Section */}
            <div className="space-y-4 pt-4 border-t">
              <h3 className="text-lg font-semibold">Social Media & Contact (Optional)</h3>
              
              {/* Facebook */}
              <div className="space-y-2">
                <Label htmlFor="facebook">Facebook</Label>
                <Input
                  id="facebook"
                  value={facebook}
                  onChange={(e) => setFacebook(e.target.value)}
                  placeholder="Facebook profile URL or username"
                />
              </div>

              {/* Instagram */}
              <div className="space-y-2">
                <Label htmlFor="instagram">Instagram</Label>
                <Input
                  id="instagram"
                  value={instagram}
                  onChange={(e) => setInstagram(e.target.value)}
                  placeholder="Instagram handle or profile URL"
                />
              </div>

              {/* Telegram */}
              <div className="space-y-2">
                <Label htmlFor="telegram">Telegram</Label>
                <Input
                  id="telegram"
                  value={telegram}
                  onChange={(e) => setTelegram(e.target.value)}
                  placeholder="Telegram username"
                />
              </div>

              {/* Website */}
              <div className="space-y-2">
                <Label htmlFor="website">Website</Label>
                <Input
                  id="website"
                  value={website}
                  onChange={(e) => setWebsite(e.target.value)}
                  placeholder="https://yourwebsite.com"
                />
              </div>

              {/* Crypto Address */}
              <div className="space-y-2">
                <Label htmlFor="cryptoAddress">Crypto address</Label>
                <Input
                  id="cryptoAddress"
                  value={cryptoAddress}
                  onChange={(e) => setCryptoAddress(e.target.value)}
                  placeholder="Your crypto wallet address"
                />
              </div>
            </div>

            {/* Submit Button */}
            <div className="flex flex-col gap-4">
              {errors.submit && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{errors.submit}</AlertDescription>
                </Alert>
              )}

              {showSuccess && (
                <Alert className="bg-green-50 text-green-900 border-green-200">
                  <CheckCircle2 className="h-4 w-4" />
                  <AlertDescription>
                    Registration successful! Redirecting to directory...
                  </AlertDescription>
                </Alert>
              )}

              <Button
                type="submit"
                size="lg"
                disabled={addRegistrant.isPending || showSuccess}
                className="w-full"
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
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
