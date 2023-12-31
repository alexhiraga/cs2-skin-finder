import { Filter, SkinsOptionsProps } from "../components/Filter";
import { Inventory } from "../components/Inventory";
import { Sidebar } from "../components/Sidebar";
import { useEffect, useState } from "react"
import data from "../skins.json"
import { Trash } from "@phosphor-icons/react/dist/ssr";
import { CfgGenerator } from "../components/CfgGenerator";
import { LinkGenerator } from "../components/LinkGenerator";
import { useParams } from "react-router-dom";
import lzString from 'lz-string';
import { SaveCfg } from "../components/SaveCfg";

export interface SkinMap {
    [key: string]: string
}
export interface SavedInventories {
    [key: string]: InventoryProps[]
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
    const [savedInventories, setSavedInventories] = useState<SavedInventories>({})

    const { id } = useParams()

    useEffect(() => {
        updateInventory()
    }, [])

    useEffect(() => {
        const decompressedInventory = id && JSON.parse(lzString.decompressFromEncodedURIComponent(id))
        if (id) {
            setInventory(decompressedInventory)
        }
        const weaponsOptions = Object.entries(data.weapons).map(([_weaponName, weaponData]) => {
            //If the weapon already have skin, return withSkin true
            let isConfigured
            if (decompressedInventory) {
                isConfigured = decompressedInventory.some((item: { weapon: number; }) => item.weapon === weaponData.id);
            }

            return {
                value: weaponData.id,
                label: _weaponName,
                skins: weaponData.skins,
                file: weaponData.file,
                name: weaponData.name,

                withSkin: isConfigured
            }
        })

        //get data from path and pako
        setWeaponsOptions(weaponsOptions)

        const skinsData = data.skinMap
        setSkinsData(skinsData)
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [data, id])

    const handleWeaponChange = (selectedOption: WeaponOptionsProps | null) => {
        if (!selectedOption || !skinsData) return
        setFloat(0)
        setPattern(0)
        setSelectedSkin({ label: 'Select...', value: -1 })

        //if already in inventory, setpattern, setskin, setfloat
        if (selectedOption.withSkin) {
            const itemInInventory = inventory.find(weapon => {
                return weapon.weapon === selectedOption.value
            })
            if (itemInInventory) {
                setPattern(itemInInventory.pattern)
                setFloat(itemInInventory.float)
                setSelectedSkin({
                    label: itemInInventory.skinName,
                    value: itemInInventory.skin
                })
            }
        }

        if (Number(selectedOption.value) > 100) {
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
        if (!selectedOption) return
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
        if (!selectedSkin || !selectedWeapon) return
        const newWeapon = {
            skin: selectedSkin.value,
            skinName: selectedSkin.label,
            weapon: selectedWeapon.value,
            pattern,
            float,
            name: selectedWeapon.name
        }

        const existingWeapon = inventory.findIndex((item) => item.weapon === newWeapon.weapon)

        if (existingWeapon !== -1) {
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

        if (indexToRemove !== -1) {
            const updatedInventory = [...inventory.slice(0, indexToRemove), ...inventory.slice(indexToRemove + 1)]
            setInventory(updatedInventory)
            setFloat(0)
            setPattern(0)
            setSelectedSkin({ label: 'Select...', value: -1 })
        }

        //set withSkins false
        setWeaponsOptions((options) =>
            options.map((weapon) =>
                weapon.value === weaponToRemove ? { ...weapon, withSkin: false } : weapon
            )
        );
    }

    const openSavedInventory = (build: InventoryProps[]) => {
        //open skin's build that was saved in localStorage
        if (!build) return

        setInventory(build)
        const updatedWeaponOptions = weaponsOptions.map((weapon) => {

            const isWeaponInBuild = build.some(savedWeapon => savedWeapon.weapon === weapon.value)

            if (isWeaponInBuild) {
                return { ...weapon, withSkin: true }
            } else {
                return { ...weapon, withSkin: false }
            }
        })

        setWeaponsOptions(updatedWeaponOptions)
    }

    const deleteSkins = () => {
        //delete current skins
        const updatedWeaponOptions = weaponsOptions.map((weapon) => {
            if (weapon.withSkin) {
                return { ...weapon, withSkin: false }
            } else {
                return weapon
            }
        })
        setInventory([])
        setWeaponsOptions(updatedWeaponOptions)
    }

    const updateInventory = () => {
        //get inventories from localStorage
        const savedInventories = (localStorage.getItem('skinInventory'))
        if (savedInventories) {
            setSavedInventories(JSON.parse(savedInventories))
        }
    }

    const deleteBuild = (buildName: string) => {
        const updatedSavedInventories = Object.fromEntries(
            Object.entries(savedInventories).filter(([inventoryName]) => inventoryName !== buildName)
        );

        setSavedInventories(updatedSavedInventories)

        localStorage.setItem('skinInventory', JSON.stringify(updatedSavedInventories))
    }

    return (
        <div className="content flex">
            <Sidebar savedInventories={savedInventories} onOpenSavedInventory={openSavedInventory} onDeleteBuild={deleteBuild} />
            <div className="w-5/6">
                <h1 className="mb-10 mt-5">CS2 Skin Finder & Builder</h1>

                <div className="flex justify-between gap-5">
                    <div className="flex-flex-col w-9/12 ">
                        <div className="my-5 flex gap-3">
                            <CfgGenerator inventory={inventory} />

                            <LinkGenerator inventory={inventory} />

                            <SaveCfg inventory={inventory} onUpdateInventory={updateInventory} />

                            <button
                                className="rounded bg-red p-2 hover:bg-dark-red transition-colors"
                                title="Delete all skins"
                                onClick={deleteSkins}
                            >
                                <Trash size={22} />
                            </button>
                        </div>

                        <Inventory
                            weaponsOptions={weaponsOptions}
                            onHandleWeaponChange={handleWeaponChange}
                            onHandleSkinDelete={handleSkinDelete}
                        />
                    </div>

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