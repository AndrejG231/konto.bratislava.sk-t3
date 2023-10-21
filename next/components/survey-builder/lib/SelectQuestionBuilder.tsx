import { ChangeEvent, useState } from 'react'

import { SelectQuestion } from '../types'

type Props = {
  content: SelectQuestion
  onChange: (content: SelectQuestion) => void
}

const SelectQuestionBuilder = (props: Props) => {
  const { content, onChange } = props
  const [value, setValue] = useState('')

  function handleAdd() {
    onChange({ ...content, options: [...content.options, { id: null, label: value, value }] })
    setValue('')
  }

  function createDeleteHandler(index: number) {
    return () =>
      onChange({
        ...content,
        options: [
          ...content.options.slice(0, index),
          ...content.options.slice(index + 1, content.options.length),
        ],
      })
  }

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
        Description:
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
      <ul className="mt-4 list-disc">
        {content.options.map((option, index) => (
          <li key={index} className="mb-2 flex items-center">
            <p className="text-gray-700">{option.label}</p>
            <button
              type="button"
              className="ml-2 text-red-500 hover:text-red-700"
              onClick={createDeleteHandler(index)}
            >
              Delete
            </button>
          </li>
        ))}
      </ul>
      <div className="mt-4 flex">
        <input
          className="w-full rounded-lg border px-3 py-2"
          value={value}
          onChange={({ target }) => setValue(target.value)}
          placeholder="New Option"
        />
        <button
          type="button"
          onClick={handleAdd}
          className="ml-2 rounded-lg bg-green-500 px-4 py-2 text-white hover:bg-green-600"
        >
          Add
        </button>
      </div>
    </div>
  )
}

export default SelectQuestionBuilder
