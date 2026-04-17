"use client";

import { GearIcon, SignOutIcon, UserCircleIcon } from "@phosphor-icons/react";
import { cn } from "@tailwind-config/utils/cn";
import Link from "next/link";
import { useRouter } from "next/navigation";

import { RouteKey } from "@/shared/enums";
import { useCurrentUser } from "@/shared/hooks";
// import { useQueryMe, useQueryUserById } from "@/shared/hooks";
import { getDetailRoute } from "@/shared/utils";

import {
  Button,
  MegaMenuRow,
  Popover,
  PopoverContent,
  PopoverTrigger,
  Separator,
  Typography,
  UserAvatar,
} from "../../components";
import { ClientRoutes } from "../../constants";

export function AccountButton() {
  const router = useRouter();
  const user = useCurrentUser();
  // const user = {
  //   user: {
  //     id: "19b16429-ef45-46e4-86d9-9eb76a128984",
  //     name: "Thanh Hùng Lý",
  //     role: "user",
  //     avatarUrl: null,
  //     createdAt: "2026-04-11T08:17:20.226Z",
  //   },
  //   profile: {
  //     id: "a38d8496-05b0-4892-8073-15c492d87088",
  //     userId: "19b16429-ef45-46e4-86d9-9eb76a128984",
  //     username: null,
  //     bio: null,
  //     avatarUrl:
  //       "http://localhost:4599/kane-blog-local/users/19b16429-ef45-46e4-86d9-9eb76a128984/avatar/89b54829-db77-4f82-8f14-7916078e923b.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=test%2F20260412%2Fus-east-1%2Fs3%2Faws4_request&X-Amz-Date=20260412T133713Z&X-Amz-Expires=3600&X-Amz-Signature=b18fe1289c756365a067852369549cf4977683b64a1476cd400ef46d952901e1&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject",
  //     coverUrl: null,
  //     name: "Thanh Hùng Lý",
  //     createdAt: "2026-04-12T03:53:09.033Z",
  //   },
  // };

  if (!user.user) return null;

  return (
    <Popover>
      <PopoverTrigger
        render={
          <Button
            variant="no-outlined-primary"
            className={cn("group/item flex items-center gap-3! rounded-full transition-colors")}
          >
            <UserAvatar
              name={user.user.name}
              avatarUrl={user.user.avatarUrl ?? undefined}
              size="sm"
            />
            <Typography variant="body-md" weight="medium" as="span">
              {user.user.name ?? user.user.email}
            </Typography>
          </Button>
        }
      />
      <PopoverContent
        side="bottom"
        align="end"
        sideOffset={8}
        popupClassName={cn(
          "bg-black-secondary flex flex-col rounded-xl shadow-xl border border-black-quaternary",
          "w-[300px] p-2"
        )}
      >
        {/* Profile header */}
        <div className="flex items-center gap-3 px-3 py-3">
          <UserAvatar
            name={user.user.name}
            avatarUrl={user.user.avatarUrl ?? undefined}
            size="md"
          />
          <div className="flex min-w-0 flex-col">
            <Typography variant="body-md" weight="semibold" truncate>
              {user.user.name ?? "User"}
            </Typography>
            <Typography variant="body-sm" color="secondary" truncate>
              {user.user.email}
            </Typography>
          </div>
        </div>

        <Separator className="my-1" />

        {/* View account */}
        <Link href={getDetailRoute(ClientRoutes[RouteKey.USER_DETAIL], user.user.id)}>
          <Button
            variant="black-quaternary"
            size="md"
            startIcon={<UserCircleIcon size={18} />}
            fullWidth
          >
            View account
          </Button>
        </Link>

        <Separator className="my-1" />

        <MegaMenuRow
          icon={<GearIcon size={18} className="text-white" />}
          label="Settings"
          href={getDetailRoute(ClientRoutes[RouteKey.USER_DETAIL], user.user.id)}
        />

        <Separator className="my-1" />

        {/* Sign out */}
        <MegaMenuRow
          icon={<SignOutIcon size={18} className="text-white" />}
          label="Sign out"
          onClick={() => {
            // signOut();
            // resetChat();
            router.push("/");
          }}
          showChevron={false}
        />
      </PopoverContent>
    </Popover>
  );
}
