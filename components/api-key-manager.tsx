"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { cn } from "@/lib/utils";
import { Plus, Copy, Check, Loader2, Ban } from "lucide-react";

interface ApiKey {
  id: string;
  label: string | null;
  key_prefix: string;
  created_at: string;
  last_used_at: string | null;
  revoked_at: string | null;
}

function formatRelativeTime(dateString: string | null): string {
  if (!dateString) return "Never";
  const now = Date.now();
  const then = new Date(dateString).getTime();
  const diffMs = now - then;
  const diffSec = Math.floor(diffMs / 1000);

  if (diffSec < 60) return "Just now";
  const diffMin = Math.floor(diffSec / 60);
  if (diffMin < 60) return `${diffMin}m ago`;
  const diffHr = Math.floor(diffMin / 60);
  if (diffHr < 24) return `${diffHr}h ago`;
  const diffDay = Math.floor(diffHr / 24);
  if (diffDay < 30) return `${diffDay}d ago`;
  return new Date(dateString).toLocaleDateString();
}

function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export function ApiKeyManager({ initialKeys }: { initialKeys: ApiKey[] }) {
  const [keys, setKeys] = useState<ApiKey[]>(initialKeys);
  const [generating, setGenerating] = useState(false);
  const [newKeyLabel, setNewKeyLabel] = useState("");
  const [newRawKey, setNewRawKey] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [revokingId, setRevokingId] = useState<string | null>(null);

  async function handleGenerate() {
    setGenerating(true);
    setError(null);
    try {
      const res = await fetch("/api/dashboard/api-keys", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ label: newKeyLabel || null }),
      });
      const json = await res.json();
      if (!res.ok) {
        setError(json.error || "Failed to generate key.");
        return;
      }
      setNewRawKey(json.data.key);
      // Add the new key to the list (without raw key)
      setKeys((prev) => [
        {
          id: json.data.id,
          label: json.data.label,
          key_prefix: json.data.key_prefix,
          created_at: json.data.created_at,
          last_used_at: null,
          revoked_at: null,
        },
        ...prev,
      ]);
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setGenerating(false);
    }
  }

  async function handleRevoke(id: string) {
    setRevokingId(id);
    setError(null);
    try {
      const res = await fetch(`/api/dashboard/api-keys/${id}`, {
        method: "PATCH",
      });
      const json = await res.json();
      if (!res.ok) {
        setError(json.error || "Failed to revoke key.");
        return;
      }
      setKeys((prev) =>
        prev.map((k) =>
          k.id === id ? { ...k, revoked_at: json.data.revoked_at } : k
        )
      );
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setRevokingId(null);
    }
  }

  async function copyToClipboard(text: string) {
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  function resetGenerateDialog() {
    setNewKeyLabel("");
    setNewRawKey(null);
    setCopied(false);
    setError(null);
  }

  const activeCount = keys.filter((k) => !k.revoked_at).length;

  return (
    <div className="space-y-6">
      {/* Header with generate button */}
      <div className="flex items-center justify-between">
        <p className="text-xs text-muted-foreground">
          {activeCount} of 5 active keys
        </p>
        <AlertDialog onOpenChange={(open) => { if (!open) resetGenerateDialog(); }}>
          <AlertDialogTrigger
            render={
              <Button size="sm" disabled={activeCount >= 5}>
                <Plus className="size-3.5" data-icon="inline-start" />
                Generate new key
              </Button>
            }
          />
          <AlertDialogContent>
            {newRawKey ? (
              <>
                <AlertDialogHeader>
                  <AlertDialogTitle>API key created</AlertDialogTitle>
                  <AlertDialogDescription>
                    This key will only be shown once. Copy it now and store it
                    securely.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <div className="rounded-none bg-muted p-3">
                  <code className="break-all text-xs">{newRawKey}</code>
                </div>
                <AlertDialogFooter>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => copyToClipboard(newRawKey)}
                  >
                    {copied ? (
                      <Check className="size-3.5" data-icon="inline-start" />
                    ) : (
                      <Copy className="size-3.5" data-icon="inline-start" />
                    )}
                    {copied ? "Copied" : "Copy key"}
                  </Button>
                  <AlertDialogCancel>Done</AlertDialogCancel>
                </AlertDialogFooter>
              </>
            ) : (
              <>
                <AlertDialogHeader>
                  <AlertDialogTitle>Generate new API key</AlertDialogTitle>
                  <AlertDialogDescription>
                    API keys allow programmatic access to manage your agents.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <div className="space-y-1.5">
                  <Label htmlFor="key-label">Label (optional)</Label>
                  <Input
                    id="key-label"
                    value={newKeyLabel}
                    onChange={(e) => setNewKeyLabel(e.target.value)}
                    placeholder="e.g. Production server"
                  />
                </div>
                {error && (
                  <p className="text-xs text-destructive">{error}</p>
                )}
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction
                    onClick={(e) => {
                      e.preventDefault();
                      handleGenerate();
                    }}
                    disabled={generating}
                  >
                    {generating && (
                      <Loader2
                        className="size-3.5 animate-spin"
                        data-icon="inline-start"
                      />
                    )}
                    {generating ? "Generating..." : "Generate"}
                  </AlertDialogAction>
                </AlertDialogFooter>
              </>
            )}
          </AlertDialogContent>
        </AlertDialog>
      </div>

      {/* Error banner */}
      {error && !generating && (
        <p className="text-xs text-destructive">{error}</p>
      )}

      {/* Key list */}
      {keys.length === 0 ? (
        <div className="flex flex-col items-center py-12 text-center">
          <p className="text-sm text-muted-foreground">
            No API keys yet. Generate one to get started.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {keys.map((apiKey) => {
            const isRevoked = !!apiKey.revoked_at;
            return (
              <Card
                key={apiKey.id}
                className={cn(isRevoked && "opacity-50")}
              >
                <CardHeader className="flex-row items-center justify-between space-y-0 pb-2">
                  <div className="space-y-0.5">
                    <CardTitle className="text-sm font-medium">
                      {apiKey.label || "Untitled"}
                    </CardTitle>
                    <CardDescription className="font-mono text-xs">
                      {apiKey.key_prefix}
                    </CardDescription>
                  </div>
                  <Badge variant={isRevoked ? "secondary" : "outline"}>
                    {isRevoked ? "Revoked" : "Active"}
                  </Badge>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <div className="flex gap-4 text-xs text-muted-foreground">
                      <span>Created {formatDate(apiKey.created_at)}</span>
                      <span>
                        Last used: {formatRelativeTime(apiKey.last_used_at)}
                      </span>
                    </div>
                    {!isRevoked && (
                      <AlertDialog>
                        <AlertDialogTrigger
                          render={
                            <Button
                              variant="ghost"
                              size="xs"
                              disabled={revokingId === apiKey.id}
                            >
                              {revokingId === apiKey.id ? (
                                <Loader2
                                  className="size-3 animate-spin"
                                  data-icon="inline-start"
                                />
                              ) : (
                                <Ban
                                  className="size-3"
                                  data-icon="inline-start"
                                />
                              )}
                              Revoke
                            </Button>
                          }
                        />
                        <AlertDialogContent size="sm">
                          <AlertDialogHeader>
                            <AlertDialogTitle>Revoke API key</AlertDialogTitle>
                            <AlertDialogDescription>
                              Are you sure? Any agent using this key will lose
                              access immediately. This action cannot be undone.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction
                              variant="destructive"
                              onClick={() => handleRevoke(apiKey.id)}
                            >
                              Revoke key
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    )}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
