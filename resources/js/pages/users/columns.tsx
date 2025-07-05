"use client"

import { ColumnDef } from "@tanstack/react-table"

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.
export type User = {
    name: string
    username: string
    email: string
    avatar?: string
    created_at: string
}

export const columns: ColumnDef<User>[] = [
    {
        accessorKey: "avatar",
        header: "Avatar",
        cell: ({ row }) => {
            const avatar = row.getValue("avatar") as string | undefined
            return (
                <img
                    src={avatar || "/assets/default.png"}
                    alt="User Avatar"
                    className="w-10 h-10 rounded-full"
                />
            )
        },
    },
    {
        accessorKey: "name",
        header: "Name",
    },
    {
        accessorKey: "username",
        header: "Username",
    },
    {
        accessorKey: "email",
        header: "Email",
    },
    {
        accessorKey: "created_at",
        header: "Created At",
        cell: ({ row }) => {
            const dateString = row.getValue("created_at") as string
            const date = new Date(dateString)
            return date.toLocaleDateString("id-ID", {
                year: "numeric",
                month: "long",
                day: "numeric",
            })
        },
    },
]
