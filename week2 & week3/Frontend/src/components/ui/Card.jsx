export const UiCard = ({ data }) => {
  return (
    <div className="transition-all duration-300 ease-out hover:scale-102">
      <img
        className="h-100 w-full rounded-xl object-contain shadow-2xl sm:h-105 sm:object-cover"
        src={data.image}
        alt={data.alt}
      />
      <div className="flex flex-col gap-1 pt-2">
        <h3>{data.title}</h3>
        <p className="font-extralight text-(--muted)">{data.author} </p>
      </div>
      <div className="flex flex-wrap items-center justify-between gap-2 pt-2">
        <p className="text-(--ink)">{`$${data.price}`}</p>
        <span className="flex min-h-8 items-center rounded border border-[#cfc7b4] bg-(--ground) px-3 text-xs font-semibold tracking-[0.1em] text-(--body-soft) uppercase">
          {data.shelf}
        </span>
      </div>
    </div>
  )
}

export const UiEventCard = ({ data }) => {
  return (
    <div className="flex items-start gap-5 rounded-xl border p-6 shadow-[0_7px_10px] transition-transform duration-200 ease-out hover:scale-105">
      <div>
        <p className="rounded-xl bg-(--ink) p-4 text-center text-4xl font-bold text-white">{`${data.day} ${data.month}`}</p>
      </div>
      <div className="flex max-w-55 flex-col items-start gap-2">
        <h3>{data.title}</h3>
        <p className="text-sm text-(--muted)">{`${data.weekday} · ${data.time} · ${data.type}`}</p>
        <p className="text-sm text-(--muted)">{data.description}</p>
        <button
          type="button"
          className="cursor-pointer border-b font-bold transition-all hover:scale-103 hover:border-b-(--accent) hover:text-(--accent)"
        >
          {data.buttonText}
        </button>
      </div>
    </div>
  )
}
