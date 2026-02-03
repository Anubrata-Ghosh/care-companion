import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Heart, MessageCircle, Share2, Search, Plus, X, Send } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import Header from "@/components/layout/Header";
import BottomNav from "@/components/layout/BottomNav";

interface Post {
  id: string;
  author: string;
  avatar: string;
  specialization: string;
  timestamp: string;
  content: string;
  likes: number;
  comments: number;
  isLiked: boolean;
}

interface Comment {
  id: string;
  author: string;
  avatar: string;
  content: string;
  timestamp: string;
}

const Connections = () => {
  const navigate = useNavigate();
  const { user, serviceType } = useAuth();
  const [posts, setPosts] = useState<Post[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newPostContent, setNewPostContent] = useState("");
  const [selectedPostId, setSelectedPostId] = useState<string | null>(null);
  const [comments, setComments] = useState<Record<string, Comment[]>>({});
  const [newComment, setNewComment] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => {
      loadPosts();
      setLoading(false);
    }, 500);
  }, []);

  const loadPosts = () => {
    const mockPosts: Post[] = [
      {
        id: "p1",
        author: "Dr. Rajesh Patel",
        avatar: "R",
        specialization: "Cardiology",
        timestamp: "2 hours ago",
        content: "Just completed a successful cardiac bypass surgery. Grateful for our amazing nursing team who made it all possible. Patient is recovering well! 🙏",
        likes: 145,
        comments: 23,
        isLiked: false,
      },
      {
        id: "p2",
        author: "Dr. Priya Verma",
        avatar: "P",
        specialization: "Pediatrics",
        timestamp: "4 hours ago",
        content: "New research on childhood immunization shows promising results. Let's discuss the implications for our practice. Who's interested in a webinar?",
        likes: 89,
        comments: 15,
        isLiked: false,
      },
      {
        id: "p3",
        author: "Dr. Amit Sharma",
        avatar: "A",
        specialization: "General Medicine",
        timestamp: "6 hours ago",
        content: "Reminder: Always maintain patient confidentiality. Our patients trust us with their personal health information. Let's uphold the highest standards of medical ethics. 💪",
        likes: 234,
        comments: 45,
        isLiked: false,
      },
    ];
    setPosts(mockPosts);
    const initialComments: Record<string, Comment[]> = {};
    mockPosts.forEach(post => {
      initialComments[post.id] = [
        {
          id: `c${post.id}-1`,
          author: "Dr. Sarah Khan",
          avatar: "S",
          content: "Great insights! Completely agree with your perspective.",
          timestamp: "1 hour ago",
        },
      ];
    });
    setComments(initialComments);
  };

  const handleCreatePost = () => {
    if (!newPostContent.trim()) {
      toast.error("Please write something to share");
      return;
    }

    const newPost: Post = {
      id: `p${Date.now()}`,
      author: user?.user_metadata?.full_name || "You",
      avatar: (user?.user_metadata?.full_name || "U")[0],
      specialization: "Your Specialty",
      timestamp: "just now",
      content: newPostContent,
      likes: 0,
      comments: 0,
      isLiked: false,
    };

    setPosts([newPost, ...posts]);
    setNewPostContent("");
    setShowCreateModal(false);
    toast.success("Post shared successfully!");
  };

  const handleLike = (postId: string) => {
    setPosts(posts.map(post => {
      if (post.id === postId) {
        return {
          ...post,
          isLiked: !post.isLiked,
          likes: post.isLiked ? post.likes - 1 : post.likes + 1,
        };
      }
      return post;
    }));
  };

  const handleAddComment = (postId: string) => {
    if (!newComment.trim()) return;

    const comment: Comment = {
      id: `c${Date.now()}`,
      author: user?.user_metadata?.full_name || "You",
      avatar: (user?.user_metadata?.full_name || "U")[0],
      content: newComment,
      timestamp: "just now",
    };

    setComments(prev => ({
      ...prev,
      [postId]: [...(prev[postId] || []), comment],
    }));

    setPosts(posts.map(post => {
      if (post.id === postId) {
        return { ...post, comments: post.comments + 1 };
      }
      return post;
    }));

    setNewComment("");
    toast.success("Comment added!");
  };

  const filteredPosts = posts.filter(p =>
    p.author.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.specialization.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="pb-20">
        {/* Hero Section */}
        <motion.section
          className="px-4 pt-6 pb-6 bg-gradient-to-r from-primary/10 to-transparent"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1 className="text-3xl font-bold text-foreground mb-2">Connections</h1>
          <p className="text-muted-foreground">Share knowledge and connect with healthcare professionals</p>
        </motion.section>

        {/* Search and Create */}
        <section className="px-4 mb-6 space-y-3">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="relative"
          >
            <Search className="w-5 h-5 text-muted-foreground absolute left-3 top-3" />
            <Input
              placeholder="Search posts or people..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
          >
            <Button
              onClick={() => setShowCreateModal(true)}
              className="w-full"
              size="lg"
            >
              <Plus className="w-5 h-5 mr-2" />
              Share Your Thoughts
            </Button>
          </motion.div>
        </section>

        {/* Posts Feed */}
        <section className="px-4 space-y-4">
          {loading ? (
            <div className="space-y-4">
              {[1, 2, 3].map(i => (
                <div key={i} className="h-48 bg-card rounded-xl animate-pulse" />
              ))}
            </div>
          ) : filteredPosts.length > 0 ? (
            filteredPosts.map((post, index) => (
              <motion.div
                key={post.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 + index * 0.05 }}
              >
                <Card className="overflow-hidden hover:shadow-lg transition-shadow">
                  <CardContent className="p-4">
                    {/* Post Header */}
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary to-purple-500 flex items-center justify-center flex-shrink-0">
                          <span className="text-lg font-bold text-white">
                            {post.avatar}
                          </span>
                        </div>
                        <div>
                          <h3 className="font-semibold text-foreground">{post.author}</h3>
                          <p className="text-xs text-muted-foreground">
                            {post.specialization} • {post.timestamp}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Post Content */}
                    <p className="text-foreground mb-4 leading-relaxed">{post.content}</p>

                    {/* Post Stats */}
                    <div className="flex items-center justify-between text-xs text-muted-foreground mb-4 pb-4 border-b border-border/50">
                      <span>{post.likes} likes</span>
                      <span
                        className="cursor-pointer hover:text-foreground"
                        onClick={() => setSelectedPostId(selectedPostId === post.id ? null : post.id)}
                      >
                        {post.comments} comments
                      </span>
                      <span>Share</span>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex items-center justify-between gap-2 mb-4">
                      <button
                        onClick={() => handleLike(post.id)}
                        className="flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-lg hover:bg-card transition-colors"
                      >
                        <Heart
                          className={`w-5 h-5 ${post.isLiked ? "fill-red-500 text-red-500" : "text-muted-foreground"}`}
                        />
                        <span className="text-sm text-muted-foreground">Like</span>
                      </button>
                      <button
                        onClick={() => setSelectedPostId(selectedPostId === post.id ? null : post.id)}
                        className="flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-lg hover:bg-card transition-colors"
                      >
                        <MessageCircle className="w-5 h-5 text-muted-foreground" />
                        <span className="text-sm text-muted-foreground">Comment</span>
                      </button>
                      <button className="flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-lg hover:bg-card transition-colors">
                        <Share2 className="w-5 h-5 text-muted-foreground" />
                        <span className="text-sm text-muted-foreground">Share</span>
                      </button>
                    </div>

                    {/* Comments Section */}
                    {selectedPostId === post.id && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        className="space-y-3 border-t border-border/50 pt-4"
                      >
                        {comments[post.id]?.map(comment => (
                          <div key={comment.id} className="flex gap-3">
                            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-purple-500 flex items-center justify-center flex-shrink-0">
                              <span className="text-xs font-bold text-white">
                                {comment.avatar}
                              </span>
                            </div>
                            <div className="flex-1">
                              <div className="bg-card rounded-lg p-3">
                                <p className="text-xs font-semibold text-foreground">
                                  {comment.author}
                                </p>
                                <p className="text-sm text-foreground mt-1">
                                  {comment.content}
                                </p>
                              </div>
                              <p className="text-xs text-muted-foreground mt-1">
                                {comment.timestamp}
                              </p>
                            </div>
                          </div>
                        ))}

                        {/* Add Comment Input */}
                        <div className="flex gap-2 mt-3">
                          <Input
                            placeholder="Write a comment..."
                            value={newComment}
                            onChange={(e) => setNewComment(e.target.value)}
                            className="text-sm"
                          />
                          <Button
                            size="sm"
                            onClick={() => handleAddComment(post.id)}
                            className="px-3"
                          >
                            <Send className="w-4 h-4" />
                          </Button>
                        </div>
                      </motion.div>
                    )}
                  </CardContent>
                </Card>
              </motion.div>
            ))
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-12"
            >
              <MessageCircle className="w-12 h-12 text-muted-foreground mx-auto mb-3 opacity-50" />
              <p className="text-muted-foreground">No posts found. Be the first to share!</p>
            </motion.div>
          )}
        </section>
      </main>

      {/* Create Post Modal */}
      {showCreateModal && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 bg-black/50 z-50 flex items-end"
        >
          <motion.div
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            className="bg-background w-full rounded-t-2xl p-6 max-h-96 overflow-y-auto"
          >
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-foreground">Share Your Thoughts</h2>
              <button
                onClick={() => setShowCreateModal(false)}
                className="p-1 hover:bg-card rounded-lg"
              >
                <X className="w-5 h-5 text-muted-foreground" />
              </button>
            </div>

            <div className="space-y-4">
              <textarea
                placeholder="What's on your mind? Share your medical insights, experiences, or ask a question..."
                value={newPostContent}
                onChange={(e) => setNewPostContent(e.target.value)}
                className="w-full h-32 p-4 border border-border/50 rounded-lg bg-card text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              />

              <div className="flex gap-2">
                <Button
                  variant="outline"
                  className="flex-1"
                  onClick={() => setShowCreateModal(false)}
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleCreatePost}
                  className="flex-1"
                >
                  Post
                </Button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}

      <BottomNav />
    </div>
  );
};

export default Connections;
