import { Dispatch, SetStateAction, useState } from 'react'

import { Content, Slide } from '../survey-builder/types'

export type Fields = Record<
  string,
  {
    value: string | number | boolean
    __type: Content['__type']
  }
>

function useSlideFields(slide: Slide): [Fields, Dispatch<SetStateAction<Fields>>] {
  return useState(() => {
    // eslint-disable-next-line no-underscore-dangle
    return Object.fromEntries(
      slide.content
        // eslint-disable-next-line no-underscore-dangle
        .filter((content) => content.__type.endsWith('question'))
        .map((val) => [
          val.id as number,
          {
            value: '',
            // eslint-disable-next-line no-underscore-dangle
            type: val.__type,
          },
        ]),
    )
  }) as unknown as [Fields, Dispatch<SetStateAction<Fields>>]
}

export default useSlideFields
