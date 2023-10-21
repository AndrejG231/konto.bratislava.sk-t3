/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-return */
import { useState } from 'react'

import { Presentation } from '../survey-builder/types'
import SlideView from './SlideView'

type Props = {
  survey: Presentation
}

const SurveyRunner = (props: Props) => {
  const { survey } = props

  const [currentPage, setCurrentPage] = useState(0)

  const [values, setValues] = useState<Record<string, any>>({})

  const addValues = (vals: any) => {
    const newValues = { ...values, ...vals }

    if (survey.slides.length - 1 > currentPage) {
      setCurrentPage((current) => current + 1)
      setValues(newValues)
    }
  }

  return (
    <SlideView slide={survey.slides[currentPage]} addValues={addValues} />
  )
}

export default SurveyRunner
