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
import {
  Trophy,
  Award,
  Users,
  FolderKanban,
  MessageSquare,
  Mail,
  Calendar,
  Star,
  CheckCircle2,
} from "lucide-react";
import Link from "next/link";

export default function ProfilePage() {
  const router = useRouter();
  const params = useParams();
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [profileUser, setProfileUser] = useState<any>(null);
  const [projects, setProjects] = useState<any[]>([]);
  const [posts, setPosts] = useState<any[]>([]);
  const [endorsements, setEndorsements] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (!storedUser) {
      router.push("/auth/login");
      return;
    }

    const userData = JSON.parse(storedUser);
    setCurrentUser(userData);
    loadProfile(params.id as string);
  }, [router, params.id]);

  const loadProfile = async (userId: string) => {
    try {
      const [userRes, projectsRes, postsRes, endorsementsRes] = await Promise.all([
        fetch(`/api/users/${userId}`),
        fetch(`/api/projects?ownerId=${userId}`),
        fetch(`/api/posts?userId=${userId}`),
        fetch(`/api/endorsements/${userId}`),
      ]);

      if (userRes.ok) {
        const userData = await userRes.json();
        setProfileUser(userData);
      }

      if (projectsRes.ok) {
        const projectsData = await projectsRes.json();
        setProjects(projectsData);
      }

      if (postsRes.ok) {
        const postsData = await postsRes.json();
        setPosts(postsData);
      }

      if (endorsementsRes.ok) {
        const endorsementsData = await endorsementsRes.json();
        setEndorsements(endorsementsData);
      }
    } catch (error) {
      console.error("Failed to load profile:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading || !profileUser) {
    return (
      <div className="min-h-screen bg-background">
        <AppNavigation />
        <div className="container mx-auto px-4 py-8">
          <Skeleton className="h-64 w-full mb-8" />
          <div className="grid md:grid-cols-3 gap-6">
            <Skeleton className="h-96" />
            <div className="md:col-span-2 space-y-6">
              <Skeleton className="h-48" />
              <Skeleton className="h-48" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  const isOwnProfile = currentUser?.id === profileUser.id;
  const nextLevel = Math.ceil((profileUser.xp || 0) / 1000) * 1000;
  const progressToNext = ((profileUser.xp || 0) % 1000) / 10;

  return (
    <div className="min-h-screen bg-background">
      <AppNavigation />

      <div className="container mx-auto px-4 py-8 space-y-8">
        {/* Profile Header */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex flex-col md:flex-row gap-6">
              <Avatar className="h-32 w-32">
                <AvatarImage src={profileUser.avatar} alt={profileUser.name} />
                <AvatarFallback className="text-4xl">
                  {profileUser.name?.charAt(0)}
                </AvatarFallback>
              </Avatar>

              <div className="flex-1 space-y-4">
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <h1 className="text-3xl font-bold">{profileUser.name}</h1>
                    {profileUser.role === "admin" && (
                      <Badge variant="default">
                        <Award className="w-3 h-3 mr-1" />
                        Admin
                      </Badge>
                    )}
                  </div>
                  <p className="text-muted-foreground flex items-center gap-2">
                    <Mail className="w-4 h-4" />
                    {profileUser.email}
                  </p>
                  {profileUser.bio && (
                    <p className="text-muted-foreground mt-2">{profileUser.bio}</p>
                  )}
                </div>

                <div className="flex flex-wrap gap-2">
                  {Array.isArray(profileUser.skills) && profileUser.skills.map((skill: string, i: number) => (
                    <Badge key={i} variant="secondary">
                      {skill}
                    </Badge>
                  ))}
                </div>

                <div className="flex items-center gap-4">
                  {!isOwnProfile && (
                    <Link href={`/messages`}>
                      <Button>
                        <MessageSquare className="w-4 h-4 mr-2" />
                        Message
                      </Button>
                    </Link>
                  )}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Stats */}
        <div className="grid md:grid-cols-4 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Experience</CardTitle>
              <Trophy className="h-4 w-4 text-yellow-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{profileUser.xp || 0} XP</div>
              <p className="text-xs text-muted-foreground">
                {nextLevel - (profileUser.xp || 0)} XP to next level
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
              <Users className="h-4 w-4 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{posts.length}</div>
              <p className="text-xs text-muted-foreground">collaboration posts</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Badges</CardTitle>
              <Award className="h-4 w-4 text-purple-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {Array.isArray(profileUser.badges) ? profileUser.badges.length : 0}
              </div>
              <p className="text-xs text-muted-foreground">achievements</p>
            </CardContent>
          </Card>
        </div>

        {/* Content Tabs */}
        <Tabs defaultValue="projects" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="projects">Projects</TabsTrigger>
            <TabsTrigger value="posts">Posts</TabsTrigger>
            <TabsTrigger value="badges">Badges</TabsTrigger>
            <TabsTrigger value="endorsements">Endorsements</TabsTrigger>
          </TabsList>

          <TabsContent value="projects" className="space-y-4">
            {projects.length === 0 ? (
              <Card>
                <CardContent className="py-12 text-center">
                  <FolderKanban className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">No projects yet</p>
                </CardContent>
              </Card>
            ) : (
              projects.map((project) => (
                <Link key={project.id} href={`/projects/${project.id}`}>
                  <Card className="hover:shadow-md transition-shadow cursor-pointer">
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <CardTitle>{project.title}</CardTitle>
                          <CardDescription className="line-clamp-2">
                            {project.description}
                          </CardDescription>
                        </div>
                        <Badge
                          variant={
                            project.status === "active" ? "default" : "secondary"
                          }
                        >
                          {project.status}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground mb-2">
                        <span className="flex items-center gap-1">
                          <Users className="w-4 h-4" />
                          {Array.isArray(project.members) ? project.members.length : 0} members
                        </span>
                        <span>{project.progress}% complete</span>
                      </div>
                      <Progress value={project.progress} />
                    </CardContent>
                  </Card>
                </Link>
              ))
            )}
          </TabsContent>

          <TabsContent value="posts" className="space-y-4">
            {posts.length === 0 ? (
              <Card>
                <CardContent className="py-12 text-center">
                  <Users className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">No posts yet</p>
                </CardContent>
              </Card>
            ) : (
              posts.map((post) => (
                <Link key={post.id} href={`/posts/${post.id}`}>
                  <Card className="hover:shadow-md transition-shadow cursor-pointer">
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <Badge>{post.type}</Badge>
                            <Badge variant="outline">{post.status}</Badge>
                          </div>
                          <CardTitle className="text-xl">{post.title}</CardTitle>
                          <CardDescription>{post.description}</CardDescription>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Calendar className="w-4 h-4" />
                        {new Date(post.createdAt).toLocaleDateString()}
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))
            )}
          </TabsContent>

          <TabsContent value="badges" className="space-y-4">
            {!Array.isArray(profileUser.badges) || profileUser.badges.length === 0 ? (
              <Card>
                <CardContent className="py-12 text-center">
                  <Award className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">No badges earned yet</p>
                </CardContent>
              </Card>
            ) : (
              <div className="grid md:grid-cols-3 gap-4">
                {profileUser.badges.map((badge: string, i: number) => (
                  <Card key={i}>
                    <CardContent className="pt-6 text-center">
                      <Award className="w-12 h-12 text-yellow-500 mx-auto mb-4" />
                      <h3 className="font-semibold">{badge}</h3>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="endorsements" className="space-y-4">
            {endorsements.length === 0 ? (
              <Card>
                <CardContent className="py-12 text-center">
                  <Star className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">No endorsements yet</p>
                </CardContent>
              </Card>
            ) : (
              <div className="grid md:grid-cols-2 gap-4">
                {endorsements.map((endorsement) => (
                  <Card key={endorsement.id}>
                    <CardContent className="pt-6">
                      <div className="flex items-center gap-3">
                        <CheckCircle2 className="w-8 h-8 text-green-500" />
                        <div>
                          <h4 className="font-semibold">{endorsement.skill}</h4>
                          <p className="text-sm text-muted-foreground">
                            Endorsed by User #{endorsement.endorsedBy}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}