import { UiButton } from "./Button";

export const UiCard = ({ item }) => {
  return (
    <div className="transition-all ease-out hover:scale-102">
      <img
        className="h-105 max-w-full rounded-xl object-cover shadow-2xl"
        src={item.image}
        alt={item.alt}
      />
      <div className="flex flex-col gap-1 pt-2">
        <h3>{item.title}</h3>
        <p className="font-extralight text-(--muted)">{item.author} </p>
      </div>
      <div className="flex items-center justify-between">
        <p className="text-(--ink)">{`$${item.price}`}</p>
        <UiButton text="Add to cart" />
      </div>
    </div>
  );
};
