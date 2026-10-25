import type { ReactNode } from 'react';
import { match, useLocation } from './lib/router';
import { useProgress } from './state/progress';
import { BottomNav } from './components/ui';
import Home from './screens/Home';
import StageMap from './screens/StageMap';
import AreaOverview from './screens/AreaOverview';
import TopicDetail from './screens/TopicDetail';
import ActivityScreen from './screens/ActivityScreen';
import Settings from './screens/Settings';
import Onboarding from './screens/Onboarding';
import InstallGuide from './screens/InstallGuide';

export default function App() {
  const { path } = useLocation();
  const s = useProgress();

  let screen: ReactNode;
  let nav = true;
  let m: Record<string, string> | null;

  if (!s.onboarded && path !== '/install') {
    screen = <Onboarding />;
    nav = false;
  } else if (path === '/') screen = <Home />;
  else if (path === '/map') screen = <StageMap />;
  else if ((m = match('/area/:areaId/topic/:topicId', path))) screen = <TopicDetail key={path} areaId={m.areaId} topicId={m.topicId} />;
  else if ((m = match('/area/:areaId', path))) screen = <AreaOverview key={path} areaId={m.areaId} />;
  else if ((m = match('/learn/:id', path))) {
    screen = <ActivityScreen key={path} id={m.id} />;
    nav = false;
  } else if (path === '/settings') screen = <Settings />;
  else if (path === '/install') screen = <InstallGuide />;
  else screen = <Home />;

  return (
    <div className="app">
      {screen}
      {nav && <BottomNav />}
    </div>
  );
}
