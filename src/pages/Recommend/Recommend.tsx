import { IonCard, IonCardContent, IonCardHeader, IonContent, IonHeader, IonIcon, IonItem, IonLabel, IonList, IonPage, IonRange, IonTitle, IonToolbar } from '@ionic/react';
import { trashBin, sparkles, skullSharp, heart } from 'ionicons/icons';
import { useContext, useEffect, useState } from 'react';
import AppHeader from '../../components/AppHeader';
import RecommendationCard from '../../components/RecommendationCard';
import { AppContext } from '../../contexts/AppContext';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/pagination';
import './Recommend.css'
import { Pagination } from "swiper";
import { Perfume } from '../CreatePerfume/CreatePerfume';

const Recommend: React.FC = () => {
  const ctx = useContext(AppContext);
  const { state, doWeatherCheck } = ctx;
  const [fanciness, setFanciness] = useState(.5)
  const [mood, setMood] = useState(.5);
  const [matchRec, setMatchRec] = useState<any>();

  useEffect(() => {
    if (!state || !state.perfume || doWeatherCheck === undefined || Object.values(state.perfume).length === 0) {
      return
    }
    getRecommendations();
  }, [state.perfume, fanciness, mood, state.lastLocLookup, doWeatherCheck, state.weatherScores])

  const getRecommendations = async () => {
    if (doWeatherCheck === undefined) { return }
    await doWeatherCheck();
    generateRecommendations();
  }

  const generateRecommendations = () => {
    let allPerfumes: any[] = Object.values(state.perfume).filter((elem: any) => { return (elem !== undefined && !state.lastWorn?.includes(elem?.id) && !elem.isEmpty) });
    if (state.weatherScores) {
        let mScore = state.settings.mood ? mood : 1 - mood
        let fScore = state.settings.fanciness ? fanciness : 1 - fanciness;
        let tScore = state.settings.temp ? state.weatherScores.heatLevel : 5 - state.weatherScores.heatLevel;
        let gScore = state.settings.gloom ? state.weatherScores.gloom : 1 - state.weatherScores.gloom;
        let userState = [mScore, fScore, tScore, gScore];

      const scoreArr = []
        for (let perfume of allPerfumes){
          let perfumeArray = [perfume.mood, perfume.fanciness, perfume.temp, perfume.gloom]
          let cosineSimilarity = getCosineSimilarity(perfumeArray, userState);
          scoreArr.push({ score: cosineSimilarity, id: perfume.id })
        }
        
      scoreArr.sort((a, b) => (a.score < b.score) ? 1 : -1)
      let arrLen = scoreArr.length;
      let matchRec = {
        match: scoreArr[0].id,
        break: scoreArr[arrLen - 1].id,
        mid: scoreArr[Math.floor(arrLen / 2)].id
      }
      setMatchRec(matchRec);
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


  return (
    <IonPage>
      <AppHeader title='Recommend Perfume'/>
      <IonContent fullscreen>
        <IonHeader collapse="condense">
          <IonToolbar>
            <IonTitle size="large">Recommend</IonTitle>
          </IonToolbar>
        </IonHeader>
        <IonList style={{ marginTop: 30 }}>
        <IonItem>
              <IonLabel position='fixed'>Fanciness</IonLabel>
            <IonRange color='secondary' value={fanciness} step={.1} min={0} max={1} onIonChange={e => setFanciness(e.detail.value.valueOf() as number)}>
              <IonIcon color="tertiary" icon={trashBin} slot="start" />
              <IonIcon color="tertiary" icon={sparkles} slot="end" />
              </IonRange>
        </IonItem>
        <IonItem>
              <IonLabel position='fixed'>Mood</IonLabel>
            <IonRange color='secondary' pin={false} value={mood} step={.1} min={0} max={1} onIonChange={e => setMood(e.detail.value as number)}>
              <IonIcon color="tertiary" icon={skullSharp} slot="start" />
              <IonIcon color="tertiary" icon={heart} slot="end" />
              </IonRange>
          </IonItem>
        </IonList>
        {Object.values(state?.perfume).length === 0 && (
          <IonCard href='/create'>
            <IonCardHeader>You have no perfumes!</IonCardHeader>
            <IonCardContent>Press here to start adding some</IonCardContent>
          </IonCard>
        )}
        {matchRec && 
          <Swiper
            spaceBetween={1}
            slidesPerView={1}
            loop={true}
            modules={[Pagination]}
            pagination={true}
          >
            {matchRec.match && state.perfume[matchRec.match] &&
              (<SwiperSlide>
              <RecommendationCard perfumeId={matchRec.match} cardHeader="Match Recommendation" />
              </SwiperSlide>)}
            {matchRec.break && state.perfume[matchRec.break] &&
              (<SwiperSlide>
              <RecommendationCard perfumeId={matchRec.break} cardHeader="Break The Mould" />
              </SwiperSlide>)}
            {matchRec.mid && state.perfume[matchRec.mid] &&
              (<SwiperSlide>
              <RecommendationCard perfumeId={matchRec.mid} cardHeader="Split the Difference" />
              </SwiperSlide>)}
          </Swiper>
        }
      </IonContent>
    </IonPage>
  );
};

export default Recommend;
