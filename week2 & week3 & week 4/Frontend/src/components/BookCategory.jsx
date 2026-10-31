import { useEffect, useState } from 'react'
import { UiButton } from './ui/Button'
import { gutter, preTitle } from '../utility/style'
import { UiCard } from './ui/Card'
import bookRepository from '../repository/bookRepository'
import purchasesRepository from '../repository/purchases'

export const BookCategory = ({
  purchasesBook = [],
  user,
  onRequireLogin,
  onPurchasesChange,
}) => {
  const categories = ['Fiction', 'Nonfiction', 'Staff Picks']
  const [category, setCategory] = useState('Fiction')
  const [bookData, setBookData] = useState([])
  const [buyingId, setBuyingId] = useState(null)
  const [buyError, setBuyError] = useState(null)
  const categoryMap = {
    Fiction: 'fiction',
    Nonfiction: 'nonfiction',
    'Staff Picks': 'staff_picks',
  }

  useEffect(() => {
    const fetchBook = async () => {
      try {
        const result = await bookRepository.getBook({
          category: categoryMap[category],
        })

        setBookData(result.data)
      } catch (error) {
        console.log(error)
      }
    }

    fetchBook()
  }, [category])

  const handleBuy = async (bookId) => {
    setBuyError(null)

    if (!user) {
      onRequireLogin()
      return
    }

    setBuyingId(bookId)
    try {
      const result = await purchasesRepository.createCheckout(bookId)

      if (result?.checkoutUrl) {
        window.location.assign(result.checkoutUrl)
        return
      }

      setBuyError('Could not start checkout. Please try again.')
    } catch (err) {
      setBuyError(
        err?.response?.data?.message ||
          'Could not start checkout. Please try again.'
      )

      // The backend rejects books that are already paid for; refresh ownership.
      if (err?.response?.status === 409) onPurchasesChange()
    } finally {
      setBuyingId(null)
    }
  }

  return (
    <section className={`${gutter} bg-(--line)`} id="books">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className={preTitle}>on the shelves</p>
          <h2 className="pt-2">Shop the books</h2>
        </div>
        <div className="flex items-center gap-3">
          {categories.map((item) => (
            <UiButton
              text={item}
              key={item}
              type="button"
              click={() => setCategory(item)}
              isActive={
                category === item ? 'bg-(--ink) text-white' : 'hover:scale-115'
              }
            />
          ))}
        </div>
      </div>

      {buyError && (
        <p role="alert" className="pt-4 text-(--accent)">
          {buyError}
        </p>
      )}

      <div className="grid grid-cols-1 gap-8 pt-8 sm:grid-cols-2 lg:grid-cols-4">
        {bookData.map((book) => {
          const isBookPurchases = purchasesBook.includes(String(book.id))
          return (
            <UiCard
              data={book}
              key={book.id}
              isPurchasesBook={isBookPurchases}
              onBuy={handleBuy}
              isBuying={buyingId === book.id}
            />
          )
        })}
      </div>
    </section>
  )
}
