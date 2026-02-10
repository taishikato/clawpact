"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { X, Loader2 } from "lucide-react";
import type { Agent } from "@/lib/types";

export function EditAgentForm({ agent }: { agent: Agent }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const [name, setName] = useState(agent.name);
  const [description, setDescription] = useState(agent.description);
  const [skillInput, setSkillInput] = useState("");
  const [skills, setSkills] = useState<string[]>(agent.skills);
  const [websiteUrl, setWebsiteUrl] = useState(agent.website_url ?? "");
  const [githubUrl, setGithubUrl] = useState(agent.github_url ?? "");

  function addSkill() {
    const trimmed = skillInput.trim();
    if (trimmed && !skills.includes(trimmed)) {
      setSkills([...skills, trimmed]);
      setSkillInput("");
    }
  }

  function removeSkill(skill: string) {
    setSkills(skills.filter((s) => s !== skill));
  }

  function handleSkillKeyDown(e: React.KeyboardEvent) {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      addSkill();
    }
  }

  function validate(): boolean {
    const newErrors: Record<string, string> = {};
    if (!name.trim()) newErrors.name = "Agent name is required.";
    if (name.trim().length > 100) newErrors.name = "Name must be under 100 characters.";
    if (!description.trim()) newErrors.description = "Description is required.";
    if (description.trim().length > 500) newErrors.description = "Description must be under 500 characters.";
    if (websiteUrl && !/^https?:\/\/.+/.test(websiteUrl)) newErrors.websiteUrl = "Must be a valid URL starting with http(s)://";
    if (githubUrl && !/^https?:\/\/(www\.)?github\.com\/.+/.test(githubUrl)) newErrors.githubUrl = "Must be a valid GitHub URL.";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    try {
      const res = await fetch(`/api/agents/${agent.slug}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name.trim(),
          description: description.trim(),
          skills,
          website_url: websiteUrl || null,
          github_url: githubUrl || null,
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        setErrors({ submit: data.error || "Failed to update agent." });
        return;
      }

      router.push(`/agents/${agent.slug}`);
    } catch {
      setErrors({ submit: "Network error. Please try again." });
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="mt-8 space-y-6 max-w-md">
      {/* Name */}
      <div className="space-y-1.5">
        <Label htmlFor="name">Agent name</Label>
        <Input
          id="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="e.g. CodeReview Pro"
          aria-invalid={!!errors.name}
        />
        <p className="text-[10px] text-muted-foreground">
          clawpact.com/agents/{agent.slug}
        </p>
        {errors.name && (
          <p className="text-[10px] text-destructive">{errors.name}</p>
        )}
      </div>

      {/* Description */}
      <div className="space-y-1.5">
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="What does this agent do? What makes it trustworthy?"
          aria-invalid={!!errors.description}
        />
        <p className="text-[10px] text-muted-foreground">
          {description.length}/500
        </p>
        {errors.description && (
          <p className="text-[10px] text-destructive">{errors.description}</p>
        )}
      </div>

      {/* Skills */}
      <div className="space-y-1.5">
        <Label htmlFor="skills">Skills</Label>
        <div className="flex gap-1.5">
          <Input
            id="skills"
            value={skillInput}
            onChange={(e) => setSkillInput(e.target.value)}
            onKeyDown={handleSkillKeyDown}
            placeholder="Type a skill and press Enter"
          />
          <Button type="button" variant="outline" size="default" onClick={addSkill}>
            Add
          </Button>
        </div>
        {skills.length > 0 && (
          <div className="flex flex-wrap gap-1 pt-1">
            {skills.map((skill) => (
              <Badge key={skill} variant="secondary" className="gap-1">
                {skill}
                <button
                  type="button"
                  onClick={() => removeSkill(skill)}
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  <X className="size-2.5" />
                </button>
              </Badge>
            ))}
          </div>
        )}
      </div>

      {/* Website URL */}
      <div className="space-y-1.5">
        <Label htmlFor="website">Website URL</Label>
        <Input
          id="website"
          type="url"
          value={websiteUrl}
          onChange={(e) => setWebsiteUrl(e.target.value)}
          placeholder="https://"
          aria-invalid={!!errors.websiteUrl}
        />
        {errors.websiteUrl && (
          <p className="text-[10px] text-destructive">{errors.websiteUrl}</p>
        )}
      </div>

      {/* GitHub URL */}
      <div className="space-y-1.5">
        <Label htmlFor="github">GitHub URL</Label>
        <Input
          id="github"
          type="url"
          value={githubUrl}
          onChange={(e) => setGithubUrl(e.target.value)}
          placeholder="https://github.com/..."
          aria-invalid={!!errors.githubUrl}
        />
        {errors.githubUrl && (
          <p className="text-[10px] text-destructive">{errors.githubUrl}</p>
        )}
      </div>

      {/* Submit error */}
      {errors.submit && (
        <p className="text-xs text-destructive">{errors.submit}</p>
      )}

      {/* Submit */}
      <Button type="submit" disabled={loading}>
        {loading && <Loader2 className="size-3.5 animate-spin" data-icon="inline-start" />}
        {loading ? "Saving..." : "Save changes"}
      </Button>
    </form>
  );
}
