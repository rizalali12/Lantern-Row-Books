import { preTitle, button, gutter } from "../utility/style.js";
import { goToId } from "../utility/composable.js";

export const Hero = () => {
  return (
    <section
      className={`${gutter} flex items-center justify-center gap-5 text-center md:justify-between md:text-start`}
      id="hero"
    >
      <div>
        <p className={preTitle}>Independent Bookshop</p>
        <h1 className="max-w-135 pt-2 pb-5 text-[40px] leading-10 md:text-[68px] md:leading-19">
          Book chosen by people who actually read them.
        </h1>
        <p className="max-w-130 leading-6">
          Shelves of new fiction, thoughtful nonfiction and a table of staff
          favourites. Come browse, stay for a reading, or join a book club.
        </p>
        <div className="flex flex-wrap items-center justify-center gap-3 pt-8 md:justify-start">
          <button
            onClick={goToId("books")}
            type="button"
            className={`${button} bg-(--ink) text-white`}
          >
            Browse the shelves
          </button>
          <button type="button" className={button}>
            See upcoming events
          </button>
        </div>
      </div>
      <div>
        <img
          className="hidden max-h-112 rounded-lg md:block"
          src="../../public/image/hero-shelf.webp"
          alt="Illustration of colorful book"
        />
      </div>
    </section>
  );
};
