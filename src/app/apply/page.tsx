"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { AppNavigation } from "@/components/AppNavigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Clock, CheckCircle2, XCircle, ExternalLink } from "lucide-react";
import Link from "next/link";

export default function ApplyPage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [applications, setApplications] = useState<any[]>([]);
  const [projects, setProjects] = useState<Map<number, any>>(new Map());
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (!storedUser) {
      router.push("/auth/login");
      return;
    }

    const userData = JSON.parse(storedUser);
    setUser(userData);
    loadApplications(userData.id);
  }, [router]);

  const loadApplications = async (userId: number) => {
    try {
      const response = await fetch(`/api/applications?userId=${userId}`);
      if (response.ok) {
        const data = await response.json();
        setApplications(data);
        
        // Load project details for each application
        const projectIds = [...new Set(data.map((app: any) => app.projectId))];
        const projectPromises = projectIds.map((id) =>
          fetch(`/api/projects/${id}`).then((res) => res.json())
        );
        const projectsData = await Promise.all(projectPromises);
        
        const projectsMap = new Map();
        projectsData.forEach((project) => {
          projectsMap.set(project.id, project);
        });
        setProjects(projectsMap);
      }
    } catch (error) {
      console.error("Failed to load applications:", error);
    } finally {
      setLoading(false);
    }
  };

  const filterApplications = (status: string) => {
    return applications.filter((app) => app.status === status);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "accepted":
        return <CheckCircle2 className="w-5 h-5 text-green-500" />;
      case "rejected":
        return <XCircle className="w-5 h-5 text-red-500" />;
      default:
        return <Clock className="w-5 h-5 text-yellow-500" />;
    }
  };

  const getStatusBadge = (status: string) => {
    const variants: any = {
      pending: "secondary",
      accepted: "default",
      rejected: "destructive",
    };
    return <Badge variant={variants[status] || "outline"}>{status}</Badge>;
  };

  const ApplicationCard = ({ application }: { application: any }) => {
    const project = projects.get(application.projectId);
    
    return (
      <Card className="hover:shadow-md transition-shadow">
        <CardHeader>
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                {getStatusIcon(application.status)}
                {getStatusBadge(application.status)}
              </div>
              <CardTitle className="text-xl mb-1">
                {project?.title || "Loading..."}
              </CardTitle>
              <CardDescription>
                Applied on {new Date(application.createdAt).toLocaleDateString()}
              </CardDescription>
            </div>
            <Link href={`/projects/${application.projectId}`}>
              <Button variant="outline" size="sm">
                <ExternalLink className="w-4 h-4 mr-2" />
                View Project
              </Button>
            </Link>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <h4 className="font-semibold text-sm mb-2">Your Message</h4>
              <p className="text-sm text-muted-foreground">{application.message}</p>
            </div>
            {project && (
              <div>
                <h4 className="font-semibold text-sm mb-2">Project Description</h4>
                <p className="text-sm text-muted-foreground">{project.description}</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <AppNavigation />
        <div className="container mx-auto px-4 py-8">
          <Skeleton className="h-64 w-full mb-8" />
        </div>
      </div>
    );
  }

  const pendingApps = filterApplications("pending");
  const acceptedApps = filterApplications("accepted");
  const rejectedApps = filterApplications("rejected");

  return (
    <div className="min-h-screen bg-background">
      <AppNavigation />

      <div className="container mx-auto px-4 py-8 space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-4xl font-bold mb-2">My Applications</h1>
          <p className="text-muted-foreground">
            Track your project applications and their status
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid md:grid-cols-3 gap-4">
          <Card>
            <CardHeader className="pb-2">
              <CardDescription>Pending</CardDescription>
              <CardTitle className="text-3xl flex items-center gap-2">
                <Clock className="w-6 h-6 text-yellow-500" />
                {pendingApps.length}
              </CardTitle>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardDescription>Accepted</CardDescription>
              <CardTitle className="text-3xl flex items-center gap-2">
                <CheckCircle2 className="w-6 h-6 text-green-500" />
                {acceptedApps.length}
              </CardTitle>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardDescription>Rejected</CardDescription>
              <CardTitle className="text-3xl flex items-center gap-2">
                <XCircle className="w-6 h-6 text-red-500" />
                {rejectedApps.length}
              </CardTitle>
            </CardHeader>
          </Card>
        </div>

        {/* Applications Tabs */}
        <Tabs defaultValue="all" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="all">
              All ({applications.length})
            </TabsTrigger>
            <TabsTrigger value="pending">
              Pending ({pendingApps.length})
            </TabsTrigger>
            <TabsTrigger value="accepted">
              Accepted ({acceptedApps.length})
            </TabsTrigger>
            <TabsTrigger value="rejected">
              Rejected ({rejectedApps.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="all" className="space-y-4">
            {applications.length === 0 ? (
              <Card>
                <CardContent className="py-12 text-center">
                  <p className="text-muted-foreground mb-4">
                    You haven't applied to any projects yet
                  </p>
                  <Link href="/projects">
                    <Button>Browse Projects</Button>
                  </Link>
                </CardContent>
              </Card>
            ) : (
              applications.map((app) => (
                <ApplicationCard key={app.id} application={app} />
              ))
            )}
          </TabsContent>

          <TabsContent value="pending" className="space-y-4">
            {pendingApps.length === 0 ? (
              <Card>
                <CardContent className="py-12 text-center">
                  <Clock className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">No pending applications</p>
                </CardContent>
              </Card>
            ) : (
              pendingApps.map((app) => (
                <ApplicationCard key={app.id} application={app} />
              ))
            )}
          </TabsContent>

          <TabsContent value="accepted" className="space-y-4">
            {acceptedApps.length === 0 ? (
              <Card>
                <CardContent className="py-12 text-center">
                  <CheckCircle2 className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">No accepted applications yet</p>
                </CardContent>
              </Card>
            ) : (
              acceptedApps.map((app) => (
                <ApplicationCard key={app.id} application={app} />
              ))
            )}
          </TabsContent>

          <TabsContent value="rejected" className="space-y-4">
            {rejectedApps.length === 0 ? (
              <Card>
                <CardContent className="py-12 text-center">
                  <XCircle className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">No rejected applications</p>
                </CardContent>
              </Card>
            ) : (
              rejectedApps.map((app) => (
                <ApplicationCard key={app.id} application={app} />
              ))
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}