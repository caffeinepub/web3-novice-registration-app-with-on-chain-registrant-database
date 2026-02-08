import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Sparkles, Trophy } from 'lucide-react';

type BrickState = 'intact' | 'removed';

interface Brick {
  id: number;
  state: BrickState;
}

const GRID_ROWS = 8;
const GRID_COLS = 10;

export default function GamePage() {
  const [bricks, setBricks] = useState<Brick[]>(() =>
    Array.from({ length: GRID_ROWS * GRID_COLS }, (_, i) => ({
      id: i,
      state: 'intact' as BrickState,
    }))
  );
  const [selectedBrick, setSelectedBrick] = useState<number | null>(null);
  const [confirmationChecked, setConfirmationChecked] = useState(false);

  const removedCount = bricks.filter((b) => b.state === 'removed').length;
  const hasRemovedBrick = removedCount > 0;

  const handleBrickClick = (brickId: number) => {
    // Only allow clicking if no brick has been removed yet
    if (hasRemovedBrick) {
      return;
    }

    const brick = bricks.find((b) => b.id === brickId);
    if (brick && brick.state === 'intact') {
      setSelectedBrick(brickId);
      setConfirmationChecked(false);
    }
  };

  const handleConfirmRemoval = () => {
    if (selectedBrick !== null && confirmationChecked) {
      setBricks((prev) =>
        prev.map((brick) =>
          brick.id === selectedBrick ? { ...brick, state: 'removed' } : brick
        )
      );
      setSelectedBrick(null);
      setConfirmationChecked(false);
    }
  };

  const handleCancelRemoval = () => {
    setSelectedBrick(null);
    setConfirmationChecked(false);
  };

  const totalBricks = bricks.length;
  const progress = Math.round((removedCount / totalBricks) * 100);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Header Section */}
        <div className="text-center space-y-4">
          <div className="flex items-center justify-center gap-2">
            <Sparkles className="h-8 w-8 text-primary" />
            <h1 className="text-4xl font-bold">Brick Breaker Game</h1>
            <Sparkles className="h-8 w-8 text-primary" />
          </div>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Remove a brick to reveal what's hidden behind the wall.
          </p>
        </div>

        {/* Progress Card */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Trophy className="h-5 w-5 text-primary" />
              Progress
            </CardTitle>
            <CardDescription>
              {removedCount} of {totalBricks} bricks removed ({progress}%)
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="w-full bg-muted rounded-full h-4 overflow-hidden">
              <div
                className="bg-primary h-full transition-all duration-500 ease-out"
                style={{ width: `${progress}%` }}
              />
            </div>
          </CardContent>
        </Card>

        {/* Brick Wall */}
        <Card>
          <CardHeader>
            <CardTitle>Brick Wall</CardTitle>
            <CardDescription>
              {hasRemovedBrick ? 'You have already removed a brick' : 'Click on any brick to remove it'}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="relative">
              {/* Hidden text behind the bricks */}
              {hasRemovedBrick && (
                <div className="absolute inset-0 flex items-center justify-center p-8 z-0">
                  <p className="text-2xl md:text-3xl font-bold text-center text-primary/80 leading-relaxed">
                    Congrats ! You just got your first REAL WORLD ASSET
                  </p>
                </div>
              )}

              {/* Brick grid */}
              <div
                className="relative grid gap-1 p-4 bg-muted/50 rounded-lg z-10"
                style={{
                  gridTemplateColumns: `repeat(${GRID_COLS}, minmax(0, 1fr))`,
                }}
              >
                {bricks.map((brick) => (
                  <button
                    key={brick.id}
                    onClick={() => handleBrickClick(brick.id)}
                    disabled={brick.state === 'removed' || hasRemovedBrick}
                    className={`
                      aspect-[2/1] rounded transition-all duration-300
                      ${
                        brick.state === 'intact'
                          ? hasRemovedBrick
                            ? 'bg-gradient-to-br from-amber-500 to-amber-700 cursor-not-allowed opacity-90'
                            : 'bg-gradient-to-br from-amber-500 to-amber-700 hover:from-amber-600 hover:to-amber-800 shadow-md hover:shadow-lg cursor-pointer'
                          : 'bg-transparent cursor-not-allowed'
                      }
                    `}
                    aria-label={`Brick ${brick.id + 1}`}
                  />
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Confirmation Dialog */}
        <Dialog open={selectedBrick !== null} onOpenChange={(open) => !open && handleCancelRemoval()}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Confirm Brick Removal</DialogTitle>
              <DialogDescription>
                Are you sure you want to remove this brick? This action will reveal what's hidden behind the wall.
              </DialogDescription>
            </DialogHeader>

            <div className="py-4">
              <div className="flex items-start gap-3 p-4 rounded-lg bg-muted/50">
                <Checkbox
                  id="confirm-removal"
                  checked={confirmationChecked}
                  onCheckedChange={(checked) => setConfirmationChecked(checked === true)}
                />
                <div className="space-y-1">
                  <Label
                    htmlFor="confirm-removal"
                    className="text-sm font-medium leading-none cursor-pointer"
                  >
                    I confirm that I want to remove this brick
                  </Label>
                  <p className="text-sm text-muted-foreground">
                    Check this box to enable the removal action
                  </p>
                </div>
              </div>
            </div>

            <DialogFooter className="gap-2">
              <Button variant="outline" onClick={handleCancelRemoval}>
                Cancel
              </Button>
              <Button
                onClick={handleConfirmRemoval}
                disabled={!confirmationChecked}
              >
                Remove Brick
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
