// TODO waiting on #305 to get merged, afterwards might move elsewhere
// frontend code for calling api endpoints grouped
import { ErrorObject } from 'ajv'

export const API_ERROR_TEXT = 'API_ERROR'

export class ApiError extends Error {
  errors: Array<ErrorObject>

  constructor(m: string, errors: Array<ErrorObject>) {
    super(m)
    // Set the prototype explicitly - workaround while target is es5, cosnsider bumping target so we don't have to deal with this
    Object.setPrototypeOf(this, ApiError.prototype)
    this.errors = errors
  }
}

const fetchJsonApi = async (path: string, options?: RequestInit) => {
  try {
    const response = await fetch(path, options)
    if (response.ok) {
      return await response.json()
    }
    console.log('response not ok')
    // try parsing errors - if they may apper in different format extend here
    const responseText = await response.text()
    console.log('got text')
    let responseJson: any = {}
    try {
      console.log('try json')
      responseJson = JSON.parse(responseText)
    } catch (error) {
      throw new Error(API_ERROR_TEXT)
    }
    console.log('have json', responseJson)
    if (responseJson?.errors) {
      throw new ApiError(responseJson?.message || API_ERROR_TEXT, responseJson.errors)
    } else if (responseJson.errorName) {
      throw new Error(responseJson.errorName)
    } else {
      throw new Error(API_ERROR_TEXT)
    }
  } catch (error) {
    // TODO: handle error with Faro
    // caught & rethrown so that we can handle Faro in one place
    console.error(error)
    throw error
  }
}

const fetchBlob = async (path: string, options?: RequestInit) => {
  try {
    const response = await fetch(path, options)
    if (response.ok) {
      return await response.blob()
    }

    const responseText = await response.text()
    throw new Error(responseText)
  } catch (error) {
    // caught & rethrown so that we can handle Sentry in one place
    console.error(error)
    throw error
  }
}

// TODO move error handling here
export const submitEform = async (eformKey: string, data: Record<string, any>) => {
  console.log('-------------------')
  console.log(eformKey)
  return fetchJsonApi(`/api/eforms/${eformKey}/submit`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  })
}

export const validateKeyword = async (
  keyword: string,
  schema: any,
  value: any,
  parentSchema: any,
): Promise<boolean> => {
  try {
    const { isValid }: { isValid: boolean } = await fetchJsonApi(`/api/eforms/validation`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ keyword, schema, value, parentSchema }),
    })

    return isValid
  } catch (error) {
    return false
  }
}

export const formDataToXml = (eform: string, data: any) => {
  return fetchBlob(`/api/eforms/${eform}/transform/xml`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ data }),
  })
}

export const xmlToFormData = (eform: string, data: string) => {
  return fetchJsonApi(`/api/eforms/${eform}/transform/xmlToJson`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ data }),
  })
}

interface Identity {
  birthNumber: string
  identityCard: string
}

export const verifyIdentityApi = (data: Identity, token: string) => {
  return fetchJsonApi(
    `${process.env.NEXT_PUBLIC_CITY_ACCOUNT_URL}/user-verification/identity-card`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    },
  )
}

interface Gdpr {
  type: 'subscribe' | 'unsubscribe'
  category: 'SWIMMINGPOOLS' | 'TAXES' | 'CITY' | 'ESBS'
}

export const subscribeApi = (data: { gdprData?: Gdpr[] }, token: string) => {
  return fetchJsonApi(`${process.env.NEXT_PUBLIC_CITY_ACCOUNT_URL}/user/subscribe`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  })
}

export const getUserApi = (token: string) => {
  return fetchJsonApi(`${process.env.NEXT_PUBLIC_CITY_ACCOUNT_URL}/user/get-or-create`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
  })
}

export const resetRcApi = (token: string) => {
  return fetchJsonApi(`${process.env.NEXT_PUBLIC_CITY_ACCOUNT_URL}/user/remove-birthnumber`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
  })
}
