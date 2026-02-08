import { useState } from 'react';
import { Copy, Check, Info, ExternalLink, AlertCircle, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  getDeploymentInfo, 
  formatCanisterId, 
  getNetworkDisplayName,
  isMainnetConfigComplete,
  getConfigDiagnostic
} from '../utils/deploymentInfo';

export default function DeploymentInfo() {
  const [copiedField, setCopiedField] = useState<string | null>(null);
  const deploymentInfo = getDeploymentInfo();
  const configComplete = isMainnetConfigComplete(deploymentInfo);
  const diagnostic = getConfigDiagnostic(deploymentInfo);

  const copyToClipboard = async (text: string, field: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedField(field);
      setTimeout(() => setCopiedField(null), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const CopyButton = ({ text, field }: { text: string; field: string }) => (
    <Button
      variant="ghost"
      size="icon"
      className="h-6 w-6"
      onClick={() => copyToClipboard(text, field)}
    >
      {copiedField === field ? (
        <Check className="h-3 w-3 text-green-600" />
      ) : (
        <Copy className="h-3 w-3" />
      )}
    </Button>
  );

  const InferredBadge = () => (
    <span className="text-xs text-amber-600 dark:text-amber-400 ml-2">(detected from URL)</span>
  );

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className="text-xs text-muted-foreground hover:text-primary"
        >
          <Info className="h-3 w-3 mr-1" />
          Deployment Info
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[480px]" align="end">
        <div className="space-y-4">
          <div>
            <h4 className="font-semibold text-sm mb-3">Deployment Information</h4>
            <p className="text-xs text-muted-foreground">
              Use this panel to verify your deployment and get the correct public URL to share.
            </p>
          </div>

          {deploymentInfo.hasMismatch && deploymentInfo.correctPublicUrl && (
            <Alert variant="destructive">
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription className="text-xs space-y-3">
                <div>
                  <strong>Canister ID Mismatch Detected</strong>
                  <p className="mt-1">{deploymentInfo.mismatchDetails}</p>
                </div>
                <div className="pt-2 border-t border-destructive/20">
                  <p className="font-medium mb-2">Correct Public URL:</p>
                  <div className="flex items-center gap-2 bg-background/50 p-2 rounded">
                    <code className="text-xs flex-1 break-all">
                      {deploymentInfo.correctPublicUrl}
                    </code>
                    <div className="flex gap-1 shrink-0">
                      <Button
                        variant="outline"
                        size="sm"
                        className="h-7 text-xs"
                        onClick={() => window.open(deploymentInfo.correctPublicUrl!, '_blank')}
                      >
                        <ExternalLink className="h-3 w-3 mr-1" />
                        Open
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="h-7 text-xs"
                        onClick={() => copyToClipboard(deploymentInfo.correctPublicUrl!, 'correct-url')}
                      >
                        {copiedField === 'correct-url' ? (
                          <Check className="h-3 w-3" />
                        ) : (
                          <Copy className="h-3 w-3" />
                        )}
                      </Button>
                    </div>
                  </div>
                  <p className="text-xs mt-2 text-muted-foreground">
                    Click "Open" to navigate to the correct URL, then verify this warning disappears.
                  </p>
                </div>
              </AlertDescription>
            </Alert>
          )}

          {diagnostic && !deploymentInfo.hasMismatch && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription className="text-xs">
                {diagnostic}
              </AlertDescription>
            </Alert>
          )}

          <div className="space-y-3">
            <div>
              <label className="text-xs font-medium text-muted-foreground">Network</label>
              <div className="flex items-center justify-between mt-1">
                <span className="text-sm font-mono">
                  {getNetworkDisplayName(deploymentInfo.network)}
                  {deploymentInfo.isInferred.network && <InferredBadge />}
                </span>
              </div>
            </div>

            {deploymentInfo.currentOrigin && (
              <div>
                <label className="text-xs font-medium text-muted-foreground">Current Browser URL</label>
                <div className="flex items-center justify-between gap-2 mt-1">
                  <span className="text-sm font-mono text-muted-foreground truncate flex-1">
                    {deploymentInfo.currentOrigin}
                  </span>
                  <CopyButton text={deploymentInfo.currentOrigin} field="origin" />
                </div>
              </div>
            )}

            {deploymentInfo.publicUrl && (
              <div>
                <label className="text-xs font-medium text-muted-foreground">
                  {deploymentInfo.network === 'ic' ? 'Shareable Public URL (icp0.io)' : 'Public URL'}
                </label>
                <div className="flex items-center justify-between gap-2 mt-1">
                  <a
                    href={deploymentInfo.publicUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm font-mono text-primary hover:underline truncate flex-1"
                  >
                    {deploymentInfo.publicUrl}
                  </a>
                  <div className="flex gap-1">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-6 w-6"
                      asChild
                    >
                      <a
                        href={deploymentInfo.publicUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <ExternalLink className="h-3 w-3" />
                      </a>
                    </Button>
                    <CopyButton text={deploymentInfo.publicUrl} field="url" />
                  </div>
                </div>
                {deploymentInfo.network === 'ic' && !deploymentInfo.hasMismatch && (
                  <p className="text-xs text-green-600 dark:text-green-400 mt-1">
                    ✓ This is the correct URL to share
                  </p>
                )}
              </div>
            )}

            <div>
              <label className="text-xs font-medium text-muted-foreground">Frontend Canister ID</label>
              <div className="flex items-center justify-between gap-2 mt-1">
                <span className="text-sm font-mono truncate flex-1">
                  {formatCanisterId(deploymentInfo.frontendCanisterId)}
                  {deploymentInfo.isInferred.frontendCanisterId && <InferredBadge />}
                </span>
                {deploymentInfo.frontendCanisterId && (
                  <CopyButton text={deploymentInfo.frontendCanisterId} field="frontend" />
                )}
              </div>
              {deploymentInfo.network === 'ic' && deploymentInfo.frontendCanisterId && (
                <p className="text-xs text-muted-foreground mt-1">
                  Detected from current hostname
                </p>
              )}
            </div>

            <div>
              <label className="text-xs font-medium text-muted-foreground">Backend Canister ID</label>
              <div className="flex items-center justify-between gap-2 mt-1">
                <span className={`text-sm font-mono truncate flex-1 ${!deploymentInfo.backendCanisterId && deploymentInfo.network === 'ic' ? 'text-amber-600 dark:text-amber-400' : ''}`}>
                  {formatCanisterId(deploymentInfo.backendCanisterId)}
                </span>
                {deploymentInfo.backendCanisterId && (
                  <CopyButton text={deploymentInfo.backendCanisterId} field="backend" />
                )}
              </div>
              {!deploymentInfo.backendCanisterId && deploymentInfo.network === 'ic' && (
                <p className="text-xs text-amber-600 dark:text-amber-400 mt-1">
                  ⚠ Backend canister ID not configured. Check VITE_BACKEND_CANISTER_ID in build environment.
                </p>
              )}
            </div>
          </div>

          {deploymentInfo.network === 'ic' && (
            <div className="pt-3 border-t border-border">
              <p className="text-xs text-muted-foreground">
                {configComplete && !deploymentInfo.hasMismatch
                  ? '✓ This application is deployed on the Internet Computer mainnet.'
                  : deploymentInfo.hasMismatch
                  ? '⚠ Canister ID mismatch detected. Use the correct URL above to resolve.'
                  : '⚠ Running on mainnet with incomplete configuration. Some features may not work correctly.'}
              </p>
              {deploymentInfo.isInferred.frontendCanisterId && !deploymentInfo.hasMismatch && (
                <p className="text-xs text-muted-foreground mt-2">
                  Frontend canister ID was detected from the URL you're currently visiting. This is the most reliable source for the correct public URL.
                </p>
              )}
              {!deploymentInfo.backendCanisterId && (
                <p className="text-xs text-amber-600 dark:text-amber-400 mt-2">
                  <strong>Note:</strong> Backend canister ID is missing. If you experience authentication or data issues, ensure the backend was deployed and VITE_BACKEND_CANISTER_ID was set during build.
                </p>
              )}
            </div>
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
}
