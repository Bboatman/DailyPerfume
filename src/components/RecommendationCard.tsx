import {
    IonButton,
    IonCard,
    IonCardContent,
    IonCardHeader,
    IonCardSubtitle,
    IonCardTitle,
    IonChip,
    IonFooter,
    IonIcon,
    IonItem,
    IonLabel,
    IonRange,
    IonTabBar,
    IonTabButton,
    IonText,
    IonToolbar
} from '@ionic/react';
import { useContext } from 'react'
import { AppContext, Perfume } from '../contexts/AppContext';
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

interface ContainerProps {
    perfumeId: string,
    cardHeader: string
}

const RecommendationCard: React.FC<ContainerProps> = ({ perfumeId, cardHeader }) => {
    const { state, dispatch } = useContext(AppContext)
    const iconLabelMap: any = {
        sad: (<IonTabButton tab="sad">
            <IonIcon color="primary" size="large" icon={skullSharp} />
            <IonLabel>Sad</IonLabel>
        </IonTabButton>),
        happy: (<IonTabButton tab="happy">
            <IonIcon color="primary" size='large' icon={heart} />
            <IonLabel>Happy</IonLabel>
        </IonTabButton>),
        fancy: (<IonTabButton tab="sad">
            <IonIcon color="primary" size='large' icon={sparkles} />
            <IonLabel>Fancy</IonLabel>
        </IonTabButton>),
        trashy: (<IonTabButton tab="trashy">
            <IonIcon color="primary" size='large' icon={trashBin} />
            <IonLabel>Trashy</IonLabel>
        </IonTabButton>),
        gloomy: (<IonTabButton tab="gloomy">
            <IonIcon color="primary" size='large' icon={thunderstorm} />
            <IonLabel>Gloomy</IonLabel>
        </IonTabButton>),
        bright: (<IonTabButton tab="bright">
            <IonIcon color="primary" size='large' icon={sunny} />
            <IonLabel>Bright</IonLabel>
        </IonTabButton>),
        warm: (<IonTabButton tab="warm">
            <IonIcon color="primary" size='large' icon={flame} />
            <IonLabel>Warm</IonLabel>
        </IonTabButton>),
        cool: (<IonTabButton tab="cool">
            <IonIcon color="primary" size='large' icon={snow} />
            <IonLabel>Cool</IonLabel>
        </IonTabButton>)
    }
    const perfumeNotes: string[] = state.perfume[perfumeId]?.notes ?? [];
    const generateIconDescriptor = (perfume: Perfume | undefined) => {
        let moodIcon, fancinessIcon, tempIcon, gloomIcon;
        moodIcon = perfume?.mood && perfume.mood < .5 ? iconLabelMap.sad : iconLabelMap.happy;
        fancinessIcon = perfume?.fanciness && perfume.fanciness < .5 ? iconLabelMap.trashy : iconLabelMap.fancy;
        tempIcon = perfume?.temp && perfume.temp < 3 ? iconLabelMap.cool : iconLabelMap.warm;
        gloomIcon = perfume?.gloom && perfume.gloom < .5 ? iconLabelMap.gloomy : iconLabelMap.bright;

        return <IonTabBar>
            {moodIcon}{fancinessIcon}{tempIcon}{gloomIcon}
        </IonTabBar>
    }
    return (
        <IonCard style={{ height: 380, marginBottom: 30 }}>
            <div style={{ height: (250 + (state.perfume[perfumeId]?.silage ? 0 : 30) + (state.perfume[perfumeId]?.throw ? 0 : 30)) }}>
                <IonCardHeader>
                    <IonCardSubtitle color='secondary'>{cardHeader}</IonCardSubtitle>
                    <IonToolbar style={{ marginTop: 10 }}>
                        <IonCardTitle>{state.perfume[perfumeId]?.title}</IonCardTitle>
                        <IonCardSubtitle>{state.perfume[perfumeId]?.house}</IonCardSubtitle>
                        <IonButton style={{ marginLeft: 10 }} fill='outline' color='secondary' slot='end'
                            onClick={() => {
                                dispatch({ type: "setWear", data: perfumeId });
                            }}>Wear It</IonButton>
                    </IonToolbar>
                </IonCardHeader>

                <IonCardContent>
                    <div style={{ height: 200, overflow: 'scroll' }}>
                        {perfumeNotes.length > 0 &&
                            <div className='chipHolder'>
                                {perfumeNotes.map(note => <IonChip key={"perfumeNote" + note}>
                                    <IonLabel>{note}</IonLabel>
                                </IonChip>)}
                            </div>
                        }
                        <IonText><p>{state.perfume[perfumeId]?.description}</p></IonText>
                    </div>
                </IonCardContent>
            </div>
            <IonFooter>
                <div>
                    {state.perfume[perfumeId]?.silage &&
                        <IonItem lines='none' style={{ height: 30, padding: 0, margin: 0 }}>
                            <p slot='start' style={{ fontSize: 12 }}>Silage</p>
                            <IonRange style={{ height: 10, width: "80%" }} disabled={true} value={state.perfume[perfumeId]?.silage} step={.02} min={0} max={1} />
                        </IonItem>
                    }
                    {state.perfume[perfumeId]?.throw &&
                        <IonItem lines='none' style={{ height: 30, padding: 0, margin: 0 }}>
                            <p slot='start' style={{ fontSize: 12 }}>Throw</p>
                            <IonRange style={{ height: 12, width: "80%" }} disabled={true} value={state.perfume[perfumeId]?.throw} step={.02} min={0} max={1} />
                        </IonItem>
                    }
                </div>
                <IonToolbar style={{ marginTop: 10 }}>
                    {generateIconDescriptor(state.perfume[perfumeId])}
                </IonToolbar>
            </IonFooter>
        </IonCard>
    );
};

export default RecommendationCard;
