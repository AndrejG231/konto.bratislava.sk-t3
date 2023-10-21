/* eslint-disable @typescript-eslint/no-explicit-any */
import { GetServerSidePropsContext } from 'next'
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

const schema = {
  description: '',
  id: 12,
  name: '',
  slides: [
    {
      id: 120_854,
      index: 0,
      content: [
        {
          id: 210,
          __type: 'title_content',
          title: 'Some title',
          index: 0,
        },
        {
          id: 102_948,
          __type: 'image_content',
          source:
            'https://img.freepik.com/free-photo/isolated-happy-smiling-dog-white-background-portrait-4_1562-693.jpg',
          title: 'Some image title',
          description: 'some image description',
          index: 1,
        },
        {
          id: 12_074,
          __type: 'close_question',
          question: 'Some closed question',
          description: 'Some closed question description',
          index: 2,
        },
        {
          id: 12_857,
          __type: 'rating_question',
          question: 'Some rating question',
          description: 'some rating question description',
          index: 3,
        },
        {
          id: 128_569,
          __type: 'select_question',
          question: 'Some select question',
          description: 'Some select question description',
          index: 4,
          options: [
            {
              id: 12_784,
              label: 'Some select option',
              value: 'Some select option',
              index: 0,
            },
            {
              id: 856_820,
              label: 'other select option',
              value: 'other select option',
              index: 1,
            },
            {
              id: 75_018_289,
              label: 'another select option',
              value: 'another select option',
              index: 2,
            },
          ],
        },
        {
          id: 2_780_145,
          __type: 'document_content',
          source: 'some file url',
          title: 'Some document title',
          description: 'some document description',
          index: 5,
        },
        {
          id: 18_274,
          __type: 'text_question',
          question: 'Some text question',
          description: 'Some text question description',
          index: 6,
        },
      ],
    },

    {
      id: 111,

      index: 2,

      content: [
        {
          id: 18_274,
          __type: 'text_question',
          question: 'Some text question',
          description: 'Some text question description',
          index: 6,
        },
      ],
    },
  ],
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
  return (
    <PageWrapper locale={page.locale} localizations={page.localizations}>
      <AccountPageLayout>
        <AccountSectionHeader title="Survey" />
        <SurveyRunner survey={schema as any} />
      </AccountPageLayout>
    </PageWrapper>
  )
}

export default ServerSideAuthProviderHOC(Survey)
