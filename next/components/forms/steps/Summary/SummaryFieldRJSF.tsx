import { getLocalTimeZone, parseDate } from '@internationalized/date'
import { FieldProps, GenericObjectType } from '@rjsf/utils'
import React from 'react'
import { useDateFormatter } from 'react-aria'

import { useFormState } from '../../useFormState'
import SummaryRow from './SummaryRow'
import { useFormSummary } from './useFormSummary'

export type SummaryFieldType = 'dateFromTo' | 'timeFromTo' | 'dateTime'

export type SummaryFieldRJSFProps = Pick<
  FieldProps<GenericObjectType>,
  'formData' | 'schema' | 'idSchema'
> & {
  fieldType: SummaryFieldType
}

const SummaryFieldRJSF = ({ formData, schema, idSchema, fieldType }: SummaryFieldRJSFProps) => {
  const { fieldHasError } = useFormSummary()
  const { goToStepByFieldId, isReadonly } = useFormState()
  const formatter = useDateFormatter()

  const formatDate = (value: string) => {
    try {
      const parsed = parseDate(value)
      return formatter.format(parsed.toDate(getLocalTimeZone()))
    } catch (error) {
      // TODO improve
      return value
    }
  }

  if (!schema.properties) {
    return null
  }

  const inputs = Object.entries(
    schema.properties as Record<string, { type: string; title: string }>,
  ).map(([key, value]) => {
    const formDataValue = formData?.[key]
    const getValue = () => {
      if (fieldType === 'dateFromTo') {
        return formatDate(formDataValue as string)
      }

      if (fieldType === 'dateTime') {
        if (key === 'dateValue') {
          return formatDate(formDataValue as string)
        }
        if (key === 'timeValue') {
          return formDataValue as string
        }

        return formDataValue as string
      }

      return formDataValue as string
    }

    const fieldId = idSchema[key]?.$id as string

    return {
      label: value.title,
      value: getValue(),
      isError: fieldHasError(fieldId),
    }
  })

  return (
    <div>
      {inputs.map(({ label, value, isError }, index) => (
        <SummaryRow
          key={index}
          data={{
            label,
            value,
            isError,
          }}
          onGoToStep={() => {
            goToStepByFieldId(idSchema.$id)
          }}
          isEditable={!isReadonly}
        />
      ))}
    </div>
  )
}
export default SummaryFieldRJSF
