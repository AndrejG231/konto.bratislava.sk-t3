import { convert, LocalDate, ZonedDateTime } from '@js-joda/core'
import lCapitalize from 'lodash/capitalize'
import padStart from 'lodash/padStart'

// "Marec 2021"
export const getLocalDate = (dateString: string) =>
  capitalize(
    convert(ZonedDateTime.parse(dateString)).toDate().toLocaleDateString('sk', {
      month: 'long',
      year: 'numeric',
    })
  )

// "1.3.2021"
export const getNumericLocalDate = (dateString: string) =>
  convert(ZonedDateTime.parse(dateString))
    .toDate()
    .toLocaleDateString('sk', {
      dateStyle: 'short',
    })
    .replace(/ /g, '')

// "Február"
export const getLocalMonthName = (month: number | string) => {
  // TODO !!! get name directly as Month[ix - 1]
  const validMonth = Math.max(0, Math.round(Number(month))) || 1
  const m = padStart(`${validMonth}`, 2, '0')

  return lCapitalize(
    convert(LocalDate.parse(`1970-${m}-01`))
      .toDate()
      .toLocaleDateString('sk', { month: 'long' })
  )
}

const capitalize = (text: string) => text[0].toUpperCase() + text.slice(1)