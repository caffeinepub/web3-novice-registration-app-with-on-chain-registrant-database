import { useState } from 'react';
import { useGetPublicRegistrantsBySector } from '../hooks/useQueries';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Loader2, Users, Mail, Award, Globe, Facebook as FacebookIcon, Instagram as InstagramIcon, Send, Wallet } from 'lucide-react';
import { SiFacebook, SiInstagram } from 'react-icons/si';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Separator } from '@/components/ui/separator';
import { Sector } from '../backend';
import { SECTOR_OPTIONS, getSectorLabel } from '../utils/sector';

export default function PublicProfilesPage() {
  const [selectedSector, setSelectedSector] = useState<Sector | null>(null);
  const { data: profiles = [], isLoading, isError } = useGetPublicRegistrantsBySector(selectedSector);

  const groupedProfiles = selectedSector === null
    ? SECTOR_OPTIONS.reduce((acc, option) => {
        acc[option.value] = profiles.filter(p => p.sector === option.value);
        return acc;
      }, {} as Record<Sector, typeof profiles>)
    : null;

  if (isLoading) {
    return (
      <div className="container py-16 flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="container py-16">
        <Alert variant="destructive">
          <AlertDescription>
            Failed to load public profiles. Please try again later.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="container py-16">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Public Profiles</h1>
          <p className="text-muted-foreground">
            Browse community members by activity sector
          </p>
        </div>

        {/* Sector Filter */}
        <div className="mb-8">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <Label className="text-sm font-medium whitespace-nowrap">Filter by Sector:</Label>
                <Select
                  value={selectedSector || 'all'}
                  onValueChange={(value) => setSelectedSector(value === 'all' ? null : value as Sector)}
                >
                  <SelectTrigger className="w-full max-w-xs">
                    <SelectValue placeholder="All Sectors" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Sectors</SelectItem>
                    {SECTOR_OPTIONS.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Results */}
        {selectedSector === null ? (
          // Grouped by sector
          <div className="space-y-8">
            {SECTOR_OPTIONS.map((option) => {
              const sectorProfiles = groupedProfiles?.[option.value] || [];
              if (sectorProfiles.length === 0) return null;

              return (
                <div key={option.value}>
                  <div className="flex items-center gap-3 mb-4">
                    <h2 className="text-2xl font-bold">{option.label}</h2>
                    <Badge variant="secondary">
                      {sectorProfiles.length} {sectorProfiles.length === 1 ? 'member' : 'members'}
                    </Badge>
                  </div>
                  <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {sectorProfiles.map((profile) => (
                      <ProfileCard key={profile.id} profile={profile} />
                    ))}
                  </div>
                  <Separator className="mt-8" />
                </div>
              );
            })}
            {profiles.length === 0 && (
              <Card>
                <CardContent className="py-12 text-center">
                  <Users className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                  <p className="text-muted-foreground">
                    No public profiles available yet. Be the first to make your profile public!
                  </p>
                </CardContent>
              </Card>
            )}
          </div>
        ) : (
          // Filtered by specific sector
          <div>
            {profiles.length > 0 ? (
              <>
                <div className="mb-4 flex items-center gap-2">
                  <h2 className="text-xl font-semibold">
                    {getSectorLabel(selectedSector)}
                  </h2>
                  <Badge variant="secondary">
                    {profiles.length} {profiles.length === 1 ? 'member' : 'members'}
                  </Badge>
                </div>
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                  {profiles.map((profile) => (
                    <ProfileCard key={profile.id} profile={profile} />
                  ))}
                </div>
              </>
            ) : (
              <Card>
                <CardContent className="py-12 text-center">
                  <Users className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                  <p className="text-muted-foreground">
                    No public profiles in this sector yet.
                  </p>
                </CardContent>
              </Card>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

function ProfileCard({ profile }: { profile: any }) {
  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <CardTitle className="text-xl mb-1">{profile.name}</CardTitle>
            <CardDescription className="flex items-center gap-1">
              <Mail className="h-3 w-3" />
              {profile.email}
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Skill Level */}
        <div className="flex items-center gap-2">
          <Award className="h-4 w-4 text-muted-foreground" />
          <span className="text-sm font-medium">{profile.skillLevel}</span>
        </div>

        {/* Interests */}
        {profile.interests && profile.interests.length > 0 && (
          <div>
            <p className="text-sm font-medium mb-2">Interests:</p>
            <div className="flex flex-wrap gap-1">
              {profile.interests.map((interest: string) => (
                <Badge key={interest} variant="secondary" className="text-xs">
                  {interest}
                </Badge>
              ))}
            </div>
          </div>
        )}

        {/* Social Links */}
        {(profile.facebook || profile.instagram || profile.telegram || profile.website) && (
          <div className="pt-2 border-t">
            <p className="text-sm font-medium mb-2">Connect:</p>
            <div className="flex flex-wrap gap-2">
              {profile.facebook && (
                <a
                  href={profile.facebook.startsWith('http') ? profile.facebook : `https://facebook.com/${profile.facebook}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-muted-foreground hover:text-primary transition-colors"
                  title="Facebook"
                >
                  <SiFacebook className="h-5 w-5" />
                </a>
              )}
              {profile.instagram && (
                <a
                  href={profile.instagram.startsWith('http') ? profile.instagram : `https://instagram.com/${profile.instagram}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-muted-foreground hover:text-primary transition-colors"
                  title="Instagram"
                >
                  <SiInstagram className="h-5 w-5" />
                </a>
              )}
              {profile.telegram && (
                <a
                  href={profile.telegram.startsWith('http') ? profile.telegram : `https://t.me/${profile.telegram}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-muted-foreground hover:text-primary transition-colors"
                  title="Telegram"
                >
                  <Send className="h-5 w-5" />
                </a>
              )}
              {profile.website && (
                <a
                  href={profile.website.startsWith('http') ? profile.website : `https://${profile.website}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-muted-foreground hover:text-primary transition-colors"
                  title="Website"
                >
                  <Globe className="h-5 w-5" />
                </a>
              )}
            </div>
          </div>
        )}

        {/* Crypto Address */}
        {profile.cryptoAddress && (
          <div className="pt-2 border-t">
            <p className="text-sm font-medium mb-1 flex items-center gap-1">
              <Wallet className="h-3 w-3" />
              Crypto Address:
            </p>
            <p className="text-xs font-mono text-muted-foreground break-all">
              {profile.cryptoAddress}
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

function Label({ children, className }: { children: React.ReactNode; className?: string }) {
  return <label className={className}>{children}</label>;
}
