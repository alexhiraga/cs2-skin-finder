import { useState } from "react";
import { InventoryProps } from "../pages/Home"
import { File } from "@phosphor-icons/react";
import Modal from 'react-modal';

interface Props {
    inventory: InventoryProps[]
}


const customStyles = {
    content: {
        top: '50%',
        left: '50%',
        right: 'auto',
        bottom: 'auto',
        marginRight: '-50%',
        transform: 'translate(-50%, -50%)',
        zIndex: '200900',
        backgroundColor: 'rgb(0, 0, 0, 0.2)'
    },
};

export function SaveCfg({ inventory }: Props) {
    const [isOpen, setIsOpen] = useState<boolean>(false)
    const [buildName, setBuildName] = useState<string>("")

    function openModal() {
        setIsOpen(true);
    }

    function closeModal() {
        setBuildName("")
        setIsOpen(false);
    }

    const saveBuild = () => {
        const existingInventoriesJSON = (localStorage.getItem('skinInventory'))

        const existingInventories = existingInventoriesJSON ? JSON.parse(existingInventoriesJSON) : {}

        existingInventories[buildName] = inventory

        localStorage.setItem('skinInventory', JSON.stringify(existingInventories))
    }

    return (
        <>
            <button
                className="flex gap-1 rounded py-2 px-5 bg-indigo-600 hover:bg-indigo-700 transition-colors"
                onClick={openModal}
                disabled={!inventory.length}
                title="Save build"
            >
                <File size={22} />
                Save build
            </button>

            <Modal
                isOpen={isOpen}
                style={customStyles}
            >
                <div className="flex flex-col gap-2 p-10 bg-dark-gray">
                    <h5>Build name:</h5>
                    <input
                        onChange={(e) => setBuildName(e.target.value)}
                        className="p-3"
                    />
                    <div className="flex gap-3">

                        <button onClick={saveBuild} className="rounded py-2 px-5 bg-green-600 hover:bg-green-700 transition-colors mt-2">
                            Save build
                        </button>
                        <button onClick={closeModal} className="rounded py-2 px-5 bg-red hover:bg-dark-red transition-colors mt-2">
                            Cancel
                        </button>
                    </div>
                </div>
            </Modal>
        </>
    )
}