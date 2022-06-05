import { IonIcon } from '@ionic/react';
import { skullSharp, heart, trashBin, sparkles, snow, flame, thunderstorm, sunny } from 'ionicons/icons';
import { Perfume } from '../pages/CreatePerfume/CreatePerfume';

const PerfumeIconDisplay: any = (perfume: Perfume, size?: string) => {
    const iconLabelMap: any = {
        sad: (<IonIcon color="primary" size={size ?? "large"} icon={skullSharp} />),
        happy: (<IonIcon color="primary" size={size ?? "large"} icon={heart} />),
        fancy: (<IonIcon color="primary" size={size ?? "large"} icon={sparkles} />),
        trashy: (<IonIcon color="primary" size={size ?? "large"} icon={trashBin} />),
        gloomy: (<IonIcon color="primary" size={size ?? "large"} icon={thunderstorm} />),
        bright: (<IonIcon color="primary" size={size ?? "large"} icon={sunny} />),
        warm: (<IonIcon color="primary" size={size ?? "large"} icon={flame} />),
        cool: (<IonIcon color="primary" size={size ?? "large"} icon={snow} />)
    }

    const generateIconArray = (perfume: any) => {
        let moodIcon, fancinessIcon, tempIcon, gloomIcon;
        moodIcon = perfume.mood < .5 ? iconLabelMap.sad : iconLabelMap.happy;
        fancinessIcon = perfume.fanciness < .5 ? iconLabelMap.trashy : iconLabelMap.fancy;
        tempIcon = perfume.temp < 2.5 ? iconLabelMap.cool : iconLabelMap.warm;
        gloomIcon = perfume.gloom < .5 ? iconLabelMap.gloomy : iconLabelMap.bright;

        return [moodIcon, fancinessIcon, tempIcon, gloomIcon]
    }
    return (generateIconArray(perfume));
};

export default PerfumeIconDisplay;
