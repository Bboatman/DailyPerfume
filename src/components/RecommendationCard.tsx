import { IonButton, IonCard, IonCardContent, IonCardHeader, IonCardSubtitle, IonCardTitle, IonFooter, IonIcon, IonLabel, IonTabBar, IonTabButton, IonText, IonToolbar } from '@ionic/react';
import { useContext } from 'react'
import { AppContext } from '../contexts/AppContext';
import { skullSharp, heart, trashBin, sparkles, snow, flame, thunderstorm, sunny } from 'ionicons/icons';

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

    const generateIconDescriptor = (perfume: any) => {
        let moodIcon, fancinessIcon, tempIcon, gloomIcon;
        moodIcon = perfume.mood < .5 ? iconLabelMap.sad : iconLabelMap.happy;
        fancinessIcon = perfume.fanciness < .5 ? iconLabelMap.trashy : iconLabelMap.fancy;
        tempIcon = perfume.temp < 2.5 ? iconLabelMap.cool : iconLabelMap.warm;
        gloomIcon = perfume.gloom < .5 ? iconLabelMap.gloomy : iconLabelMap.bright;

        return <IonTabBar>
            {moodIcon}{fancinessIcon}{tempIcon}{gloomIcon}
        </IonTabBar>
    }
    return (
        <IonCard style={{ height: 380, marginBottom: 50 }}>
            <div style={{ height: 310 }}>
                <IonCardHeader>
                    <IonCardSubtitle color='secondary'>{cardHeader}</IonCardSubtitle>
                    <IonToolbar style={{ marginTop: 10 }}>
                        <IonCardTitle>{state.perfume[perfumeId].title}</IonCardTitle>
                        <IonCardSubtitle>{state.perfume[perfumeId].house}</IonCardSubtitle>
                        <IonButton style={{ marginLeft: 10 }} fill='outline' color='secondary' slot='end'
                            onClick={() => {
                                console.log(perfumeId)
                                dispatch({ type: "setWear", data: perfumeId });
                            }}>Wear It</IonButton>
                    </IonToolbar>
                </IonCardHeader>

                <IonCardContent>
                    <div style={{ height: 200, overflow: 'scroll' }}>
                        <IonText><p>{state.perfume[perfumeId].description}</p></IonText>
                        <br />
                        {state.perfume[perfumeId].silage &&
                            <IonText>
                                <p>Silage: {state.perfume[perfumeId].silage}</p>
                            </IonText>
                        }
                        {state.perfume[perfumeId].throw &&
                            <IonText>
                                <p>Throw: {state.perfume[perfumeId].throw}</p>
                            </IonText>
                        }
                    </div>
                </IonCardContent>
            </div>
            <IonFooter>
                <IonToolbar style={{ marginTop: 10 }}>
                    {generateIconDescriptor(state.perfume[perfumeId])}
                </IonToolbar>
            </IonFooter>
        </IonCard>
    );
};

export default RecommendationCard;
