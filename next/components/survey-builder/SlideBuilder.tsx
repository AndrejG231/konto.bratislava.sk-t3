import ContentBuilder from './ContentBuilder'
import { Content, Slide } from './types'

type Props = Readonly<{
  slide: Slide
  onChange: (slide: Slide) => void
  onDelete: () => void
}>

const SlideBuilder = (props: Props) => {
  const { slide, onChange, onDelete } = props

  const createChangeHandler = (index: number) => {
    return (content: Content) =>
      onChange({
        ...slide,
        content: [
          ...slide.content.slice(0, index),
          content,
          ...slide.content.slice(index + 1, slide.content.length),
        ],
      })
  }

  const createDeleteHandler = (index: number) => {
    return () =>
      onChange({
        ...slide,
        content: [
          ...slide.content.slice(0, index),
          ...slide.content.slice(index + 1, slide.content.length),
        ],
      })
  }

  const onAdd = () => {
    onChange({
      ...slide,
      content: [...slide.content, { id: null, __type: 'title_content', title: '', index: 0 }],
    })
  }

  return (
    <div className="m-2 rounded-lg border bg-gray-100 p-4 shadow-lg">
      {slide.content.map((item, index) => (
        <ContentBuilder
          content={item}
          key={index}
          onChange={createChangeHandler(index)}
          onDelete={createDeleteHandler(index)}
        />
      ))}
      <div className="m-2 flex items-center">
        <button
          type="button"
          onClick={onAdd}
          className="m-1 rounded-lg bg-blue-500 px-4 py-2 text-white hover:bg-blue-600"
        >
          Add Content
        </button>
        <button
          type="button"
          onClick={onDelete}
          className="m-1 rounded-lg bg-red-500 px-4 py-2 text-white hover:bg-red-600"
        >
          Delete Slide
        </button>
      </div>
    </div>
  )
}

export default SlideBuilder
