import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Star, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";

interface Booking {
  id: string;
  title: string;
  provider_name: string;
}

interface FeedbackModalProps {
  isOpen: boolean;
  booking?: Booking;
  onClose: () => void;
  onSubmit: (rating: number, review: string) => void;
}

const FeedbackModal = ({ isOpen, booking, onClose, onSubmit }: FeedbackModalProps) => {
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [review, setReview] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (rating === 0) {
      return;
    }
    
    setIsSubmitting(true);
    await onSubmit(rating, review);
    setIsSubmitting(false);
    
    // Reset form
    setRating(0);
    setReview("");
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="w-full">
        <DialogHeader>
          <DialogTitle>Share Your Feedback</DialogTitle>
          <DialogDescription>
            Help us improve your experience
          </DialogDescription>
        </DialogHeader>

        {booking && (
          <div className="space-y-4">
            {/* Service Info */}
            <div className="p-3 rounded-lg bg-muted/50 border border-border/50">
              <p className="text-sm font-medium text-foreground">{booking.title}</p>
              <p className="text-xs text-muted-foreground mt-1">{booking.provider_name}</p>
            </div>

            {/* Star Rating */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">How was your experience?</label>
              <div className="flex gap-2 justify-center py-4">
                {[1, 2, 3, 4, 5].map((star) => (
                  <motion.button
                    key={star}
                    whileHover={{ scale: 1.2 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setRating(star)}
                    onMouseEnter={() => setHoverRating(star)}
                    onMouseLeave={() => setHoverRating(0)}
                    className="focus:outline-none"
                  >
                    <Star
                      className={`w-8 h-8 transition-all ${
                        star <= (hoverRating || rating)
                          ? "fill-yellow-400 text-yellow-400"
                          : "text-muted-foreground/30"
                      }`}
                    />
                  </motion.button>
                ))}
              </div>
            </div>

            {/* Review Text */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Tell us more (optional)</label>
              <Textarea
                placeholder="Share your experience, what went well, what could be improved..."
                value={review}
                onChange={(e) => setReview(e.target.value)}
                className="resize-none h-24"
              />
            </div>

            {/* Actions */}
            <div className="flex gap-2 pt-2">
              <Button
                variant="outline"
                onClick={onClose}
                disabled={isSubmitting}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button
                onClick={handleSubmit}
                disabled={rating === 0 || isSubmitting}
                className="flex-1"
              >
                {isSubmitting ? "Submitting..." : "Submit Feedback"}
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default FeedbackModal;
