import { IonButton, IonButtons, IonIcon, IonTitle, IonToolbar } from '@ionic/react';
import { settings } from 'ionicons/icons';

const SettingsToolbar: React.FC = (props) => {
  return (
        <IonToolbar>
          <IonTitle>{props.children}</IonTitle>
          <IonButtons slot='end'>
                    <IonButton fill="clear" href='/settings'>
                        <IonIcon icon={settings}/>
                    </IonButton>
                </IonButtons>
        </IonToolbar>
  );
};

export default SettingsToolbar;
