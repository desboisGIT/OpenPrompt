import { ObjectId } from 'bson'

import { z } from "zod"

export type UserRole = "owner" | "manager" | "moderator" | "developer" | "member"

export const validId = z.string().refine((id) => ObjectId.isValid(id), {
    message: "Provided an invalid ID",
});