import { z } from "zod";


import {
    createTRPCRouter,
    protectedProcedure,
    publicProcedure,
} from "@/server/api/trpc";

import { ObjectId } from "bson"

export const teamRouter = createTRPCRouter({
    //   hello: publicProcedure
    //     .input(z.object({ text: z.string() }))
    //     .query(({ input }) => {
    //       return {
    //         greeting: `Hello ${input.text}`,
    //       };
    //     }),

    // create: protectedProcedure
    //   .input(z.object({ name: z.string().min(1) }))
    //   .mutation(async ({ ctx, input }) => {
    //     return ctx.db.dummy.create({
    //       data: {
    //         createdBy: { connect: { id: ctx.session.user.id } },
    //       },
    //     });
    //   }),

    // getLatest: protectedProcedure.query(async ({ ctx }) => {
    //   const dummy = await ctx.db.dummy.findFirst({
    //     orderBy: { createdAt: "desc" },
    //   });

    //   return dummy ?? null;
    // }),

    //   getSecretMessage: protectedProcedure.query(() => {
    //     return "you can now see this secret message!";
    //   }),


    createTeam: protectedProcedure
        .input(z.object({
            name: z.string().min(1)
        }))
        .mutation(async ({ ctx, input }) => {

            const existingTeam = await ctx.db.team.findUnique({
                where: {
                    name: input.name
                }
            });

            if (existingTeam) {
                throw new Error("A team with this name already exists. Please choose a different name.");
            }

            const team = await ctx.db.team.create({
                data: {
                    name: input.name
                }
            })

            const member = await ctx.db.teamMember.create({
                data: {
                    userId: ctx.session.user.id,
                    teamId: team.id
                }
            })

            return team
        }),

    createPrompt: protectedProcedure
        .input(z.object({
            aiPrompt: z.string().min(1, "Must provide a source prompt"),
            title: z.string().min(1, "A title is required for your prompt"),
            description: z.string().optional(),
            teamId: z.string().refine((id) => !id || ObjectId.isValid(id), {
                message: "Invalid Team ID",
            }),
        }))
        .mutation(async ({ ctx, input }) => {
            const teamId = new ObjectId(input.teamId)

            const branding = await ctx.db.branding.create({
                data: {
                    name: `${input.title}`,
                },
            });

            const prompt = await ctx.db.prompt.create({
                data: {
                    aiPrompt: input.aiPrompt,
                    title: input.title,
                    description: input.description || null,
                    brandingId: branding.id,
                    teamId: teamId.toString(),
                    userId: ctx.session.user.id,
                },
            });

            return prompt;
        }),



    getTeam: protectedProcedure
        .input(z.object({
            teamId: z.string().min(1).refine((id) => {
                return ObjectId.isValid(id)
            }, {
                message: "Invalid Team ID"
            })
        }))
        .query(async ({ ctx, input }) => {
            const id = new ObjectId(input.teamId)

            return ctx.db.team.findUnique({ where: { id: id.toString() }, include: { members: true, settings: true, prompts: true } })
        }),

    getUserTeams: protectedProcedure.query(async ({ ctx }) => {
        try {
            // Ensure user is authenticated
            if (!ctx.session?.user?.email) {
                throw new Error("Unauthorized: No user session found");
            }

            // Fetch user and their teams safely
            const userWithTeams = await ctx.db.user.findFirst({
                where: { email: ctx.session.user.email },
                select: {
                    teams: {
                        select: {
                            role: true,
                            team: {
                                select: {
                                    id: true,
                                    name: true,
                                    createdAt: true,
                                    updatedAt: true,
                                    members: {
                                        select: {
                                            role: true,
                                            user: {
                                                select: {
                                                    id: true,
                                                    name: true,
                                                    email: true
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            });

            // If user not found or has no teams, return an empty array
            if (!userWithTeams || !userWithTeams.teams) {
                return [];
            }

            // Transform data safely
            const teams = userWithTeams.teams
                .filter(teamMember => teamMember.team !== null)  // Ensure no null teams
                .map(teamMember => ({
                    id: teamMember.team!.id,
                    name: teamMember.team!.name || "Unnamed Team",
                    createdAt: teamMember.team!.createdAt,
                    updatedAt: teamMember.team!.updatedAt,
                    role: teamMember.role,
                    members: (teamMember.team!.members || []).map(member => ({
                        role: member.role,
                        user: {
                            id: member.user.id,
                            name: member.user.name || "Unknown",
                            email: member.user.email || "No email provided"
                        }
                    }))
                }));

            return teams;
        } catch (error) {
            console.error("Error fetching user teams:", error);
            throw new Error("Failed to fetch user teams. Please try again later.");
        }
    })


});
