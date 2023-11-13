import logo from "../assets/notagg-logo.png"
import faceitLogo from "../assets/faceit-logo.png"
import gcLogo from "../assets/gamersclub-icon.png"
import youtubeLogo from "../assets/youtube-logo.png"
import { InventoryProps } from "../pages/Home"

interface Props {
    savedInventories: InventoryProps[]
    onOpenSavedInventory: (build: InventoryProps[]) => void
}
export function Sidebar({ savedInventories, onOpenSavedInventory }: Props) {
   
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

                        return (
                            <button onClick={openInventory} className="navButton">{inventoryName}</button>
                        )
                    })}
                </div>
            )}
        </div>
    )
}