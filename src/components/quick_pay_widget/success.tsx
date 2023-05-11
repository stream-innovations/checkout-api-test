import { Dialog } from '@headlessui/react'
import { CheckIcon } from '@heroicons/react/24/outline'

export default function Success({
    setModalOpen,
    bonusAmount,
    bonusDecimals
}: {
    setModalOpen: any
    bonusAmount: number
    bonusDecimals: number
}) {

    return (
        <>
            <div>
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-green-100">
                    <CheckIcon className="h-6 w-6 text-green-600" aria-hidden="true" />
                </div>
                <div className="mt-3 text-center sm:mt-5">
                    <Dialog.Title as="h3" className="text-base font-semibold leading-6 text-gray-900">
                        Payment successful
                    </Dialog.Title>
                    <div className="mt-2">
                        <p className="text-sm text-gray-500">
                            Your payment has been successfully processed. You can now close this window.
                        </p>
                    </div>
                    {bonusAmount > 0 && (
                        <div className="overflow-hidden rounded-lg bg-indigo-50 mt-2">
                            <div className="px-4 py-5 sm:p-6 text-center text-gray-600 text-sm">
                                <div className='flex flex-col'>
                                    <span>You have got</span>
                                    <span className='text-lg font-bold text-gray-900'>
                                        {bonusAmount / (10 ** bonusDecimals)}
                                    </span>
                                    <span>as a bonus for the next purchase</span>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
            <div className="mt-5 sm:mt-6">
                <button
                    type="button"
                    className="inline-flex w-full justify-center rounded-md bg-indigo-600 px-5 py-3 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                    onClick={() => setModalOpen(false)}
                >
                    Go back to shop
                </button>
            </div>
        </>
    )
}
