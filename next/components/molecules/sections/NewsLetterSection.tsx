import { NewsLetter } from '@bratislava/ui-bratislava'
import NewsLetterImage from '../../../assets/images/newsletter-image.png'
import { useTranslation } from 'react-i18next'
import cx from 'classnames'

interface IProps {
  className?: string
}

const NewsLetterSection = ({ className }: IProps) => {
  const { t } = useTranslation('newsletter')

  return (
    <div className={cx('flex w-full justify-center', className)}>
      <NewsLetter
        imageSrc={NewsLetterImage.src}
        checkBoxContent={t('newsletterCheckboxContent')}
        newsLetterContent={t('newsletterContent')}
        buttonLabel={t('newsletterButtonContent')}
      />
    </div>
  )
}

export default NewsLetterSection