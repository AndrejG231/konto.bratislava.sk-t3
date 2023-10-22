/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-return */
import { useRouter } from 'next/router'
import { useState } from 'react'

import { Presentation } from '../survey-builder/types'
import SlideView from './SlideView'

type Props = {
  survey: Presentation
}

const SurveyRunner = (props: Props) => {
  const { survey } = props

  const [currentPage, setCurrentPage] = useState(0)

  const router = useRouter()

  const [values, setValues] = useState<Record<string, any>>({})

  const [modal, setModal] = useState<any>(null)

  const onClose = () => router.push('/participation')

  const addValues = (vals: any) => {
    const newValues = { ...values, ...vals }

    if (survey.slides.length - 1 > currentPage) {
      setCurrentPage((current) => current + 1)
      setValues(newValues)
      return
    }

    setModal(
      <div className="fixed inset-0 z-50 flex items-center justify-center">
        <div className="modal-overlay absolute h-full w-full bg-gray-900 opacity-50" />

        <div className="modal-container z-50 mx-auto w-11/12 overflow-y-auto rounded bg-white shadow-lg md:max-w-md">
          <div className="modal-content px-6 py-4 text-left">
            <div className="flex items-center justify-between pb-3">
              <p className="text-2xl font-bold">Ďakujeme</p>
              <button type="button" className="modal-close z-50 cursor-pointer" onClick={onClose}>
                <svg
                  className="fill-current text-black"
                  xmlns="http://www.w3.org/2000/svg"
                  width="18"
                  height="18"
                  viewBox="0 0 18 18"
                >
                  <path d="M1 1l16 16m0-16L1 17" />
                </svg>
              </button>
            </div>

            <p className="text-gray-600">Popis</p>

            <div className="mt-5">
              <button
                className="rounded-full bg-blue-500 px-4 py-2 font-bold text-white hover:bg-blue-700"
                onClick={onClose}
                type="button"
              >
                Späť
              </button>
            </div>
          </div>
        </div>
      </div>,
    )
  }

  return (
    <>
      <SlideView
        hasMore={survey.slides.length - 1 > currentPage}
        slide={survey.slides[currentPage]}
        addValues={addValues}
      />
      {modal}
    </>
  )
}

export default SurveyRunner
