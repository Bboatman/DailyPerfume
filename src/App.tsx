import { Redirect, Route } from 'react-router-dom';
import {
  IonApp,
  IonIcon,
  IonLabel,
  IonRouterOutlet,
  IonTabBar,
  IonTabButton,
  IonTabs,
  setupIonicReact
} from '@ionic/react';
import { IonReactRouter } from '@ionic/react-router';
import { ellipse, square, triangle } from 'ionicons/icons';
import Weather from './pages/Weather/Weather';

/* Core CSS required for Ionic components to work properly */
import '@ionic/react/css/core.css';

/* Basic CSS for apps built with Ionic */
import '@ionic/react/css/normalize.css';
import '@ionic/react/css/structure.css';
import '@ionic/react/css/typography.css';

/* Optional CSS utils that can be commented out */
import '@ionic/react/css/padding.css';
import '@ionic/react/css/float-elements.css';
import '@ionic/react/css/text-alignment.css';
import '@ionic/react/css/text-transformation.css';
import '@ionic/react/css/flex-utils.css';
import '@ionic/react/css/display.css';

/* Theme variables */
import './theme/variables.css';
import Recommend from './pages/Recommend/Recommend';
import Perfume from './pages/Perfume/Perfume';
import CreatePerfume from './pages/CreatePerfume/CreatePerfume';
import Settings from './pages/Settings/Settings';
import { AppContextProvider } from './contexts/AppContext';

setupIonicReact();

const App: React.FC = () => (
  <IonApp>
    <IonReactRouter>
      <AppContextProvider>
      <IonTabs>
        <IonRouterOutlet>
          <Route exact path="/weather">
            <Weather />
          </Route>
          <Route exact path="/recommend">
            <Recommend />
          </Route>
          <Route exact path="/perfume">
            <Perfume />
          </Route>
          <Route path="/perfume/:id" component={CreatePerfume}>
          </Route>
          <Route exact path="/create" component={CreatePerfume}>
          </Route>
          <Route exact path="/settings">
            <Settings />
          </Route>
          <Route exact path="/">
            <Redirect to="/recommend" />
          </Route>
        </IonRouterOutlet>
        <IonTabBar slot="bottom">
          <IonTabButton tab="tab1" href="/weather">
            <IonIcon icon={triangle} />
            <IonLabel>Weather</IonLabel>
          </IonTabButton>
          <IonTabButton tab="tab2" href="/recommend">
            <IonIcon icon={ellipse} />
            <IonLabel>Recommend</IonLabel>
          </IonTabButton>
          <IonTabButton tab="tab3" href="/perfume">
            <IonIcon icon={square} />
            <IonLabel>Perfumes</IonLabel>
          </IonTabButton>
        </IonTabBar>
      </IonTabs>
      </AppContextProvider>
    </IonReactRouter>
  </IonApp>
);

export default App;
