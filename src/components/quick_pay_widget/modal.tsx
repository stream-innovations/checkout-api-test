import { Fragment, useRef, useEffect, useState } from 'react'
import { Dialog, Transition } from '@headlessui/react'
import { w3cwebsocket as WebSocket } from "websocket";
import SelectCurrency from './select_currency'
import QR from './qrcode'
import Success from './success'
import Fail from './fail'
import Loading from './loading'

enum State {
    SelectCurrency,
    Loading,
    ShowQR,
    Error,
    Success,
}

enum TxStatus {
    Pending = 'pending',
    Completed = 'completed',
    Failed = 'failed',
}

function renderStateView({
    state,
    currencies,
    setModalOpen,
    setSelectedCurrency,
    error,
    payment,
    tx,
    applyBonus,
    setApplyBonus,
}: {
    state: State
    currencies: { sumbol: string, mint: string }[]
    setModalOpen: (open: boolean) => void
    setSelectedCurrency: (currency: string) => void
    error: string
    payment: PaymentLink
    tx: any
    applyBonus: boolean
    setApplyBonus: (apply: boolean) => void
}) {
    switch (state) {
        case State.SelectCurrency:
            return (
                <SelectCurrency
                    currencies={currencies}
                    selectCurrency={setSelectedCurrency}
                    setModalOpen={setModalOpen}
                    applyBonus={applyBonus}
                    setApplyBonus={setApplyBonus}
                />
            )
        case State.Loading:
            return (
                <Loading loading={true} />
            )
        case State.ShowQR:
            if (!payment) {
                return (
                    <Loading loading={true} />
                )
            }
            return (
                <QR
                    inAmount={toUIAmount({ amount: payment.inAmount, mint: payment.inCurrency })}
                    inCurrencySymbol={findSymbolByMint(payment.inCurrency)!}
                    link={payment.paymentLink}
                />
            )
        case State.Error:
            return (
                <Fail setModalOpen={setModalOpen} error={error} />
            )
        case State.Success:
            return (
                <Success setModalOpen={setModalOpen} bonusAmount={tx?.accrued_bonus_amount} bonusDecimals={6} />
            )
    }
}

const currencies = [
    {
        sumbol: 'SOL',
        mint: 'So11111111111111111111111111111111111111112',
        decimals: 9,
    }, {
        sumbol: 'USDT',
        mint: 'Es9vMFrzaCERmJfrF4H2FYD4KCoNkY11McCe8BenwNYB',
        decimals: 6,
    }, {
        sumbol: 'USDC',
        mint: 'EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v',
        decimals: 6,
    }, {
        sumbol: 'STR',
        mint: '5P3giWpPBrVKL8QP8roKM7NsLdi3ie1Nc2b5r9mGtvwb',
        decimals: 9,
    }
]

function findSymbolByMint(mint: string) {
    return currencies.find((currency) => currency.mint === mint)?.sumbol
}

function toUIAmount({ amount, mint }: { amount: number, mint: string }) {
    const decimals = currencies.find((c) => c.mint === mint)?.decimals
    return amount / 10 ** decimals!
}

type PaymentLink = {
    paymentId: string,
    inAmount: number,
    inCurrency: string,
    outAmount: number,
    outCurrency: string,
    paymentLink: string
    error: string
}

export default function QuickPayModal({ open, setOpen, amount }: { open: boolean, setOpen: any, amount: number }) {
    const [state, setState] = useState(State.SelectCurrency)
    const [selectedCurrency, setSelectedCurrency] = useState('')
    const [applyBonus, setApplyBonus] = useState(false)
    const [error, setError] = useState('')
    const [payment, setPayment] = useState<PaymentLink>()
    const [clientOpen, setClientOpen] = useState(false)
    const [tx, setTx] = useState<any>(null)

    useEffect(() => {
        if (!open) {
            setState(State.SelectCurrency)
            setSelectedCurrency('')
            setError('')
        } else if (selectedCurrency !== '') {
            setState(State.Loading)

            fetch('/api/payment', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    amount: amount,
                    currency: selectedCurrency,
                    applyBonus: applyBonus,
                })
            }).then((res) => {
                console.debug('res', res)
                if (res.ok === false) {
                    setError(res.statusText)
                    setState(State.Error)
                }
                return res.json()
            }).then((data) => {
                console.debug('data', data);

                if (data.error) {
                    setError(data.error)
                    setState(State.Error)
                } else {
                    setPayment(data)
                    setState(State.ShowQR)
                }
            })
        }

    }, [selectedCurrency, open, amount])

    useEffect(() => {
        if (payment?.paymentId && !clientOpen) {
            const sourceURI = process.env.NEXT_PUBLIC_EVENT_SOURCE_URI + '/' + payment.paymentId;
            const client = new WebSocket(sourceURI);

            client.onopen = () => {
                console.debug("WebSocket client connected");
            };

            client.onclose = (event: any) => {
                console.debug(`WebSocket client disconnected with code ${event.code}`);
                setTimeout(() => {
                    client.close();
                    setClientOpen(false);
                }, 1000);
            };

            client.onmessage = (event: any) => {
                const data = JSON.parse(event.data);
                console.log("Received event:", data);

                if (data.name === 'transaction.created') {
                    setState(State.Loading)
                } else if (data.name === 'transaction.updated') {
                    setTx(data.data.transaction)
                    if (data.data.status === TxStatus.Completed) {
                        setState(State.Success)
                    } else if (data.data.status === TxStatus.Failed) {
                        setState(State.Error)
                    }
                }
            };

            return () => {
                client.close();
                setClientOpen(false);
            };
        }
    }, [payment, clientOpen]);


    return (
        <Transition.Root show={open} as={Fragment} >
            <Dialog as="div" className="relative z-10" onClose={setOpen}>
                <Transition.Child
                    as={Fragment}
                    enter="ease-out duration-300"
                    enterFrom="opacity-0"
                    enterTo="opacity-100"
                    leave="ease-in duration-200"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                >
                    <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
                </Transition.Child>

                <div className="fixed inset-0 z-10 overflow-y-auto">
                    <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
                        <Transition.Child
                            as={Fragment}
                            enter="ease-out duration-300"
                            enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                            enterTo="opacity-100 translate-y-0 sm:scale-100"
                            leave="ease-in duration-200"
                            leaveFrom="opacity-100 translate-y-0 sm:scale-100"
                            leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                        >
                            <Dialog.Panel className="relative transform overflow-hidden rounded-lg bg-white px-4 pt-5 pb-4 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-sm sm:p-6">
                                {renderStateView({
                                    state,
                                    currencies,
                                    setModalOpen: setOpen,
                                    setSelectedCurrency,
                                    error: error,
                                    payment: payment || { paymentId: '', inAmount: 0, inCurrency: '', outAmount: 0, outCurrency: '', paymentLink: '', error: '' },
                                    tx: tx,
                                    applyBonus,
                                    setApplyBonus
                                })}
                            </Dialog.Panel>
                        </Transition.Child>
                    </div>
                </div>
            </Dialog>
        </Transition.Root >
    )
}