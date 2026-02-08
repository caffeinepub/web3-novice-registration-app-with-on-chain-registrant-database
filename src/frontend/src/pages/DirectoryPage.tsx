import { useState, useMemo } from 'react';
import { useCurrentUser } from '../hooks/useCurrentUser';
import { useSearchRegistrants, useDeleteRegistrant } from '../hooks/useQueries';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Search, Users, Loader2, Trash2, AlertCircle, ExternalLink, Wallet } from 'lucide-react';
import { SiFacebook, SiInstagram, SiTelegram } from 'react-icons/si';
import { toast } from 'sonner';

const SKILL_LEVELS = ['All Levels', 'Beginner', 'Intermediate', 'Advanced'];

export default function DirectoryPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [skillFilter, setSkillFilter] = useState('All Levels');
  const [deleteTarget, setDeleteTarget] = useState<string | null>(null);
  
  const { isAdmin } = useCurrentUser();
  const { data: registrants = [], isLoading, error } = useSearchRegistrants(searchTerm);
  const deleteRegistrant = useDeleteRegistrant();

  const filteredRegistrants = useMemo(() => {
    if (skillFilter === 'All Levels') {
      return registrants;
    }
    return registrants.filter(r => r.skillLevel === skillFilter);
  }, [registrants, skillFilter]);

  const handleDelete = async () => {
    if (!deleteTarget) return;

    try {
      await deleteRegistrant.mutateAsync(deleteTarget);
      toast.success('Registrant removed successfully');
      setDeleteTarget(null);
    } catch (error: any) {
      toast.error(error.message || 'Failed to remove registrant');
    }
  };

  return (
    <div className="container py-16">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2">Community Directory</h1>
        <p className="text-lg text-muted-foreground">
          Browse and connect with Web3 learners from around the world
        </p>
      </div>

      {/* Search and Filter */}
      <Card className="mb-8">
        <CardContent className="pt-6">
          <div className="grid md:grid-cols-2 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by name..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={skillFilter} onValueChange={setSkillFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Filter by skill level" />
              </SelectTrigger>
              <SelectContent>
                {SKILL_LEVELS.map((level) => (
                  <SelectItem key={level} value={level}>
                    {level}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Loading State */}
      {isLoading && (
        <div className="flex items-center justify-center py-16">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      )}

      {/* Error State */}
      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Failed to load registrants. Please try again later.
          </AlertDescription>
        </Alert>
      )}

      {/* Empty State */}
      {!isLoading && !error && filteredRegistrants.length === 0 && (
        <Card>
          <CardContent className="py-16 text-center">
            <Users className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
            <h3 className="text-xl font-semibold mb-2">No Registrants Found</h3>
            <p className="text-muted-foreground">
              {searchTerm || skillFilter !== 'All Levels'
                ? 'Try adjusting your search or filters'
                : 'Be the first to join the community!'}
            </p>
          </CardContent>
        </Card>
      )}

      {/* Registrants Grid */}
      {!isLoading && !error && filteredRegistrants.length > 0 && (
        <>
          <div className="mb-4 text-sm text-muted-foreground">
            Showing {filteredRegistrants.length} {filteredRegistrants.length === 1 ? 'registrant' : 'registrants'}
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredRegistrants.map((registrant) => (
              <Card key={registrant.email} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="text-xl mb-2">{registrant.name}</CardTitle>
                      <Badge variant="secondary">{registrant.skillLevel}</Badge>
                    </div>
                    {isAdmin && (
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setDeleteTarget(registrant.email)}
                        className="text-destructive hover:text-destructive hover:bg-destructive/10"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">Email</p>
                      <p className="text-sm font-medium break-all">{registrant.email}</p>
                    </div>
                    {registrant.id && registrant.id !== 'Web3 enthusiast' && (
                      <div>
                        <p className="text-sm text-muted-foreground mb-1">Bio</p>
                        <p className="text-sm">{registrant.id}</p>
                      </div>
                    )}
                    {registrant.interests.length > 0 && (
                      <div>
                        <p className="text-sm text-muted-foreground mb-2">Interests</p>
                        <div className="flex flex-wrap gap-1">
                          {registrant.interests.map((interest) => (
                            <Badge key={interest} variant="outline" className="text-xs">
                              {interest}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Social Media Links */}
                    {(registrant.facebook || registrant.instagram || registrant.telegram || registrant.website) && (
                      <div>
                        <p className="text-sm text-muted-foreground mb-2">Connect</p>
                        <div className="flex flex-wrap gap-2">
                          {registrant.facebook && (
                            <a
                              href={registrant.facebook.startsWith('http') ? registrant.facebook : `https://facebook.com/${registrant.facebook}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-1 text-xs px-2 py-1 rounded-md bg-blue-100 text-blue-700 hover:bg-blue-200 transition-colors"
                            >
                              <SiFacebook className="h-3 w-3" />
                              Facebook
                            </a>
                          )}
                          {registrant.instagram && (
                            <a
                              href={registrant.instagram.startsWith('http') ? registrant.instagram : `https://instagram.com/${registrant.instagram}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-1 text-xs px-2 py-1 rounded-md bg-pink-100 text-pink-700 hover:bg-pink-200 transition-colors"
                            >
                              <SiInstagram className="h-3 w-3" />
                              Instagram
                            </a>
                          )}
                          {registrant.telegram && (
                            <a
                              href={registrant.telegram.startsWith('http') ? registrant.telegram : `https://t.me/${registrant.telegram}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-1 text-xs px-2 py-1 rounded-md bg-sky-100 text-sky-700 hover:bg-sky-200 transition-colors"
                            >
                              <SiTelegram className="h-3 w-3" />
                              Telegram
                            </a>
                          )}
                          {registrant.website && (
                            <a
                              href={registrant.website.startsWith('http') ? registrant.website : `https://${registrant.website}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-1 text-xs px-2 py-1 rounded-md bg-gray-100 text-gray-700 hover:bg-gray-200 transition-colors"
                            >
                              <ExternalLink className="h-3 w-3" />
                              Website
                            </a>
                          )}
                        </div>
                      </div>
                    )}

                    {/* Crypto Address */}
                    {registrant.cryptoAddress && (
                      <div>
                        <p className="text-sm text-muted-foreground mb-1">Crypto address</p>
                        <div className="flex items-center gap-2 px-2 py-1.5 rounded-md bg-amber-50 border border-amber-200">
                          <Wallet className="h-3 w-3 text-amber-700 flex-shrink-0" />
                          <p className="text-xs font-mono text-amber-900 break-all">
                            {registrant.cryptoAddress}
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </>
      )}

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={!!deleteTarget} onOpenChange={() => setDeleteTarget(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Remove Registrant</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to remove this registrant from the directory? 
              This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              disabled={deleteRegistrant.isPending}
            >
              {deleteRegistrant.isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Removing...
                </>
              ) : (
                'Remove'
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
