import { gutter, preTitle } from "../utility/style";
import { UiEventCard } from "./ui/Card";
import { UiButton } from "./ui/Button";
import { useState } from "react";
import eventData from "../data/events.json";

export const Event = () => {
  const categories = ["All", "Book club", "Event"];
  const [category, setCategory] = useState("All");

  const dataFilter =
    category === "All"
      ? eventData
      : eventData.filter((data) => data.type === category);

  return (
    <section className={gutter} id="event">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className={preTitle}>In the shop</p>
          <h2 className="pt-2">Readings & book clubs</h2>
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
      <div className="grid grid-cols-1 gap-5 pt-8 sm:grid-cols-2 lg:grid-cols-3">
        {dataFilter.map((item) => (
          <UiEventCard data={item} key={item.title} />
        ))}
      </div>
    </section>
  );
};
