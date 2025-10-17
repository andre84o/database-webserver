import { v4 as uuidv4 } from "uuid";
import { createClient as createSupabaseClient, SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "./database.types";

export const uploadImages = async (image: File, userId?: string) => {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
    const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
    if (!serviceKey) throw new Error("SUPABASE_SERVICE_ROLE_KEY is not set in env");

    const supabase: SupabaseClient<Database> = createSupabaseClient(supabaseUrl, serviceKey);

    const imageName: string[] = image.name.split(".");
    const ext = imageName.length > 1 ? imageName.pop() : "jpg";
    const basename = imageName.join(".") || uuidv4();
    const path: string = `${basename}-${Date.now()}.${ext}`;

    let uploadBody: Buffer | File = image as File;
    const contentType: string | undefined = (image as any)?.type;
    if (typeof (image as any)?.arrayBuffer === "function") {
        const arrayBuffer = await (image as any).arrayBuffer();
        uploadBody = Buffer.from(arrayBuffer);
    }

    const { data, error } = await supabase.storage.from("images").upload(path, uploadBody, {
        metadata: userId ? { user_id: userId } : undefined,
        cacheControl: "3600",
        contentType,
    });

    console.log("upload-images upload result:", { path, data, error: (error as any)?.message ?? error });
    if (error) throw error;

    const publicUrlResult = await supabase.storage.from("images").getPublicUrl(path);
    console.log("upload-images publicUrl result:", { path, publicUrlResult });
    return publicUrlResult.data.publicUrl;
};