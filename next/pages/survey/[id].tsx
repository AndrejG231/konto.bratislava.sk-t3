/* eslint-disable @typescript-eslint/no-explicit-any */
import { GetServerSidePropsContext } from 'next'
import { useRouter } from 'next/router'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import React from 'react'

import AccountSectionHeader from '../../components/forms/segments/AccountSectionHeader/AccountSectionHeader'
import AccountPageLayout from '../../components/layouts/AccountPageLayout'
import PageWrapper from '../../components/layouts/PageWrapper'
import {
  getSSRCurrentAuth,
  ServerSideAuthProviderHOC,
} from '../../components/logic/ServerSideAuthProvider'
import SurveyRunner from '../../components/survey-runner/SurveyRunner'
import { AsyncServerProps } from '../../frontend/utils/types'

const surveys = {
  10: {
    description: '',
    id: null,
    name: '',
    slides: [
      {
        content: [
          {
            id: null,
            __type: 'title_content',
            title: 'Občianska participácia v Bratislave v súvislosti s klimatickou zmenou',
            index: 0,
          },
          {
            id: null,
            index: 0,
            __type: 'close_question',
            question: 'Bývate v Bratislave?',
            description: '',
          },
          {
            id: null,
            index: 0,
            __type: 'close_question',
            question: 'Požívate aktívne bratislavske konto?',
            description: '',
          },
          {
            id: null,
            index: 0,
            __type: 'rating_question',
            question:
              'Nakoľko sa stotožňujete s krokmi, ktoré mesto Bratislava podniká v oblasti klimatickej zmeny? (Napríklad budovanie cyklotrás, regulovanie osobnej automobilovej dopravy, rozširovanie mestskej zelene.)',
            description: '',
          },
          {
            id: null,
            index: 0,
            __type: 'select_question',
            question:
              'Dokázali by ste sa s krokmi mesta stotožniť lepšie, pokiaľ by ste boli mestom zapojení do plánovacieho procesu a mohli sa ku jednotlivým zámerom ľahko vyjadriť?',
            description: '',
            options: [
              {
                id: null,
                label: 'Áno',
                value: 'Áno',
                index: 0,
              },
              {
                id: null,
                label: 'Nie',
                value: 'Nie',
                index: 0,
              },
              {
                id: null,
                label: 'Neviem',
                value: 'Neviem',
                index: 0,
              },
            ],
          },
          {
            id: null,
            index: 0,
            __type: 'close_question',
            question:
              'Zúčastnili ste sa niekedy na mestom organizovaných informačných stretnutiach či verejných konzultáciách ohľadom reakcií mesta na zmeny klímy?',
            description: '',
          },
          {
            id: null,
            index: 0,
            __type: 'text_question',
            question:
              'Ak áno, zúčastnili by ste sa podobných akcií znovu? Ak ste sa žiadnych nezúčastnili, aký bol Váš dôvod?',
            description: '',
          },
          {
            id: null,
            index: 0,
            __type: 'text_question',
            question:
              'Čo sú podľa Vás hlavné prekážky, pre ktoré si občania len pomaly osvojujú potrebné kroky a opatrenia, ktorými by prispeli k lepšej reakcii na zmeny klímy? (Napr. presedlanie z áut na MHD či šetrenie vodou a energiami.)',
            description: '',
          },
        ],
        id: null,
        index: 0,
      },
    ],
  },
  0: {
    description: '',
    id: 1,
    name: '',
    slides: [
      {
        content: [
          {
            id: 2,
            index: 1,
            __type: 'title_content',
            title: 'Občianska participácia v Bratislave v súvislosti s klimatickou zmenou',
          },
          {
            id: 3,
            index: 2,
            __type: 'close_question',
            question: 'Bývate v Bratislave?',
            description: '',
          },
          {
            id: 4,
            index: 3,
            __type: 'close_question',
            question: 'Požívate aktívne bratislavske konto?',
            description: '',
          },
          {
            id: 5,
            index: 4,
            __type: 'rating_question',
            question:
              'Nakoľko sa stotožňujete s krokmi, ktoré mesto Bratislava podniká v oblasti klimatickej zmeny? (Napríklad budovanie cyklotrás, regulovanie osobnej automobilovej dopravy, rozširovanie mestskej zelene.)',
            description: '',
          },
          {
            id: 6,
            index: 5,
            __type: 'select_question',
            question:
              'Dokázali by ste sa s krokmi mesta stotožniť lepšie, pokiaľ by ste boli mestom zapojení do plánovacieho procesu a mohli sa ku jednotlivým zámerom ľahko vyjadriť?',
            description: '',
            options: [
              {
                id: 7,
                label: 'Áno',
                value: 'Áno',
                index: 1,
              },
              {
                id: 8,
                label: 'Nie',
                value: 'Nie',
                index: 2,
              },
              {
                id: 9,
                label: 'Neviem',
                value: 'Neviem',
                index: 3,
              },
            ],
          },
          {
            id: 10,
            index: 6,
            __type: 'close_question',
            question:
              'Zúčastnili ste sa niekedy na mestom organizovaných informačných stretnutiach či verejných konzultáciách ohľadom reakcií mesta na zmeny klímy?',
            description: '',
          },
          {
            id: 11,
            index: 7,
            __type: 'text_question',
            question:
              'Ak áno, zúčastnili by ste sa podobných akcií znovu? Ak ste sa žiadnych nezúčastnili, aký bol Váš dôvod?',
            description: '',
          },
          {
            id: 12,
            index: 8,
            __type: 'text_question',
            question:
              'Čo sú podľa Vás hlavné prekážky, pre ktoré si občania len pomaly osvojujú potrebné kroky a opatrenia, ktorými by prispeli k lepšej reakcii na zmeny klímy? (Napr. presedlanie z áut na MHD či šetrenie vodou a energiami.)',
            description: '',
          },
        ],
        id: 13,
        index: 1,
      },
    ],
  },
}

export const getServerSideProps = async (ctx: GetServerSidePropsContext) => {
  const locale = ctx.locale ?? 'sk'

  return {
    props: {
      ssrCurrentAuthProps: await getSSRCurrentAuth(ctx.req),
      page: {
        locale: ctx.locale,
        localizations: ['sk', 'en']
          .filter((l) => l !== ctx.locale)
          .map((l) => ({
            slug: '',
            locale: l,
          })),
      },
      ...(await serverSideTranslations(locale)),
    },
  }
}

const Survey = ({ page }: AsyncServerProps<typeof getServerSideProps>) => {
  const router = useRouter()

  const surveyId = router.query.id as string

  const survey = surveys[surveyId]

  if (!surveyId || !survey) {
    return (
      <PageWrapper locale={page.locale} localizations={page.localizations}>
        <AccountPageLayout>
          <AccountSectionHeader title="Survey" />
          Error - Survey not found.
        </AccountPageLayout>
      </PageWrapper>
    )
  }

  return (
    <PageWrapper locale={page.locale} localizations={page.localizations}>
      <AccountPageLayout>
        <AccountSectionHeader title="Survey" />
        <SurveyRunner survey={survey} />
      </AccountPageLayout>
    </PageWrapper>
  )
}

export default ServerSideAuthProviderHOC(Survey)
