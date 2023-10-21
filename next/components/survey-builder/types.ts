export type FollowUp = {
  id: string | null
  MIN_RATING: number
  MAX_RATING: number
  question: TextQuestion
}

export type RatingQuestion = {
  id: string | null
  __type: 'rating_question'
  question: string
  description?: string
  followUp?: FollowUp
}

export type SelectOption = {
  id: string | null
  value: string
  label: string
}

export type SelectQuestion = {
  id: string | null
  __type: 'select_question'
  question: string
  description?: string
  options: SelectOption[]
}

export type TextQuestion = {
  id: string | null
  __type: 'text_question'
  question: string
  description?: string
}

export type CloseQuestion = {
  id: string | null
  __type: 'close_question'
  question: string
  description?: string
}

export type DocumentContent = {
  id: string | null
  __type: 'document_content'
  title: string
  source: string
  description?: string
}

export type ImageContent = {
  id: string | null
  __type: 'image_content'
  title: string
  source: string
  description?: string
}

export type TitleContent = {
  id: string | null
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
  id: string | null
  content: Content[]
}

export type Presentation = {
  id: string | null
  name: string
  description: string
  slides: Slide[]
}
