import './ExploreContainer.css';
import { IonCard, IonCardContent, IonCardTitle, IonText } from '@ionic/react';
import { useContext } from 'react'
import { AppContext } from '../contexts/AppContext';

interface ContainerProps {
  name: string;
}

const ExploreContainer: React.FC<ContainerProps> = ({ name }) => {
  const {state} = useContext(AppContext)
  return (
    <div className="container" >
      <IonCard style={{paddingTop: 20, paddingBottom: 10}}>
      <IonCardTitle>
      <strong>Your Location</strong></IonCardTitle>
      <IonCardContent>
        <p>City: {state?.cityName}</p>
        <p>Latitude: {state?.location?.latitude}</p>
        <p>Longitude: {state?.location?.longitude}</p>
      </IonCardContent>
      <IonCardContent>
      <IonText>It is: {state?.weatherScores?.temp}</IonText></IonCardContent>
      <IonCardContent>
      <IonText>Gloom Level: {Math.floor(state?.weatherScores?.gloom * 100)}%</IonText></IonCardContent>
      </IonCard>
    </div>
  );
};

export default ExploreContainer;
