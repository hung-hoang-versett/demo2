// /graphql/types/User.ts
import { booleanArg, enumType, extendType, objectType, stringArg } from "nexus";
import { Link } from "./Link";

export const User = objectType({
  name: "User",
  definition(t) {
    t.string("id");
    t.string("name");
    t.string("email");
    t.string("image");
    t.string("sub");
    t.field("role", { type: Role });
    t.list.field("bookmarks", {
      type: Link,
      async resolve(_parent, _args, ctx) {
        return await ctx.prisma.user
          .findUnique({
            where: {
              id: _parent.id,
            },
          })
          .bookmarks();
      },
    });
  },
});

const Role = enumType({
  name: "Role",
  members: ["USER", "ADMIN"],
});

export const UsersQuery = extendType({
  type: "Query",
  definition(t) {
    t.nonNull.list.field("users", {
      type: User,
      resolve(_parent, _args, ctx) {
        return ctx.prisma.user.findMany();
      },
    });
  },
});

export const UsersMutation = extendType({
  type: "Mutation",
  definition(t) {
    t.nonNull.field("toggleLike", {
      type: User,
      args: {
        linkId: stringArg(),
        userId: stringArg(),
        isLiked: booleanArg(),
      },
      async resolve(_parent, _args, ctx) {
        const key = _args.isLiked ? "disconnect" : "connect";
        console.log("toggleLike", _args);
        const user = await ctx.prisma.user.update({
          where: {
            id: _args.userId,
          },
          data: {
            bookmarks: {
              [key]: {
                id: _args.linkId,
              },
            },
          },
        });
        return user;
      },
    });
  },
});

export const UserQuery = extendType({
  type: "Query",
  definition(t) {
    t.nonNull.field("user", {
      type: User || null,
      args: {
        email: stringArg(),
      },
      async resolve(_parent, _args, ctx) {
        return await ctx.prisma.user.findFirst({
          where: {
            email: _args.email,
          },
          include: {
            bookmarks: true,
          },
        });
      },
    });
  },
});
