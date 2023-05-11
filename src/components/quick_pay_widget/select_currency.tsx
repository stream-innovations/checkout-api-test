import { Dialog, Switch } from '@headlessui/react'
import { BanknotesIcon } from '@heroicons/react/24/outline'
import { useState } from 'react'

function classNames(...classes: string[]) {
    return classes.filter(Boolean).join(' ')
}

export default function SelectCurrency({
    currencies,
    selectCurrency,
    setModalOpen,
    applyBonus,
    setApplyBonus,
}: {
    currencies: { sumbol: string; mint: string }[]
    selectCurrency: (currency: string) => void
    setModalOpen: (open: boolean) => void
    applyBonus: boolean
    setApplyBonus: (apply: boolean) => void
}) {

    const [selected, setSelected] = useState(currencies[0].mint)

    return (
        <>
            <div>
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-indigo-100">
                    <BanknotesIcon className="h-6 w-6 text-indigo-600" aria-hidden="true" />
                </div>
                <div className="mt-3 text-center sm:mt-5">
                    <Dialog.Title as="h3" className="text-base font-semibold leading-6 text-gray-900">
                        Select payment currency
                    </Dialog.Title>
                    <div className="mt-2">
                        <p className="text-sm text-gray-500">
                            Select the currency you will use to pay for the order. It will swap to USDC automatically.
                        </p>
                    </div>
                </div>
            </div>
            <div className="mt-5 sm:mt-6">
                <div className="grid grid-cols-3 gap-3 sm:grid-cols-3">
                    {currencies.map((currency) => (
                        <button
                            key={currency.mint}
                            onClick={() => setSelected(currency.mint)}
                            type="button"
                            className={selected === currency.mint ? 'ring-2 ring-inset ring-indigo-300 bg-white text-gray-900 hover:bg-gray-50 flex items-center justify-center rounded-md py-3 px-5 text-sm font-semibold uppercase sm:flex-1' : 'ring-1 ring-inset ring-gray-300 bg-white text-gray-900 hover:bg-gray-50 flex items-center justify-center rounded-md py-3 px-5 text-sm font-semibold uppercase sm:flex-1'}>
                            {currency.sumbol}
                        </button>
                    ))}
                </div>
            </div>

            <Switch.Group as="div" className="flex items-center mt-5">
                <Switch
                    checked={applyBonus}
                    onChange={setApplyBonus}
                    className={classNames(
                        applyBonus ? 'bg-indigo-600' : 'bg-gray-200',
                        'relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:ring-offset-2'
                    )}
                >
                    <span
                        aria-hidden="true"
                        className={classNames(
                            applyBonus ? 'translate-x-5' : 'translate-x-0',
                            'pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out'
                        )}
                    />
                </Switch>
                <Switch.Label as="span" className="ml-3 text-sm">
                    <span className="font-medium text-gray-900">Pay with bonus</span>{' '}
                    <span className="text-gray-500">(if available on balance)</span>
                </Switch.Label>
            </Switch.Group>

            <div className="mt-5 sm:mt-6">
                <button
                    type="button"
                    onClick={() => selectCurrency(selected)}
                    className="inline-flex w-full justify-center rounded-md bg-indigo-600 px-5 py-3 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                >
                    Next step &rarr;
                </button>
            </div>
        </>
    )
}