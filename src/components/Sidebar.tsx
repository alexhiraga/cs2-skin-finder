import logo from "../assets/notagg-logo.png"
import faceitLogo from "../assets/faceit-logo.png"
import gcLogo from "../assets/gamersclub-icon.png"
import youtubeLogo from "../assets/youtube-logo.png"
import { InventoryProps, SavedInventories } from "../pages/Home"
import { TrashSimple } from '@phosphor-icons/react/dist/ssr'

interface Props {
    savedInventories: SavedInventories
    onOpenSavedInventory: (build: InventoryProps[]) => void
    onDeleteBuild: (buildName: string) => void
}
export function Sidebar({ savedInventories, onOpenSavedInventory, onDeleteBuild }: Props) {

    return (
        <div className="h-screen w-1/6 p-3 flex flex-col gap-2">
            <div className="flex gap-2 align-middle mb-7">
                <img src={logo} alt="NoTagg logo" className="w-10 object-contain" />
                <h6 className="my-auto"><a href="">NoTagg</a></h6>
            </div>

            <div className="flex flex-col gap-4">
                <div className="flex gap-2 align-middle">
                    <img src={gcLogo} alt="Gamersclub logo" className="w-6 object-contain" />
                    <a className="my-auto" href="https://gamersclub.com.br/team/300709" target="_blank">GamersClub</a>
                </div>
                <div className="flex gap-2 align-middle">
                    <img src={faceitLogo} alt="Gamersclub logo" className="w-6 object-contain" />
                    <a className="my-auto" href="https://www.faceit.com/en/teams/e529995b-6190-4c2f-ba1b-75a13aedb7e4" target="_blank">FACEIT</a>
                </div>
                <div className="flex gap-2 align-middle">
                    <img src={youtubeLogo} alt="Gamersclub logo" className="w-6 object-contain" />
                    <a className="my-auto" href="https://www.youtube.com/@kikowsz1821" target="_blank">Kikowsz</a>
                </div>
            </div>

            {savedInventories && (
                <div className="mt-5 flex flex-col gap-4">
                    <span className="font-bold text-light-purple">Inventory list:</span>
                    {Object.entries(savedInventories).map(([inventoryName, inventoryItems]) => {
                        const openInventory = () => {
                            onOpenSavedInventory(inventoryItems)
                        }
                        const deleteInventory = () => {
                            onDeleteBuild(inventoryName)
                        }
                        return (
                            <div 
                                className="flex justify-between" 
                            >
                                <button onClick={openInventory} className="navButton">{inventoryName}</button>
                                <button onClick={deleteInventory} className="" title="Delete build">
                                    <TrashSimple size={18} className="text-red hover:text-light-red transition-colors" />
                                </button>
                            </div>
                        )
                    })}
                </div>
            )}
        </div>
    )
}