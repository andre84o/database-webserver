import Link from "next/link";

const EditButton = ({ slug }: { slug: string }) => {
  return (
    <Link className="button-secondary" href={`/${slug}/edit`}>
      Edit Post
    </Link>
  );
};

export default EditButton;
