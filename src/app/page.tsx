"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";
import { 
  Rocket, 
  Users, 
  Trophy, 
  MessageSquare, 
  FolderKanban, 
  Sparkles,
  ArrowRight,
  CheckCircle2,
  Zap,
  Target,
  Globe
} from "lucide-react";
import Link from "next/link";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
      {/* Navigation */}
      <nav className="border-b bg-background/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center gap-2"
          >
            <div className="w-8 h-8 bg-gradient-to-br from-primary to-primary/60 rounded-lg flex items-center justify-center">
              <Rocket className="w-5 h-5 text-primary-foreground" />
            </div>
            <span className="text-xl font-bold">Collab</span>
          </motion.div>
          
          <div className="hidden md:flex items-center gap-6">
            <Link href="#features" className="text-sm hover:text-primary transition-colors">Features</Link>
            <Link href="#how-it-works" className="text-sm hover:text-primary transition-colors">How it Works</Link>
            <Link href="#community" className="text-sm hover:text-primary transition-colors">Community</Link>
          </div>

          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center gap-3"
          >
            <Link href="/auth/login">
              <Button variant="ghost" size="sm">Login</Button>
            </Link>
            <Link href="/auth/signup">
              <Button size="sm">Get Started</Button>
            </Link>
          </motion.div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20 md:py-32">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Badge className="mb-4" variant="secondary">
              <Sparkles className="w-3 h-3 mr-1" />
              Connect. Create. Collaborate.
            </Badge>
            <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-6">
              Build Amazing Projects{" "}
              <span className="bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
                Together
              </span>
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
              Join a vibrant community of creators, developers, and innovators. 
              Find teammates, collaborate on projects, and level up your skills with gamification.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <Link href="/auth/signup">
              <Button size="lg" className="w-full sm:w-auto">
                Start Collaborating
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
            <Link href="/feed">
              <Button size="lg" variant="outline" className="w-full sm:w-auto">
                Explore Projects
              </Button>
            </Link>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="mt-16"
          >
            <Card className="p-8 bg-gradient-to-br from-primary/5 to-primary/10 border-primary/20">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                {[
                  { label: "Active Users", value: "10K+" },
                  { label: "Projects", value: "500+" },
                  { label: "Collaborations", value: "1.2K+" },
                  { label: "Success Rate", value: "94%" }
                ].map((stat, i) => (
                  <div key={i} className="text-center">
                    <div className="text-3xl font-bold text-primary">{stat.value}</div>
                    <div className="text-sm text-muted-foreground mt-1">{stat.label}</div>
                  </div>
                ))}
              </div>
            </Card>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="container mx-auto px-4 py-20 bg-muted/30">
        <div className="text-center mb-16">
          <Badge className="mb-4" variant="outline">Features</Badge>
          <h2 className="text-4xl font-bold mb-4">Everything You Need to Collaborate</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Powerful tools designed to make collaboration seamless and engaging
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {[
            {
              icon: Users,
              title: "Find Teammates",
              description: "Connect with creators who share your vision and complement your skills",
              color: "text-blue-500"
            },
            {
              icon: FolderKanban,
              title: "Project Management",
              description: "Organize tasks, track progress, and manage your team efficiently",
              color: "text-green-500"
            },
            {
              icon: MessageSquare,
              title: "Real-time Chat",
              description: "Communicate instantly with 1:1 and group messaging",
              color: "text-purple-500"
            },
            {
              icon: Trophy,
              title: "Gamification",
              description: "Earn XP, unlock badges, and compete on leaderboards",
              color: "text-yellow-500"
            },
            {
              icon: Target,
              title: "Progress Tracking",
              description: "Visualize project milestones and celebrate achievements",
              color: "text-red-500"
            },
            {
              icon: Globe,
              title: "Knowledge Hub",
              description: "Access articles, templates, and resources from the community",
              color: "text-cyan-500"
            }
          ].map((feature, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              viewport={{ once: true }}
            >
              <Card className="p-6 h-full hover:shadow-lg transition-shadow">
                <feature.icon className={`w-12 h-12 mb-4 ${feature.color}`} />
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-muted-foreground">{feature.description}</p>
              </Card>
            </motion.div>
          ))}
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="container mx-auto px-4 py-20">
        <div className="text-center mb-16">
          <Badge className="mb-4" variant="outline">How It Works</Badge>
          <h2 className="text-4xl font-bold mb-4">Get Started in 3 Simple Steps</h2>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {[
            {
              step: "01",
              title: "Create Your Profile",
              description: "Sign up and showcase your skills, interests, and project goals"
            },
            {
              step: "02",
              title: "Find Your Team",
              description: "Browse collaboration posts, connect with creators, and join projects"
            },
            {
              step: "03",
              title: "Build & Grow",
              description: "Collaborate, track progress, earn XP, and bring your ideas to life"
            }
          ].map((step, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: i * 0.2 }}
              viewport={{ once: true }}
              className="text-center"
            >
              <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-primary">{step.step}</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">{step.title}</h3>
              <p className="text-muted-foreground">{step.description}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section id="community" className="container mx-auto px-4 py-20">
        <Card className="bg-gradient-to-br from-primary to-primary/80 text-primary-foreground p-12 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
          >
            <Zap className="w-16 h-16 mx-auto mb-6" />
            <h2 className="text-4xl font-bold mb-4">Ready to Start Building?</h2>
            <p className="text-lg mb-8 opacity-90 max-w-2xl mx-auto">
              Join thousands of creators already collaborating on amazing projects
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/auth/signup">
                <Button size="lg" variant="secondary" className="w-full sm:w-auto">
                  Create Free Account
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </Link>
              <Link href="/feed">
                <Button size="lg" variant="outline" className="w-full sm:w-auto bg-transparent border-primary-foreground text-primary-foreground hover:bg-primary-foreground/10">
                  Browse Projects
                </Button>
              </Link>
            </div>
          </motion.div>
        </Card>
      </section>

      {/* Footer */}
      <footer className="border-t mt-20">
        <div className="container mx-auto px-4 py-12">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-6 h-6 bg-gradient-to-br from-primary to-primary/60 rounded-lg flex items-center justify-center">
                  <Rocket className="w-4 h-4 text-primary-foreground" />
                </div>
                <span className="font-bold">Collab</span>
              </div>
              <p className="text-sm text-muted-foreground">
                Empowering creators to build amazing projects together.
              </p>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Platform</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><Link href="/feed" className="hover:text-foreground transition-colors">Collaboration Feed</Link></li>
                <li><Link href="/projects" className="hover:text-foreground transition-colors">Projects</Link></li>
                <li><Link href="/leaderboard" className="hover:text-foreground transition-colors">Leaderboard</Link></li>
                <li><Link href="/resources" className="hover:text-foreground transition-colors">Resources</Link></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Company</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><Link href="/about" className="hover:text-foreground transition-colors">About</Link></li>
                <li><Link href="/help" className="hover:text-foreground transition-colors">Help Center</Link></li>
                <li><a href="#" className="hover:text-foreground transition-colors">Privacy</a></li>
                <li><a href="#" className="hover:text-foreground transition-colors">Terms</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Connect</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><a href="#" className="hover:text-foreground transition-colors">Twitter</a></li>
                <li><a href="#" className="hover:text-foreground transition-colors">Discord</a></li>
                <li><a href="#" className="hover:text-foreground transition-colors">GitHub</a></li>
                <li><a href="#" className="hover:text-foreground transition-colors">LinkedIn</a></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t mt-8 pt-8 text-center text-sm text-muted-foreground">
            <p>© 2024 Collab Platform. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}