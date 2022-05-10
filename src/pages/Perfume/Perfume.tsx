import { IonContent, IonFab, IonFabButton, IonHeader, IonIcon, IonItem, IonLabel, IonList, IonPage, IonTitle, IonToolbar } from '@ionic/react';
import { add } from 'ionicons/icons';
import { useContext } from 'react';
import AppHeader from '../../components/AppHeader';
import { AppContext } from '../../contexts/AppContext';
import './Perfume.css';

const Perfume: React.FC = () => {
  const { state } = useContext(AppContext);

  return (
    <IonPage>
      <AppHeader title="All Perfumes"/> 
      <IonContent fullscreen>
        <IonHeader collapse="condense">
          <IonToolbar>
            <IonTitle size="large">Perfumes</IonTitle>
          </IonToolbar>
        </IonHeader>
        <IonList>
          {Object.values(state.perfume).map((p: any) => p && (
            <IonItem key={p.id} href={'perfume/' + p.id}>
              <IonLabel>{p?.title}</IonLabel>
            </IonItem>)
          )}
        </IonList>
        <IonFab vertical="bottom" horizontal="end" slot="fixed">
          <IonFabButton href='/create'>
            <IonIcon icon={add} />
          </IonFabButton>
        </IonFab>
      </IonContent>
    </IonPage>
  );
};

export default Perfume;
