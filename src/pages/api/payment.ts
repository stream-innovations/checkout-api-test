import { OAuth2Client } from '@/lib/oauth2client/client'
import type { NextApiRequest, NextApiResponse } from 'next'

type ResponseData = {
    paymentId?: string
    inCurrency?: string
    outCurrency?: string
    inAmount?: number
    outAmount?: number
    paymentLink?: string
    error?: string
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

    const randomNumber = Math.floor(Math.random() * 1000000000)
    const orderID = `order_${randomNumber}`

    try {
        console.log('Creating payment')
        const createPaymentReqData = {
            external_id: orderID,
            amount: req.body.amount,
            message: 'Payment for order ' + randomNumber,
            ttl: 300,
        }
        const resultPayment = await client.post(process.env.CREATE_PAYMENT_URL!, createPaymentReqData)
        console.log('resultPayment', resultPayment)
        if (resultPayment.data.error) {
            res.status(resultPayment.data.code).json({
                error: resultPayment.data.message ? resultPayment.data.message : resultPayment.data.error
            })
            return
        }

        console.log('Creating payment link');

        const genLinkReqData = {
            mint: req.body.currency,
            apply_bonus: req.body.applyBonus ?? false,
        }
        const resultLink = await client.post(`${process.env.GENERATE_PAYMENT_LINK_URL!}/${resultPayment.data.payment.id}/link`, genLinkReqData)
        console.log('resultLink', resultLink)
        if (resultLink.data.error) {
            res.status(resultLink.data.code).json({
                error: resultLink.data.message ? resultLink.data.message : resultLink.data.error
            })
            return
        }

        var resultExchange = null
        if (req.body.currency !== resultPayment.data.payment.destination_mint) {
            console.log('Getting exchange rate');
            const exchangeReqData = {
                in_currency: req.body.currency,
                out_currency: resultPayment.data.payment.destination_mint,
                amount: resultPayment.data.payment.amount,
                swap_mode: 'ExactOut'
            }
            resultExchange = await client.post(process.env.EXCHANGE_RATE_URL!, exchangeReqData)
            console.log('resultExchange', resultExchange)

            if (resultExchange.data.error) {
                res.status(resultExchange.data.code).json({
                    error: resultExchange.data.message ? resultExchange.data.message : resultExchange.data.error
                })
                return
            }
        }

        console.log('Returning response');

        res.status(200).json({
            paymentId: resultPayment.data.payment.id,
            inCurrency: req.body.currency,
            inAmount: resultExchange ? resultExchange.data.exchange_rate.inAmount : req.body.amount,
            outAmount: resultExchange ? resultExchange.data.exchange_rate.outAmount : req.body.amount,
            outCurrency: resultExchange ? resultExchange.data.exchange_rate.outCurrency : resultPayment.data.payment.destination_mint,
            paymentLink: resultLink.data.link
        })

        return
    } catch (e) {
        console.log(e)
        res.status(500).json({
            error: `Error: ${e}`
        })
        return
    }
}