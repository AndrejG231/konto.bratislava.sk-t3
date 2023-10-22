import { ChangeEvent } from 'react'

import { CloseQuestion } from '../types'

type Props = {
  content: CloseQuestion
  onChange: (content: CloseQuestion) => void
}

const ClosedQuestionBuilder = (props: Props) => {
  const { content, onChange } = props

  return (
    <div className="rounded-lg border p-4 shadow-lg">
      <label htmlFor="title" className="mb-2 block font-bold text-gray-700">
        Question:
        <input
          value={content.question}
          onChange={({ target }: ChangeEvent<HTMLInputElement>) =>
            onChange({ ...content, question: target.value })
          }
          type="text"
          id="title"
          className="mt-2 w-full rounded-lg border px-3 py-2"
        />
      </label>
      <label htmlFor="description" className="mb-2 block font-bold text-gray-700">
        Description (optional):
        <input
          value={content.description}
          onChange={({ target }: ChangeEvent<HTMLInputElement>) =>
            onChange({ ...content, description: target.value })
          }
          type="text"
          id="description"
          className="mt-2 w-full rounded-lg border px-3 py-2"
        />
      </label>
    </div>
  )
}

export default ClosedQuestionBuilder
