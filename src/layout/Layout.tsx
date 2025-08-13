import React, { useState, useMemo } from 'react';
import { Sidebar } from './Sidebar';
import { TabBar } from './TabBar';

import { HomePage } from '../pages/HomePage';
import { FlightPage } from '../pages/FlightPage';
import { CivilPage } from '../pages/CivilPage';
import { BusPage } from '../pages/BusPage';
import { NetflixPage } from '../pages/NetflixPage';

import type { Tab } from './TabTypes';
import styles from './layout.module.scss';

const routes = [
  { path: '/', component: HomePage },
  { path: 'pages/flight', component: FlightPage },
  { path: 'pages/civil', component: CivilPage },
  { path: 'pages/bus', component: BusPage },
  { path: 'pages/netflix', component: NetflixPage },
];

export const Layout: React.FC = () => {
  const [tabs, setTabs] = useState<Tab[]>([]);
  const [activeRoute, setActiveRoute] = useState<string | null>(null);

  const componentMap = useMemo(() => {
    const map: Record<string, React.FC> = {};
    for (const route of routes) {
      map[route.path] = route.component;
    }
    return map;
  }, []);

  const onMenuClick = (item: { title: string; route?: string }) => {
    if (!item.route) return;
    const { route, title } = item;

    const exists = tabs.find(t => t.route === route);
    if (exists) {
      setActiveRoute(route);
      return;
    }

    const component = componentMap[route];
    setTabs(prevTabs => [...prevTabs, { title, route, component }]);
    setActiveRoute(route);
  };

  const selectTab = (tab: Tab) => {
    setActiveRoute(tab.route);
  };

  const closeTab = (tabToClose: Tab) => {
    setTabs(prevTabs => {
      const newTabs = prevTabs.filter(t => t.route !== tabToClose.route);
      if (activeRoute === tabToClose.route) {
        setActiveRoute(newTabs.length > 0 ? newTabs[newTabs.length - 1].route : null);
      }
      return newTabs;
    });
  };

  const ActiveComponent = useMemo(() => {
    if (activeRoute && componentMap[activeRoute]) {
      return componentMap[activeRoute];
    }
    return HomePage;
  }, [activeRoute, componentMap]);
  
  return (
    <div className={styles['layout-container']}>
      <div className={styles.sidebar}>
        <Sidebar activeRoute={activeRoute ?? ''} onMenuClick={onMenuClick} />
      </div>
      <main className={styles['main-content']}>
        {tabs.length > 0 && (
          <TabBar tabs={tabs} activeRoute={activeRoute} onSelect={selectTab} onClose={closeTab} />
        )}
        <div className={styles['content-container']}>
          <ActiveComponent />
        </div>
      </main>
    </div>
  );  
};
