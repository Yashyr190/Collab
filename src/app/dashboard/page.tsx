"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { AppNavigation } from "@/components/AppNavigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Trophy,
  TrendingUp,
  Users,
  FolderKanban,
  MessageSquare,
  Zap,
  ArrowRight,
  Award,
  Activity,
} from "lucide-react";
import Link from "next/link";

// Safe JSON parsing helper
const safeJsonParse = (str: any, fallback: any = []) => {
  // If already an array or object, return it
  if (Array.isArray(str)) return str;
  if (typeof str === 'object' && str !== null) return str;
  
  // If not a string, return fallback
  if (typeof str !== 'string') return fallback;
  
  // If empty string, return fallback
  if (str.trim() === "") return fallback;
  
  // Try to parse
  try {
    return JSON.parse(str);
  } catch (e) {
    return fallback;
  }
};

export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [projects, setProjects] = useState<any[]>([]);
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (!storedUser) {
      router.push("/auth/login");
      return;
    }

    const userData = JSON.parse(storedUser);
    setUser(userData);
    loadDashboardData(userData.id);
  }, [router]);

  const loadDashboardData = async (userId: number) => {
    try {
      const [projectsRes, postsRes] = await Promise.all([
        fetch(`/api/projects?ownerId=${userId}`),
        fetch(`/api/posts?userId=${userId}&limit=5`),
      ]);

      if (projectsRes.ok) {
        const projectsData = await projectsRes.json();
        setProjects(projectsData);
      }

      if (postsRes.ok) {
        const postsData = await postsRes.json();
        setPosts(postsData);
      }
    } catch (error) {
      console.error("Failed to load dashboard data:", error);
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-background">
        <AppNavigation />
        <div className="container mx-auto px-4 py-8">
          <Skeleton className="h-32 w-full mb-8" />
          <div className="grid md:grid-cols-3 gap-6">
            <Skeleton className="h-48" />
            <Skeleton className="h-48" />
            <Skeleton className="h-48" />
          </div>
        </div>
      </div>
    );
  }

  const nextLevel = Math.ceil((user.xp || 0) / 1000) * 1000;
  const progressToNext = ((user.xp || 0) % 1000) / 10;

  return (
    <div className="min-h-screen bg-background">
      <AppNavigation />

      <div className="container mx-auto px-4 py-8 space-y-8">
        {/* Welcome Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold mb-2">
              Welcome back, {user.name?.split(" ")[0]}! 👋
            </h1>
            <p className="text-muted-foreground">
              Here's what's happening with your collaborations today
            </p>
          </div>
          <Link href="/feed">
            <Button>
              <Users className="w-4 h-4 mr-2" />
              Browse Collaborations
            </Button>
          </Link>
        </div>

        {/* Stats Cards */}
        <div className="grid md:grid-cols-4 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total XP</CardTitle>
              <Trophy className="h-4 w-4 text-yellow-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{user.xp || 0}</div>
              <p className="text-xs text-muted-foreground">
                {nextLevel - (user.xp || 0)} XP to next level
              </p>
              <Progress value={progressToNext} className="mt-2" />
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Projects</CardTitle>
              <FolderKanban className="h-4 w-4 text-blue-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{projects.length}</div>
              <p className="text-xs text-muted-foreground">
                {projects.filter((p) => p.status === "active").length} active
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Posts</CardTitle>
              <Activity className="h-4 w-4 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{posts.length}</div>
              <p className="text-xs text-muted-foreground">
                {posts.filter((p) => p.status === "open").length} open
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Badges</CardTitle>
              <Award className="h-4 w-4 text-purple-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {safeJsonParse(user.badges, []).length}
              </div>
              <p className="text-xs text-muted-foreground">Achievements earned</p>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Recent Projects */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Your Projects</CardTitle>
                  <CardDescription>Active collaborations and projects</CardDescription>
                </div>
                <Link href="/projects">
                  <Button variant="outline" size="sm">
                    View All
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </Link>
              </div>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="space-y-4">
                  {[1, 2, 3].map((i) => (
                    <Skeleton key={i} className="h-20" />
                  ))}
                </div>
              ) : projects.length === 0 ? (
                <div className="text-center py-12">
                  <FolderKanban className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground mb-4">No projects yet</p>
                  <Link href="/feed">
                    <Button>Find Collaborations</Button>
                  </Link>
                </div>
              ) : (
                <div className="space-y-4">
                  {projects.slice(0, 3).map((project) => (
                    <Link key={project.id} href={`/projects/${project.id}`}>
                      <Card className="hover:shadow-md transition-shadow cursor-pointer">
                        <CardContent className="p-4">
                          <div className="flex items-start justify-between mb-2">
                            <div className="flex-1">
                              <h4 className="font-semibold mb-1">{project.title}</h4>
                              <p className="text-sm text-muted-foreground line-clamp-1">
                                {project.description}
                              </p>
                            </div>
                            <Badge variant={project.status === "active" ? "default" : "secondary"}>
                              {project.status}
                            </Badge>
                          </div>
                          <div className="flex items-center gap-4 text-sm text-muted-foreground">
                            <span className="flex items-center gap-1">
                              <Users className="w-4 h-4" />
                              {safeJsonParse(project.members, []).length} members
                            </span>
                            <span>{project.progress}% complete</span>
                          </div>
                          <Progress value={project.progress} className="mt-2" />
                        </CardContent>
                      </Card>
                    </Link>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Quick Actions & Profile */}
          <div className="space-y-6">
            {/* Profile Card */}
            <Card>
              <CardHeader>
                <CardTitle>Your Profile</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-3">
                  <Avatar className="h-16 w-16">
                    <AvatarImage src={user.avatar} alt={user.name} />
                    <AvatarFallback>{user.name?.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <h3 className="font-semibold">{user.name}</h3>
                    <p className="text-sm text-muted-foreground">{user.email}</p>
                  </div>
                </div>

                {safeJsonParse(user.badges, []).length > 0 && (
                  <div>
                    <p className="text-sm font-medium mb-2">Badges</p>
                    <div className="flex flex-wrap gap-2">
                      {safeJsonParse(user.badges, []).slice(0, 3).map((badge: string, i: number) => (
                        <Badge key={i} variant="secondary">
                          <Award className="w-3 h-3 mr-1" />
                          {badge}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                {safeJsonParse(user.skills, []).length > 0 && (
                  <div>
                    <p className="text-sm font-medium mb-2">Skills</p>
                    <div className="flex flex-wrap gap-2">
                      {safeJsonParse(user.skills, []).slice(0, 4).map((skill: string, i: number) => (
                        <Badge key={i} variant="outline">
                          {skill}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                <Link href={`/profile/${user.id}`}>
                  <Button variant="outline" className="w-full">
                    View Full Profile
                  </Button>
                </Link>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Link href="/feed">
                  <Button variant="outline" className="w-full justify-start">
                    <Users className="w-4 h-4 mr-2" />
                    Find Collaborations
                  </Button>
                </Link>
                <Link href="/messages">
                  <Button variant="outline" className="w-full justify-start">
                    <MessageSquare className="w-4 h-4 mr-2" />
                    View Messages
                  </Button>
                </Link>
                <Link href="/leaderboard">
                  <Button variant="outline" className="w-full justify-start">
                    <Trophy className="w-4 h-4 mr-2" />
                    Check Leaderboard
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}