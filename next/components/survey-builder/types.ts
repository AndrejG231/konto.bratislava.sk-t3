export type FollowUp = {
  id: number | null
  MIN_RATING: number
  MAX_RATING: number
  question: TextQuestion
}

export type RatingQuestion = {
  index: number
  id: number | null
  __type: 'rating_question'
  question: string
  description?: string
  followUp?: FollowUp
}

export type SelectOption = {
  index: number
  id: number | null
  value: string
  label: string
}

export type SelectQuestion = {
  id: number | null
  index: number
  __type: 'select_question'
  question: string
  description?: string
  options: SelectOption[]
}

export type TextQuestion = {
  id: number | null
  index: number
  __type: 'text_question'
  question: string
  description?: string
}

export type CloseQuestion = {
  id: number | null
  index: number
  __type: 'close_question'
  question: string
  description?: string
}

export type DocumentContent = {
  id: number | null
  index: number
  __type: 'document_content'
  title: string
  source: string
  description?: string
}

export type ImageContent = {
  id: number | null
  index: number
  __type: 'image_content'
  title: string
  source: string
  description?: string
}

export type TitleContent = {
  id: number | null
  index: number
  __type: 'title_content'
  title: string
}

export type Content =
  | ImageContent
  | DocumentContent
  | TextQuestion
  | SelectQuestion
  | RatingQuestion
  | TitleContent
  | CloseQuestion

export type Slide = {
  id: number | null
  index: number
  content: Content[]
}

export type Presentation = {
  id: number | null
  name: string
  description: string
  slides: Slide[]
}
