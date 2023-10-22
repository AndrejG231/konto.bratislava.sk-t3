import AccountPageLayout from 'components/layouts/AccountPageLayout'
import PageWrapper from 'components/layouts/PageWrapper'
import {
  getSSRCurrentAuth,
  ServerSideAuthProviderHOC,
} from 'components/logic/ServerSideAuthProvider'
import { GetServerSidePropsContext } from 'next'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import { ReactNode, useState } from 'react'
import { AiFillEnvironment } from 'react-icons/ai'
import { FaBicycle, FaLeaf, FaPeopleCarry, FaTree } from 'react-icons/fa'
import { FiSun } from 'react-icons/fi'
import { GiRecycle } from 'react-icons/gi'
import { IoIosLeaf, IoIosPlanet } from 'react-icons/io'
import { useWindowSize } from 'usehooks-ts'

import CampaignsAndProjects from '../assets/icons/most-wanted-services/campaigns-and-projects.svg'
import ParticipationHeader from '../components/forms/segments/AccountSectionHeader/ParticipationHeader'
import { Pagination } from '../components/forms/simple-components/Pagination/Pagination'
import ServiceCard from '../components/forms/simple-components/ServiceCard'
import SelectField from '../components/forms/widget-components/SelectField/SelectField'
import { SelectOption } from '../components/forms/widget-components/SelectField/SelectOption.interface'
import GraphList from '../components/graphs/GraphList'
import { AsyncServerProps } from '../frontend/utils/types'

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

const ALL_CATEGORY = 'Všetky kategórie'
const GENERAL_INFO = 'Všeobecné informácie'
const SUSTAINABILITY = 'Udržateľnosť'
const COMMUNITY_INVOLVEMENT = 'Zapojenie komunity'
const COMMUNITY_ENGAGEMENT = 'Angažovanosť komunity'
const MOBILITY = 'Mobilita'

type ServiceCardBase = {
  title: string
  description: string
  buttonText?: string
  className?: string
  linkType?: 'internal' | 'external'
  icon: ReactNode
  href?: string
  tag?: string
  tagStyle?: string
  category: string[]
  onPress?: () => void
}

const cards: ServiceCardBase[] = [
  {
    title: 'Požívaš Bratislava ID?',
    description:
      'Si ochotný/-á participovať v environmentálnom vývoji mesta? Podeľ sa s tvojim pohľadom a pomôž pri následnej tvorbe politík.',
    buttonText: 'Vyplň dotazník.',
    icon: <CampaignsAndProjects className="h-10 w-10 text-category-600 lg:h-12 lg:w-12" />,
    category: [GENERAL_INFO],
    linkType: 'internal',
    href: '/survey/0',
  },
  {
    title: 'Zapojte sa do hnutia pre udržateľnosť Starého mesta',
    description:
      'Buďte súčasťou hnutia na vybudovanie udržateľnejšieho Starého mesta v Bratislave. Zdieľajte svoje nápady, názory, potreby a skúsenosti na vytvorenie ekologickejšieho Starého mesta.',
    buttonText: 'Zdieľajte svoj hlas v Starom meste',
    icon: <FaLeaf className="h-10 w-10 text-category-600 lg:h-12 lg:w-12" />,
    category: [SUSTAINABILITY, COMMUNITY_INVOLVEMENT],
    linkType: 'internal',
    href: '/survey/1',
  },
  {
    title: 'Pomôžte formovať environmentálnu budúcnosť Ružinova',
    description:
      'Pomôžte formovať environmentálnu budúcnosť Ružinova tým, že zdieľate svoje myšlienky, názory, potreby a skúsenosti. Buďte aktívnym prispievateľom k udržateľnému životnému štýlu vo vašom okrese.',
    buttonText: 'Zdieľajte svoje poznatky pre Ružinov',
    icon: <GiRecycle className="h-10 w-10 text-category-600 lg:h-12 lg:w-12" />,
    category: [SUSTAINABILITY, COMMUNITY_INVOLVEMENT],
    linkType: 'internal',
    href: '/survey/2',
  },
  {
    title: 'Buďte aktívnou silou vytvárania zelenej a ekologickej Vrakuňe',
    description:
      'Zdieľajte svoje nápady, názory, potreby a skúsenosti, aby ste viedli cestu k udržateľnému rozvoju. Buďte aktívnym promotérom zelenej Vrakuňy.',
    buttonText: 'Podporte zelenú budúcnosť Vrakuňy',
    icon: <IoIosLeaf className="h-10 w-10 text-category-600 lg:h-12 lg:w-12" />,
    category: [SUSTAINABILITY, COMMUNITY_INVOLVEMENT],
    linkType: 'internal',
    href: '/survey/3',
  },
  {
    title: 'Zdieľajte svoje myšlienky pre udržateľnú budúcnosť Podunajských Biskupici',
    description:
      'Zdieľajte svoje myšlienky, názory, potreby a skúsenosti, ktoré pomôžu vytvoriť udržateľnú budúcnosť v Podunajských Biskupiciach. Vaša aktívna účasť má význam.',
    buttonText: 'Formujte Podunajské Biskupice',
    icon: <IoIosPlanet className="h-10 w-10 text-category-600 lg:h-12 lg:w-12" />,
    category: [SUSTAINABILITY, COMMUNITY_ENGAGEMENT],
    linkType: 'internal',
    href: '/survey/4',
  },
  {
    title: 'Zastupujte zmenu pre životné prostredie v Novom Meste',
    description:
      'Zdieľajte svoju vášeň, nápady, názory, potreby a skúsenosti, aby ste prispeli k zelenšiemu obvodu. Staňte sa obhajcom životného prostredia v Novom Meste.',
    buttonText: 'Zastupujte Nové Mesto',
    icon: <FaTree className="h-10 w-10 text-category-600 lg:h-12 lg:w-12" />,
    category: [SUSTAINABILITY, COMMUNITY_INVOLVEMENT],
    linkType: 'internal',
    href: '/survey/5',
  },
  {
    title: 'Podporte udržateľnosť v Rači',
    description:
      'Staňte sa šampiónom udržateľnosti v Rači tým, že zdieľate svoje nápady, názory, potreby a skúsenosti. Prispievajte k ekologickejšiemu okresu.',
    buttonText: 'Podporte udržateľnosť v Rači',
    icon: <FaLeaf className="h-10 w-10 text-category-600 lg:h-12 lg:w-12" />,
    category: [SUSTAINABILITY, COMMUNITY_ENGAGEMENT],
    linkType: 'internal',
    href: '/survey/5',
  },
  {
    title: 'Zastupujte zmenu pre životné prostredie v Novom Meste',
    description:
      'Zdieľajte svoju vášeň, nápady, názory, potreby a skúsenosti, aby ste prispeli k zelenšiemu obvodu. Staňte sa obhajcom životného prostredia v Novom Meste.',
    buttonText: 'Zastupujte Nové Mesto',
    icon: <FaTree className="h-10 w-10 text-category-600 lg:h-12 lg:w-12" />,
    category: [SUSTAINABILITY, COMMUNITY_INVOLVEMENT],
    linkType: 'internal',
    href: '/survey/7',
  },
  {
    title: 'Podporte udržateľnosť v Rači',
    description:
      'Staňte sa šampiónom udržateľnosti v Rači tým, že zdieľate svoje nápady, názory, potreby a skúsenosti. Prispievajte k ekologickejšiemu okresu.',
    buttonText: 'Podporte udržateľnosť v Rači',
    icon: <FaLeaf className="h-10 w-10 text-category-600 lg:h-12 lg:w-12" />,
    category: [SUSTAINABILITY, COMMUNITY_ENGAGEMENT],
    linkType: 'internal',
    href: '/survey/8',
  },
  {
    title: 'Spolupracujte na vytvorení zelenejho Vajnor',
    description:
      'Spolupracujte na vytvorenie zelenejho Vajnor tým, že zdieľate svoje nápady, názory, potreby a skúsenosti a pracujete spolu na udržateľnejšom okrese.',
    buttonText: 'Spolupracujte pre Vajnory',
    icon: <FaPeopleCarry className="h-10 w-10 text-category-600 lg:h-12 lg:w-12" />,
    category: [SUSTAINABILITY, COMMUNITY_ENGAGEMENT],
    linkType: 'internal',
    href: '/survey/9',
  },
  {
    title: 'Rozvíjajte zelené plochy v Karlovej Vsi',
    description:
      'Rozvíjajte zelené plochy v Karlovej Vsi tým, že zdieľate svoje nápady, názory, potreby a skúsenosti. Formujte ekologickejší okres.',
    buttonText: 'Zelena Karlova Ves',
    icon: <AiFillEnvironment className="h-10 w-10 text-category-600 lg:h-12 lg:w-12" />,
    category: [SUSTAINABILITY, COMMUNITY_ENGAGEMENT],
    linkType: 'internal',
    href: '/survey/10',
  },
  {
    title: 'Podporte udržateľnú mobilitu v Dúbravke',
    description:
      'Podporte udržateľnú mobilitu v Dúbravke tým, že zdieľate svoje názory, nápady, potreby a skúsenosti v oblasti dopravných riešení.',
    buttonText: 'Podporte mobilitu v Dúbravke',
    icon: <FaBicycle className="h-10 w-10 text-category-600 lg:h-12 lg:w-12" />,
    category: [SUSTAINABILITY, MOBILITY],
    linkType: 'internal',
    href: '/survey/11',
  },
  {
    title: 'Buďte tvorcom zmien v oblasti životného prostredia v Lamači',
    description:
      'Staňte sa tvorcom zmien v oblasti životného prostredia v Lamači tým, že zdieľate svoje nápady, názory, potreby a skúsenosti. Pomôžte napredovať v oblasti životného prostredia vo vašom okrese.',
    buttonText: 'Urobte zmenu v Lamači',
    icon: <FiSun className="h-10 w-10 text-category-600 lg:h-12 lg:w-12" />,
    category: [SUSTAINABILITY, COMMUNITY_ENGAGEMENT],
    linkType: 'internal',
    href: '/survey/12',
  },
]

const enumOptions: SelectOption[] = [
  { const: 'ALL_CATEGORY', title: ALL_CATEGORY, description: '' },
  { const: 'GENERAL_INFO', title: GENERAL_INFO, description: '' },
  { const: 'SUSTAINABILITY', title: SUSTAINABILITY, description: '' },
  { const: 'COMMUNITY_INVOLVEMENT', title: COMMUNITY_INVOLVEMENT, description: '' },
  { const: 'COMMUNITY_ENGAGEMENT', title: COMMUNITY_ENGAGEMENT, description: '' },
  { const: 'MOBILITY', title: MOBILITY, description: '' },
]

const AccountHelpPage = ({ page }: AsyncServerProps<typeof getServerSideProps>) => {
  const { width } = useWindowSize()
  const [currentPage, setCurrentPage] = useState<number>(1)
  const [selectorValue, setSelectorValue] = useState<SelectOption[]>(enumOptions.slice(0, 1))
  const selectorValueTitle: string = selectorValue[0]?.title || ''
  const ITEMS_PER_PAGE = width > 480 ? 20 : 5

  const filteredServiceCards = cards.filter((card) =>
    selectorValueTitle === ALL_CATEGORY ? true : card.category.includes(selectorValueTitle),
  )

  const headerNavigationList = [
    { title: 'Dotazníky', tag: 'SENT' },
    { title: 'Výsledky', tag: 'SENDING' },
  ]

  const [selectedCategory, setSelectedCategory] = useState(headerNavigationList[0])

  return (
    <PageWrapper locale={page.locale} localizations={page.localizations}>
      <AccountPageLayout>
        <div className="flex flex-col">
          <ParticipationHeader
            selectCategory={setSelectedCategory}
            selectedCategory={selectedCategory}
            title="Participácia"
            categories={headerNavigationList}
          >
            <SelectField
              label=""
              className="max-w-none pr-4 xs:max-w-[400px]"
              type="one"
              value={selectorValue}
              onChange={(val) => {
                setSelectorValue(val)
                setCurrentPage(1)
              }}
              dropdownDivider
              hideScrollbar
              alwaysOneSelected
              enumOptions={enumOptions}
              maxWordSize={width > 480 ? 45 : 25}
            />
          </ParticipationHeader>
          <div className="mx-auto w-full max-w-screen-lg pt-4 lg:pt-8">
            {selectedCategory.tag === 'SENT' ? (
              <>
                <div className="grid grid-cols-1 gap-3 px-4 sm:gap-6 min-[615px]:grid-cols-2 md:gap-8 min-[960px]:grid-cols-3 lg:grid-cols-4 lg:px-0">
                  {filteredServiceCards
                    .filter(
                      (_, i) =>
                        i + 1 <= currentPage * ITEMS_PER_PAGE &&
                        i + 1 > (currentPage - 1) * ITEMS_PER_PAGE,
                    )
                    .map((card, i) => (
                      <ServiceCard
                        key={i}
                        className={card.className}
                        title={card.title}
                        description={card.description}
                        buttonText={card.buttonText}
                        linkType={card.linkType}
                        icon={card.icon}
                        href={card.href}
                        tag={card.tag}
                        tagStyle={card.tagStyle}
                        onPress={card.onPress}
                        plausibleProps={{ id: `Mestské služby: ${card.title}` }}
                      />
                    ))}
                </div>
                <div className="my-4 lg:my-8">
                  <Pagination
                    count={Math.ceil(filteredServiceCards.length / ITEMS_PER_PAGE)}
                    selectedPage={currentPage}
                    onChange={setCurrentPage}
                  />
                </div>
              </>
            ) : (
              <GraphList />
            )}
          </div>
        </div>
      </AccountPageLayout>
    </PageWrapper>
  )
}

export default ServerSideAuthProviderHOC(AccountHelpPage)
