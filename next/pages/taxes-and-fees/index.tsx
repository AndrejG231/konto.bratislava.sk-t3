import { AsyncServerProps } from '@utils/types'
import { isProductionDeployment } from '@utils/utils'
import TaxesFeesSection from 'components/forms/segments/AccountSections/TaxesFeesSection/TaxesFeesSection'
import AccountPageLayout from 'components/layouts/AccountPageLayout'
import PageWrapper from 'components/layouts/PageWrapper'
import { GetServerSidePropsContext } from 'next'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'

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

const AccountTaxesFeesPage = ({
  page,
  isProductionDeployment,
}: AsyncServerProps<typeof getServerSideProps>) => {
  return (
    <PageWrapper locale={page.locale} localizations={page.localizations}>
      <AccountPageLayout>
        <TaxesFeesSection isProductionDeployment={isProductionDeployment} />
      </AccountPageLayout>
    </PageWrapper>
  )
}

export default AccountTaxesFeesPage