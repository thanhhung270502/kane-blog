import type {
  CreateCommentResponse,
  CreatePostResponse,
  EAttachmentKind,
  GetCommentsResponse,
  GetFeedResponse,
  GetUserPostsResponse,
  PostAttachmentObject,
  PostAuthorObject,
  PostCommentObject,
  PostCommentRow,
  PostObject,
  PostRow,
  ToggleReactionResponse,
  UpsertProfileResponse,
  UserProfileRow,
} from "@common";
import { EPostVisibility } from "@common";

import { getDownloadUrl } from "@/libs/s3";
import { PostRepository } from "@/repositories/post.repository";
import { UserRepository } from "@/repositories/user.repository";

/** Resolve an S3 path to a presigned download URL. Returns null if path is null/empty. */
async function resolveImageUrl(path: string | null | undefined): Promise<string | null> {
  if (!path) return null;
  return getDownloadUrl(path);
}

// ─── Internal Helpers ─────────────────────────────────────────────────────────

async function buildAuthor(
  userId: string,
  profilesMap?: Map<string, UserProfileRow>
): Promise<PostAuthorObject> {
  const user = await UserRepository.findById(userId);
  const profile = profilesMap?.get(userId) ?? null;

  return {
    id: userId,
    name: user?.name ?? "Unknown",
    avatarUrl: await resolveImageUrl(profile?.avatar_path),
    username: profile?.username ?? null,
  };
}

function toAttachmentObject(row: {
  id: string;
  post_id: string;
  url: string;
  kind: string;
  sort_order: number;
}): PostAttachmentObject {
  return {
    id: row.id,
    postId: row.post_id,
    url: row.url,
    kind: row.kind as EAttachmentKind,
    sortOrder: row.sort_order,
  };
}

function toCommentObject(row: PostCommentRow, author: PostAuthorObject): PostCommentObject {
  return {
    id: row.id,
    postId: row.post_id,
    author,
    body: row.body,
    parentId: row.parent_id,
    createdAt: row.created_at,
  };
}

async function buildPostObjects(rows: PostRow[], viewerId: string): Promise<PostObject[]> {
  if (rows.length === 0) return [];

  const postIds = rows.map((r) => r.id);
  const allAuthorIds = [...new Set(rows.map((r) => r.author_id))];

  // Batch-load profiles, reactions, comments, shares
  const [profiles, reactionCounts, commentCounts, shareCounts, viewerReactions] = await Promise.all(
    [
      PostRepository.findProfilesByUserIds(allAuthorIds),
      PostRepository.getReactionCounts(postIds),
      PostRepository.getCommentCounts(postIds),
      PostRepository.getShareCounts(postIds),
      PostRepository.getUserReactions(postIds, viewerId),
    ]
  );

  const attachmentRows = await PostRepository.getAttachmentsByPostIds(postIds);

  const profilesMap = new Map(profiles.map((p) => [p.user_id, p]));
  const reactionMap = new Map(reactionCounts.map((r) => [r.post_id, parseInt(r.count, 10)]));
  const commentMap = new Map(commentCounts.map((r) => [r.post_id, parseInt(r.count, 10)]));
  const shareMap = new Map(shareCounts.map((r) => [r.post_id, parseInt(r.count, 10)]));
  const likedSet = new Set(viewerReactions.map((r) => r.post_id));
  const attachmentsMap = new Map<string, typeof attachmentRows>();
  for (const att of attachmentRows) {
    const list = attachmentsMap.get(att.post_id) ?? [];
    list.push(att);
    attachmentsMap.set(att.post_id, list);
  }

  // Load shared posts (one level deep)
  const sharedPostIds = rows.filter((r) => r.shared_post_id).map((r) => r.shared_post_id as string);

  let sharedPostsMap = new Map<string, PostObject>();
  if (sharedPostIds.length > 0) {
    const sharedRows = await Promise.all(sharedPostIds.map((id) => PostRepository.findById(id)));
    const validShared = sharedRows.filter((r): r is PostRow => r !== null);
    if (validShared.length > 0) {
      const sharedObjects = await buildPostObjects(validShared, viewerId);
      sharedPostsMap = new Map(sharedObjects.map((p) => [p.id, p]));
    }
  }

  return await Promise.all(
    rows.map(async (row) => {
      const profile = profilesMap.get(row.author_id);
      const author: PostAuthorObject = {
        id: row.author_id,
        name: await UserRepository.findById(row.author_id).then((u) => u?.name ?? "Unknown"),
        avatarUrl: await resolveImageUrl(profile?.avatar_path),
        username: profile?.username ?? null,
      };

      return {
        id: row.id,
        author,
        body: row.body,
        visibility: row.visibility as EPostVisibility,
        attachments: (attachmentsMap.get(row.id) ?? []).map(toAttachmentObject),
        sharedPost: row.shared_post_id ? (sharedPostsMap.get(row.shared_post_id) ?? null) : null,
        reactionsCount: reactionMap.get(row.id) ?? 0,
        commentsCount: commentMap.get(row.id) ?? 0,
        sharesCount: shareMap.get(row.id) ?? 0,
        viewerHasLiked: likedSet.has(row.id),
        createdAt: row.created_at,
        updatedAt: row.updated_at,
      };
    })
  );
}

// ─── Post Service ─────────────────────────────────────────────────────────────

export const PostService = {
  /**
   * Get paginated feed for the current user.
   */
  async getFeed(viewerId: string, limit: number, cursor: string | null): Promise<GetFeedResponse> {
    const effectiveLimit = Math.min(limit, 50);
    const rows = await PostRepository.getFeed(viewerId, effectiveLimit + 1, cursor);

    const hasMore = rows.length > effectiveLimit;
    const pageRows = hasMore ? rows.slice(0, effectiveLimit) : rows;
    const posts = await buildPostObjects(pageRows, viewerId);

    return {
      posts,
      nextCursor: hasMore ? pageRows[pageRows.length - 1].created_at : null,
      hasMore,
    };
  },

  /**
   * Create a new post.
   */
  async createPost(
    authorId: string,
    data: {
      body?: string;
      visibility?: EPostVisibility;
      sharedPostId?: string | null;
      attachments?: Array<{ url: string; kind?: EAttachmentKind; sortOrder?: number }>;
    }
  ): Promise<CreatePostResponse> {
    const row = await PostRepository.create(
      authorId,
      data.body ?? null,
      data.visibility ?? "public",
      data.sharedPostId ?? null
    );

    if (data.attachments && data.attachments.length > 0) {
      await PostRepository.createAttachments(
        row.id,
        data.attachments.map((a) => ({
          url: a.url,
          kind: a.kind,
          sortOrder: a.sortOrder,
        }))
      );
    }

    const [post] = await buildPostObjects([row], authorId);
    return { post };
  },

  /**
   * Delete a post (only the owner can delete).
   */
  async deletePost(postId: string, authorId: string): Promise<boolean> {
    return PostRepository.softDelete(postId, authorId);
  },

  /**
   * Toggle like on a post. Returns new state.
   */
  async toggleReaction(
    postId: string,
    userId: string,
    type = "like"
  ): Promise<ToggleReactionResponse> {
    const existing = await PostRepository.findReaction(postId, userId);

    if (existing) {
      await PostRepository.removeReaction(postId, userId);
    } else {
      await PostRepository.addReaction(postId, userId, type);
    }

    const reactionsCount = await PostRepository.countReactions(postId);
    return { liked: !existing, reactionsCount };
  },

  /**
   * Get paginated comments for a post.
   */
  async getComments(
    postId: string,
    limit: number,
    cursor: string | null
  ): Promise<GetCommentsResponse> {
    const effectiveLimit = Math.min(limit, 100);
    const rows = await PostRepository.getComments(postId, effectiveLimit + 1, cursor);

    const hasMore = rows.length > effectiveLimit;
    const pageRows = hasMore ? rows.slice(0, effectiveLimit) : rows;

    const authorIds = [...new Set(pageRows.map((r) => r.author_id))];
    const profiles = await PostRepository.findProfilesByUserIds(authorIds);
    const profilesMap = new Map(profiles.map((p) => [p.user_id, p]));

    const comments: PostCommentObject[] = await Promise.all(
      pageRows.map(async (row) => {
        const author = await buildAuthor(row.author_id, profilesMap);
        return toCommentObject(row, author);
      })
    );

    return {
      comments,
      nextCursor: hasMore ? pageRows[pageRows.length - 1].created_at : null,
      hasMore,
    };
  },

  /**
   * Add a comment to a post.
   */
  async createComment(
    postId: string,
    authorId: string,
    body: string,
    parentId: string | null
  ): Promise<CreateCommentResponse> {
    const row = await PostRepository.createComment(postId, authorId, body, parentId);
    const profiles = await PostRepository.findProfilesByUserIds([authorId]);
    const profilesMap = new Map(profiles.map((p) => [p.user_id, p]));
    const author = await buildAuthor(authorId, profilesMap);
    return { comment: toCommentObject(row, author) };
  },

  /**
   * Share a post to feed (creates a new post referencing the original).
   */
  async sharePost(
    originalPostId: string,
    userId: string,
    body?: string
  ): Promise<CreatePostResponse> {
    await PostRepository.recordShare(originalPostId, userId);
    return this.createPost(userId, {
      body: body ?? undefined,
      sharedPostId: originalPostId,
      visibility: EPostVisibility.PUBLIC,
    });
  },

  /**
   * Get public profile + posts for a user.
   */
  async getProfile(targetUserId: string) {
    const profile = await PostRepository.findProfile(targetUserId);
    const user = await UserRepository.findById(targetUserId);

    if (profile) {
      const [avatarUrl, coverUrl] = await Promise.all([
        resolveImageUrl(profile.avatar_path ?? user?.avatar_path),
        resolveImageUrl(profile.cover_path),
      ]);
      return {
        profile: {
          id: profile.id,
          userId: profile.user_id,
          username: profile.username,
          bio: profile.bio,
          avatarUrl,
          coverUrl,
          name: user?.name ?? "",
          createdAt: profile.created_at,
        },
      };
    }

    return {
      profile: {
        id: "",
        userId: targetUserId,
        username: null,
        bio: null,
        avatarUrl: await resolveImageUrl(user?.avatar_path),
        coverUrl: null,
        name: user?.name ?? "",
        createdAt: new Date().toISOString(),
      },
    };
  },

  /**
   * Get paginated posts for a specific user (respecting visibility rules).
   */
  async getUserPosts(
    authorId: string,
    viewerId: string,
    limit: number,
    cursor: string | null
  ): Promise<GetUserPostsResponse> {
    const effectiveLimit = Math.min(limit, 50);
    const rows = await PostRepository.getByAuthor(authorId, viewerId, effectiveLimit + 1, cursor);

    const hasMore = rows.length > effectiveLimit;
    const pageRows = hasMore ? rows.slice(0, effectiveLimit) : rows;
    const posts = await buildPostObjects(pageRows, viewerId);

    return {
      posts,
      nextCursor: hasMore ? pageRows[pageRows.length - 1].created_at : null,
      hasMore,
    };
  },

  /**
   * Upsert user profile.
   */
  async upsertProfile(
    userId: string,
    data: { username?: string; bio?: string; avatarPath?: string; coverPath?: string }
  ): Promise<UpsertProfileResponse> {
    const row = await PostRepository.upsertProfile(userId, data);
    const user = await UserRepository.findById(userId);

    const [avatarUrl, coverUrl] = await Promise.all([
      resolveImageUrl(row.avatar_path),
      resolveImageUrl(row.cover_path),
    ]);

    const profile = {
      id: row.id,
      userId: row.user_id,
      username: row.username,
      bio: row.bio,
      avatarUrl,
      coverUrl,
      name: user?.name ?? "",
      createdAt: row.created_at,
    };

    return { profile };
  },
};
