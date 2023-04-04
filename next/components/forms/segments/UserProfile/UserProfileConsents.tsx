import useSnackbar from '@utils/useSnackbar'
import useUser from '@utils/useUser'
import cx from 'classnames'
import { useTranslation } from 'next-i18next'

import UserConsent from './UserConsent'
import UserProfileSection from './UserProfileSection'
import UserProfileSectionHeader from './UserProfileSectionHeader'

export interface Consent {
  id: string
  title: string
  text: string
  isDisabled: boolean
  isSelected: boolean
}

const UserProfileConsents = () => {
  const { t } = useTranslation('account')
  const user = useUser()

  const [openSnackbarSuccess] = useSnackbar({ variant: 'success' })
  const [openSnackbarError] = useSnackbar({ variant: 'error' })
  const handleOnChangeConsent = async (isSelected: boolean) => {
    const res = isSelected ? await user.subscribe() : await user.unsubscribe()
    if (res) {
      openSnackbarSuccess(t('profile_detail.success_alert'), 3000)
    } else {
      openSnackbarError(t('profile_detail.error_alert'))
    }
  }

  const isSelected = user.data?.gdprData
    .filter((x) => x.type !== 'LICENSE')
    .some((x) => x.subType === 'subscribe')
  return (
    <UserProfileSection>
      <UserProfileSectionHeader
        title={t('consents.title')}
        text={t('consents.text')}
        underline
        isMobileColumn
      />
      <div className={cx('px-4', 'md:px-8')}>
        <UserConsent
          consent={{
            id: 'receive_information',
            title: t('consents.receive_information.title'),
            text: t('consents.receive_information.text'),
            isDisabled: false,
            isSelected,
          }}
          isLast
          onChange={handleOnChangeConsent}
        />
      </div>
    </UserProfileSection>
  )
}

export default UserProfileConsents
