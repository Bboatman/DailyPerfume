import './ExploreContainer.css';
import { IonCard, IonCardContent, IonCardHeader, IonCardSubtitle, IonCardTitle, IonFooter, IonIcon, IonLabel, IonTabBar, IonTabButton, IonToolbar } from '@ionic/react';
import { useContext } from 'react'
import { AppContext } from '../contexts/AppContext';
import { skullSharp, heart, trashBin, sparkles, snow, flame, thunderstorm, sunny } from 'ionicons/icons';

interface ContainerProps {
    perfumeId: string,
    cardHeader: string
}

const RecommendationCard: React.FC<ContainerProps> = ({ perfumeId, cardHeader }) => {
    const { state } = useContext(AppContext);
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
        <IonCard style={{ height: 400 }}>
            <IonCardHeader>
                <IonCardSubtitle color='secondary'>{cardHeader}</IonCardSubtitle>
                <IonCardTitle>{state.perfume[perfumeId].title}</IonCardTitle>
                <IonCardSubtitle>{state.perfume[perfumeId].house}</IonCardSubtitle>
            </IonCardHeader>

            <IonCardContent style={{ height: "60%" }}>
                {state.perfume[perfumeId].description}
            </IonCardContent>
            <IonFooter>
                <IonToolbar>
                    {generateIconDescriptor(state.perfume[perfumeId])}
                </IonToolbar>
            </IonFooter>
        </IonCard>
    );
};

export default RecommendationCard;
