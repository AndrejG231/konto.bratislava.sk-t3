import { ROUTES } from '@utils/constants'
import { formatUnicorn } from '@utils/string'
import { AsyncServerProps } from '@utils/types'
import useAccount, { AccountStatus } from '@utils/useAccount'
import AccountActivator from 'components/forms/segments/AccountActivator/AccountActivator'
import AccountContainer from 'components/forms/segments/AccountContainer/AccountContainer'
import AccountMarkdown from 'components/forms/segments/AccountMarkdown/AccountMarkdown'
import AccountSuccessAlert from 'components/forms/segments/AccountSuccessAlert/AccountSuccessAlert'
import EmailVerificationForm from 'components/forms/segments/EmailVerificationForm/EmailVerificationForm'
import IdentityVerificationForm from 'components/forms/segments/IdentityVerificationForm/IdentityVerificationForm'
import RegisterForm from 'components/forms/segments/RegisterForm/RegisterForm'
import LoginRegisterLayout from 'components/layouts/LoginRegisterLayout'
import { GetServerSidePropsContext } from 'next'
import { useRouter } from 'next/router'
import { useTranslation } from 'next-i18next'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import { useState } from 'react'

import PageWrapper from '../components/layouts/PageWrapper'
import { isProductionDeployment } from '../utils/utils'
import AccountVerificationPendingAlert from 'components/forms/segments/AccountVerificationPendingAlert/AccountVerificationPendingAlert'

export const getServerSideProps = async (ctx: GetServerSidePropsContext) => {
  const locale = ctx.locale ?? 'sk'

  return {
    props: {
      page: {
        locale: ctx.locale,
        localizations: ['sk', 'en']
          .filter((l) => l !== ctx.locale)
          .map((l) => ({
            slug: '',
            locale: l,
          })),
      },
      isProductionDeployment: isProductionDeployment(),
      ...(await serverSideTranslations(locale)),
    },
  }
}

const RegisterPage = ({ page }: AsyncServerProps<typeof getServerSideProps>) => {
  const { t } = useTranslation('account')
  const [lastRc, setLastRc] = useState('')
  const [lastIdCard, setLastIdCard] = useState('')
  const {
    signUp,
    resendVerificationCode,
    verifyEmail,
    error,
    status,
    setStatus,
    verifyIdentity,
    lastEmail,
    refreshUserData,
  } = useAccount()
  const router = useRouter()

  const verifyIdentityAndRefreshUserData = async (
    rc: string,
    idCard: string,
    turnstileToken: string,
  ) => {
    setLastRc(rc)
    setLastIdCard(idCard)
    await verifyIdentity(rc, idCard, turnstileToken)
    // give the queue a few seconds to process the verification
    await new Promise((resolve) => setTimeout(resolve, 8000))
    // status will be set according to current cognito tier - pending if still processing
    await refreshUserData()
  }

  return (
    <PageWrapper locale={page.locale} localizations={page.localizations}>
      <LoginRegisterLayout
        backButtonHidden={[
          AccountStatus.EmailVerificationSuccess,
          AccountStatus.IdentityVerificationRequired,
          AccountStatus.IdentityVerificationPending,
          AccountStatus.IdentityVerificationFailed,
          AccountStatus.IdentityVerificationSuccess,
        ].includes(status)}
      >
        {status === AccountStatus.Idle && <AccountActivator />}
        <AccountContainer className="md:pt-6 pt-0 mb-0 md:mb-8">
          {status === AccountStatus.Idle && (
            <RegisterForm lastEmail={lastEmail} onSubmit={signUp} error={error} />
          )}
          {status === AccountStatus.EmailVerificationRequired && (
            <EmailVerificationForm
              lastEmail={lastEmail}
              onResend={resendVerificationCode}
              onSubmit={verifyEmail}
              error={error}
            />
          )}
          {status === AccountStatus.EmailVerificationSuccess && (
            <AccountSuccessAlert
              title={t('register_success_title')}
              description={formatUnicorn(t('register_success_description'), {
                email: lastEmail,
              })}
              confirmLabel={t('identity_verification_link')}
              onConfirm={() => setStatus(AccountStatus.IdentityVerificationRequired)}
              cancelLabel={t('identity_verification_skip')}
              onCancel={() =>
                router.push({ pathname: ROUTES.HOME, query: { from: ROUTES.REGISTER } })
              }
            >
              <AccountMarkdown
                className="text-center"
                content={t('register_success_content')}
                variant="sm"
              />
            </AccountSuccessAlert>
          )}
          {status === AccountStatus.IdentityVerificationRequired && (
            <IdentityVerificationForm onSubmit={verifyIdentityAndRefreshUserData} error={error} />
          )}
          {status === AccountStatus.IdentityVerificationFailed && (
            <IdentityVerificationForm onSubmit={verifyIdentityAndRefreshUserData} error={error} />
          )}
          {status === AccountStatus.IdentityVerificationPending && (
            <AccountVerificationPendingAlert
              title={t('identity_verification_pending_title')}
              description={
                lastRc && lastIdCard
                  ? formatUnicorn(t('identity_verification_pending_description'), {
                      rc: lastRc,
                      idCard: lastIdCard,
                    })
                  : t('identity_verification_pending_description_without_data')
              }
              confirmLabel={t('account_continue_link')}
              onConfirm={() =>
                router.push({ pathname: ROUTES.HOME, query: { from: ROUTES.REGISTER } })
              }
            />
          )}
          {status === AccountStatus.IdentityVerificationSuccess && (
            <AccountSuccessAlert
              title={t('identity_verification_success_title')}
              description={
                lastRc &&
                lastIdCard &&
                formatUnicorn(t('identity_verification_success_description'), {
                  rc: lastRc,
                  idCard: lastIdCard,
                })
              }
              confirmLabel={t('account_continue_link')}
              onConfirm={() =>
                router.push({ pathname: ROUTES.HOME, query: { from: ROUTES.REGISTER } })
              }
            />
          )}
        </AccountContainer>
      </LoginRegisterLayout>
    </PageWrapper>
  )
}

export default RegisterPage