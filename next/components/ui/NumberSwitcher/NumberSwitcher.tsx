import cx from 'classnames'
import MinusIcon from '../../../assets/images/minus.svg'
import PlusIcon from '../../../assets/images/plus.svg'

interface IProps {
  id?: string
  value: number
  onChange?: (num: number) => void
  className?: string
  hasError?: boolean
}

export const NumberSwitcher = ({ className, value, hasError, id, onChange }: IProps) => {
  return (
    <div
      id={id}
      className={cx(className, 'base-input flex items-center justify-between', {
        'base-input--with-error': hasError,
      })}
    >
      <button
        onClick={() => {
          onChange(value - 1)
        }}
        className="cursor-pointer py-2 text-primary"
      >
        <MinusIcon />
      </button>
      <span className="text-default font-medium">{value}</span>
      <button
        onClick={() => {
          onChange(value + 1)
        }}
        className="cursor-pointer py-2 text-primary"
      >
        <PlusIcon />
      </button>
    </div>
  )
}

export default NumberSwitcher