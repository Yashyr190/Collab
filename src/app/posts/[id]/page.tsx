"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { AppNavigation } from "@/components/AppNavigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import { Separator } from "@/components/ui/separator";
import {
  Calendar,
  Tag,
  User,
  MessageSquare,
  ArrowLeft,
  Mail
} from "lucide-react";
import Link from "next/link";

export default function PostDetailPage() {
  const router = useRouter();
  const params = useParams();
  const [user, setUser] = useState<any>(null);
  const [post, setPost] = useState<any>(null);
  const [author, setAuthor] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (!storedUser) {
      router.push("/auth/login");
      return;
    }

    const userData = JSON.parse(storedUser);
    setUser(userData);
    loadPost(params.id as string);
  }, [router, params.id]);

  const loadPost = async (postId: string) => {
    try {
      const response = await fetch(`/api/posts/${postId}`);
      if (response.ok) {
        const postData = await response.json();
        
        // Parse tags to ensure they're always an array
        let parsedTags = [];
        try {
          if (Array.isArray(postData.tags)) {
            parsedTags = postData.tags;
          } else if (typeof postData.tags === 'string') {
            if (postData.tags.startsWith('[')) {
              parsedTags = JSON.parse(postData.tags);
            } else if (postData.tags) {
              parsedTags = postData.tags.split(',').map((t: string) => t.trim()).filter((t: string) => t);
            }
          }
        } catch (e) {
          console.warn('Failed to parse tags for post:', postData.id, e);
          parsedTags = [];
        }
        
        setPost({ ...postData, tags: parsedTags });
        
        // Load author data
        const authorResponse = await fetch(`/api/users?id=${postData.userId}`);
        if (authorResponse.ok) {
          const authorData = await authorResponse.json();
          setAuthor(authorData);
        }
      } else {
        router.push("/feed");
      }
    } catch (error) {
      console.error("Failed to load post:", error);
      router.push("/feed");
    } finally {
      setLoading(false);
    }
  };

  if (loading || !post) {
    return (
      <div className="min-h-screen bg-background">
        <AppNavigation />
        <div className="container mx-auto px-4 py-8">
          <Skeleton className="h-96 w-full" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <AppNavigation />

      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <Button
          variant="ghost"
          className="mb-6"
          onClick={() => router.back()}
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back
        </Button>

        <Card>
          <CardHeader>
            <div className="flex items-center gap-2 mb-4">
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

            <CardTitle className="text-3xl mb-4">{post.title}</CardTitle>

            {author && (
              <div className="flex items-center gap-3 mb-4">
                <Link href={`/profile/${author.id}`}>
                  <Avatar className="cursor-pointer hover:opacity-80 transition-opacity">
                    <AvatarImage src={author.avatar} alt={author.name} />
                    <AvatarFallback>{author.name?.charAt(0)}</AvatarFallback>
                  </Avatar>
                </Link>
                <div>
                  <Link href={`/profile/${author.id}`}>
                    <p className="font-medium hover:underline cursor-pointer">
                      {author.name}
                    </p>
                  </Link>
                  <p className="text-sm text-muted-foreground flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    {new Date(post.createdAt).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </p>
                </div>
              </div>
            )}

            {post.tags && post.tags.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {post.tags.map((tag: string, i: number) => (
                  <Badge key={i} variant="outline">
                    <Tag className="w-3 h-3 mr-1" />
                    {tag}
                  </Badge>
                ))}
              </div>
            )}
          </CardHeader>

          <Separator />

          <CardContent className="pt-6">
            <div className="prose prose-neutral dark:prose-invert max-w-none">
              <p className="text-lg whitespace-pre-wrap">{post.description}</p>
            </div>

            {author && user && author.id !== user.id && (
              <div className="mt-8 flex gap-3">
                <Link href={`/messages`}>
                  <Button>
                    <MessageSquare className="w-4 h-4 mr-2" />
                    Message Author
                  </Button>
                </Link>
                <Link href={`/profile/${author.id}`}>
                  <Button variant="outline">
                    <User className="w-4 h-4 mr-2" />
                    View Profile
                  </Button>
                </Link>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Author Info Card */}
        {author && (
          <Card className="mt-6">
            <CardHeader>
              <CardTitle>About the Author</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-start gap-4">
                <Link href={`/profile/${author.id}`}>
                  <Avatar className="w-16 h-16 cursor-pointer hover:opacity-80 transition-opacity">
                    <AvatarImage src={author.avatar} alt={author.name} />
                    <AvatarFallback className="text-2xl">
                      {author.name?.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                </Link>
                <div className="flex-1">
                  <Link href={`/profile/${author.id}`}>
                    <h3 className="font-semibold text-lg hover:underline cursor-pointer">
                      {author.name}
                    </h3>
                  </Link>
                  {author.bio && (
                    <p className="text-muted-foreground mt-1">{author.bio}</p>
                  )}
                  {author.skills && author.skills.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-3">
                      {author.skills.map((skill: string, i: number) => (
                        <Badge key={i} variant="secondary">
                          {skill}
                        </Badge>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}