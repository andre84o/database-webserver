import { getSinglePost } from "@/utils/supabase/queries";

const SinglePost = async ({params}:{params:{slug:string}}) => {
    const {slug} = await params
    const {data,error} = await getSinglePost(slug)
    console.log(data)

    return (
        <>
        {data && 
          <>
            <div className="w-2xl p-4 m-auto border-gray-700 border-1 mt-4 rounded-2xl">
                <h2 className="font-bold text-xl">{data.title}</h2>
                <p className="mt-4">Author {data.users?.username}</p>
                </div>
            <div className="w-2xl p-4 m-auto border-gray-700 border-1 mt-4 rounded-2xl">
                {data.content && <div>{data.content}</div>}
            </div>
          </>
}
        </>

    )}

    export default SinglePost;