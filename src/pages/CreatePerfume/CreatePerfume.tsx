import { IonBackButton, IonButton, IonButtons, IonContent, IonHeader, IonIcon, IonInput, IonItem, IonItemDivider, IonLabel, IonPage, IonRange, IonTextarea, IonTitle, IonToolbar } from '@ionic/react';
import { flame, heart, save, skullSharp, snow, sparkles, sunny, thunderstorm, trashBin } from 'ionicons/icons';
import { useContext, useEffect, useState } from 'react';
import { RouteComponentProps } from 'react-router';
import AppHeader from '../../components/AppHeader';
import { AppContext } from '../../contexts/AppContext';
import { useHistory } from 'react-router-dom';

import './CreatePerfume.css';

interface PerfumeCreateProps
  extends RouteComponentProps<{
    id?: string;
  }> {}

const CreatePerfume: React.FC<PerfumeCreateProps> = ({ match }) => {
    const [title, setTitle] = useState<string>()
    const [house, setHouse] = useState<string>()
    const [id, setId] = useState<string>(match.params.id ?? Math.random().toString(36).replace(/[^a-z]+/g, '').substring(0, 10))
    const [description, setDescription] = useState<string>()
    const [fanciness, setFanciness] = useState<number>(.5)
    const [mood, setMood] = useState<number>(.5)
    const [gloom, setGloom] = useState<number>(.5)
    const [temp, setTemp] = useState<number>(2.5)
    
    const {state, dispatch} = useContext(AppContext)
    const history = useHistory();
    
    useEffect(() => {
        if(!state && Object.hasOwn(state.perfume, id)){ return }
        let perfume = state.perfume[id];
        console.log()
        if (!perfume) { return }
        setTitle(perfume.title);
        setHouse(perfume.house);
        setDescription(perfume.description);
        setFanciness(perfume.fanciness);
        setMood(perfume.mood);
        setGloom(perfume.gloom);
        setTemp(perfume.temp);
        return
    },[id, state])

    const handlePerfumeCreation = () => {
        console.log(fanciness, mood, gloom, temp)
        if (!(title && id && fanciness && mood && gloom && temp)) { return }
        let ret = {
            title, id, description, fanciness, mood, gloom, temp, house
        }
        dispatch({type: "createPerfume", data: ret})
        history.goBack();
    }

    const handlePerfumeDeletion = () => {
        dispatch({type: "deletePerfume", data: id})
        history.goBack();
    }

    const roundNumber = (number: number) => {
        return Math.round((number + Number.EPSILON) * 100) / 100
    }

    return (
        <IonPage>
        <IonHeader>
            <AppHeader title='Create Perfumes'>
                <IonButtons slot="start">
                    <IonBackButton defaultHref="/perfume" />
                </IonButtons>
                <IonTitle>Create Perfumes</IonTitle>
                <IonButtons slot='end'>
                    <IonButton fill="clear" onClick={handlePerfumeCreation}>
                        <IonIcon icon={save}/>
                    </IonButton>
                    <IonButton fill="clear" color='danger' onClick={handlePerfumeDeletion}>
                        <IonIcon icon={trashBin}/>
                    </IonButton>
                </IonButtons>
            </AppHeader>
        </IonHeader>
        <IonContent fullscreen>
            <IonHeader collapse="condense">
            <IonToolbar>
                <IonTitle size="large">Create</IonTitle>
            </IonToolbar>
            </IonHeader>
            
          <IonItem>
            <IonLabel position="floating">Perfume Name</IonLabel>
            <IonInput 
                value={title}
                inputMode={"text"} 
                onIonChange={e => setTitle(e.detail.value!)}>  
            </IonInput>
          </IonItem>
          <IonItem>
                    <IonLabel position="floating">Perfume House</IonLabel>
                    <IonInput
                        value={house}
                        inputMode={"text"}
                        onIonChange={e => setHouse(e.detail.value!)}>
                    </IonInput>
                </IonItem>
                <IonItem>
            <IonLabel position="floating">Description</IonLabel>
            <IonTextarea
                autoGrow={true}
                inputMode={"text"}
                value={description} onIonChange={e => setDescription(e.detail.value!)}>
            </IonTextarea>
          </IonItem>
          <IonItemDivider/>
          <IonItem>
                <IonLabel position='fixed'>Temperature</IonLabel>
                    <IonRange value={temp} step={.1} min={1} max={5}
                        onIonChange={e =>
                            setTemp(roundNumber(e.detail.value.valueOf() as number))
                        }>
                    <IonIcon icon={snow} slot="start"/>
                    <IonIcon icon={flame} slot="end"/>
                </IonRange>
          </IonItem>
          
          <IonItem>
                <IonLabel position='fixed'>Gloom</IonLabel>
                    <IonRange value={gloom} step={.02} min={0} max={1}
                        onIonChange={e =>
                            setGloom(roundNumber(e.detail.value.valueOf() as number))
                        }>
                    <IonIcon icon={thunderstorm} slot="start"/>
                    <IonIcon icon={sunny} slot="end"/>
                </IonRange>
          </IonItem>
          <IonItem>
                <IonLabel position='fixed'>Fanciness</IonLabel>
                    <IonRange value={fanciness} step={.02} min={0} max={1}
                        onIonChange={e =>
                            setFanciness(roundNumber(e.detail.value.valueOf() as number))
                        }>
                    <IonIcon icon={trashBin} slot="start"/>
                    <IonIcon icon={sparkles} slot="end"/>
                </IonRange>
          </IonItem>
          <IonItem>
                <IonLabel position='fixed'>Mood</IonLabel>
                    <IonRange pin={false} value={mood} step={.02} min={0} max={1}
                        onIonChange={e =>
                            setMood(roundNumber(e.detail.value.valueOf() as number))
                        }>
                    <IonIcon icon={skullSharp} slot="start"/>
                    <IonIcon icon={heart} slot="end"/>
                </IonRange>
          </IonItem>
        </IonContent>
        </IonPage>
    );
};

export default CreatePerfume;
