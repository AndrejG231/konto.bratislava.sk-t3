import cx from 'classnames'
import { ReactNode } from 'react'

type MyApplicationsHeaderBase = {
  title: string
  children: ReactNode
  categories: HeaderNavigationItemBase[]
  selectCategory: (category: HeaderNavigationItemBase) => void
  selectedCategory: HeaderNavigationItemBase
}

type HeaderNavigationItemBase = {
  title: string
  tag: string
}

// TODO accessibility - refactor to use Tabs from react-aria-components
const ParticipationHeader = (props: MyApplicationsHeaderBase) => {
  const { title, children, selectCategory, selectedCategory, categories } = props

  return (
    <div className="bg-gray-50">
      <span className="m-auto flex h-full w-full max-w-screen-lg flex-col justify-end gap-4 pt-6 lg:gap-6 lg:px-0 lg:pt-14">
        <h1 className="text-h1 pl-4 lg:pl-0">{title}</h1>
        {children}
        <ul className="flex gap-0 lg:gap-12">
          {categories.map((item, i) => (
            <li className="w-full lg:w-max" key={i}>
              <button
                type="button"
                onClick={() => selectCategory(item)}
                className={cx(
                  'text-20 w-full cursor-pointer border-b-2 py-4 transition-all',
                  'hover:text-20-semibold hover:border-gray-700 ',
                  {
                    'text-20-semibold border-b-2 border-gray-700':
                      selectedCategory.tag === item.tag,
                  },
                  {
                    'border-transparent': selectedCategory.tag !== item.tag,
                  },
                )}
              >
                {item.title}
              </button>
            </li>
          ))}
        </ul>
      </span>
    </div>
  )
}

export default ParticipationHeader
