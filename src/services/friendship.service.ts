import type {
  EFriendshipStatus,
  FriendshipObject,
  GetFriendsResponse,
  GetPendingFriendRequestsResponse,
  PostAuthorObject,
  RespondFriendRequestResponse,
  SendFriendRequestResponse,
} from "@common";

import { FriendshipRepository } from "@/repositories/friendship.repository";
import { PostRepository } from "@/repositories/post.repository";
import { UserRepository } from "@/repositories/user.repository";

async function buildFriendshipObject(
  row: {
    id: string;
    requester_id: string;
    addressee_id: string;
    status: string;
    created_at: string;
  },
  profilesMap: Map<string, { avatar_url: string | null; username: string | null }>
): Promise<FriendshipObject> {
  const requester = await UserRepository.findById(row.requester_id);
  const profile = profilesMap.get(row.requester_id);

  const requesterObj: PostAuthorObject = {
    id: row.requester_id,
    name: requester?.name ?? "Unknown",
    avatarUrl: profile?.avatar_url ?? null,
    username: profile?.username ?? null,
  };

  return {
    id: row.id,
    requesterId: row.requester_id,
    addresseeId: row.addressee_id,
    status: row.status as EFriendshipStatus,
    requester: requesterObj,
    createdAt: row.created_at,
  };
}

export const FriendshipService = {
  /**
   * Send a friend request. Throws if already friends or request pending.
   */
  async sendRequest(
    requesterId: string,
    addresseeId: string
  ): Promise<SendFriendRequestResponse> {
    if (requesterId === addresseeId) {
      throw new Error("Cannot send a friend request to yourself");
    }

    const existing = await FriendshipRepository.findBetween(requesterId, addresseeId);
    if (existing) {
      throw new Error("A friendship or request already exists between these users");
    }

    const row = await FriendshipRepository.create(requesterId, addresseeId);
    const profiles = await PostRepository.findProfilesByUserIds([requesterId]);
    const profilesMap = new Map(
      profiles.map((p) => [p.user_id, { avatar_url: p.avatar_url, username: p.username }])
    );

    const friendship = await buildFriendshipObject(row, profilesMap);
    return { friendship };
  },

  /**
   * Accept or reject a friend request. Only the addressee can respond.
   */
  async respondToRequest(
    friendshipId: string,
    addresseeId: string,
    status: EFriendshipStatus.ACCEPTED | EFriendshipStatus.REJECTED
  ): Promise<RespondFriendRequestResponse> {
    const existing = await FriendshipRepository.findById(friendshipId);

    if (!existing) {
      throw new Error("Friend request not found");
    }

    if (existing.addressee_id !== addresseeId) {
      throw new Error("Not authorized to respond to this request");
    }

    if (existing.status !== "pending") {
      throw new Error("This request has already been responded to");
    }

    const updated = await FriendshipRepository.updateStatus(friendshipId, status);
    if (!updated) throw new Error("Failed to update friendship");

    const profiles = await PostRepository.findProfilesByUserIds([updated.requester_id]);
    const profilesMap = new Map(
      profiles.map((p) => [p.user_id, { avatar_url: p.avatar_url, username: p.username }])
    );

    const friendship = await buildFriendshipObject(updated, profilesMap);
    return { friendship };
  },

  /**
   * Get pending friend requests for the current user.
   */
  async getPendingRequests(userId: string): Promise<GetPendingFriendRequestsResponse> {
    const rows = await FriendshipRepository.getPendingForAddressee(userId);
    const requesterIds = rows.map((r) => r.requester_id);
    const profiles = await PostRepository.findProfilesByUserIds(requesterIds);
    const profilesMap = new Map(
      profiles.map((p) => [p.user_id, { avatar_url: p.avatar_url, username: p.username }])
    );

    const friendships = await Promise.all(
      rows.map((row) => buildFriendshipObject(row, profilesMap))
    );

    return { friendships };
  },

  /**
   * Get all accepted friends for a user.
   */
  async getFriends(userId: string): Promise<GetFriendsResponse> {
    const friendIds = await FriendshipRepository.getFriendIds(userId);
    const users = await Promise.all(friendIds.map((id) => UserRepository.findById(id)));
    const profiles = await PostRepository.findProfilesByUserIds(friendIds);
    const profilesMap = new Map(profiles.map((p) => [p.user_id, p]));

    const friends: PostAuthorObject[] = users
      .filter((u) => u !== null)
      .map((u) => ({
        id: u!.id,
        name: u!.name,
        avatarUrl: profilesMap.get(u!.id)?.avatar_url ?? null,
        username: profilesMap.get(u!.id)?.username ?? null,
      }));

    return { friends };
  },

  /**
   * Unfriend or cancel a request.
   */
  async removeFriendship(friendshipId: string, userId: string): Promise<void> {
    const existing = await FriendshipRepository.findById(friendshipId);
    if (!existing) throw new Error("Friendship not found");

    if (existing.requester_id !== userId && existing.addressee_id !== userId) {
      throw new Error("Not authorized");
    }

    await FriendshipRepository.deleteById(friendshipId);
  },

  /**
   * Get friendship status between two users.
   */
  async getStatus(userAId: string, userBId: string): Promise<EFriendshipStatus | null> {
    const row = await FriendshipRepository.findBetween(userAId, userBId);
    return row ? (row.status as EFriendshipStatus) : null;
  },
};
