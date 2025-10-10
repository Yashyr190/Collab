"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { AppNavigation } from "@/components/AppNavigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import { Trophy, Medal, Award, TrendingUp, Crown } from "lucide-react";
import Link from "next/link";

export default function LeaderboardPage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (!storedUser) {
      router.push("/auth/login");
      return;
    }

    const userData = JSON.parse(storedUser);
    setUser(userData);
    loadLeaderboard();
  }, [router]);

  const loadLeaderboard = async () => {
    try {
      const response = await fetch("/api/users/leaderboard?limit=50");
      if (response.ok) {
        const data = await response.json();
        
        // Parse badges to ensure they're always arrays
        const usersWithParsedBadges = data.map((user: any) => {
          let parsedBadges = [];
          try {
            if (Array.isArray(user.badges)) {
              parsedBadges = user.badges;
            } else if (typeof user.badges === 'string') {
              if (user.badges.startsWith('[')) {
                parsedBadges = JSON.parse(user.badges);
              } else if (user.badges) {
                parsedBadges = user.badges.split(',').map((b: string) => b.trim()).filter((b: string) => b);
              }
            }
          } catch (e) {
            console.warn('Failed to parse badges for user:', user.id, e);
            parsedBadges = [];
          }
          return { ...user, badges: parsedBadges };
        });
        
        setUsers(usersWithParsedBadges);
      }
    } catch (error) {
      console.error("Failed to load leaderboard:", error);
    } finally {
      setLoading(false);
    }
  };

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return <Crown className="w-6 h-6 text-yellow-500" />;
      case 2:
        return <Medal className="w-6 h-6 text-gray-400" />;
      case 3:
        return <Medal className="w-6 h-6 text-amber-600" />;
      default:
        return <span className="text-xl font-bold text-muted-foreground">#{rank}</span>;
    }
  };

  if (!user) return null;

  return (
    <div className="min-h-screen bg-background">
      <AppNavigation />

      <div className="container mx-auto px-4 py-8 space-y-8">
        {/* Header */}
        <div className="text-center">
          <Trophy className="w-16 h-16 text-yellow-500 mx-auto mb-4" />
          <h1 className="text-4xl font-bold mb-2">Leaderboard</h1>
          <p className="text-muted-foreground">
            Top collaborators ranked by experience points
          </p>
        </div>

        {/* Top 3 Podium */}
        {!loading && users.length >= 3 && (
          <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            {/* 2nd Place */}
            <Link href={`/profile/${users[1].id}`}>
              <Card className="hover:shadow-lg transition-shadow cursor-pointer mt-8">
                <CardContent className="pt-6 text-center">
                  <div className="relative">
                    <Avatar className="h-20 w-20 mx-auto mb-4 ring-4 ring-gray-400">
                      <AvatarImage src={users[1].avatar} alt={users[1].name} />
                      <AvatarFallback>{users[1].name?.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2">
                      <Medal className="w-8 h-8 text-gray-400" />
                    </div>
                  </div>
                  <h3 className="font-bold text-lg mb-1">{users[1].name}</h3>
                  <p className="text-2xl font-bold text-primary mb-2">{users[1].xp} XP</p>
                  <Badge variant="secondary">2nd Place</Badge>
                </CardContent>
              </Card>
            </Link>

            {/* 1st Place */}
            <Link href={`/profile/${users[0].id}`}>
              <Card className="hover:shadow-lg transition-shadow cursor-pointer border-2 border-yellow-500">
                <CardContent className="pt-6 text-center">
                  <div className="relative">
                    <Avatar className="h-24 w-24 mx-auto mb-4 ring-4 ring-yellow-500">
                      <AvatarImage src={users[0].avatar} alt={users[0].name} />
                      <AvatarFallback>{users[0].name?.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2">
                      <Crown className="w-10 h-10 text-yellow-500" />
                    </div>
                  </div>
                  <h3 className="font-bold text-xl mb-1">{users[0].name}</h3>
                  <p className="text-3xl font-bold text-yellow-500 mb-2">{users[0].xp} XP</p>
                  <Badge className="bg-yellow-500">🏆 Champion</Badge>
                </CardContent>
              </Card>
            </Link>

            {/* 3rd Place */}
            <Link href={`/profile/${users[2].id}`}>
              <Card className="hover:shadow-lg transition-shadow cursor-pointer mt-8">
                <CardContent className="pt-6 text-center">
                  <div className="relative">
                    <Avatar className="h-20 w-20 mx-auto mb-4 ring-4 ring-amber-600">
                      <AvatarImage src={users[2].avatar} alt={users[2].name} />
                      <AvatarFallback>{users[2].name?.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2">
                      <Medal className="w-8 h-8 text-amber-600" />
                    </div>
                  </div>
                  <h3 className="font-bold text-lg mb-1">{users[2].name}</h3>
                  <p className="text-2xl font-bold text-primary mb-2">{users[2].xp} XP</p>
                  <Badge variant="secondary">3rd Place</Badge>
                </CardContent>
              </Card>
            </Link>
          </div>
        )}

        {/* Full Leaderboard */}
        <Card className="max-w-4xl mx-auto">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5" />
              Full Rankings
            </CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="space-y-4">
                {[1, 2, 3, 4, 5].map((i) => (
                  <Skeleton key={i} className="h-20" />
                ))}
              </div>
            ) : (
              <div className="space-y-2">
                {users.map((rankedUser, index) => {
                  const rank = index + 1;
                  const isCurrentUser = rankedUser.id === user.id;
                  
                  return (
                    <Link key={rankedUser.id} href={`/profile/${rankedUser.id}`}>
                      <Card
                        className={`hover:shadow-md transition-shadow cursor-pointer ${
                          isCurrentUser ? "ring-2 ring-primary" : ""
                        }`}
                      >
                        <CardContent className="p-4">
                          <div className="flex items-center gap-4">
                            <div className="w-12 flex items-center justify-center">
                              {getRankIcon(rank)}
                            </div>

                            <Avatar className="h-12 w-12">
                              <AvatarImage src={rankedUser.avatar} alt={rankedUser.name} />
                              <AvatarFallback>
                                {rankedUser.name?.charAt(0)}
                              </AvatarFallback>
                            </Avatar>

                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2">
                                <h3 className="font-semibold truncate">
                                  {rankedUser.name}
                                </h3>
                                {isCurrentUser && (
                                  <Badge variant="outline">You</Badge>
                                )}
                              </div>
                              {rankedUser.badges && rankedUser.badges.length > 0 && (
                                <div className="flex flex-wrap gap-1 mt-1">
                                  {rankedUser.badges.slice(0, 2).map((badge: string, i: number) => (
                                    <Badge key={i} variant="secondary" className="text-xs">
                                      <Award className="w-3 h-3 mr-1" />
                                      {badge}
                                    </Badge>
                                  ))}
                                </div>
                              )}
                            </div>

                            <div className="text-right">
                              <p className="text-2xl font-bold text-primary">
                                {rankedUser.xp}
                              </p>
                              <p className="text-xs text-muted-foreground">XP</p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </Link>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}