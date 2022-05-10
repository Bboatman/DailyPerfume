import { IonButton, IonCard, IonCardContent, IonCardHeader, IonCardSubtitle, IonCardTitle, IonContent, IonHeader, IonIcon, IonItem, IonItemDivider, IonLabel, IonList, IonPage, IonRange, IonRow, IonTitle, IonToolbar } from '@ionic/react';
import { trashBin, sparkles, skullSharp, heart, snow, flame, thunderstorm, sunny } from 'ionicons/icons';
import { useContext, useState } from 'react';
import AppHeader from '../../components/AppHeader';
import { AppContext } from '../../contexts/AppContext';
import './Recommend.css';

const Recommend: React.FC = () => {
  const {state, dispatch} = useContext(AppContext);

  const [fanciness, setFanciness] = useState(.5)
  const [mood, setMood] = useState(.5);
  const [matchRec, setMatchRec] = useState<string>();
  const [breakRec, setBreakRec] = useState();
  
  const generateRecommendations = () => {
      let allPerfumes: any[] = Object.values(state.perfume).filter(elem => elem != undefined);
      if (state.weatherScores){
        let max = {id: undefined, score: -1};
        let min = {id: undefined, score: 2};
        let mScore = state.settings.mood ? mood : 1 - mood
        let fScore = state.settings.fanciness ? fanciness : 1 - fanciness;
        let tScore = state.settings.temp ? state.weatherScores.heatLevel : 5 - state.weatherScores.heatLevel;
        let gScore = state.settings.gloom ? state.weatherScores.gloom : 1 - state.weatherScores.gloom;
        let userState = [mScore, fScore, tScore, gScore];

        for (let perfume of allPerfumes){
          let perfumeArray = [perfume.mood, perfume.fanciness, perfume.temp, perfume.gloom]
          let cosineSimilarity = getCosineSimilarity(perfumeArray, userState);
          if (cosineSimilarity > max.score){
            max = {id: perfume.id, score: cosineSimilarity}
          }
          if (cosineSimilarity < min.score){
            min = {id: perfume.id, score: cosineSimilarity}
          }
        }
        
        setMatchRec(min.id);
        setBreakRec(max.id);
      }
  }

  const getCosineSimilarity = (A: number[],B: number[]) =>{
    var dotproduct=0;
    var mA=0;
    var mB=0;
    for(let i = 0; i < A.length; i++){ 
        dotproduct += (A[i] * B[i]);
        mA += (A[i]*A[i]);
        mB += (B[i]*B[i]);
    }
    mA = Math.sqrt(mA);
    mB = Math.sqrt(mB);
    var similarity = (dotproduct)/((mA)*(mB))
    return similarity;
}

const generateIconDescriptor = (perfume: any) => {
  let moodIcon, fancinessIcon, tempIcon, gloomIcon;
  moodIcon = perfume.mood < .5 ? skullSharp : heart;
  fancinessIcon = perfume.fanciness < .5 ? trashBin : sparkles;
  tempIcon = perfume.temp < 2.5 ? snow : flame;
  gloomIcon = perfume.gloom < .5 ? thunderstorm : sunny;

  return <IonRow style={{justifyContent: "space-around"}}>
    <IonIcon size='large' icon={moodIcon}/>
    <IonIcon size='large' icon={fancinessIcon}/>
    <IonIcon size='large' icon={tempIcon}/>
    <IonIcon size='large' icon={gloomIcon}/>
    </IonRow>
}


  return (
    <IonPage>
      <AppHeader title='Recommend Perfume'/>
      <IonContent fullscreen>
        <IonHeader collapse="condense">
          <IonToolbar>
            <IonTitle size="large">Recommend</IonTitle>
          </IonToolbar>
        </IonHeader>
        <IonList style={{marginTop: 20}}>
        <IonItem>
              <IonLabel position='fixed'>Fanciness</IonLabel>
              <IonRange value={fanciness} step={.1} min={0} max={1} onIonChange={e => setFanciness(e.detail.value.valueOf() as number)}>
                  <IonIcon icon={trashBin} slot="start"/>
                  <IonIcon icon={sparkles} slot="end"/>
              </IonRange>
        </IonItem>
        <IonItem>
              <IonLabel position='fixed'>Mood</IonLabel>
              <IonRange pin={false} value={mood} step={.1} min={0} max={1} onIonChange={e => setMood(e.detail.value as number)}>
                  <IonIcon icon={skullSharp} slot="start"/>
                  <IonIcon icon={heart} slot="end"/>
              </IonRange>
        </IonItem>
        <IonItemDivider/>
        <IonItem>
          <IonButton onClick={generateRecommendations} style={{width: "50%", marginLeft:"25%", height: "80%"}}>Recommend</IonButton>
        </IonItem>
        </IonList>
        { matchRec && state.perfume[matchRec] && 
        (<IonCard href={'/perfume/' + matchRec}>
          <IonCardHeader>
            <IonCardSubtitle>Match Recommendation</IonCardSubtitle>
            <IonCardTitle>{state.perfume[matchRec].title}</IonCardTitle>
          </IonCardHeader>

          <IonCardContent>
            {state.perfume[matchRec].description}
          </IonCardContent>
          <IonCardContent style={{width: "100%"}}>
            {generateIconDescriptor(state.perfume[matchRec])}
          </IonCardContent>
        </IonCard>)}
        
        { breakRec && state.perfume[breakRec] && 
        (<IonCard href={'/perfume/' + breakRec}>
          <IonCardHeader>
            <IonCardSubtitle>Break The Mould</IonCardSubtitle>
            <IonCardTitle>{state.perfume[breakRec].title}</IonCardTitle>
          </IonCardHeader>

          <IonCardContent>
            {state.perfume[breakRec].description}
          </IonCardContent>
          <IonCardContent style={{width: "100%"}}>
            {generateIconDescriptor(state.perfume[breakRec])}
          </IonCardContent>
        </IonCard>)}
      </IonContent>
    </IonPage>
  );
};

export default Recommend;
