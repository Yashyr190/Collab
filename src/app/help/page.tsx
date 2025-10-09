"use client";

import { AppNavigation } from "@/components/AppNavigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  HelpCircle,
  Search,
  Book,
  MessageCircle,
  Mail,
} from "lucide-react";
import Link from "next/link";

export default function HelpPage() {
  return (
    <div className="min-h-screen bg-background">
      <AppNavigation />

      <div className="container mx-auto px-4 py-12 space-y-12">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto">
          <HelpCircle className="w-16 h-16 text-primary mx-auto mb-6" />
          <h1 className="text-4xl font-bold mb-4">Help Center</h1>
          <p className="text-xl text-muted-foreground mb-8">
            Find answers to common questions and learn how to get the most out of Collab
          </p>
          
          <div className="relative max-w-xl mx-auto">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
            <Input 
              placeholder="Search for help..." 
              className="pl-12 h-12"
            />
          </div>
        </div>

        {/* Getting Started */}
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl flex items-center gap-2">
              <Book className="w-6 h-6 text-primary" />
              Getting Started
            </CardTitle>
            <CardDescription>
              Everything you need to know to start collaborating
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Accordion type="single" collapsible className="w-full">
              <AccordionItem value="item-1">
                <AccordionTrigger>How do I create an account?</AccordionTrigger>
                <AccordionContent>
                  Click the "Sign Up" button in the navigation bar, fill in your details (name, email, password), and you'll be ready to start collaborating. You can also complete your profile by adding skills, bio, and avatar.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-2">
                <AccordionTrigger>How do I find collaborators?</AccordionTrigger>
                <AccordionContent>
                  Visit the Collaboration Feed to browse open posts and projects. You can filter by type (collab, project, discussion) and search for specific topics. Click on any post to view details and reach out to the creator.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-3">
                <AccordionTrigger>How do I create a project?</AccordionTrigger>
                <AccordionContent>
                  Go to the Projects page and click "Create Project". Fill in the project title, description, and status. You can add team members, create tasks, and track progress as you work on your project together.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-4">
                <AccordionTrigger>What is XP and how do I earn it?</AccordionTrigger>
                <AccordionContent>
                  XP (Experience Points) is earned by being active on the platform: creating projects, posting collaborations, completing tasks, and helping others. Your XP level shows your contribution to the community and appears on the leaderboard.
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </CardContent>
        </Card>

        {/* Features Guide */}
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">Features Guide</CardTitle>
            <CardDescription>
              Learn about all the features available on Collab
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Accordion type="single" collapsible className="w-full">
              <AccordionItem value="item-1">
                <AccordionTrigger>What are badges and how do I earn them?</AccordionTrigger>
                <AccordionContent>
                  Badges are achievements you earn by reaching milestones on the platform. Examples include "Early Adopter", "Team Player", "Project Leader", and more. Check your profile to see your earned badges and visit the leaderboard to see what others have achieved.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-2">
                <AccordionTrigger>How does the messaging system work?</AccordionTrigger>
                <AccordionContent>
                  The messaging system allows you to have 1:1 conversations with other users. Simply visit a user's profile and click "Message" to start a conversation. You can also access all your conversations from the Messages page in the navigation.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-3">
                <AccordionTrigger>What is the Knowledge Hub?</AccordionTrigger>
                <AccordionContent>
                  The Knowledge Hub (Resources page) is a collection of articles, templates, and videos shared by the community. You can browse resources by type, search for specific topics, and upvote helpful content. Contribute your own resources to help others!
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-4">
                <AccordionTrigger>How do endorsements work?</AccordionTrigger>
                <AccordionContent>
                  Endorsements are peer validations of your skills. When you collaborate with others, they can endorse you for specific skills (e.g., React, UI Design, Project Management). These endorsements appear on your profile and help build credibility.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-5">
                <AccordionTrigger>Can I track project progress?</AccordionTrigger>
                <AccordionContent>
                  Yes! Each project has a progress tracker showing completion percentage. You can create tasks with different statuses (todo, in progress, completed) and the overall progress updates automatically. View detailed progress on the project page.
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </CardContent>
        </Card>

        {/* Contact Support */}
        <Card className="border-2 border-primary/20">
          <CardHeader>
            <CardTitle className="text-2xl flex items-center gap-2">
              <MessageCircle className="w-6 h-6 text-primary" />
              Still Need Help?
            </CardTitle>
            <CardDescription>
              Our support team is here to help you
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-muted-foreground">
              Can't find what you're looking for? We're here to help.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4">
              <Button className="gap-2">
                <Mail className="w-4 h-4" />
                Email Support
              </Button>
              <Link href="/about">
                <Button variant="outline" className="gap-2 w-full sm:w-auto">
                  <Book className="w-4 h-4" />
                  Learn More About Us
                </Button>
              </Link>
            </div>

            <p className="text-sm text-muted-foreground">
              Email us at{" "}
              <a href="mailto:support@collab.platform" className="text-primary hover:underline">
                support@collab.platform
              </a>
              {" "}and we'll get back to you within 24 hours.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}