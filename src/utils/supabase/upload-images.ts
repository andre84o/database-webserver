import {v4 as uuidv4} from 'uuid';
import { createClient } from './server-client';

export const uploadImages = async (image: File) => {
    const supabase = await createClient();

    const imageName: string[] = image.name.split('.');
    const path: string = `${imageName[0]}-${Date.now()}.${imageName[1]}`;

    const { data, error } = await supabase.storage.from('images').upload(path, image);

    if (error) throw error;

    const { data: { publicUrl } } = await supabase.storage.from('images').getPublicUrl(path);

    return publicUrl;
}