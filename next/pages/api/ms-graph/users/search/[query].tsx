////https://graph.microsoft.com/v1.0/users?$search="displayName:Kmet"

import { withSentry } from '@sentry/nextjs'
import { forceString } from '@utils/utils'
import _ from 'lodash'
import type { NextApiRequest, NextApiResponse } from 'next'
import { getToken, getUsersByDisplayName } from 'services/ms-graph'
import { sanitize } from 'string-sanitizer'

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const { query } = req.query
  const { accessToken } = await getToken()
  console.log(sanitize(forceString(query)))
  const users = await getUsersByDisplayName({ token: accessToken, query: sanitize(forceString(query)) })
  res.json(users)
}

export default withSentry(handler)