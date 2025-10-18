import { CreatePost } from "@/actions/create.post";

const CreatePage = async () => {
  return (
    <div className="max-w-2xl mx-auto px-4 py-6 sm:py-10 mt-4">
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 sm:p-6">
        <h1 className="font-bold text-2xl mb-4">Create Post</h1>

  <form id="create-post-form" action={CreatePost} className="space-y-6 pb-28 sm:pb-0">
          <div>
            <label className="block mb-2 font-medium text-sm" htmlFor="title">
              Title
            </label>
            <input
              id="title"
              name="title"
              required
              className="w-full border border-gray-200 rounded-lg px-3 py-3 text-base focus:outline-none focus:ring-2 focus:ring-[var(--brand-center)]"
            />
          </div>
          <div>
            <label className="block mb-2 font-medium text-sm" htmlFor="content">
              Content
            </label>
            <textarea
              id="content"
              name="content"
              rows={8}
              className="w-full border border-gray-200 rounded-lg px-3 py-3 text-base focus:outline-none focus:ring-2 focus:ring-[var(--brand-center)]"
            />
          </div>
          <div>
            <label className="block mb-2 font-medium text-sm" htmlFor="image">
              Cover image
            </label>
            <input
              id="image"
              name="image"
              type="file"
              accept="image/*"
              className="hidden"
            />

            <label htmlFor="image" className="bookmarkBtn">
              <span className="IconContainer">
                <svg className="icon" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"></path>
                </svg>
              </span>
              <span className="text">Save</span>
            </label>
          </div>
          <div>
            <label className="block mb-2 font-medium text-sm" htmlFor="category">
              Category
            </label>
            <select
              id="category"
              name="category"
              className="w-full border border-gray-200 rounded-lg px-3 py-3 text-base"
            >
              <option value="">Select a category</option>
              <option>Food</option>
              <option>Politics</option>
              <option>Travel</option>
              <option>Inspiration</option>
              <option>News</option>
              <option>Food &amp; Recipes</option>
              <option>Photo &amp; Design</option>
              <option>Productivity</option>
            </select>
          </div>
          <div className="hidden sm:block">
            <button className="w-40 inline-block bg-neutral-900 text-white py-3 px-4 rounded-lg" type="submit">
              Create
            </button>
          </div>
        </form>
      </div>
      <div className="sm:hidden fixed left-4 right-4 bottom-4 z-50">
        <button
          form="create-post-form"
          type="submit"
          className="w-full bg-neutral-900 text-white py-3 rounded-lg shadow-lg"
          aria-label="Create post"
        >
          Create
        </button>
      </div>
    </div>
  );
};

export default CreatePage;
