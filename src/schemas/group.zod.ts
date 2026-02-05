import { z } from "zod"

export const GroupSchema = z.object({
    groupName: z.string().min(1, "Group name is required"),
    participants: z.array(z.string()).min(2, "Group size must be larger than 2")
})

