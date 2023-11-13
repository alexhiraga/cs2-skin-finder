import { Filter, SkinsOptionsProps } from "../components/Filter";
import { Inventory } from "../components/Inventory";
import { Sidebar } from "../components/Sidebar";
import { useEffect, useState } from "react"
import data from "../skins.json"
import { Trash } from "@phosphor-icons/react/dist/ssr";
import { CfgGenerator } from "../components/CfgGenerator";


export interface SkinMap {
    [key: string]: string
}

export interface WeaponOptionsProps {
    value: number
    label: string
    name: string
    skins: number[]
    file?: string
    withSkin: boolean
}

export interface InventoryProps {
    skin: number
    skinName: string
    weapon: number
    name?: string
    pattern: number
    float: number
}


export function Home() {
    const [weaponsOptions, setWeaponsOptions] = useState<WeaponOptionsProps[]>([])
    const [skinsData, setSkinsData] = useState<SkinMap | undefined>()

    const [skinsOptions, setSkinsOptions] = useState<SkinsOptionsProps[] | undefined>()
    const [selectedWeapon, setSelectedWeapon] = useState<WeaponOptionsProps | undefined>()
    const [knifeId, setKnifeId] = useState<number | null>(null)

    const [selectedSkin, setSelectedSkin] = useState<SkinsOptionsProps | undefined>()
    const [pattern, setPattern] = useState<number>(0)
    const [float, setFloat] = useState<number>(0)

    const [inventory, setInventory] = useState<InventoryProps[]>([])
        
    useEffect(() => {
        const weaponsOptions = Object.entries(data.weapons).map(([_weaponName, weaponData]) => {
            //If the weapon already have skin, return withSkin true
            //add another If for the case no data has been loaded

            return {
                value: weaponData.id,
                label: _weaponName,
                skins: weaponData.skins,
                file: weaponData.file,
                name: weaponData.name,

                withSkin: false
            }
        })

        //get data from path and pako
        setWeaponsOptions(weaponsOptions)

        const skinsData = data.skinMap
        setSkinsData(skinsData)
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [data])

    const handleWeaponChange = (selectedOption: WeaponOptionsProps | null) => {
        if(!selectedOption || !skinsData) return
        setFloat(0)
        setPattern(0)
        setSelectedSkin({label: 'Select...', value: -1})

        //if already in inventory, setpattern, setskin, setfloat
        if(selectedOption.withSkin) {
            const itemInInventory = inventory.find(weapon => {
                return weapon.weapon === selectedOption.value
            })
            if(itemInInventory) {
                setPattern(itemInInventory.pattern)
                setFloat(itemInInventory.float)
                setSelectedSkin({
                    label: itemInInventory.skinName,
                    value: itemInInventory.skin
                })
            }
        }

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

    const saveNewWeapon = () => {
        if(!selectedSkin || !selectedWeapon) return
        const newWeapon = {
            skin: selectedSkin.value,
            skinName: selectedSkin.label,
            weapon: selectedWeapon.value,
            pattern,
            float,
            name: selectedWeapon.name
        }

        const existingWeapon = inventory.findIndex((item) => item.weapon === newWeapon.weapon)

        if(existingWeapon !== -1) {
            // if exists, update pattern, skin and float
            const updatedInventory = [...inventory]
            updatedInventory[existingWeapon] = {
                ...updatedInventory[existingWeapon],
                pattern: newWeapon.pattern,
                skin: newWeapon.skin,
                skinName: newWeapon.skinName,
                float: newWeapon.float
            }
            setInventory(updatedInventory)
        } else {
            // if it doesn't exist, add a new weapon skin in inventory
            setInventory((inv) => [...inv, newWeapon])

            //and set 'withSkins' = true
            setWeaponsOptions((options) =>
                options.map((weapon) =>
                    weapon.value === newWeapon.weapon ? { ...weapon, withSkin: true } : weapon
                )
            );
        }
    }

    const handleSkinDelete = (weaponToRemove: number) => {
        const indexToRemove = inventory.findIndex((item) => item.weapon === weaponToRemove)

        if(indexToRemove !== -1) {
            const updatedInventory = [...inventory.slice(0, indexToRemove), ...inventory.slice(indexToRemove + 1)]
            setInventory(updatedInventory)
            setFloat(0)
            setPattern(0)
            setSelectedSkin({label: 'Select...', value: -1})
        }
        
        //set withSkins false
        setWeaponsOptions((options) =>
            options.map((weapon) =>
                weapon.value === weaponToRemove ? { ...weapon, withSkin: false } : weapon
            )
        );
    }
    return (
        <div className="content flex">
            <Sidebar />
            <div className="w-5/6">
                <h1 className="mb-10 mt-5">CS2 Skin Finder & Builder</h1>

                <div className="my-5 flex gap-3">
                    <CfgGenerator inventory={inventory} />
                    
                    <button 
                        className="rounded bg-red p-2 hover:bg-dark-red transition-colors"
                        title="Delete all skins"
                    >
                        <Trash size={22} />
                    </button>
                </div>

                <div className="flex justify-between gap-5">
                    <Inventory 
                        weaponsOptions={weaponsOptions}
                        onHandleWeaponChange={handleWeaponChange}
                        onHandleSkinDelete={handleSkinDelete}
                    />
                    <Filter
                        weaponsOptions={weaponsOptions}
                        selectedWeapon={selectedWeapon}
                        skinsOptions={skinsOptions}
                        knifeId={knifeId}
                        onHandleWeaponChange={handleWeaponChange}
                        onHandleSkinChange={handleSkinChange}
                        onHandlePatternChange={handlePatternChange}
                        onHandleFloatChange={handleFloatChange}
                        selectedSkin={selectedSkin}
                        pattern={pattern}
                        float={float}
                        onSaveNewWeapon={saveNewWeapon}
                        onHandleSkinDelete={handleSkinDelete}
                    />
                </div>
            </div>
        </div>
    )
}