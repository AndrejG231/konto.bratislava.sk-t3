import React from 'react'

import { Slide } from '../survey-builder/types'
import ContentView from './ContentView'
import useSlideFields, { Fields } from './useSlideFields'

type Props = {
  slide: Slide
  addValues: (fields: Fields) => void
}

const SlideView = (props: Props) => {
  const { slide, addValues } = props

  const [fields, setFields] = useSlideFields(slide)

  const isFilled = Object.values(fields).every((val) => val.value !== '')

  const handleNext = () => {
    addValues(fields)
  }

  const createChangeHandler = (field: any) => {
    return (value: any) =>
      setFields((curr) => ({
        ...curr,
        [field]: {
          ...curr[field as string],
          value,
        },
      }))
  }

  return (
    <div>
      {JSON.stringify(fields)}
      {slide.content.map((content) => (
        <ContentView
          content={content}
          onChange={createChangeHandler(content.id)}
          value={fields[content.id as number]}
        />
      ))}
      <div className="align-center flex w-full items-center">
        <button
          type="button"
          onClick={handleNext}
          disabled={!isFilled}
          className={`
          mx-auto mb-4 mt-2 rounded-md px-4 py-2
          ${
            !isFilled
              ? 'cursor-not-allowed bg-gray-400'
              : 'bg-blue-500 text-white hover:bg-blue-600 hover:text-white'
          }
        `}
        >
          Next
        </button>
      </div>
    </div>
  )
}

export default SlideView
