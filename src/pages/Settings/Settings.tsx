import { IonBackButton, IonButtons, IonContent, IonHeader, IonItem, IonLabel, IonList, IonListHeader, IonPage, IonTitle, IonToggle, IonToolbar } from '@ionic/react';
import { useContext, useState } from 'react';
import AppHeader from '../../components/AppHeader';
import { AppContext } from '../../contexts/AppContext';
import './Settings.css';

const Settings: React.FC = (params: any) => {
  const {state, dispatch} = useContext(AppContext)
  
  return (
    <IonPage>
      <IonHeader>
        <AppHeader title='Settings'>
          <IonButtons slot="start">
              <IonBackButton defaultHref="/" />
          </IonButtons>
          <IonTitle>Settings</IonTitle>
        </AppHeader>
      </IonHeader>
      <IonContent fullscreen>
        <IonHeader collapse="condense">
          <IonToolbar>
            <IonTitle size="large">Settings</IonTitle>
          </IonToolbar>
        </IonHeader>
        <IonList>
          <IonListHeader>Ranking Metrics</IonListHeader>
          <IonListHeader>Inverted metrics find opposites to be good match (i.e. hot weather and cold smells)</IonListHeader>
          <IonItem>
            <IonLabel>Temperature {!state.settings.temp && (<p>inverted</p>)}</IonLabel>
            <IonToggle checked={state.settings.temp} onIonChange={e => {
              if(dispatch){
                dispatch({type: "setSetting", data: {value: e.detail.checked, type: "temp"}});
              }
            }} />
          </IonItem>
          <IonItem>
            <IonLabel>Gloom {!state.settings.gloom && (<p>inverted</p>)}</IonLabel>
            <IonToggle checked={state.settings.gloom} onIonChange={e => {
              if(dispatch){
                dispatch({type: "setSetting", data: {value: e.detail.checked, type: "gloom"}});
            }}} />
          </IonItem>
          <IonItem>
            <IonLabel>Mood {!state.settings.mood && (<p>inverted</p>)}</IonLabel>
            <IonToggle checked={state.settings.mood} onIonChange={e => {
              if(dispatch){
                dispatch({type: "setSetting", data: {value: e.detail.checked, type: "mood"}});
              }}} />
          </IonItem>
          <IonItem>
            <IonLabel>Fanciness {!state.settings.fanciness && (<p>inverted</p>)}</IonLabel>
            <IonToggle checked={state.settings.fanciness} onIonChange={e => {
              if(dispatch){
                dispatch({type: "setSetting", data: {value: e.detail.checked, type: "fanciness"}});
              }}} />
          </IonItem>
        </IonList>
      </IonContent>
    </IonPage>
  );
};

export default Settings;
