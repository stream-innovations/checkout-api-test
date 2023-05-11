import QRCode from "react-qr-code";
import { Dialog } from '@headlessui/react'

export default function QR({
    inAmount,
    inCurrencySymbol,
    link,
}: {
    inAmount: number
    inCurrencySymbol: string
    link: string
}) {
    return (
        <>
            <div>
                <div className="mx-auto mt-5 flex h-12 w-12 items-center justify-center">
                    <div className="flex flex-col text-center pb-5">
                        <span className="text-xl text-gray-700">{inCurrencySymbol}</span>
                        <span className="text-5xl font-bold text-gray-900">{inAmount}</span>
                    </div>
                </div>
                <div className="mt-3 text-center sm:mt-5">
                    <Dialog.Title as="h3" className="text-base font-semibold leading-6 text-gray-900">
                        Scan QR code
                    </Dialog.Title>
                    <div className="mt-2">
                        <p className="text-sm text-gray-500">
                            Scan the QR code via wallet app to pay for the order.
                        </p>
                    </div>
                </div>
            </div>
            <div className="p-6">
                <QRCode className="mx-auto w-48 max-h-48" value={link ?? ''} />
            </div>
        </>
    )
}