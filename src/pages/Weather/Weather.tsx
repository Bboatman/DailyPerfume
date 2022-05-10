import { IonContent, IonHeader, IonPage, IonTitle, IonToolbar } from '@ionic/react';
import AppHeader from '../../components/AppHeader';
import ExploreContainer from '../../components/ExploreContainer';
import './Weather.css';

const Tab1: React.FC = () => {
  return (
    <IonPage>
      <AppHeader title='Weather Synopsis'/>
      <IonContent fullscreen>
        <IonHeader collapse="condense">
          <IonToolbar>
            <IonTitle size="large">Weather</IonTitle>
          </IonToolbar>
        </IonHeader>
        <ExploreContainer name="Weather Synopsis page" />
      </IonContent>
    </IonPage>
  );
};

export default Tab1;
