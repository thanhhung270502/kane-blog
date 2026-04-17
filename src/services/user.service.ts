import type {
  EUserRole,
  GetUserByIdResponse,
  PublicUserObject,
  UserProfileObject,
} from "@common";

import { getDownloadUrl } from "@/libs/s3";
import { PostRepository } from "@/repositories/post.repository";
import { UserRepository } from "@/repositories/user.repository";

async function resolveImageUrl(path: string | null | undefined): Promise<string | null> {
  if (!path) return null;
  return getDownloadUrl(path);
}

export const UserService = {
  /**
   * Public user account + optional social profile (S3 URLs for avatar/cover).
   */
  async getById(userId: string): Promise<GetUserByIdResponse | null> {
    const user = await UserRepository.findPublicById(userId);
    if (!user) return null;

    const profileRow = await PostRepository.findProfile(userId);

    const userAvatarUrl = await resolveImageUrl(user.avatar_path);

    const publicUser: PublicUserObject = {
      id: user.id,
      name: user.name,
      role: user.role as EUserRole,
      avatarUrl: userAvatarUrl,
      createdAt: user.created_at,
    };

    if (!profileRow) {
      return { user: publicUser, profile: null };
    }

    const [avatarUrl, coverUrl] = await Promise.all([
      resolveImageUrl(profileRow.avatar_path ?? user.avatar_path),
      resolveImageUrl(profileRow.cover_path),
    ]);

    const profile: UserProfileObject = {
      id: profileRow.id,
      userId: profileRow.user_id,
      username: profileRow.username,
      bio: profileRow.bio,
      avatarUrl,
      coverUrl,
      name: user.name,
      createdAt: profileRow.created_at,
    };

    return { user: publicUser, profile };
  },
};
