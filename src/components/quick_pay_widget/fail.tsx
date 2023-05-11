import { Dialog } from '@headlessui/react'
import { XCircleIcon } from '@heroicons/react/24/outline'

export default function Fail({ setModalOpen, error }: { setModalOpen: any, error: string }) {

    return (
        <>
            <div>
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-red-100">
                    <XCircleIcon className="h-6 w-6 text-red-600" aria-hidden="true" />
                </div>
                <div className="mt-3 text-center sm:mt-5">
                    <Dialog.Title as="h3" className="text-base font-semibold leading-6 text-gray-900">
                        Payment failed
                    </Dialog.Title>
                    <div className="mt-2">
                        <p className="text-sm text-gray-500">
                            {error}
                        </p>
                    </div>
                </div>
            </div>
            <div className="mt-5 sm:mt-6">
                <button
                    type="button"
                    className="inline-flex w-full justify-center rounded-md bg-red-600 px-5 py-3 text-sm font-semibold text-white shadow-sm hover:bg-red-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-600"
                    onClick={() => setModalOpen(false)}
                >
                    Go back to shop
                </button>
            </div>
        </>
    )
}
