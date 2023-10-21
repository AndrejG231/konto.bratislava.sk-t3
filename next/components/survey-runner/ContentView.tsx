/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable tailwindcss/no-custom-classname */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable no-underscore-dangle */
import Link from 'next/link'
import React from 'react'

import { Content } from '../survey-builder/types'
import RateSelector from './RateSelector'

type Props = {
  content: Content
  onChange: any
  value: any
}

const ContentView = (props: Props) => {
  const { content, onChange, value } = props

  const handleChange = (event: any) => {
    if (content.__type === 'text_question' || content.__type === 'select_question') {
      onChange(event.target.value)
      return
    }

    if (content.__type === 'close_question') {
      onChange((event.target as HTMLInputElement).checked)
      return
    }

    if (content.__type === 'rating_question') {
      onChange(event)
    }
  }

  if (content.__type === 'text_question') {
    return (
      <div className="mx-auto max-w-lg p-4">
        <div className="rounded-lg bg-white p-4 shadow-lg">
          <label className="text-sm mb-2 block font-bold text-gray-700" htmlFor="example-input">
            {content.question}
            <input
              className="w-full rounded-md border p-2"
              type="text"
              id="example-input"
              placeholder="Type your answer here"
			  value={value.value}
			  onChange={handleChange}
            />
          </label>
          {content.description && (
            <p className="text-sm mt-2 text-gray-600">{content.description}</p>
          )}
        </div>
      </div>
    )
  }

  if (content.__type === 'close_question') {
    return (
      <div className="mx-auto max-w-lg p-4">
        <div className="rounded-lg bg-white p-4 shadow-lg">
          <div className="flex items-center justify-between">
            <label className="text-sm font-bold text-gray-700" htmlFor="toggle-switch">
              {content.question}
            </label>
            <div className="relative flex items-center">
              <div
                className={`shadow-inner h-6 w-12 rounded-full bg-gray-300 ${
                  value.value ? 'bg-blue-500' : ''
                }`}
              >
                <div
                  className={`h-6 w-6 rounded-full bg-white ${
                    value.value ? 'translate-x-6' : 'translate-x-0'
                  } transition-transform duration-200`}
                />
                <input
                  type="checkbox"
                  id="toggle"
                  style={{
                    opacity: '0',
                    position: 'absolute',
                    left: '0',
                    right: '0',
                    bottom: '0',
                    top: '0',
                  }}
                  checked={!!value.value}
                  onChange={handleChange}
                />
              </div>
            </div>
          </div>

          <p className="text-sm mt-2 text-gray-600">{content.description}</p>
        </div>
      </div>
    )
  }

  if (content.__type === 'document_content') {
    return (
      <>
        <h1 style={{ fontSize: '42px' }} className="bold p-2 pt-6 text-center">
          {content.title}
        </h1>
        {content.description && <h4 className="pb-2 text-center">{content.description}</h4>}
        <Link href={content.source} target="_blank">
          <p className="px-2 text-center underline">Download</p>
        </Link>
      </>
    )
  }

  if (content.__type === 'image_content') {
    return (
      <div className="mx-auto max-w-lg p-4">
        <div className="rounded-lg bg-white shadow-lg" />
        <img src={content.source} alt="Alt Text" className="h-auto w-full rounded-t-lg" />
        <div className="p-4">
          <h2 className="text-xl text-center font-semibold text-gray-800">{content.title}</h2>
          <p className="mt-2 text-center text-gray-600">{content.description}</p>
        </div>
      </div>
    )
  }

  if (content.__type === 'rating_question') {
    return (
      <RateSelector
        question={content.question}
        description={content.description}
        value={value.value}
        onChange={handleChange}
      />
    )
  }

  if (content.__type === 'select_question') {
    return (
      <div className="mx-auto max-w-lg p-4">
        <div className="rounded-lg bg-white p-4 shadow-lg">
          <label className="text-sm font-bold text-gray-700" htmlFor="select-element">
            {content.question}
          </label>
          <select
            id="select-element"
            className="mt-2 block w-full rounded-md border p-2"
            value={value.value}
            onChange={handleChange}
          >
            {content.options.map((option) => (
              <option key={option.id} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>

          <p className="text-sm mt-2 text-gray-600">{content.description}</p>
        </div>
      </div>
    )
  }

  return (
    <h1 style={{ fontSize: '60px' }} className="px-2 py-10 text-center">
      {content.title}
    </h1>
  )
}

export default ContentView
