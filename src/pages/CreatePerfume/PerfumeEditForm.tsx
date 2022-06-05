import { IonIcon, IonInput, IonItem, IonItemDivider, IonLabel, IonList, IonListHeader, IonRange, IonTextarea } from '@ionic/react';
import { flame, heart, skullSharp, snow, sparkles, sunny, thunderstorm, trashBin } from 'ionicons/icons';
import { useEffect, useState } from 'react';

import './CreatePerfume.css';
import TextInputWithSuggestion from '../../components/TextInputWithSuggestion';
import { Perfume } from './CreatePerfume';


const PerfumeEditForm: React.FC<{ perfume: Perfume, setPerfume: React.Dispatch<Perfume>, ctx: any }> = ({ perfume, setPerfume, ctx }) => {
    const [autoCompleteList, setAutoCompleteList] = useState<string[]>([])

    useEffect(() => {
        if (!ctx.perfume) { return }
        if (!perfume.house || perfume.house.length === 0) {
            let autoList: string[] = Object.values(ctx.perfume).map((elem: any) => elem?.house.trim());
            autoList = Array.from(new Set<string>(autoList))
            setAutoCompleteList(autoList)
        }
        let filtered = Object.values(ctx.perfume).filter((elem: any) => {
            return elem?.house.toLowerCase().includes(perfume.house?.toLowerCase())
        });
        let autoList: string[] = (filtered && filtered.length > 0) ? filtered.map((elem: any) => elem.house.trim()) : []
        autoList = Array.from(new Set<string>(autoList))
        setAutoCompleteList(autoList);
    }, [perfume.house, ctx.perfume])

    const roundNumber = (number: number) => {
        return Math.round((number + Number.EPSILON) * 100) / 100
    }

    const setHouse = (valueChange: string) => {
        setPerfume({ ...perfume, house: valueChange! });
    }

    return (
        <IonList>
            <IonItem>
                <IonLabel position="floating">Perfume Name</IonLabel>
                <IonInput
                    value={perfume.title}
                    inputMode={"text"}
                    onIonChange={e => setPerfume({ ...perfume, title: e.detail.value! })}>
                </IonInput>
            </IonItem>
            <IonItem>
                <IonLabel position="floating">Perfume House</IonLabel>
                <TextInputWithSuggestion
                    valueGetter={perfume.house}
                    valueSetter={setHouse}
                    staticComparator={ctx.perfume ?? ctx.perfume[perfume.id]?.house}
                    suggestionArray={autoCompleteList}
                />
            </IonItem>
            <IonItem>
                <IonLabel position="floating">Description</IonLabel>
                <IonTextarea
                    autoGrow={true}
                    inputMode={"text"}
                    value={perfume.description}
                    onIonChange={e => setPerfume({ ...perfume, description: e.detail.value! })}>
                </IonTextarea>
            </IonItem>
            <IonItemDivider />
            <IonItem>
                <IonLabel position='fixed'>Temperature</IonLabel>
                <IonRange color='secondary' value={perfume.temp} step={.1} min={1} max={5}
                    onIonChange={e =>
                        setPerfume({ ...perfume, temp: roundNumber(e.detail.value.valueOf() as number) })
                    }>

                    <IonIcon color="tertiary" icon={snow} slot="start" />
                    <IonIcon color="tertiary" icon={flame} slot="end" />
                </IonRange>
            </IonItem>
            <IonItem>
                <IonLabel position='fixed'>Gloom</IonLabel>
                <IonRange color='secondary' value={perfume.gloom} step={.02} min={0} max={1}
                    onIonChange={e =>
                        setPerfume({ ...perfume, gloom: roundNumber(e.detail.value.valueOf() as number) })
                    }>
                    <IonIcon color="tertiary" icon={thunderstorm} slot="start" />
                    <IonIcon color="tertiary" icon={sunny} slot="end" />
                </IonRange>
            </IonItem>
            <IonItem>
                <IonLabel position='fixed'>Fanciness</IonLabel>
                <IonRange color='secondary' value={perfume.fanciness} step={.02} min={0} max={1}
                    onIonChange={e =>
                        setPerfume({ ...perfume, fanciness: roundNumber(e.detail.value.valueOf() as number) })
                    }>
                    <IonIcon color="tertiary" icon={trashBin} slot="start" />
                    <IonIcon color="tertiary" icon={sparkles} slot="end" />
                </IonRange>
            </IonItem>
            <IonItem>
                <IonLabel position='fixed'>Mood</IonLabel>
                <IonRange color='secondary' pin={false} value={perfume.mood} step={.02} min={0} max={1}
                    onIonChange={e =>
                        setPerfume({ ...perfume, mood: roundNumber(e.detail.value.valueOf() as number) })
                    }>
                    <IonIcon color="tertiary" icon={skullSharp} slot="start" />
                    <IonIcon color="tertiary" icon={heart} slot="end" />
                </IonRange>
            </IonItem>
            <IonListHeader color='light'>Review Notes</IonListHeader>
            <IonItem>
                <IonLabel position="floating">Silage</IonLabel>
                <IonRange color='secondary' value={perfume.silage} step={.02} min={0} max={1}
                    onIonChange={e =>
                        setPerfume({ ...perfume, silage: roundNumber(e.detail.value.valueOf() as number) })
                    }>
                    <IonIcon color="tertiary" icon={thunderstorm} slot="start" />
                    <IonIcon color="tertiary" icon={sunny} slot="end" />
                </IonRange>
            </IonItem>
            <IonItem>
                <IonLabel position="floating">Throw</IonLabel>
                <IonRange color='secondary' value={perfume.throw} step={.02} min={0} max={1}
                    onIonChange={e =>
                        setPerfume({ ...perfume, throw: roundNumber(e.detail.value.valueOf() as number) })
                    }>
                    <IonIcon color="tertiary" icon={thunderstorm} slot="start" />
                    <IonIcon color="tertiary" icon={sunny} slot="end" />
                </IonRange>
            </IonItem>
            <IonItem>
                <IonLabel position="floating">In The Bottle</IonLabel>
                <IonTextarea
                    autoGrow={true}
                    inputMode={"text"}
                    value={perfume.inBottle}
                    onIonChange={e => setPerfume({ ...perfume, inBottle: e.detail.value! })}>
                </IonTextarea>
            </IonItem>
            <IonItem>
                <IonLabel position="floating">Wet</IonLabel>
                <IonTextarea
                    autoGrow={true}
                    inputMode={"text"}
                    value={perfume.wet}
                    onIonChange={e => setPerfume({ ...perfume, wet: e.detail.value! })}>
                </IonTextarea>
            </IonItem>
            <IonItem>
                <IonLabel position="floating">Dried Down</IonLabel>
                <IonTextarea
                    autoGrow={true}
                    inputMode={"text"}
                    value={perfume.dried}
                    onIonChange={e => setPerfume({ ...perfume, dried: e.detail.value! })}>
                </IonTextarea>
            </IonItem>
            <IonItem>
                <IonLabel position="floating">One Hour Wear</IonLabel>
                <IonTextarea
                    autoGrow={true}
                    inputMode={"text"}
                    value={perfume.oneHour}
                    onIonChange={e => setPerfume({ ...perfume, oneHour: e.detail.value! })}>
                </IonTextarea>
            </IonItem>
            <IonItem>
                <IonLabel position="floating">Three Hour Wear </IonLabel>
                <IonTextarea
                    autoGrow={true}
                    inputMode={"text"}
                    value={perfume.threeHour}
                    onIonChange={e => setPerfume({ ...perfume, threeHour: e.detail.value! })}>
                </IonTextarea>
            </IonItem>
        </IonList>
    );
};

export default PerfumeEditForm;
