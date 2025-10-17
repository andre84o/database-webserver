import { CreatePost } from "@/actions/create.post";

const CreatePage = async () => {
  return (
    <div className="w-2xl p-4 m-auto border-gray-700 border-1 mt-4 rounded-2xl">
      <h1 className="font-bold text-xl mb-4">Create Post</h1>
      <form action={CreatePost}>
        <div className="mb-4">
          <label className="block mb-1 font-medium" htmlFor="title">
            Title
          </label>
          <input
            id="title"
            name="title"
            required
            className="w-full border border-gray-300 rounded px-3 py-2"
          />
        </div>

        <div className="mb-4">
          <label className="block mb-1 font-medium" htmlFor="content">
            Content
          </label>
          <textarea
            id="content"
            name="content"
            rows={6}
            className="w-full border border-gray-300 rounded px-3 py-2"
          />
        </div>

        <div className="mb-4">
          <label className="block mb-1 font-medium" htmlFor="image">
            Image
          </label>
          <input id="image" name="image" type="file" accept="image/*" />
        </div>

        <div className="mb-4">
          <label className="block mb-1 font-medium" htmlFor="category">
            Category
          </label>
          <select
            id="category"
            name="category"
            className="w-full border border-gray-300 rounded px-3 py-2"
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

        <div>
            <button className="button-quaternary" type="submit">
            Create
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreatePage;
