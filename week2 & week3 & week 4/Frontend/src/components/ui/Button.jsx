export const UiButton = ({ type, text, click, isActive }) => {
  return (
    <button
      type={type}
      className={`cursor-pointer rounded-[999px] border border-(--ink) px-4 py-1.5 transition-all ease-out hover:bg-(--ink) hover:text-white ${isActive} `}
      onClick={click}
    >
      {text}
    </button>
  );
};
