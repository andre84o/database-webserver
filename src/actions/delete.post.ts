'use server'

import { createClient } from "@/utils/supabase/server-client"
import { redirect } from "next/navigation"

const DeletePost = async (postId: string) => {
    const supabase = await createClient()
    const id = Number(postId)
    await supabase
    .from('posts').delete().eq('id', id).throwOnError()

    redirect("/")
}

export default DeletePost