import type { CurrentUserObject, PostObject } from "@common";

import { Skeleton, Typography } from "@/shared";

import { PostCard } from ".";

type MainFeedProps = {
  posts: PostObject[];
  currentUser: CurrentUserObject;
  isLoading: boolean;
};

export const MainFeed = ({ posts, currentUser, isLoading }: MainFeedProps) => {
  if (isLoading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="bg-black-secondary p-4xl rounded-xl shadow-sm">
            <div className="flex gap-3">
              <Skeleton className="h-10 w-10 rounded-full" />
              <div className="flex-1 space-y-2">
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-3/4" />
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }
  if (posts.length === 0) {
    return (
      <div className="bg-black-secondary rounded-xl p-8 text-center shadow-sm">
        <Typography variant="body-xl" color="primary" weight="semibold">
          Your feed is empty
        </Typography>
        <Typography variant="body-md" color="secondary" weight="regular">
          Add friends and make posts to see content here.
        </Typography>
      </div>
    );
  }
  return posts.map((post) => <PostCard key={post.id} post={post} currentUser={currentUser} />);
};
