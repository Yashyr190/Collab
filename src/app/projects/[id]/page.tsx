"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { AppNavigation } from "@/components/AppNavigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import {
  Users,
  Calendar,
  CheckCircle2,
  Circle,
  Clock,
  Activity,
  Settings,
  Send,
  UserPlus,
} from "lucide-react";
import Link from "next/link";
import { useToast } from "@/hooks/use-toast";

// Helper function to safely parse JSON
const safeJsonParse = (str: any, fallback: any = []) => {
  // If already an array or object, return it directly
  if (Array.isArray(str)) return str;
  if (typeof str === 'object' && str !== null) return str;
  
  // If not a string, return fallback
  if (typeof str !== 'string') return fallback;
  
  // If empty string, return fallback
  if (str.trim() === "") return fallback;
  
  // Try to parse JSON string
  try {
    return JSON.parse(str);
  } catch (e) {
    console.warn("Failed to parse JSON:", str, e);
    return fallback;
  }
};

export default function ProjectDetailPage() {
  const router = useRouter();
  const params = useParams();
  const { toast } = useToast();
  const [user, setUser] = useState<any>(null);
  const [project, setProject] = useState<any>(null);
  const [members, setMembers] = useState<any[]>([]);
  const [applications, setApplications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [applyDialogOpen, setApplyDialogOpen] = useState(false);
  const [applicationMessage, setApplicationMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [hasApplied, setHasApplied] = useState(false);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (!storedUser) {
      router.push("/auth/login");
      return;
    }

    const userData = safeJsonParse(storedUser, null);
    if (!userData) {
      router.push("/auth/login");
      return;
    }
    setUser(userData);
    loadProject(params.id as string, userData);
  }, [router, params.id]);

  const loadProject = async (projectId: string, userData: any) => {
    try {
      const response = await fetch(`/api/projects?id=${projectId}`);
      if (response.ok) {
        const data = await response.json();
        setProject(data);
        
        // Load members
        const memberIds = safeJsonParse(data.members, []);
        if (memberIds.length > 0) {
          loadMembers(memberIds);
        }

        // Load applications if owner
        if (userData.id === data.ownerId) {
          loadApplications(projectId);
        }

        // Check if user has already applied
        checkUserApplication(projectId, userData.id);
      }
    } catch (error) {
      console.error("Failed to load project:", error);
    } finally {
      setLoading(false);
    }
  };

  const loadMembers = async (memberIds: number[]) => {
    try {
      const memberPromises = memberIds.map((id) =>
        fetch(`/api/users?id=${id}`).then((res) => res.json())
      );
      const membersData = await Promise.all(memberPromises);
      setMembers(membersData);
    } catch (error) {
      console.error("Failed to load members:", error);
    }
  };

  const loadApplications = async (projectId: string) => {
    try {
      const response = await fetch(`/api/applications?projectId=${projectId}`);
      if (response.ok) {
        const data = await response.json();
        setApplications(data);
      }
    } catch (error) {
      console.error("Failed to load applications:", error);
    }
  };

  const checkUserApplication = async (projectId: string, userId: number) => {
    try {
      const response = await fetch(`/api/applications?projectId=${projectId}&userId=${userId}`);
      if (response.ok) {
        const data = await response.json();
        setHasApplied(data.length > 0);
      }
    } catch (error) {
      console.error("Failed to check application:", error);
    }
  };

  const handleApply = async () => {
    if (!applicationMessage.trim()) {
      toast({
        title: "Message required",
        description: "Please provide a message with your application",
        variant: "destructive",
      });
      return;
    }

    setSubmitting(true);
    try {
      const response = await fetch("/api/applications", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          projectId: parseInt(params.id as string),
          userId: user.id,
          message: applicationMessage,
        }),
      });

      if (response.ok) {
        toast({
          title: "Application submitted!",
          description: "The project owner will review your application soon.",
        });
        setApplyDialogOpen(false);
        setApplicationMessage("");
        setHasApplied(true);
      } else {
        const error = await response.json();
        toast({
          title: "Failed to submit",
          description: error.error || "Something went wrong",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to submit application",
        variant: "destructive",
      });
    } finally {
      setSubmitting(false);
    }
  };

  const handleApplicationAction = async (applicationId: number, status: string) => {
    try {
      const response = await fetch(`/api/applications/${applicationId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });

      if (response.ok) {
        toast({
          title: "Application updated",
          description: `Application ${status}`,
        });
        loadApplications(params.id as string);
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update application",
        variant: "destructive",
      });
    }
  };

  if (loading || !project) {
    return (
      <div className="min-h-screen bg-background">
        <AppNavigation />
        <div className="container mx-auto px-4 py-8">
          <Skeleton className="h-64 w-full mb-8" />
        </div>
      </div>
    );
  }

  const tasks = safeJsonParse(project.tasks, []);
  const isOwner = user?.id === project.ownerId;
  const isMember = safeJsonParse(project.members, []).includes(user?.id);

  return (
    <div className="min-h-screen bg-background">
      <AppNavigation />

      <div className="container mx-auto px-4 py-8 space-y-8">
        {/* Project Header */}
        <Card>
          <CardHeader>
            <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <Badge
                    variant={
                      project.status === "active"
                        ? "default"
                        : project.status === "planning"
                        ? "secondary"
                        : "outline"
                    }
                  >
                    {project.status}
                  </Badge>
                  {isOwner && <Badge variant="outline">Owner</Badge>}
                  {isMember && !isOwner && <Badge variant="outline">Member</Badge>}
                </div>
                <CardTitle className="text-3xl mb-2">{project.title}</CardTitle>
                <CardDescription>{project.description}</CardDescription>
              </div>
              <div className="flex gap-2">
                {isOwner && (
                  <Button variant="outline">
                    <Settings className="w-4 h-4 mr-2" />
                    Manage
                  </Button>
                )}
                {!isOwner && !isMember && !hasApplied && (
                  <Dialog open={applyDialogOpen} onOpenChange={setApplyDialogOpen}>
                    <DialogTrigger asChild>
                      <Button>
                        <UserPlus className="w-4 h-4 mr-2" />
                        Apply to Join
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Apply to {project.title}</DialogTitle>
                        <DialogDescription>
                          Tell the project owner why you'd like to join this project
                        </DialogDescription>
                      </DialogHeader>
                      <div className="space-y-4 py-4">
                        <div className="space-y-2">
                          <Label htmlFor="message">Your Message</Label>
                          <Textarea
                            id="message"
                            placeholder="Explain your experience, skills, and why you're interested in this project..."
                            value={applicationMessage}
                            onChange={(e) => setApplicationMessage(e.target.value)}
                            rows={6}
                          />
                        </div>
                      </div>
                      <DialogFooter>
                        <Button variant="outline" onClick={() => setApplyDialogOpen(false)}>
                          Cancel
                        </Button>
                        <Button onClick={handleApply} disabled={submitting}>
                          <Send className="w-4 h-4 mr-2" />
                          {submitting ? "Submitting..." : "Submit Application"}
                        </Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                )}
                {hasApplied && !isMember && (
                  <Button disabled variant="outline">
                    <Clock className="w-4 h-4 mr-2" />
                    Application Pending
                  </Button>
                )}
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col md:flex-row gap-6">
              <div className="flex-1 space-y-4">
                <div>
                  <div className="flex items-center justify-between text-sm mb-2">
                    <span className="text-muted-foreground">Progress</span>
                    <span className="font-semibold">{project.progress}%</span>
                  </div>
                  <Progress value={project.progress} className="h-2" />
                </div>
                
                <Separator />
                
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-muted-foreground mb-1">Created</p>
                    <p className="font-medium flex items-center gap-2">
                      <Calendar className="w-4 h-4" />
                      {new Date(project.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <div>
                    <p className="text-muted-foreground mb-1">Last Updated</p>
                    <p className="font-medium flex items-center gap-2">
                      <Activity className="w-4 h-4" />
                      {new Date(project.updatedAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Content Tabs */}
        <Tabs defaultValue="tasks" className="space-y-6">
          <TabsList className={`grid w-full ${isOwner ? 'grid-cols-4' : 'grid-cols-3'}`}>
            <TabsTrigger value="tasks">Tasks</TabsTrigger>
            <TabsTrigger value="members">Members</TabsTrigger>
            <TabsTrigger value="activity">Activity</TabsTrigger>
            {isOwner && (
              <TabsTrigger value="applications">
                Applications ({applications.length})
              </TabsTrigger>
            )}
          </TabsList>

          <TabsContent value="tasks" className="space-y-4">
            {tasks.length === 0 ? (
              <Card>
                <CardContent className="py-12 text-center">
                  <CheckCircle2 className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">No tasks yet</p>
                </CardContent>
              </Card>
            ) : (
              <div className="grid gap-4">
                {tasks.map((task: any) => (
                  <Card key={task.id}>
                    <CardContent className="pt-6">
                      <div className="flex items-start gap-4">
                        {task.status === "completed" ? (
                          <CheckCircle2 className="w-5 h-5 text-green-500 mt-0.5" />
                        ) : task.status === "in_progress" ? (
                          <Clock className="w-5 h-5 text-blue-500 mt-0.5" />
                        ) : (
                          <Circle className="w-5 h-5 text-muted-foreground mt-0.5" />
                        )}
                        <div className="flex-1">
                          <h4 className="font-semibold mb-1">{task.title}</h4>
                          <Badge
                            variant={
                              task.status === "completed"
                                ? "default"
                                : task.status === "in_progress"
                                ? "secondary"
                                : "outline"
                            }
                          >
                            {task.status.replace("_", " ")}
                          </Badge>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="members" className="space-y-4">
            {members.length === 0 ? (
              <Card>
                <CardContent className="py-12 text-center">
                  <Users className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">No members yet</p>
                </CardContent>
              </Card>
            ) : (
              <div className="grid md:grid-cols-2 gap-4">
                {members.map((member) => (
                  <Link key={member.id} href={`/profile/${member.id}`}>
                    <Card className="hover:shadow-md transition-shadow cursor-pointer">
                      <CardContent className="pt-6">
                        <div className="flex items-center gap-4">
                          <Avatar className="h-12 w-12">
                            <AvatarImage src={member.avatar} alt={member.name} />
                            <AvatarFallback>{member.name?.charAt(0)}</AvatarFallback>
                          </Avatar>
                          <div className="flex-1">
                            <h4 className="font-semibold">{member.name}</h4>
                            <p className="text-sm text-muted-foreground">
                              {member.xp} XP
                            </p>
                          </div>
                          {member.id === project.ownerId && (
                            <Badge variant="secondary">Owner</Badge>
                          )}
                        </div>
                        {member.skills && member.skills.length > 0 && (
                          <div className="flex flex-wrap gap-2 mt-4">
                            {member.skills.slice(0, 3).map((skill: string, i: number) => (
                              <Badge key={i} variant="outline" className="text-xs">
                                {skill}
                              </Badge>
                            ))}
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  </Link>
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="activity" className="space-y-4">
            <Card>
              <CardContent className="py-12 text-center">
                <Activity className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">Activity timeline coming soon</p>
              </CardContent>
            </Card>
          </TabsContent>

          {isOwner && (
            <TabsContent value="applications" className="space-y-4">
              {applications.length === 0 ? (
                <Card>
                  <CardContent className="py-12 text-center">
                    <Users className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground">No applications yet</p>
                  </CardContent>
                </Card>
              ) : (
                <div className="grid gap-4">
                  {applications.map((app) => (
                    <Card key={app.id}>
                      <CardHeader>
                        <div className="flex items-start justify-between">
                          <div>
                            <CardTitle className="text-lg">Application #{app.id}</CardTitle>
                            <CardDescription>
                              Submitted {new Date(app.createdAt).toLocaleDateString()}
                            </CardDescription>
                          </div>
                          <Badge
                            variant={
                              app.status === "accepted"
                                ? "default"
                                : app.status === "rejected"
                                ? "destructive"
                                : "secondary"
                            }
                          >
                            {app.status}
                          </Badge>
                        </div>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div>
                          <h4 className="font-semibold text-sm mb-2">Message</h4>
                          <p className="text-sm text-muted-foreground">{app.message}</p>
                        </div>
                        {app.status === "pending" && (
                          <div className="flex gap-2">
                            <Button
                              size="sm"
                              onClick={() => handleApplicationAction(app.id, "accepted")}
                            >
                              <CheckCircle2 className="w-4 h-4 mr-2" />
                              Accept
                            </Button>
                            <Button
                              size="sm"
                              variant="destructive"
                              onClick={() => handleApplicationAction(app.id, "rejected")}
                            >
                              Reject
                            </Button>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </TabsContent>
          )}
        </Tabs>
      </div>
    </div>
  );
}