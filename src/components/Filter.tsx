/* eslint-disable @typescript-eslint/no-explicit-any */
import Select from 'react-select'
import { WeaponOptionsProps } from "../pages/Home"
import { Copy } from '@phosphor-icons/react'
import { File, TrashSimple } from '@phosphor-icons/react/dist/ssr'

const customStyles = {
    control: (provided: any) => ({
        ...provided,
        backgroundColor: 'black', // set background color
        color: 'white', // set text color
    }),
    option: (provided: any, state: { isSelected: any }) => ({
        ...provided,
        backgroundColor: state.isSelected ? 'var(--dark-purple)' : 'var(--dark-gray)', // set background color for selected and non-selected options
        color: 'white', // set text color for options
        '&:hover': {
            backgroundColor: 'var(--purple)'
        }
    }),
    singleValue: (provided: any) => ({
        ...provided,
        color: 'var(--light-gray)'
    }),
    
}

interface Props {
    weaponsOptions: WeaponOptionsProps[]
    selectedWeapon: WeaponOptionsProps | undefined
    skinsOptions: SkinsOptionsProps[] | undefined
    knifeId: number | null
    onHandleWeaponChange: (selectedOption: WeaponOptionsProps | null) => void
    onHandleSkinChange: (selectedOption: SkinsOptionsProps | null) => void
    onHandlePatternChange: (e: any) => void
    onHandleFloatChange: (e: any) => void
    float: number
    pattern: number
    selectedSkin: SkinsOptionsProps | undefined
    onSaveNewWeapon: () => void
    onHandleSkinDelete:(weaponToRemove: number) => void
}

export interface SkinsOptionsProps {
    value: number
    label: string
}

export function Filter({ 
    weaponsOptions, 
    selectedWeapon, 
    skinsOptions, 
    knifeId, 
    onHandleWeaponChange,
    onHandleSkinChange,
    onHandlePatternChange,
    onHandleFloatChange,
    selectedSkin,
    pattern,
    float,
    onSaveNewWeapon,
    onHandleSkinDelete
}: Props ) {

    const handleWeaponChange = (selectedOption: WeaponOptionsProps | null) => {
        onHandleWeaponChange(selectedOption)
    }

    const handleSkinChange = (selectedOption: SkinsOptionsProps | null) => {
        if(!selectedOption) return
        onHandleSkinChange(selectedOption)
    }
    
    const saveSkin = () => {
        onSaveNewWeapon()
    }

    const resetSkin = () => {
        if(!selectedWeapon) return
        onHandleSkinDelete(selectedWeapon?.value)
    }

    return (
        <div className="w-3/12">
            <h5 className="mb-3">Weapon:</h5>
            <Select
                options={weaponsOptions}
                onChange={(selectedOption: WeaponOptionsProps | null) => handleWeaponChange(selectedOption)}
                value={selectedWeapon}
                styles={customStyles}
            />

            {selectedWeapon && (
                <>
                    <h5 className="mt-6 mb-3">Skin:</h5>
                    <Select
                        options={skinsOptions}
                        onChange={(selectedOption: SkinsOptionsProps | null) => handleSkinChange(selectedOption)}
                        value={selectedSkin}
                        styles={customStyles}
                    />
                    <h5 className="mt-6 mb-3">
                        Pattern:
                        <span className="ml-2 text-light-purple">
                            {pattern}
                        </span>
                    </h5>
                    <input 
                        type="range"
                        min={0}
                        max={1024}
                        value={pattern}
                        onChange={onHandlePatternChange}
                        className="w-full"
                    />

                    <h5 className="mt-6 mb-3">
                        Float:
                        <span className="ml-2 text-light-red">
                            {float / 100000}
                        </span>
                    </h5>
                    <input 
                        type="range"
                        min={0}
                        max={100000}
                        value={float}
                        onChange={onHandleFloatChange}
                        className="w-full"
                    />

                    {selectedSkin && selectedSkin?.value > 0 && (
                        <div>
                            <div 
                                className="bg-neutral-800 hover:bg-dark-purple transition-colors p-3 text-lg text-center border-purple rounded text-light-purple 
                                cursor-pointer border mt-3 flex justify-between align-middle"
                                onClick={() => navigator.clipboard.writeText('skin ' + selectedSkin?.value + ' ' + pattern + ' ' + float/100000 + (knifeId && ' '+knifeId))}
                                title="Click to copy!"
                            >   
                                <div></div>
                                <div>
                                    skin {selectedSkin.value + ' ' + pattern + ' ' + float/100000} {knifeId && knifeId}
                                </div>
                                <Copy size={22} weight="bold" className="my-auto" />
                            </div>

                            <div className="flex gap-2">
                                <button 
                                    onClick={saveSkin} 
                                    className={`flex align-middle gap-1 saveButton mt-3 justify-center ${selectedWeapon.withSkin ? 'w-5/6' : 'w-full'}`}
                                    title="Save skin"
                                >
                                    <File size={22} />
                                    Save skin
                                </button>

                                {selectedWeapon.withSkin && (
                                    <button 
                                        onClick={resetSkin} 
                                        className=" deleteButton mt-3 w-1/6 relative"
                                        title="Delete skin"    
                                        >
                                        <TrashSimple size={22} className="absolute left-1/4 top-[20%]" />
                                    </button>
                                )}
                            </div>
                        </div>
                    )}
                </>
            )}
            
        </div>
    )
}