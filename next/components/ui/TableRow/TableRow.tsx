import cx from 'classnames'

export interface TableRowProps {
  className?: string
  tableCells: { content: React.ReactNode; className?: string }[]
}

export const TableRow = ({ className, tableCells }: TableRowProps) => {
  return (
    <tr className={cx(className, 'h-14 shadow rounded-lg')}>
      {tableCells.map((tableCell, i) => (
        <td
          key={i}
          className={cx(tableCell.className, 'text-font pl-5 py-6', {
            'rounded-l-lg': i === 0,
            'rounded-r-lg': i === tableCells.length - 1,
          })}
        >
          {tableCell.content}
        </td>
      ))}
    </tr>
  )
}

export default TableRow