import { ChangeEvent } from 'react'

import ClosedQuestionBuilder from './lib/ClosedQuestionBuilder'
import DocumentBuilder from './lib/DocumentBuilder'
import ImageBuilder from './lib/ImageBuilder'
import RatingQuestionBuilder from './lib/RatingQuestionBuilder'
import SelectQuestionBuilder from './lib/SelectQuestionBuilder'
import TextQuestionBuilder from './lib/TextQuestionBuilder'
import TitleBuilder from './lib/TitleBuilder'
import { Content } from './types'

type Props = Readonly<{
  content: Content
  onChange: (content: Content) => void
  onDelete: () => void
}>

const ContentBuilder = (props: Props) => {
  const { content, onDelete, onChange } = props

  const getCorrectBuilder = () => {
    // eslint-disable-next-line no-underscore-dangle
    switch (content.__type) {
      case 'title_content':
        return <TitleBuilder content={content} onChange={onChange} />
      case 'document_content':
        return <DocumentBuilder content={content} onChange={onChange} />
      case 'image_content':
        return <ImageBuilder content={content} onChange={onChange} />
      case 'text_question':
        return <TextQuestionBuilder content={content} onChange={onChange} />
      case 'close_question':
        return <ClosedQuestionBuilder content={content} onChange={onChange} />
      case 'rating_question':
        return <RatingQuestionBuilder content={content} onChange={onChange} />
      case 'select_question':
        return <SelectQuestionBuilder content={content} onChange={onChange} />
      default:
        return null
    }
  }

  const changeType = ({ target }: ChangeEvent<HTMLSelectElement>) => {
    switch (target.value) {
      case 'document_content':
        onChange({
          id: content.id,
          __type: 'document_content',
          source: '',
          title: '',
          description: '',
        })
        return
      case 'image_content':
        onChange({
          id: content.id,
          __type: 'image_content',
          source: '',
          title: '',
          description: '',
        })
        return
      case 'rating_question':
        onChange({ id: content.id, __type: 'rating_question', question: '', description: '' })
        return
      case 'select_question':
        onChange({
          id: content.id,
          __type: 'select_question',
          question: '',
          description: '',
          options: [],
        })
        return
      case 'text_question':
        onChange({ id: content.id, __type: 'text_question', question: '', description: '' })
        return
      case 'title_content':
        onChange({ id: content.id, __type: 'title_content', title: '' })
        break
      case 'close_question':
        onChange({ id: content.id, __type: 'close_question', question: '', description: '' })
        break
      default:
    }
  }

  return (
    <div className="mt-4 rounded-lg border bg-gray-100 p-4 shadow-lg">
      <div className="mb-4">
        <label htmlFor="selectInput" className="block font-bold text-gray-700">
          Choose an option:
          <select
            id="selectInput"
            name="selectInput"
            // eslint-disable-next-line no-underscore-dangle
            value={content.__type}
            onChange={changeType}
            className="mt-2 w-full rounded-lg border px-3 py-2 text-gray-700"
          >
            <option value="document_content">Document Content</option>
            <option value="image_content">Image Content</option>
            <option value="rating_question">Rating Question</option>
            <option value="select_question">Select Question</option>
            <option value="text_question">Text Question</option>
            <option value="close_question">Closed Question</option>
            <option value="title_content">Title Content</option>
          </select>
        </label>
      </div>
      {getCorrectBuilder()}
      <div className="mt-4">
        <button
          type="button"
          onClick={onDelete}
          className="rounded-lg bg-red-500 px-4 py-2 text-white hover:bg-red-600"
        >
          Delete Content
        </button>
      </div>
    </div>
  )
}

export default ContentBuilder
