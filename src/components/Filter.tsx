/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react"
import data from "../skins.json"
import Select from 'react-select'

interface WeaponOptionsProps {
    value: number | string
    label: string
    skins: number[]
}

interface SkinMap {
    [key: string]: string
}

interface SkinsOptionsProps {
    value: number | string
    label: string
}

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


export function Filter() {
    const [weaponsOptions, setWeaponsOptions] = useState<WeaponOptionsProps[]>()
    const [skinsData, setSkinsData] = useState<SkinMap | undefined>()
    const [selectedWeapon, setSelectedWeapon] = useState<WeaponOptionsProps>()
    const [skinsOptions, setSkinsOptions] = useState<SkinsOptionsProps[] | undefined>()
    const [selectedSkin, setSelectedSkin] = useState<SkinsOptionsProps | undefined>()

    const [knifeId, setKnifeId] = useState<number | null>(null)
    const [pattern, setPattern] = useState<number>(0)
    const [float, setFloat] = useState<number>(0)

    useEffect(() => {
        const weaponsOptions = Object.entries(data.weapons).map(([weaponName, weaponData]) => {
            return {
                value: weaponData.id,
                label: weaponName,
                skins: weaponData.skins
            }
        })
        setWeaponsOptions(weaponsOptions)

        const skinsData = data.skinMap
        setSkinsData(skinsData)
    }, [data])

    const handleWeaponChange = (selectedOption: WeaponOptionsProps | null) => {
        if(!selectedOption || !skinsData) return

        if(Number(selectedOption.value) > 100) {
            setKnifeId(Number(selectedOption.value))
        } else {
            setKnifeId(null)
        }
        setSelectedWeapon(selectedOption)
        const weaponSkins = selectedOption.skins

        const filteredSkins = weaponSkins.map(skinId => ({
            value: skinId,
            label: skinsData[skinId]
        }))

        setSkinsOptions(filteredSkins)
    }

    const handleSkinChange = (selectedOption: SkinsOptionsProps | null) => {
        if(!selectedOption) return
        setSelectedSkin(selectedOption)
    }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const handlePatternChange = (e: any) => {
        setPattern(parseInt(e.target.value))
    }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const handleFloatChange = (e: any) => {
        setFloat(parseInt(e.target.value))
    }

    return (
        <div>
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
                        onChange={handlePatternChange}
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
                        onChange={handleFloatChange}
                        className="w-full"
                    />

                    {selectedSkin && (

                        <div 
                            className="bg-neutral-800 hover:bg-neutral-700 transition-colors p-3 text-lg text-center border-purple rounded text-light-purple cursor-pointer border mt-3"
                            onClick={() =>  navigator.clipboard.writeText('skin ' + selectedSkin?.value + ' ' + pattern + ' ' + float/100000 + (knifeId && ' '+knifeId))}
                            title="Click to copy!"
                        >
                            skin {selectedSkin.value + ' ' + pattern + ' ' + float/100000} {knifeId && knifeId}
                        </div>
                    )}
                </>
            )}
            
        </div>
    )
}