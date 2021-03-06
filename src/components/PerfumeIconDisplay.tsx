import { IonIcon } from '@ionic/react';
import {
    skullSharp,
    heart,
    trashBin,
    sparkles,
    snow,
    flame,
    thunderstorm,
    sunny
} from 'ionicons/icons';
import { Perfume } from '../contexts/AppContext';

const PerfumeIconDisplay: any = (perfume: Perfume, size?: string) => {
    const iconLabelMap: any = {
        sad: (<IonIcon key="sadIco" color="primary" size={size ?? "large"} icon={skullSharp} />),
        happy: (<IonIcon key="happyIco" color="primary" size={size ?? "large"} icon={heart} />),
        fancy: (<IonIcon key="fancyIco" color="primary" size={size ?? "large"} icon={sparkles} />),
        trashy: (<IonIcon key="trashyIco" color="primary" size={size ?? "large"} icon={trashBin} />),
        gloomy: (<IonIcon key="gloomyIco" color="primary" size={size ?? "large"} icon={thunderstorm} />),
        bright: (<IonIcon key="brightIco" color="primary" size={size ?? "large"} icon={sunny} />),
        warm: (<IonIcon key="warmIco" color="primary" size={size ?? "large"} icon={flame} />),
        cool: (<IonIcon key="coolIco" color="primary" size={size ?? "large"} icon={snow} />)
    }

    const generateIconArray = (perfume: Perfume) => {
        let moodIcon, fancinessIcon, tempIcon, gloomIcon;
        moodIcon = perfume.mood && perfume.mood < .5 ? iconLabelMap.sad : iconLabelMap.happy;
        fancinessIcon = perfume.fanciness && perfume.fanciness < .5 ? iconLabelMap.trashy : iconLabelMap.fancy;
        tempIcon = perfume.temp && perfume.temp < 3 ? iconLabelMap.cool : iconLabelMap.warm;
        gloomIcon = perfume.gloom && perfume.gloom < .5 ? iconLabelMap.gloomy : iconLabelMap.bright;

        return [moodIcon, fancinessIcon, tempIcon, gloomIcon]
    }
    return (generateIconArray(perfume));
};

export default PerfumeIconDisplay;
