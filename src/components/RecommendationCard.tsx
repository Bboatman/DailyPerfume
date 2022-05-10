import './ExploreContainer.css';
import { IonCard, IonCardContent, IonCardHeader, IonCardSubtitle, IonCardTitle, IonIcon, IonRow } from '@ionic/react';
import { useContext } from 'react'
import { AppContext } from '../contexts/AppContext';
import { skullSharp, heart, trashBin, sparkles, snow, flame, thunderstorm, sunny } from 'ionicons/icons';

interface ContainerProps {
    perfumeId: string,
    cardHeader: string
}

const RecommendationCard: React.FC<ContainerProps> = ({ perfumeId, cardHeader }) => {
    const { state } = useContext(AppContext);

    const generateIconDescriptor = (perfume: any) => {
        let moodIcon, fancinessIcon, tempIcon, gloomIcon;
        moodIcon = perfume.mood < .5 ? skullSharp : heart;
        fancinessIcon = perfume.fanciness < .5 ? trashBin : sparkles;
        tempIcon = perfume.temp < 2.5 ? snow : flame;
        gloomIcon = perfume.gloom < .5 ? thunderstorm : sunny;

        return <IonRow style={{ justifyContent: "space-around" }}>
            <IonIcon size='large' icon={moodIcon} />
            <IonIcon size='large' icon={fancinessIcon} />
            <IonIcon size='large' icon={tempIcon} />
            <IonIcon size='large' icon={gloomIcon} />
        </IonRow>
    }
    return (
        <IonCard style={{ height: 220 }}>
            <IonCardHeader>
                <IonCardSubtitle>{cardHeader}</IonCardSubtitle>
                <IonCardTitle>{state.perfume[perfumeId].title}</IonCardTitle>
                <IonCardSubtitle>{state.perfume[perfumeId].house}</IonCardSubtitle>
            </IonCardHeader>

            <IonCardContent>
                {state.perfume[perfumeId].description}
            </IonCardContent>
            <IonCardContent style={{ width: "100%" }}>
                {generateIconDescriptor(state.perfume[perfumeId])}
            </IonCardContent>
        </IonCard>
    );
};

export default RecommendationCard;
