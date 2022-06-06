import { IonBackButton, IonButton, IonButtons, IonChip, IonContent, IonFab, IonFabButton, IonFooter, IonHeader, IonIcon, IonItem, IonItemDivider, IonLabel, IonList, IonListHeader, IonNote, IonPage, IonPopover, IonRange, IonSpinner, IonTitle, IonToolbar } from '@ionic/react';
import { trashBin, close, pencilSharp } from 'ionicons/icons';
import { useContext, useEffect, useState } from 'react';
import { RouteComponentProps } from 'react-router';
import AppHeader from '../../components/AppHeader';
import { AppContext, Perfume } from '../../contexts/AppContext';
import { useHistory } from 'react-router-dom';

import './CreatePerfume.css';
import PerfumeEditForm from './PerfumeEditForm';
import PerfumeIconDisplay from '../../components/PerfumeIconDisplay';
import noteMasterList, { NoteRanking } from '../../contexts/NoteData';

export interface PerfumeCreateProps
    extends RouteComponentProps<{
        id?: string;
    }> { }


const CreatePerfume: React.FC<PerfumeCreateProps> = ({ match }) => {
    const [perfume, setPerfume] = useState<Perfume>({
        id: match.params.id ?? Math.random().toString(36).replace(/[^a-z]+/g, '').substring(0, 15),
        gloom: .5,
        temp: 3,
        fanciness: .5,
        mood: .5
    })
    const [shouldLeave, setShouldLeave] = useState<boolean>(false);
    const [isEditing, setIsEditing] = useState<boolean>(true)
    const [hasReview, setHasReview] = useState<boolean>(false)

    const { state, dispatch } = useContext(AppContext)
    const history = useHistory();

    useEffect(() => {
        if (state.isSaving) { return }
        if (shouldLeave) { history.goBack() }
    }, [state.isSaving, shouldLeave])

    const handlePerfumeCreation = () => {
        if (!(
            perfume?.title && perfume?.id &&
            ((perfume?.fanciness && perfume?.mood && perfume?.gloom && perfume?.temp) || (perfume?.notes && perfume?.notes.length > 0)))) {
            return
        }
        let p = { ...perfume };
        if (perfume?.notes && perfume?.notes.length > 0) {
            let relevantNotes: any[] = perfume?.notes.map((elem: string) => {
                return noteMasterList.find((note: NoteRanking) => note.label == elem && note.category === "perfume");
            }).filter(elem => elem !== undefined);
            p.fanciness = relevantNotes.map((elem: NoteRanking) => { return elem.fanciness }).reduce((a, b) => a + b) / relevantNotes.length;
            p.gloom = relevantNotes.map((elem: NoteRanking) => { return elem.gloom }).reduce((a, b) => a + b) / relevantNotes.length;
            p.mood = relevantNotes.map((elem: NoteRanking) => { return elem.mood }).reduce((a, b) => a + b) / relevantNotes.length;
            let rawTemp = relevantNotes.map((elem: NoteRanking) => { return elem.temp }).reduce((a, b) => a + b) / relevantNotes.length;
            p.temp = rawTemp * 6;
        }
        dispatch({ type: "createPerfume", data: p })
        setIsEditing(false);
    }

    const handlePerfumeDeletion = () => {
        setShouldLeave(true)
        dispatch({ type: "deletePerfume", data: perfume?.id })
    }

    useEffect(() => {
        let id = match.params.id;
        if (perfume) {
            id = perfume?.id
        }
        if ((!id || (id && !Object.hasOwn(state.perfume, id)))) {
            return
        } else {
            setIsEditing(false)
        }
        let p = state.perfume[id];
        setPerfume(p);
        return
    }, [match.params.id, state.perfume])

    useEffect(() => {
        if (perfume?.silage || perfume?.throw || perfume?.inBottle || perfume?.wet || perfume?.dried || perfume?.oneHour || perfume?.threeHour) {
            setHasReview(true);
        }
    }, [perfume])

    useEffect(() => {
        let id = match.params.id;
        if (perfume) {
            id = perfume?.id;
        }
        if (!id || !state?.perfume || isEditing) {
            return;
        }
        if (!isEditing && state.perfume && Object.hasOwn(state.perfume, id)) {
            setPerfume(state.perfume[id]);
        }
    }, [isEditing])

    return (
        <IonPage>
            <IonHeader>
                <AppHeader title='Create Perfumes'>
                    <IonButtons slot="start">
                        <IonBackButton color='tertiary' defaultHref="/perfume" />
                    </IonButtons>
                    <IonTitle color='dark'>Create Perfumes</IonTitle>
                    <IonButtons slot='end'>
                        <IonButton fill="clear" color='danger' onClick={handlePerfumeDeletion}>
                            <IonIcon icon={trashBin} />
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
                {shouldLeave && <div style={{ height: "100%", width: "100%", display: "flex", justifyContent: "center", alignItems: "center" }}>
                    <IonSpinner name="crescent" style={{ height: 70, width: 70 }} color='primary'></IonSpinner>
                </div>}
                {isEditing && !shouldLeave && <PerfumeEditForm perfume={perfume} setPerfume={setPerfume} ctx={state} />}
                {!isEditing && !shouldLeave &&
                    <IonList>
                        <IonItem>
                            <IonLabel position="stacked">Title</IonLabel>
                            <p>{perfume?.title}</p>
                        </IonItem>
                        <IonItem>
                            <IonLabel position="stacked">House</IonLabel>
                            <p>{perfume?.house}</p>
                        </IonItem>
                        <IonItem>
                            <IonLabel position="stacked">Description</IonLabel>
                            <p>{perfume?.description}</p>
                        </IonItem>
                        {perfume?.notes &&
                            <div className='chipHolder' >
                                {noteMasterList.filter((elem: NoteRanking) => {
                                    return elem.category === "perfume"
                                }).filter(elem => perfume?.notes?.includes(elem.label)).map((elem: NoteRanking) => {
                                    return (<IonChip key={elem.label}>
                                        <IonLabel>{elem.label}</IonLabel>
                                    </IonChip>)
                                })}
                            </div>
                        }
                        <div style={{ width: "100%", display: "flex", justifyContent: "space-around", marginTop: 20, marginBottom: 20 }}>
                            {PerfumeIconDisplay(perfume, "large")}
                        </div>
                        {hasReview && <IonListHeader color='light'>Review Notes</IonListHeader>}
                        {perfume?.silage && <IonItem>
                            <IonNote style={{ fontSize: 14, paddingTop: 15 }}>Silage</IonNote>
                            <IonRange disabled={true} value={perfume?.silage} step={.02} min={0} max={1} />
                        </IonItem>}
                        {perfume?.throw && <IonItem>
                            <IonNote style={{ fontSize: 14, paddingTop: 15 }}>Throw</IonNote>
                            <IonRange disabled={true} value={perfume?.throw} step={.02} min={0} max={1} />
                        </IonItem>} 
                        {perfume?.inBottle && <IonItem>
                            <IonLabel position="stacked">In The Bottle</IonLabel>
                            <p>{perfume?.inBottle}</p>
                        </IonItem>}
                        {perfume?.wet && <IonItem>
                            <IonLabel position="stacked">Wet</IonLabel>
                            <p>{perfume?.wet}</p>
                        </IonItem>}
                        {perfume?.dried && <IonItem>
                            <IonLabel position="stacked">Dried Down</IonLabel>
                            <p>{perfume?.dried}</p>
                        </IonItem>}
                        {perfume?.oneHour && <IonItem>
                            <IonLabel position="stacked">One Hour Wear</IonLabel>
                            <p>{perfume?.oneHour}</p>
                        </IonItem>}
                        {perfume?.threeHour && <IonItem>
                            <IonLabel position="stacked">Three Hour Wear</IonLabel>
                            <p>{perfume?.threeHour}</p>
                        </IonItem>}
                    </IonList>
                }
                <IonFab vertical="bottom" horizontal="end" slot="fixed">
                    <IonFabButton onClick={() => setIsEditing(!isEditing)}>
                        <IonIcon size='small' icon={isEditing ? close : pencilSharp} />
                    </IonFabButton>
                </IonFab>
            </IonContent>
            {isEditing && !shouldLeave && 
                <IonFooter collapse="fade">
                    <IonToolbar>
                        <IonButton onClick={handlePerfumeCreation} fill='solid' color="primary" style={{ width: "95%", marginLeft: "2.5%" }}>Save Changes</IonButton>
                    </IonToolbar>
                </IonFooter>
            }
        </IonPage>
    );
};

export default CreatePerfume;
