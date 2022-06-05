import { IonBackButton, IonButton, IonButtons, IonContent, IonFab, IonFabButton, IonFooter, IonHeader, IonIcon, IonItem, IonItemDivider, IonLabel, IonList, IonListHeader, IonPage, IonPopover, IonTitle, IonToolbar } from '@ionic/react';
import { trashBin, close, pencil } from 'ionicons/icons';
import { useContext, useEffect, useState } from 'react';
import { RouteComponentProps } from 'react-router';
import AppHeader from '../../components/AppHeader';
import { AppContext } from '../../contexts/AppContext';
import { useHistory } from 'react-router-dom';

import './CreatePerfume.css';
import PerfumeEditForm from './PerfumeEditForm';
import PerfumeIconDisplay from '../../components/PerfumeIconDisplay';

export interface PerfumeCreateProps
    extends RouteComponentProps<{
        id?: string;
    }> { }

export interface Perfume {
    title?: string,
    house?: string,
    id: string,
    description?: string,
    fanciness?: number,
    mood?: number,
    gloom?: number,
    temp?: number,
    silage?: number,
    throw?: number,
    inBottle?: string,
    wet?: string,
    oneHour?: string,
    threeHour?: string,
    dried?: string
}

const CreatePerfume: React.FC<PerfumeCreateProps> = ({ match }) => {
    const [perfume, setPerfume] = useState<Perfume>({
        id: match.params.id ?? Math.random().toString(36).replace(/[^a-z]+/g, '').substring(0, 10)
    })
    const [shouldLeave, setShouldLeave] = useState<boolean>(false);
    const [isEditing, setIsEditing] = useState<boolean>(false)
    const [hasReview, setHasReview] = useState<boolean>(false)

    const { state, dispatch } = useContext(AppContext)
    const history = useHistory();

    useEffect(() => {
        if (state.isSaving) { return }
        if (shouldLeave) { history.goBack() }
    }, [state.isSaving, shouldLeave])

    const handlePerfumeCreation = () => {
        if (!(perfume.title && perfume.id && perfume.fanciness && perfume.mood && perfume.gloom && perfume.temp)) { return }
        dispatch({ type: "createPerfume", data: perfume })
        setIsEditing(false);
    }

    const handlePerfumeDeletion = () => {
        dispatch({ type: "deletePerfume", data: perfume.id })
        setShouldLeave(true);
    }

    useEffect(() => {
        let id = match.params.id;
        if (!id) {
            setIsEditing(true)
            return
        }
        if ((!state && Object.hasOwn(state.perfume, id)) || state.isSaving) { return }
        if (!Object.hasOwn(state.perfume, id)) {
            return
        }
        let perfume = state.perfume[id];
        setPerfume(perfume);
        return
    }, [match.params.id, state])

    useEffect(() => {
        if (perfume.silage || perfume.throw || perfume.inBottle || perfume.wet || perfume.dried || perfume.oneHour || perfume.threeHour) {
            setHasReview(true);
        }
    }, [perfume])

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
                {isEditing && <PerfumeEditForm perfume={perfume} setPerfume={setPerfume} ctx={state} />}
                {!isEditing &&
                    <IonList>
                        <IonItem>
                            <IonLabel position="stacked">Title</IonLabel>
                            <p>{perfume.title}</p>
                        </IonItem>
                        <IonItem>
                            <IonLabel position="stacked">House</IonLabel>
                            <p>{perfume.house}</p>
                        </IonItem>
                        <IonItem>
                            <IonLabel position="stacked">Description</IonLabel>
                            <p>{perfume.description}</p>
                        </IonItem>
                        <div style={{ width: "100%", display: "flex", justifyContent: "space-around", marginTop: 20 }}>
                            {PerfumeIconDisplay(perfume, "large")}
                        </div>

                        {hasReview && <IonItemDivider />}
                        {hasReview && <IonListHeader>Review Notes</IonListHeader>}
                        {perfume.silage && <IonItem>
                            <IonLabel position="stacked">Silage</IonLabel>
                            <p>{perfume.title}</p>
                        </IonItem>}
                        {perfume.throw && <IonItem>
                            <IonLabel position="stacked">Throw</IonLabel>
                            <p>{perfume.throw}</p>
                        </IonItem>}
                        {perfume.inBottle && <IonItem>
                            <IonLabel position="stacked">In The Bottle</IonLabel>
                            <p>{perfume.inBottle}</p>
                        </IonItem>}
                        {perfume.wet && <IonItem>
                            <IonLabel position="stacked">Wet</IonLabel>
                            <p>{perfume.wet}</p>
                        </IonItem>}
                        {perfume.dried && <IonItem>
                            <IonLabel position="stacked">Dried Down</IonLabel>
                            <p>{perfume.dried}</p>
                        </IonItem>}
                        {perfume.oneHour && <IonItem>
                            <IonLabel position="stacked">One Hour Wear</IonLabel>
                            <p>{perfume.oneHour}</p>
                        </IonItem>}
                        {perfume.threeHour && <IonItem>
                            <IonLabel position="stacked">Three Hour Wear</IonLabel>
                            <p>{perfume.threeHour}</p>
                        </IonItem>}
                    </IonList>
                }
                <IonFab vertical="bottom" horizontal="end" slot="fixed">
                    <IonFabButton onClick={() => setIsEditing(!isEditing)}>
                        <IonIcon icon={isEditing ? close : pencil} />
                    </IonFabButton>
                </IonFab>
            </IonContent>
            {isEditing &&
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
