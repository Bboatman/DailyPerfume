import {
  IonButton,
  IonContent,
  IonFab,
  IonFabButton,
  IonHeader,
  IonIcon,
  IonItem,
  IonItemGroup,
  IonLabel,
  IonList,
  IonPage,
  IonSearchbar,
  IonSelect,
  IonSelectOption,
  IonTitle,
  IonToolbar
} from '@ionic/react';
import { add, chevronDownOutline, chevronUpOutline } from 'ionicons/icons';
import { useContext, useEffect, useState } from 'react';
import AppHeader from '../../components/AppHeader';
import PerfumeIconDisplay from '../../components/PerfumeIconDisplay';
import { AppContext } from '../../contexts/AppContext';
import './Perfume.css';

const Perfume: React.FC = () => {
  const { state } = useContext(AppContext);
  const [localPerfumes, setLocalPerfumes] = useState<any[]>()
  const [searchText, setSearchText] = useState<string>()
  const [sortVal, setSort] = useState("title");
  const [direction, setDirection] = useState<boolean>(true);

  useEffect(() => {
    let perfumes = Object.values(state.perfume)
    perfumes.sort(comparatorFx);
    if (searchText && searchText.length > 0) {
      let compText = searchText.toLowerCase();
      perfumes = perfumes.filter((elem: any) => {
        if (!elem) { return false }
        let titleHas = elem?.title ? elem.title.toLowerCase().includes(compText) : false;
        let descHas = elem?.description ? elem.description.toLowerCase().includes(compText) : false;
        let houseHas = elem?.house ? elem.house.toLowerCase().includes(compText) : false;
        return (titleHas || houseHas || descHas)
      });
    }
    setLocalPerfumes(perfumes);
  }, [state.perfume, searchText, sortVal, direction])

  function comparatorFx(a: any, b: any) {
    if (direction) {
      return a[sortVal] > b[sortVal] ? 1 : -1
    } else {
      return a[sortVal] < b[sortVal] ? 1 : -1
    }
  }


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
          <IonItemGroup key={"searchGroup"}>
            <IonSearchbar placeholder='Search by house, note, or name' value={searchText} onIonChange={e => setSearchText(e.detail.value!)}></IonSearchbar>
            <IonItem key="sortField">
              <IonLabel>Sort By</IonLabel>
              <IonSelect
                key="sortType"
                interface="alert"
                multiple={false}
                placeholder="Sort by"
                onIonChange={e => setSort(e.detail.value)}
                value={sortVal}
              >
                <IonSelectOption key={"titleSelect"} value="title">Name</IonSelectOption>
                <IonSelectOption key={"houseSelect"} value="house">House</IonSelectOption>
                <IonSelectOption key={"tempSelect"} value="temp">Temperature</IonSelectOption>
                <IonSelectOption key={"gloomSelect"} value="gloom">Gloom</IonSelectOption>
                <IonSelectOption key={"fancinessSelect"} value="fanciness">Fanciness</IonSelectOption>
                <IonSelectOption key={"moodSelect"} value="mood">Mood</IonSelectOption>
              </IonSelect>
              <IonButton fill='clear' onClick={() => setDirection(!direction)}>
                {direction ?
                  <IonIcon slot="icon-only" icon={chevronDownOutline} /> :
                  <IonIcon slot="icon-only" icon={chevronUpOutline} />}
              </IonButton>
            </IonItem>

          </IonItemGroup>
          <IonItemGroup key="perfumeGroup">
            {localPerfumes && localPerfumes.map((p: any) => p && (
              <IonItem key={p.id} href={'perfume/' + p.id}>
                <IonLabel>
                  <h2>{p?.title}</h2>
                  <h3>{p?.house}</h3>
                </IonLabel>
                {PerfumeIconDisplay(state.perfume[p.id], "small").map((ico: any, index: number) => (<div key={index} style={{ margin: 5 }} slot='end'>{ico}</div>))}
              </IonItem>)
            )}
          </IonItemGroup>
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
