// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { OAuth2Client } from '@/lib/oauth2client/client'
import type { NextApiRequest, NextApiResponse } from 'next'

type RequestPayload = {
  inCurrency: string
  outCurrency: string
  amount: number
}

type ResponseData = {
  inAmount?: number
  outAmount?: number
  error?: string
}

type ExchangeRateResponse = {
  exchange_rate: {
    inputMint: string
    outputMint: string
    inAmount: number
    outAmount: number
  }
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseData>
) {
  if (req.method !== 'POST') {
    res.status(405).send({ error: 'Only POST requests allowed' })
    return
  }

  const client = new OAuth2Client({
    clientId: process.env.CLIENT_ID!,
    clientSecret: process.env.CLIENT_SECRET!,
    accessTokenUrl: process.env.OAUTH2_ACCESS_TOKEN_URL!,
    refreshTokenUrl: process.env.OAUTH2_REFRESH_TOKEN_URL!,
  });

  const reqData = {
    in_currency: req.body.inCurrency,
    out_currency: req.body.outCurrency,
    amount: req.body.amount,
    swap_mode: 'ExactOut'
  }
  const result = await client.post(process.env.EXCHANGE_RATE_URL!, reqData)
  console.log(result)


  res.status(200).json({
    inAmount: result.data.exchange_rate.inAmount,
    outAmount: result.data.exchange_rate.outAmount
  })
}
