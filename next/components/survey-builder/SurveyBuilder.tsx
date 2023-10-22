import { useState } from 'react'

import SlideBuilder from './SlideBuilder'
import { Presentation, Slide } from './types'

type Props = {
  initialPresentation: Presentation
}

const SurveyBuilder = (props: Props) => {
  const { initialPresentation } = props

  const [presentation, setPresentation] = useState<Presentation>(initialPresentation)

  const createSlideChangeHandler = (index: number) => {
    return (slide: Slide) =>
      setPresentation((curr) => ({
        ...curr,
        slides: [
          ...curr.slides.slice(0, index),
          slide,
          ...curr.slides.slice(index + 1, curr.slides.length),
        ],
      }))
  }

  const createSlideDeleteHandler = (index: number) => {
    return () =>
      setPresentation((curr) => ({
        ...curr,
        slides: [
          ...curr.slides.slice(0, index),
          ...curr.slides.slice(index + 1, curr.slides.length),
        ],
      }))
  }

  const addSlide = () => {
    setPresentation((curr) => ({
      ...curr,
      slides: [...curr.slides, { content: [], id: null, index: 0 }],
    }))
  }

  return (
    <div className="m-2">
      {presentation.slides.map((item, index) => (
        <SlideBuilder
          key={index}
          slide={item}
          onChange={createSlideChangeHandler(index)}
          onDelete={createSlideDeleteHandler(index)}
        />
      ))}
      <button
        onClick={addSlide}
        className="m-2 rounded-lg bg-blue-500 px-4 py-2 text-white hover:bg-blue-600"
        type="button"
      >
        Add Survey Section
      </button>
      {/* <pre>{JSON.stringify(presentation, null, 4)}</pre> */}
    </div>
  )
}

export default SurveyBuilder
