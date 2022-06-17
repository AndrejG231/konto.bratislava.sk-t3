import cx from 'classnames'
import CheckMark from '../../../assets/images/check-mark.svg'

export interface IStepperStepProps {
  className?: string
  title?: string
  number: number
  onClick?: () => void
  active?: boolean
  checked?: boolean
}

export const StepperStep = ({ title, number, onClick, active, checked, className }: IStepperStepProps) => (
  <button
    className={cx(
      'relative rounded-full text-lg flex items-center justify-center font-semibold',
      {
        'bg-primary text-white': active,
        'bg-secondary text-primary': !active,
        'cursor-default': !onClick,
        'cursor-pointer': !!onClick,
      },
      className
    )}
    onClick={onClick}
  >
    {checked ? <CheckMark className="w-10" /> : number}
    {title && (
      <p
        className={cx(
          'absolute top-full left-1/2 transform -translate-x-1/2 pt-3 text-center text-sm text-primary whitespace-pre',
          { 'cursor-pointer': !!onClick }
        )}
      >
        {title}
      </p>
    )}
  </button>
)

export default StepperStep