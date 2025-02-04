import { edenTreaty } from '@elysiajs/eden'

import type { AppRouter } from ':root/server/src/api'
import { env } from '~/env.mjs'

export const client = edenTreaty<AppRouter>(env.NEXT_PUBLIC_SERVER_API_URL)
