"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { AppNavigation } from "@/components/AppNavigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Search,
  Plus,
  Users,
  Calendar,
  Tag,
  MessageSquare,
  Loader2,
  Filter,
  Star,
  FolderKanban,
} from "lucide-react";
import Link from "next/link";

// Safe JSON parse helper
const safeJsonParse = (value: any, fallback: any = []) => {
  if (Array.isArray(value)) return value;
  if (typeof value !== "string" || !value) return fallback;
  try {
    return JSON.parse(value);
  } catch {
    return fallback;
  }
};

export default function FeedPage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [posts, setPosts] = useState<any[]>([]);
  const [projects, setProjects] = useState<any[]>([]);
  const [filteredPosts, setFilteredPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [creating, setCreating] = useState(false);

  const [newPost, setNewPost] = useState({
    title: "",
    description: "",
    type: "collab",
    tags: "",
  });

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (!storedUser) {
      router.push("/auth/login");
      return;
    }

    const userData = JSON.parse(storedUser);
    setUser(userData);
    loadContent();
  }, [router]);

  useEffect(() => {
    filterPosts();
  }, [posts, searchQuery, typeFilter, statusFilter]);

  const loadContent = async () => {
    try {
      const [postsRes, projectsRes] = await Promise.all([
        fetch("/api/posts?limit=50"),
        fetch("/api/projects/top-rated")
      ]);

      if (postsRes.ok) {
        const data = await postsRes.json();
        // Robust tag parsing that handles all formats
        const postsWithParsedTags = data.map((post: any) => {
          let parsedTags = [];
          try {
            if (Array.isArray(post.tags)) {
              parsedTags = post.tags;
            } else if (typeof post.tags === 'string') {
              if (post.tags.startsWith('[')) {
                parsedTags = JSON.parse(post.tags);
              } else if (post.tags) {
                parsedTags = post.tags.split(',').map((t: string) => t.trim()).filter((t: string) => t);
              }
            }
          } catch (e) {
            console.warn('Failed to parse tags for post:', post.id, e);
            parsedTags = [];
          }
          return { ...post, tags: parsedTags };
        });
        setPosts(postsWithParsedTags);
      }

      if (projectsRes.ok) {
        const projectsData = await projectsRes.json();
        setProjects(projectsData.slice(0, 3)); // Show top 3 rated projects
      }
    } catch (error) {
      console.error("Failed to load content:", error);
    } finally {
      setLoading(false);
    }
  };

  const filterPosts = () => {
    let filtered = [...posts];

    if (searchQuery) {
      filtered = filtered.filter(
        (post) =>
          post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          post.description?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    if (typeFilter !== "all") {
      filtered = filtered.filter((post) => post.type === typeFilter);
    }

    if (statusFilter !== "all") {
      filtered = filtered.filter((post) => post.status === statusFilter);
    }

    setFilteredPosts(filtered);
  };

  const handleCreatePost = async (e: React.FormEvent) => {
    e.preventDefault();
    setCreating(true);

    try {
      const tags = newPost.tags
        .split(",")
        .map((t) => t.trim())
        .filter((t) => t);

      const response = await fetch("/api/posts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: user.id,
          title: newPost.title,
          description: newPost.description,
          type: newPost.type,
          tags,
          status: "open",
        }),
      });

      if (response.ok) {
        const data = await response.json();
        setPosts([data, ...posts]);
        setDialogOpen(false);
        setNewPost({ title: "", description: "", type: "collab", tags: "" });
      }
    } catch (error) {
      console.error("Failed to create post:", error);
    } finally {
      setCreating(false);
    }
  };

  if (!user) return null;

  return (
    <div className="min-h-screen bg-background">
      <AppNavigation />

      <div className="container mx-auto px-4 py-8 space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold mb-2">Collaboration Feed</h1>
            <p className="text-muted-foreground">
              Discover projects and find your next collaboration
            </p>
          </div>

          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="w-4 h-4 mr-2" />
                Create Post
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[525px]">
              <form onSubmit={handleCreatePost}>
                <DialogHeader>
                  <DialogTitle>Create Collaboration Post</DialogTitle>
                  <DialogDescription>
                    Share your project idea and find teammates
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="space-y-2">
                    <Label htmlFor="title">Title</Label>
                    <Input
                      id="title"
                      placeholder="Looking for React developer..."
                      value={newPost.title}
                      onChange={(e) =>
                        setNewPost({ ...newPost, title: e.target.value })
                      }
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="description">Description</Label>
                    <Textarea
                      id="description"
                      placeholder="We're building a SaaS platform and need..."
                      value={newPost.description}
                      onChange={(e) =>
                        setNewPost({ ...newPost, description: e.target.value })
                      }
                      rows={4}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="type">Type</Label>
                    <Select
                      value={newPost.type}
                      onValueChange={(value) =>
                        setNewPost({ ...newPost, type: value })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="collab">Collaboration</SelectItem>
                        <SelectItem value="project">Project</SelectItem>
                        <SelectItem value="discussion">Discussion</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="tags">Tags (comma-separated)</Label>
                    <Input
                      id="tags"
                      placeholder="react, nodejs, design"
                      value={newPost.tags}
                      onChange={(e) =>
                        setNewPost({ ...newPost, tags: e.target.value })
                      }
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button type="submit" disabled={creating}>
                    {creating ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Creating...
                      </>
                    ) : (
                      "Create Post"
                    )}
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {/* Top Rated Projects Section */}
        {!loading && projects.length > 0 && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold flex items-center gap-2">
                  <Star className="w-6 h-6 fill-yellow-500 text-yellow-500" />
                  Top Rated Projects
                </h2>
                <p className="text-sm text-muted-foreground mt-1">
                  Check out highly-rated projects from the community
                </p>
              </div>
              <Link href="/projects">
                <Button variant="outline" size="sm">View All</Button>
              </Link>
            </div>
            
            <div className="grid md:grid-cols-3 gap-4">
              {projects.map((project) => (
                <Link key={project.id} href={`/projects/${project.id}`}>
                  <Card className="h-full hover:shadow-lg transition-all hover:scale-105 cursor-pointer">
                    <CardHeader>
                      <div className="flex items-start justify-between mb-2">
                        <Badge variant={
                          project.status === "active" ? "default" : 
                          project.status === "planning" ? "secondary" : "outline"
                        }>
                          {project.status}
                        </Badge>
                        <div className="flex items-center gap-1">
                          <Star className="w-4 h-4 fill-yellow-500 text-yellow-500" />
                          <span className="font-semibold text-sm">
                            {project.averageRating?.toFixed(1) || "0.0"}
                          </span>
                          <span className="text-xs text-muted-foreground">
                            ({project.totalRatings})
                          </span>
                        </div>
                      </div>
                      <CardTitle className="line-clamp-1 text-lg">{project.title}</CardTitle>
                      <CardDescription className="line-clamp-2 text-sm">
                        {project.description}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Users className="w-4 h-4" />
                        <span>{safeJsonParse(project.members, []).length} members</span>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Search and Filters */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                <Input
                  placeholder="Search posts..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Select value={typeFilter} onValueChange={setTypeFilter}>
                <SelectTrigger className="w-full md:w-[180px]">
                  <Filter className="w-4 h-4 mr-2" />
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="collab">Collaboration</SelectItem>
                  <SelectItem value="project">Project</SelectItem>
                  <SelectItem value="discussion">Discussion</SelectItem>
                </SelectContent>
              </Select>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-full md:w-[180px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="open">Open</SelectItem>
                  <SelectItem value="in_progress">In Progress</SelectItem>
                  <SelectItem value="closed">Closed</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Posts List */}
        <div>
          <h2 className="text-2xl font-bold mb-4">Recent Posts</h2>
          {loading ? (
            <div className="space-y-4">
              {[1, 2, 3, 4, 5].map((i) => (
                <Skeleton key={i} className="h-48" />
              ))}
            </div>
          ) : filteredPosts.length === 0 ? (
            <Card>
              <CardContent className="py-12 text-center">
                <Users className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground mb-4">No posts found</p>
                <Button onClick={() => setDialogOpen(true)}>
                  Create First Post
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-6">
              {filteredPosts.map((post) => (
                <Card
                  key={post.id}
                  className="hover:shadow-lg transition-shadow cursor-pointer"
                >
                  <CardHeader>
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <Badge
                            variant={
                              post.type === "collab"
                                ? "default"
                                : post.type === "project"
                                ? "secondary"
                                : "outline"
                            }
                          >
                            {post.type}
                          </Badge>
                          <Badge
                            variant={
                              post.status === "open"
                                ? "default"
                                : post.status === "in_progress"
                                ? "secondary"
                                : "outline"
                            }
                          >
                            {post.status}
                          </Badge>
                        </div>
                        <CardTitle className="text-xl mb-2">{post.title}</CardTitle>
                        <CardDescription className="line-clamp-2">
                          {post.description}
                        </CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-2 mb-4">
                      {post.tags &&
                        post.tags.map((tag: string, i: number) => (
                          <Badge key={i} variant="outline">
                            <Tag className="w-3 h-3 mr-1" />
                            {tag}
                          </Badge>
                        ))}
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Calendar className="w-4 h-4" />
                        {new Date(post.createdAt).toLocaleDateString()}
                      </div>
                      <Link href={`/posts/${post.id}`}>
                        <Button variant="outline" size="sm">
                          <MessageSquare className="w-4 h-4 mr-2" />
                          View Details
                        </Button>
                      </Link>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}