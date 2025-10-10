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
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
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
  Plus,
  Trash2,
} from "lucide-react";
import Link from "next/link";
import { useToast } from "@/hooks/use-toast";

// Helper function to safely parse JSON
const safeJsonParse = (str: any, fallback: any = []) => {
  if (Array.isArray(str)) return str;
  if (typeof str === 'object' && str !== null) return str;
  if (typeof str !== 'string') return fallback;
  if (str.trim() === "") return fallback;
  
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
  const [tasks, setTasks] = useState<any[]>([]);
  const [activities, setActivities] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [applyDialogOpen, setApplyDialogOpen] = useState(false);
  const [taskDialogOpen, setTaskDialogOpen] = useState(false);
  const [applicationMessage, setApplicationMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [hasApplied, setHasApplied] = useState(false);
  
  // Task form state
  const [newTask, setNewTask] = useState({
    title: "",
    description: "",
    status: "pending" as "pending" | "in_progress" | "completed",
  });

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

        // Load tasks from new API
        loadTasks(projectId);

        // Load activities from new API
        loadActivities(projectId);

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

  const loadTasks = async (projectId: string) => {
    try {
      const response = await fetch(`/api/projects/${projectId}/tasks`);
      if (response.ok) {
        const data = await response.json();
        setTasks(data);
      }
    } catch (error) {
      console.error("Failed to load tasks:", error);
    }
  };

  const loadActivities = async (projectId: string) => {
    try {
      const response = await fetch(`/api/projects/${projectId}/activity`);
      if (response.ok) {
        const data = await response.json();
        setActivities(data);
      }
    } catch (error) {
      console.error("Failed to load activities:", error);
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
        // Reload everything to reflect the new member
        loadProject(params.id as string, user);
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

  const handleCreateTask = async () => {
    if (!newTask.title.trim()) {
      toast({
        title: "Title required",
        description: "Please provide a task title",
        variant: "destructive",
      });
      return;
    }

    try {
      const response = await fetch(`/api/projects/${params.id}/tasks`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newTask),
      });

      if (response.ok) {
        toast({
          title: "Task created!",
          description: "Task has been added to the project",
        });
        setTaskDialogOpen(false);
        setNewTask({ title: "", description: "", status: "pending" });
        loadTasks(params.id as string);
        
        // Create activity log
        await fetch(`/api/projects/${params.id}/activity`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            userId: user.id,
            action: "created_task",
            description: `${user.name} created task: ${newTask.title}`,
          }),
        });
        loadActivities(params.id as string);
      } else {
        const error = await response.json();
        toast({
          title: "Failed to create task",
          description: error.error || "Something went wrong",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create task",
        variant: "destructive",
      });
    }
  };

  const handleUpdateTaskStatus = async (taskId: number, newStatus: string) => {
    try {
      const response = await fetch(`/api/projects/${params.id}/tasks/${taskId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });

      if (response.ok) {
        toast({
          title: "Task updated!",
          description: `Task status changed to ${newStatus}`,
        });
        loadTasks(params.id as string);
        
        // Create activity log
        const task = tasks.find(t => t.id === taskId);
        await fetch(`/api/projects/${params.id}/activity`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            userId: user.id,
            action: "updated_task",
            description: `${user.name} updated task "${task?.title}" to ${newStatus}`,
          }),
        });
        loadActivities(params.id as string);
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update task",
        variant: "destructive",
      });
    }
  };

  const handleDeleteTask = async (taskId: number) => {
    try {
      const response = await fetch(`/api/projects/${params.id}/tasks/${taskId}`, {
        method: "DELETE",
      });

      if (response.ok) {
        toast({
          title: "Task deleted",
          description: "Task has been removed from the project",
        });
        loadTasks(params.id as string);
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete task",
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
            <TabsTrigger value="tasks">Tasks ({tasks.length})</TabsTrigger>
            <TabsTrigger value="members">Members ({members.length})</TabsTrigger>
            <TabsTrigger value="activity">Activity</TabsTrigger>
            {isOwner && (
              <TabsTrigger value="applications">
                Applications ({applications.length})
              </TabsTrigger>
            )}
          </TabsList>

          <TabsContent value="tasks" className="space-y-4">
            {(isOwner || isMember) && (
              <Dialog open={taskDialogOpen} onOpenChange={setTaskDialogOpen}>
                <DialogTrigger asChild>
                  <Button>
                    <Plus className="w-4 h-4 mr-2" />
                    Add Task
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Create New Task</DialogTitle>
                    <DialogDescription>
                      Add a new task to track progress on this project
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4 py-4">
                    <div className="space-y-2">
                      <Label htmlFor="task-title">Title *</Label>
                      <Input
                        id="task-title"
                        placeholder="Task title..."
                        value={newTask.title}
                        onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="task-description">Description</Label>
                      <Textarea
                        id="task-description"
                        placeholder="Task description..."
                        value={newTask.description}
                        onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
                        rows={4}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="task-status">Status</Label>
                      <Select
                        value={newTask.status}
                        onValueChange={(value: any) => setNewTask({ ...newTask, status: value })}
                      >
                        <SelectTrigger id="task-status">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="pending">Pending</SelectItem>
                          <SelectItem value="in_progress">In Progress</SelectItem>
                          <SelectItem value="completed">Completed</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <DialogFooter>
                    <Button variant="outline" onClick={() => setTaskDialogOpen(false)}>
                      Cancel
                    </Button>
                    <Button onClick={handleCreateTask}>
                      <Plus className="w-4 h-4 mr-2" />
                      Create Task
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            )}

            {tasks.length === 0 ? (
              <Card>
                <CardContent className="py-12 text-center">
                  <CheckCircle2 className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground mb-4">No tasks yet</p>
                  {(isOwner || isMember) && (
                    <Button onClick={() => setTaskDialogOpen(true)}>
                      <Plus className="w-4 h-4 mr-2" />
                      Add First Task
                    </Button>
                  )}
                </CardContent>
              </Card>
            ) : (
              <div className="grid gap-4">
                {tasks.map((task: any) => (
                  <Card key={task.id}>
                    <CardContent className="pt-6">
                      <div className="flex items-start gap-4">
                        {task.status === "completed" ? (
                          <CheckCircle2 className="w-5 h-5 text-green-500 mt-0.5 shrink-0" />
                        ) : task.status === "in_progress" ? (
                          <Clock className="w-5 h-5 text-blue-500 mt-0.5 shrink-0" />
                        ) : (
                          <Circle className="w-5 h-5 text-muted-foreground mt-0.5 shrink-0" />
                        )}
                        <div className="flex-1 min-w-0">
                          <h4 className="font-semibold mb-1">{task.title}</h4>
                          {task.description && (
                            <p className="text-sm text-muted-foreground mb-2">{task.description}</p>
                          )}
                          <div className="flex items-center gap-2">
                            {(isOwner || isMember) ? (
                              <Select
                                value={task.status}
                                onValueChange={(value) => handleUpdateTaskStatus(task.id, value)}
                              >
                                <SelectTrigger className="w-[140px] h-8">
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="pending">Pending</SelectItem>
                                  <SelectItem value="in_progress">In Progress</SelectItem>
                                  <SelectItem value="completed">Completed</SelectItem>
                                </SelectContent>
                              </Select>
                            ) : (
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
                            )}
                            {(isOwner || isMember) && (
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleDeleteTask(task.id)}
                              >
                                <Trash2 className="w-4 h-4 text-destructive" />
                              </Button>
                            )}
                          </div>
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
                        {member.skills && safeJsonParse(member.skills, []).length > 0 && (
                          <div className="flex flex-wrap gap-2 mt-4">
                            {safeJsonParse(member.skills, []).slice(0, 3).map((skill: string, i: number) => (
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
            {activities.length === 0 ? (
              <Card>
                <CardContent className="py-12 text-center">
                  <Activity className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">No activity yet</p>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-4">
                {activities.map((activity) => (
                  <Card key={activity.id}>
                    <CardContent className="pt-6">
                      <div className="flex items-start gap-4">
                        <div className="w-2 h-2 rounded-full bg-primary mt-2 shrink-0" />
                        <div className="flex-1">
                          <p className="text-sm">{activity.description}</p>
                          <p className="text-xs text-muted-foreground mt-1">
                            {new Date(activity.timestamp).toLocaleString()}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
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