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
import { Search, Users, Loader2, Trash2, AlertCircle } from 'lucide-react';
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
