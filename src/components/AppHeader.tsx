
import { IonHeader } from '@ionic/react';
import SettingsToolbar from './SettingsToolbar';

const AppHeader: React.FC<{title: string}> = (props, backlink) => {
  return (
      <IonHeader style={{verticalPadding: 20, horizontalPadding: 10}}>
          {props.children && (<div style={{display: "flex", width: "100%"}}>{props.children}</div>)}
          {!props.children && (<SettingsToolbar>{props.title}</SettingsToolbar>)}
      </IonHeader> 
  );
};

export default AppHeader;
