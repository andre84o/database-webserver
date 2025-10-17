import Link from "next/link";
import StartWritingButton from "@/app/components/StartWritingButton";
import Image from "next/image";

const AboutPage = () => {
    return (
      <main className="min-h-screen bg-white text-slate-900">
        <section className="relative overflow-hidden">
          <div className="w-full py-24 px-6 sm:px-8 lg:px-16 rounded-b-3xl about-hero">
            <div className="max-w-6xl mx-auto text-center text-white">
              <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold leading-tight drop-shadow-lg">
                A modern platform for creators and readers
              </h1>
              <p className="mt-4 text-lg sm:text-xl text-white/90 max-w-3xl mx-auto">
                Publish long-form posts, share images, and connect with a
                curious audience. Our blog platform is built for creators who
                care about design, clarity and discoverability.
              </p>

              <div className="mt-8 flex items-center justify-center gap-4">
                <StartWritingButton>Create a Post</StartWritingButton>
                <Link
                  href="/"
                  className="button-primary text-white inline-block border shadow-2xl course-pointer"
                >
                  Learn more
                </Link>
              </div>
            </div>
          </div>
        </section>

        <section className="py-16 px-6 sm:px-8 lg:px-16">
          <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold mb-4">Our mission</h2>
              <p className="text-lg text-slate-700 mb-6">
                We empower writers, photographers and creators to publish their
                best work. Our mission is to make publishing accessible,
                beautiful, and fast — so ideas reach the right readers. Posts
                support images, categories and rich content to give every story
                the space it deserves.
              </p>

              <ul className="space-y-4">
                <li className="flex items-start gap-4">
                  <div className="h-10 w-10 rounded-lg bg-[var(--brand-top-left)] flex items-center justify-center text-white font-semibold">
                    A
                  </div>
                  <div>
                    <div className="font-semibold">Attention to craft</div>
                    <div className="text-sm text-slate-600">
                      Design and engineering in harmony.
                    </div>
                  </div>
                </li>
                <li className="flex items-start gap-4">
                  <div className="h-10 w-10 rounded-lg bg-[var(--brand-bottom-right)] flex items-center justify-center text-white font-semibold">
                    P
                  </div>
                  <div>
                    <div className="font-semibold">Privacy first</div>
                    <div className="text-sm text-slate-600">
                      We protect user data and build responsibly.
                    </div>
                  </div>
                </li>
              </ul>
            </div>

            <div className="w-full rounded-2xl overflow-hidden shadow-xl bg-gradient-to-br from-white/30 to-white/10">
              <div className="aspect-[4/3] bg-gradient-to-br from-[var(--brand-top-left)] to-[var(--brand-bottom-right)] flex items-center justify-center text-white text-2xl font-bold">
                <Image
                  src="/logo-bixy.png"
                  alt="About us image"
                  width={400}
                  height={300}
                />
              </div>
            </div>
          </div>
        </section>

        <section className="py-12 bg-slate-50">
          <div className="max-w-6xl mx-auto px-6 sm:px-8 lg:px-16">
            <h3 className="text-2xl font-bold mb-8">What we do</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="p-6 bg-white rounded-2xl shadow-md">
                <div className="h-12 w-12 rounded-lg bg-[var(--brand-center)] flex items-center justify-center text-white mb-4">
                  Ix
                </div>
                <h4 className="font-semibold mb-2">Publish with ease</h4>
                <p className="text-sm text-slate-600">
                  Write long-form posts, attach images, and organize with
                  categories.
                </p>
              </div>
              <div className="p-6 bg-white rounded-2xl shadow-md">
                <div className="h-12 w-12 rounded-lg bg-[var(--brand-purple-1)] flex items-center justify-center text-white mb-4">
                  Ux
                </div>
                <h4 className="font-semibold mb-2">Discoverability</h4>
                <p className="text-sm text-slate-600">
                  Filters and category pages help readers find the stories they
                  love.
                </p>
              </div>
              <div className="p-6 bg-white rounded-2xl shadow-md">
                <div className="h-12 w-12 rounded-lg bg-[var(--brand-purple-2)] flex items-center justify-center text-white mb-4">
                  En
                </div>
                <h4 className="font-semibold mb-2">Performance & scale</h4>
                <p className="text-sm text-slate-600">
                  Fast page loads and image handling for global audiences.
                </p>
              </div>
            </div>
          </div>
        </section>
        <section className="py-16 px-6 sm:px-8 lg:px-16">
          <div className="max-w-6xl mx-auto">
            <h3 className="text-2xl font-bold mb-6">Our team</h3>
            <p className="text-sm text-slate-600 mb-8">
              Small, multi-disciplinary team working across product, design and
              engineering — we ship features that help creators publish and
              readers discover.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {[
                { name: "André Torabpour", role: "Founder & CEO" },
                { name: "André Torabpour", role: "Head of Design" },
                { name: "André Torabpour", role: "Lead Engineer" },
              ].map((p, i) => (
                <div
                  key={`${p.name}-${p.role}-${i}`}
                  className="p-6 bg-white rounded-2xl shadow-md flex gap-4 items-center"
                >
                  <div className="h-14 w-14 rounded-full bg-[var(--brand-center)] flex items-center justify-center text-white font-semibold text-lg">
                    {p.name
                      .split(" ")
                      .map((n) => n[0])
                      .slice(0, 2)
                      .join("")}
                  </div>
                  <div>
                    <div className="font-semibold">{p.name}</div>
                    <div className="text-sm text-slate-600">{p.role}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
        <section className="py-12 bg-gradient-to-t from-white/60 to-transparent">
          <div className="max-w-6xl mx-auto px-6 sm:px-8 lg:px-16 text-center">
            <h4 className="text-xl font-bold mb-3">
              Ready to share your story?
            </h4>
            <p className="text-sm text-slate-600 mb-6">
              Join our community and publish what matters to you.
            </p>
            <StartWritingButton>Start writing</StartWritingButton>
          </div>
        </section>
      </main>
    );
};

export default AboutPage;