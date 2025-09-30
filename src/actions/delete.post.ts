'use server'

import { createClient } from "@/utils/supabase/server-client"
import { redirect } from "next/navigation"

const DeletePost = async (postId: string) => {
    const supabase = createClient()
    await supabase
    .from('posts').delete().eq('id', postId).throwOnError()

    redirect("/")
}

export default DeletePost