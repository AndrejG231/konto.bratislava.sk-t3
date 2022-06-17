import cx from 'classnames'
import React from 'react'
import { RelatedContent } from '@bratislava/ui-bratislava'
import { GeneralPageFragment } from '@bratislava/strapi-sdk-homepage'
import { parseRelatedBlogPosts } from '../../../../utils/page'

interface IProps {
  className?: string
  page?: GeneralPageFragment
}

const RelatedBlogPosts = ({ className, page }: IProps) => {
  const [relatedBlogPosts, setRelatedBlogPosts] = React.useState(parseRelatedBlogPosts(page?.relatedBlogPosts ?? []))

  if (!page) return null

  const fetchRelateBlogPosts = async () => {
    const tags = page.relatedBlogPosts.map((post) => post.tag?.id).filter(Boolean)
    const res = await fetch(`/api/latest-blogposts?tags=${tags.join(',')}&offset=${relatedBlogPosts.length}`)
    const data = await res.json()
    setRelatedBlogPosts((relatedBlogPosts) => relatedBlogPosts.concat(parseRelatedBlogPosts(data)))
  }

  return (
    <RelatedContent
      className={cx(className)}
      shiftIndex={1}
      visibleItems={3}
      fetchMoreItems={fetchRelateBlogPosts}
      cards={relatedBlogPosts}
    />
  )
}

export default RelatedBlogPosts