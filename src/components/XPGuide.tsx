"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { XP_REWARDS } from "@/lib/badges";
import {
  CheckCircle2,
  FolderKanban,
  BookOpen,
  MessageSquare,
  Star,
  UserPlus,
  Trophy,
} from "lucide-react";

export function XPGuide() {
  const xpActions = [
    {
      action: "Complete a task",
      xp: XP_REWARDS.TASK_COMPLETE,
      icon: <CheckCircle2 className="w-5 h-5 text-green-500" />,
      description: "Mark tasks as completed in projects"
    },
    {
      action: "Create a project",
      xp: XP_REWARDS.PROJECT_CREATE,
      icon: <FolderKanban className="w-5 h-5 text-blue-500" />,
      description: "Start a new project"
    },
    {
      action: "Share a resource",
      xp: XP_REWARDS.RESOURCE_SHARE,
      icon: <BookOpen className="w-5 h-5 text-purple-500" />,
      description: "Share useful learning resources"
    },
    {
      action: "Create a post",
      xp: XP_REWARDS.POST_CREATE,
      icon: <MessageSquare className="w-5 h-5 text-orange-500" />,
      description: "Share collaboration posts"
    },
    {
      action: "Receive an endorsement",
      xp: XP_REWARDS.ENDORSEMENT_RECEIVED,
      icon: <Star className="w-5 h-5 text-yellow-500" />,
      description: "Get endorsed for your skills"
    },
    {
      action: "Join a project",
      xp: XP_REWARDS.JOIN_PROJECT,
      icon: <UserPlus className="w-5 h-5 text-cyan-500" />,
      description: "Get accepted into a project"
    },
  ];

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <Trophy className="w-5 h-5 text-yellow-500" />
          <CardTitle>How to Earn XP</CardTitle>
        </div>
        <CardDescription>
          Complete these actions to earn experience points and unlock badges
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {xpActions.map((item, index) => (
            <div
              key={index}
              className="flex items-center justify-between p-3 rounded-lg border bg-card hover:bg-accent/50 transition-colors"
            >
              <div className="flex items-center gap-3">
                {item.icon}
                <div>
                  <p className="font-medium">{item.action}</p>
                  <p className="text-sm text-muted-foreground">{item.description}</p>
                </div>
              </div>
              <Badge variant="secondary" className="font-bold">
                +{item.xp} XP
              </Badge>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}