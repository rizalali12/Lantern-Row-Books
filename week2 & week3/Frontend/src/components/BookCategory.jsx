import { useEffect, useState } from 'react'
import { UiButton } from './ui/Button'
import { gutter, preTitle } from '../utility/style'
import { UiCard } from './ui/Card'
import bookRepository from '../repository/bookRepository'

export const BookCategory = () => {
  const categories = ['Fiction', 'Nonfiction', 'Staff Picks']
  const [category, setCategory] = useState('Fiction')
  const [bookData, setBookData] = useState([])
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

      <div className="grid grid-cols-1 gap-8 pt-8 sm:grid-cols-2 lg:grid-cols-4">
        {bookData.map((book) => (
          <UiCard data={book} key={book.id} />
        ))}
      </div>
    </section>
  )
}
