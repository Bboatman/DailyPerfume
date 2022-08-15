import {
  IonButton,
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardTitle,
  IonChip,
  IonContent,
  IonHeader,
  IonIcon,
  IonItem,
  IonLabel,
  IonList,
  IonPage,
  IonRange,
  IonTitle,
  IonToolbar
} from '@ionic/react';
import {
  trashBin,
  sparkles,
  skullSharp,
  heart
} from 'ionicons/icons';
import {
  useContext,
  useEffect,
  useState
} from 'react';
import AppHeader from '../../components/AppHeader';
import RecommendationCard from '../../components/RecommendationCard';
import { AppContext, Perfume } from '../../contexts/AppContext';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/pagination';
import './Recommend.css'
import { Pagination } from "swiper";
import noteMasterList, { NoteRanking } from '../../contexts/NoteData';

const Recommend: React.FC = () => {
  const ctx = useContext(AppContext);
  const { state, doWeatherCheck } = ctx;
  const [userState, setUserState] = useState<NoteRanking>({
    mood: .5,
    temp: 2.5,
    fanciness: .5,
    gloom: .5,
    label: "User",
    category: "internal"
  })
  const [matchRec, setMatchRec] = useState<any>();
  const [moodNotes, setMoodNotes] = useState<string[]>([])
  const moodList = noteMasterList.filter((elem: NoteRanking) => {
    return elem.category === "mood"
  });

  useEffect(() => {
    if (!state || !state.perfume || doWeatherCheck === undefined || Object.values(state.perfume).length === 0) {
      return
    }
    getRecommendations();
  }, [state.perfume, userState, state.lastLocLookup, doWeatherCheck, state.weatherScores])

  useEffect(() => {
    if (!moodNotes || moodNotes.length === 0) { return }
    if (moodNotes && moodNotes.length > 0) {
      let p: NoteRanking = { ...userState }
      let relevantNotes: any[] = moodNotes.map((elem: string) => {
        return moodList.find((note: NoteRanking) => note.label === elem);
      }).filter(elem => elem !== undefined);
      p.fanciness = relevantNotes.map((elem: NoteRanking) => { return elem.fanciness }).reduce((a, b) => a + b) / relevantNotes.length;
      p.gloom = relevantNotes.map((elem: NoteRanking) => { return elem.gloom }).reduce((a, b) => a + b) / relevantNotes.length;
      p.mood = relevantNotes.map((elem: NoteRanking) => { return elem.mood }).reduce((a, b) => a + b) / relevantNotes.length;
      p.temp = ((relevantNotes.map((elem: NoteRanking) => { return elem.temp }).reduce((a, b) => a + b) / relevantNotes.length) * 6) + 1;
      setUserState(p)
    }
  }, [moodNotes])

  const getRecommendations = async () => {
    if (doWeatherCheck === undefined) { return }
    if (state.canUseLocation){
        await doWeatherCheck();
    }
    generateRecommendations();
  }

  const generateRecommendations = () => {
    let allPerfumes: any[] = Object.values(state.perfume).filter((elem: any) => { return (elem !== undefined && !elem.isEmpty) });
    let mScore, fScore, tScore, gScore;

    mScore = state.settings.mood ? userState.mood : 1 - userState.mood
    fScore = state.settings.fanciness ? userState.fanciness : 1 - userState.fanciness;
    if (state.weatherScores) {
      tScore = state.settings.temp ? state.weatherScores.heatLevel : 5 - state.weatherScores.heatLevel;
      gScore = state.settings.gloom ? state.weatherScores.gloom : 1 - state.weatherScores.gloom;
    } else {
      mScore = state.settings.temp ? userState.temp : 1 - userState.temp
      fScore = state.settings.gloom ? userState.gloom : 1 - userState.gloom;
    }

      if (!state.settings?.manualEntry) {
        tScore = (tScore * 4 + userState.temp) / 5;
        gScore = (gScore * 4 + userState.gloom) / 5;
      }

      if (!tScore) {
        tScore = !userState.temp ? 3 : userState.temp;
      }

      if (!gScore) {
        gScore = !userState.gloom ? .5 : userState.gloom;
      }

      let current = [mScore, fScore, tScore, gScore];
      const scoreArr = [];
      for (let perfume of allPerfumes) {
        let perfumeScoreArray = [perfume.mood, perfume.fanciness, perfume.temp, perfume.gloom]
        let cosineSimilarity = getCosineSimilarity(perfumeScoreArray, current);
        let decayedValue = getWearFitDecay(perfume);
        scoreArr.push({ score: cosineSimilarity * decayedValue, id: perfume.id })
      }

      scoreArr.sort((a, b) => (a.score < b.score) ? 1 : -1);
      let arrLen = scoreArr.length;
      let matchRec = {
        match: scoreArr[0].id,
        break: scoreArr[arrLen - 1].id,
        mid: scoreArr[Math.floor(arrLen / 2)].id
      }
      setMatchRec(matchRec);
  }

  const getWearFitDecay = (perfume: Perfume) => {
    let now = new Date();
    if (perfume.lastWear){
      const rateOfDecay = .5;
      const daysPassed = daysBetween(perfume.lastWear, now);
      let decayedValue = 1*(Math.pow((1-rateOfDecay), daysPassed));
      return 1-decayedValue;
    } else {
      return 1
    }
  }

  function treatAsUTC(date: Date): Date {
      var result = new Date(date);
      result.setMinutes(result.getMinutes() - result.getTimezoneOffset());
      return result;
  }

  function daysBetween(startDate: Date, endDate: Date): number {
      const millisecondsPerDay = 8.64e+7;
      const millisecondsBetweenDates = treatAsUTC(endDate).getTime() - treatAsUTC(startDate).getTime();
      return millisecondsBetweenDates / millisecondsPerDay;
  }

  const getCosineSimilarity = (A: number[], B: number[]) => {
    var dotproduct = 0;
    var mA = 0;
    var mB = 0;
    for (let i = 0; i < A.length; i++) {
      dotproduct += (A[i] * B[i]);
      mA += (A[i] * A[i]);
      mB += (B[i] * B[i]);
    }
    mA = Math.sqrt(mA);
    mB = Math.sqrt(mB);
    var similarity = (dotproduct) / ((mA) * (mB))
    return similarity;
  }


  return (
    <IonPage>
      <AppHeader title='Recommend Perfume' />
      <IonContent fullscreen>
        <IonHeader collapse="condense">
          <IonToolbar>
            <IonTitle size="large">Recommend</IonTitle>
          </IonToolbar>
        </IonHeader>
        <IonList>

        {!state.canUseLocation && (
          <IonToolbar color="secondary">
            <IonTitle size="small">
              Couldn't get location. Recommendations will be less accurate.
            </IonTitle>
          </IonToolbar>
        )}

          {!state.settings?.manualEntry &&
            <IonCard>
              <IonCardHeader>
                <IonCardTitle>How are you feeling?</IonCardTitle>
              </IonCardHeader>

              <IonCardContent>
                <div className='scrollingDiv fixedHeightDiv'>
                  {moodList.map((elem: NoteRanking) => {
                    return (<IonChip
                      key={elem.label}
                      outline={!moodNotes.includes(elem.label)}
                      onClick={() => {
                        let newNotes = [...moodNotes]
                        if (moodNotes.includes(elem.label)) {
                          let ind = moodNotes.indexOf(elem.label);
                          newNotes.splice(ind, 1);
                        } else {
                          newNotes.push(elem.label);
                        }
                        setMoodNotes(newNotes)
                      }}
                    >
                      <IonLabel>{elem.label}</IonLabel>
                    </IonChip>)
                  })}
                </div>
              </IonCardContent>
            </IonCard>
          }
          {state.settings?.manualEntry && <div>
            <IonItem>
              <IonLabel position='fixed'>Fanciness</IonLabel>
              <IonRange color='secondary' value={userState.fanciness} step={.1} min={0} max={1} onIonChange={e =>
                setUserState({ ...userState, fanciness: e.detail.value.valueOf() as number })
              }>
                <IonIcon color="tertiary" icon={trashBin} slot="start" />
                <IonIcon color="tertiary" icon={sparkles} slot="end" />
              </IonRange>
            </IonItem>
            <IonItem>
              <IonLabel position='fixed'>Mood</IonLabel>
              <IonRange color='secondary' pin={false} value={userState.mood} step={.1} min={0} max={1} onIonChange={e =>
                setUserState({ ...userState, mood: e.detail.value as number })
              }>
                <IonIcon color="tertiary" icon={skullSharp} slot="start" />
                <IonIcon color="tertiary" icon={heart} slot="end" />
              </IonRange>
            </IonItem>
          </div>}
        </IonList>
        {Object.values(state?.perfume).length === 0 && (
          <IonCard href='/create'>
            <IonCardHeader>You have no perfumes!</IonCardHeader>
            <IonCardContent>
              <div className='fixedHeightDiv' style={{
                  textAlign: 'center',
                  justifyContent: 'spaceAround',
                  alignItems: 'center',
                }}>
                <IonButton color="primary">Add One!</IonButton>
              </div>
            </IonCardContent>
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
