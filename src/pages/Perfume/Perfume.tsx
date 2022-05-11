import { IonContent, IonFab, IonFabButton, IonHeader, IonIcon, IonItem, IonLabel, IonList, IonPage, IonSearchbar, IonTitle, IonToolbar } from '@ionic/react';
import { add } from 'ionicons/icons';
import { useContext, useEffect, useState } from 'react';
import AppHeader from '../../components/AppHeader';
import { AppContext } from '../../contexts/AppContext';
import './Perfume.css';

const Perfume: React.FC = () => {
  const { state } = useContext(AppContext);
  const [localPerfumes, setLocalPerfumes] = useState<any[]>()
  const [searchText, setSearchText] = useState<string>()

  useEffect(() => {
    let perfumes = Object.values(state.perfume)
    perfumes.sort((a: any, b: any) => (a.title > b.title) ? 1 : -1);
    if (searchText && searchText.length > 0) {
      let compText = searchText.toLowerCase();
      perfumes = perfumes.filter((elem: any) => {
        console.log(elem)
        if (!elem) { return false }
        let titleHas = elem?.title ? elem.title.toLowerCase().includes(compText) : false;
        let descHas = elem?.description ? elem.description.toLowerCase().includes(compText) : false;
        let houseHas = elem?.house ? elem.house.toLowerCase().includes(compText) : false;
        return (titleHas || houseHas || descHas)
      });
    }
    setLocalPerfumes(perfumes);
  }, [state.perfume, searchText])


  return (
    <IonPage>
      <AppHeader title="All Perfumes"/> 
      <IonContent fullscreen>
        <IonHeader collapse="condense">
          <IonToolbar>
            <IonTitle size="large">Perfumes</IonTitle>
          </IonToolbar>
        </IonHeader>        
        <IonSearchbar placeholder='Search by house, note, or name' value={searchText} onIonChange={e => setSearchText(e.detail.value!)}></IonSearchbar>

        <IonList>
          {localPerfumes && localPerfumes.map((p: any) => p && (
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
