import { useState } from "react";
import books from "../data/books.json";
import { UiButton } from "./ui/Button";
import { gutter, preTitle } from "../utility/style";
import { UiCard } from "./ui/Card";
export const BookCategory = () => {
  const categories = ["Fiction", "Nonfiction", "Staff Picks"];
  const [category, setCategory] = useState("Fiction");
  const booksData = (bookCategory) => {
    switch (bookCategory) {
      case "Fiction":
        return books.fiction;
      case "Nonfiction":
        return books.nonfiction;
      case "Staff Picks":
        return books.staffPicks;
      default:
        return [];
    }
  };
  return (
    <section className={`${gutter} bg-(--band)`}>
      <div className="flex items-end justify-between">
        <div>
          <p className={preTitle}>on the shelves</p>
          <h2 className="pt-2">Shop the books</h2>
        </div>
        <div className="flex gap-3">
          {categories.map((item) => (
            <UiButton
              text={item}
              key={item}
              type="button"
              click={() => setCategory(item)}
              isActive={
                category === item ? "bg-(--ink) text-white" : "hover:scale-115"
              }
            />
          ))}
        </div>
      </div>

      <div className="grid grid-cols-4 gap-4 pt-8">
        {booksData(category).map((book, index) => (
          <UiCard item={book} key={index} />
        ))}
      </div>
    </section>
  );
};
