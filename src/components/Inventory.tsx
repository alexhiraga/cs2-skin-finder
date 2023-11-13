import { TrashSimple } from "@phosphor-icons/react/dist/ssr";
import { WeaponOptionsProps } from "../pages/Home"

interface Props {
    weaponsOptions: WeaponOptionsProps[]
    onHandleWeaponChange: (selectedOption: WeaponOptionsProps | null) => void
    onHandleSkinDelete:(weaponToRemove: number) => void
}

export function Inventory({ weaponsOptions, onHandleWeaponChange, onHandleSkinDelete }: Props) {

    return (
        <div className="w-9/12 flex">
            <div className="flex gap-5 flex-wrap">
                {weaponsOptions && weaponsOptions.map((weapon) => {
                    const basePath = "/cs2-skin-finder/"
                    const imagePath = `${basePath}assets/weapons/${weapon.file}`;

                    const selectWeaponSkin = () => {
                        onHandleWeaponChange(weapon)
                    }

                    const deleteSkin = (e: { stopPropagation: () => void; }) => {
                        e.stopPropagation()
                        onHandleSkinDelete(weapon.value)
                    }
     
                    return (
                        <div 
                            className={`w-28 h-28 rounded border flex flex-col justify-center cursor-pointer border-purple 
                            hover:bg-dark-purple ${!weapon.withSkin && 'grayscale brightness-75 hover:grayscale-0 hover:brightness-100 transition-all border-neutral-600'}
                            transition-colors relative
                            `}
                            title={weapon.label}
                            onClick={selectWeaponSkin}
                        >
                            <img 
                                src={imagePath} 
                                alt={`weapon ${weapon.file}`} 
                                className="p-3" 
                            />
                            
                            {weapon.withSkin && (
                                <div className="flex absolute bottom-1 left-1 w-full z-10">
                                    {/* <button onClick={copyToClipboard} className="">
                                        <Copy size={20} />
                                    </button> */}
                                    <button 
                                        onClick={deleteSkin} 
                                        className="text-light-gray rounded bg-red hover:bg-dark-red transition-colors p-2"
                                        title="Delete skin"
                                    >
                                        <TrashSimple size={16} />
                                    </button>
                                </div>
                            )}
                        </div>
                    )
                })}
            </div>
        </div>
    )
}