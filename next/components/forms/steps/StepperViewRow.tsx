import { CheckIcon } from '@assets/ui-icons'
import cx from 'classnames'
import { useTranslation } from 'next-i18next'
import React, { useRef } from 'react'
import { useButton } from 'react-aria'

import { FormStepMetadata } from '../types/Steps'

interface StepperViewRowProps {
  step: FormStepMetadata
  isCurrent?: boolean
  onClick?: () => void
  className?: string
  isButton?: boolean
}

const StepperViewRow = ({ step, isCurrent, onClick, className, isButton }: StepperViewRowProps) => {
  const { t } = useTranslation('forms')

  const { title, isSummary, isSubmitted, displayIndex } = step
  const iconClassName = cx(
    'min-w-8 w-8 flex-row h-8 rounded-full flex justify-center items-center border-2 shrink-0',
    {
      'bg-gray-700 border-gray-700 text-white': isSubmitted || isCurrent,
      'border-gray-300 text-gray-300 bg-transparent': !isSubmitted && !isCurrent,
    },
  )

  const buttonRef = useRef<HTMLDivElement>(null)
  const { buttonProps } = useButton({ onPress: onClick, elementType: 'div' }, buttonRef)

  return (
    <li
      className={cx('flex select-none flex-col', className)}
      aria-current={isCurrent ? 'step' : undefined}
    >
      <div
        className="flex cursor-pointer flex-row items-center gap-3"
        {...(isButton ? buttonProps : {})}
        ref={buttonRef}
      >
        <div className={iconClassName}>
          {isCurrent || !isSubmitted ? (
            displayIndex
          ) : (
            <CheckIcon fill="white" className="h-6 w-6" />
          )}
        </div>
        <p className="text-p3-medium w-72 ">
          {isCurrent ? <span className="sr-only">{t('steps.current_sr')}</span> : null}
          {isSubmitted && !isCurrent ? <span className="sr-only">{t('submitted_sr')}</span> : null}
          {title}
        </p>
      </div>
      {!isSummary && isButton && (
        <div className="flex h-8 w-8 flex-row items-center justify-center">
          <div className="h-4 w-0.5 bg-gray-300 py-2" />
        </div>
      )}
    </li>
  )
}

export default StepperViewRow
