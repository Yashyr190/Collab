"use client";

import { AppNavigation } from "@/components/AppNavigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Rocket,
  Target,
  Users,
  Heart,
  Zap,
  Globe,
  MessageSquare,
} from "lucide-react";
import Link from "next/link";

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-background">
      <AppNavigation />

      <div className="container mx-auto px-4 py-12 space-y-12">
        {/* Hero */}
        <div className="text-center max-w-3xl mx-auto">
          <div className="w-16 h-16 bg-gradient-to-br from-primary to-primary/60 rounded-lg flex items-center justify-center mx-auto mb-6">
            <Rocket className="w-8 h-8 text-primary-foreground" />
          </div>
          <h1 className="text-4xl font-bold mb-4">About Collab</h1>
          <p className="text-xl text-muted-foreground">
            Empowering creators, developers, and innovators to collaborate and build amazing projects together
          </p>
        </div>

        {/* Mission */}
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl flex items-center gap-2">
              <Target className="w-6 h-6 text-primary" />
              Our Mission
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-lg">
              At Collab, we believe that the best projects are built through collaboration. Our mission is to create a vibrant ecosystem where students, creators, and professionals can connect, share ideas, and bring innovative projects to life.
            </p>
            <p className="text-muted-foreground">
              We're breaking down barriers to collaboration by providing powerful tools, gamification features, and a supportive community that celebrates every milestone and achievement.
            </p>
          </CardContent>
        </Card>

        {/* Values */}
        <div>
          <h2 className="text-3xl font-bold mb-6 text-center">Our Values</h2>
          <div className="grid md:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <Users className="w-12 h-12 text-blue-500 mb-4" />
                <CardTitle>Community First</CardTitle>
                <CardDescription>
                  Building a supportive environment where everyone can thrive
                </CardDescription>
              </CardHeader>
            </Card>

            <Card>
              <CardHeader>
                <Zap className="w-12 h-12 text-yellow-500 mb-4" />
                <CardTitle>Innovation</CardTitle>
                <CardDescription>
                  Empowering creative solutions and breakthrough ideas
                </CardDescription>
              </CardHeader>
            </Card>

            <Card>
              <CardHeader>
                <Heart className="w-12 h-12 text-red-500 mb-4" />
                <CardTitle>Collaboration</CardTitle>
                <CardDescription>
                  Fostering teamwork and shared success
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>

        {/* Features Highlight */}
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">What Makes Us Different</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="flex gap-4">
                  <Badge className="h-8 w-8 rounded-full flex items-center justify-center">
                    ✓
                  </Badge>
                  <div>
                    <h3 className="font-semibold mb-1">Gamification</h3>
                    <p className="text-sm text-muted-foreground">
                      Earn XP, unlock badges, and compete on leaderboards as you collaborate
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <Badge className="h-8 w-8 rounded-full flex items-center justify-center">
                    ✓
                  </Badge>
                  <div>
                    <h3 className="font-semibold mb-1">Real-time Communication</h3>
                    <p className="text-sm text-muted-foreground">
                      Stay connected with instant messaging and project updates
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <Badge className="h-8 w-8 rounded-full flex items-center justify-center">
                    ✓
                  </Badge>
                  <div>
                    <h3 className="font-semibold mb-1">Project Management</h3>
                    <p className="text-sm text-muted-foreground">
                      Track progress, manage tasks, and visualize your journey
                    </p>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex gap-4">
                  <Badge className="h-8 w-8 rounded-full flex items-center justify-center">
                    ✓
                  </Badge>
                  <div>
                    <h3 className="font-semibold mb-1">Knowledge Hub</h3>
                    <p className="text-sm text-muted-foreground">
                      Access resources, templates, and community wisdom
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <Badge className="h-8 w-8 rounded-full flex items-center justify-center">
                    ✓
                  </Badge>
                  <div>
                    <h3 className="font-semibold mb-1">Skill Endorsements</h3>
                    <p className="text-sm text-muted-foreground">
                      Build credibility with peer endorsements and achievements
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <Badge className="h-8 w-8 rounded-full flex items-center justify-center">
                    ✓
                  </Badge>
                  <div>
                    <h3 className="font-semibold mb-1">Global Community</h3>
                    <p className="text-sm text-muted-foreground">
                      Connect with creators from around the world
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Stats */}
        <Card className="bg-gradient-to-br from-primary/5 to-primary/10">
          <CardContent className="py-12">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
              <div>
                <div className="text-4xl font-bold text-primary mb-2">10K+</div>
                <div className="text-sm text-muted-foreground">Active Users</div>
              </div>
              <div>
                <div className="text-4xl font-bold text-primary mb-2">500+</div>
                <div className="text-sm text-muted-foreground">Projects</div>
              </div>
              <div>
                <div className="text-4xl font-bold text-primary mb-2">1.2K+</div>
                <div className="text-sm text-muted-foreground">Collaborations</div>
              </div>
              <div>
                <div className="text-4xl font-bold text-primary mb-2">94%</div>
                <div className="text-sm text-muted-foreground">Success Rate</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* CTA */}
        <Card className="bg-gradient-to-br from-primary to-primary/80 text-primary-foreground">
          <CardContent className="py-12 text-center">
            <Globe className="w-16 h-16 mx-auto mb-6" />
            <h2 className="text-3xl font-bold mb-4">Join Our Community</h2>
            <p className="text-lg mb-8 opacity-90 max-w-2xl mx-auto">
              Start collaborating on amazing projects today. Connect with talented individuals and bring your ideas to life.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/auth/signup">
                <Button size="lg" variant="secondary">
                  Get Started Free
                </Button>
              </Link>
              <Link href="/feed">
                <Button size="lg" variant="outline" className="bg-transparent border-primary-foreground text-primary-foreground hover:bg-primary-foreground/10">
                  Explore Projects
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>

        {/* Contact */}
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl flex items-center gap-2">
              <MessageSquare className="w-6 h-6 text-primary" />
              Get in Touch
            </CardTitle>
            <CardDescription>
              Have questions? We'd love to hear from you
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-4">
              Email us at{" "}
              <a href="mailto:support@collab.platform" className="text-primary hover:underline">
                support@collab.platform
              </a>
            </p>
            <p className="text-muted-foreground">
              Follow us on social media for updates and community highlights
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}