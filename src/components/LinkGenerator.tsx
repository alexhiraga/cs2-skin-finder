import { InventoryProps } from '../pages/Home'
import lzString from 'lz-string';

interface Props {
    inventory: InventoryProps[]
}

export function LinkGenerator({ inventory }: Props) {
    const url = window.location.href

    const generateLink = () => {
        const inventoryStringified = JSON.stringify(inventory)

        const compressed = lzString.compressToEncodedURIComponent(inventoryStringified)

        navigator.clipboard.writeText(url + compressed)
    }

    return (
        <>
            <button
                className="flex gap-1 rounded py-2 px-5 bg-sky-600 hover:bg-sky-700 transition-colors" 
                onClick={generateLink}
                disabled={!inventory.length}
                title="Generate link"
            >
                Generate link
            </button>
        </>
    )
}