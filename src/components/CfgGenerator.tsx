import { Export } from "@phosphor-icons/react";
import { InventoryProps } from "../pages/Home";

interface Props {
    inventory: InventoryProps[]
}

export function CfgGenerator({ inventory }: Props) {
    const generateAndDownloadCfgFile = () => {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        let commands: string = ''
        let initialCommand = 1
        inventory.map((skin) => {
            //knives
            if(skin.weapon > 100) {
                commands += `
alias command${initialCommand} "slot3; skin ${skin.skin} ${skin.pattern} ${skin.float}; skin ${skin.skin} ${skin.pattern} ${skin.float}; bind F6 command${initialCommand}.5"
                `
            } else {
                // pistols
                if(
                    skin.weapon === 1 ||
                    skin.weapon === 2 ||
                    skin.weapon === 3 ||
                    skin.weapon === 30 ||
                    skin.weapon === 32 ||
                    skin.weapon === 36 ||
                    skin.weapon === 61 ||
                    skin.weapon === 63 ||
                    skin.weapon === 64
                ) {
                    commands += `
alias command${initialCommand} "give weapon_${skin.name}; slot2; skin ${skin.skin} ${skin.pattern} ${skin.float}; bind F6 command${initialCommand}.5"
                    `
                } else {
                    commands += `
alias command${initialCommand} "give weapon_${skin.name}; slot1; skin ${skin.skin} ${skin.pattern} ${skin.float}; bind F6 command${initialCommand}.5"
                    `
                }
            }

            commands += `
alias command${initialCommand}.5 "drop; bind F6 command${initialCommand+1}"
            `
            initialCommand++

        })
        commands += `
bind F6 command1
        `

        const cfgContent = commands;

        const blob = new Blob([cfgContent], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);

        const a = document.createElement('a');
        a.href = url;
        a.download = 'skins.cfg';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    };

    return (
        <>
            <button 
                className="flex gap-1 rounded py-2 px-5 bg-green-600 hover:bg-green-700 transition-colors" 
                disabled={!inventory.length}
                title="Export all skins"
                onClick={generateAndDownloadCfgFile}
            >
                <Export size={22} />
                Export skins (.cfg)
            </button>
        </>
    );
}