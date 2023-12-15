import {
  clearAllBodyScrollLocks,
  disableBodyScroll,
  enableBodyScroll,
} from 'body-scroll-lock-upgrade';
import { ConfigProvider, Layout, Modal, theme } from 'antd';
import { HappyProvider } from '@ant-design/happy-work-theme';
import { useCallback, useEffect, useState } from 'react';

import FormSearch from './components/FormSearch';
import ModalRequest from './components/ModalRequest';

import { ContextApp } from './context/App';
import TabsSinger from './components/TabsSinger';

export default function App() {

  // variables
  const [activeTab, setActiveTab] = useState('tab_songbook');
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState();
  const [pageFavorites, setPageFavorites] = useState();
  const [pageSongs, setPageSongs] = useState();
  const [popup, popupContext] = Modal.useModal();
  const [requestSong, setRequestSong] = useState();
  const [songs, setSongs] = useState([]);
  const production = import.meta.env.PROD;

  // shared properties
  const api = {
    endpoint: production ? '/api' : '//localhost:3300/api',
    options: {
      headers: {
        'Content-Type': 'application/json',
      },
      method: 'POST',
    },
  };

  // callbacks
  const requestShow = useCallback((item) => {
    setModalOpen(true);
    setRequestSong(item);
  }, []);

  // effects
  useEffect(() => {
    setFavorites(JSON.parse(localStorage.getItem('okjs_saved')) ?? []);

    return () => {
      clearAllBodyScrollLocks();
      Modal.destroyAll();
    };
  }, []);

  useEffect(() => {
    switch (modalOpen) {
      case false:
        enableBodyScroll(popup);
        break;
      case true:
        disableBodyScroll(popup);
        break;
    }
  }, [modalOpen]);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [pageFavorites, pageSongs, songs]);

  return (
    <ContextApp.Provider value={{
      activeTab,
      api,
      disableBodyScroll,
      enableBodyScroll,
      favorites,
      loading,
      modalOpen,
      pageFavorites,
      pageSongs,
      popup,
      requestSong,
      setActiveTab,
      setFavorites,
      setLoading,
      setModalOpen,
      setPageFavorites,
      setPageSongs,
      setRequestSong,
      setSongs,
      songs,
    }}>
      <ConfigProvider
        theme={{
          algorithm: theme.darkAlgorithm,
          token: {
            borderRadius: 10,
            colorInfo: '#f59e0b',
            colorPrimary: '#f59e0b',
            fontSize: 14,
            wireframe: false,
          },
        }}
      >
        <HappyProvider>
          <Layout>
            <Layout.Header
              className="
                backdrop-blur bg-transparent fixed flex items-center 
                justify-center px-0 top-0 w-full z-10
              "
            >
              <FormSearch />
            </Layout.Header>
            <Layout.Content>
              {/* pop-ups */}
              {popupContext}

              {/* request modal */}
              <ModalRequest />

              {/* tabs */}
              <TabsSinger />
            </Layout.Content>
          </Layout>
        </HappyProvider>
      </ConfigProvider>
    </ContextApp.Provider>
  )
}
