/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable jsx-a11y/label-has-associated-control */
import React from 'react'

type Props = {
  question: string
  onChange: any
  description?: string
  value: number
}

const RateSelector = (props: Props) => {
  const { question, description, onChange, value: selectedValue } = props

  return (
    <div className="mx-auto max-w-lg p-4">
      <div className="rounded-lg bg-white p-4 shadow-lg">
        <label className="text-sm font-bold text-gray-700" htmlFor="rate-selector">
          {question}
        </label>
        <div className="mt-2 flex items-center space-x-2">
          {[1, 2, 3, 4, 5].map((value) => (
            <label
              key={value}
              className={`cursor-pointer ${
                selectedValue === value ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700'
              } rounded-md px-4 py-2`}
            >
              <input
                type="radio"
                id={`rate-${value}`}
                name="rating"
                value={value}
                onChange={() => onChange(value)}
                className="hidden"
              />
              {value}
            </label>
          ))}
        </div>
        {description && <p className="text-sm mt-2 text-gray-600">{description}</p>}
      </div>
    </div>
  )
}

export default RateSelector
