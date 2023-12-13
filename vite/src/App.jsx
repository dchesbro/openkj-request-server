import {
  clearAllBodyScrollLocks,
  disableBodyScroll,
  enableBodyScroll,
} from 'body-scroll-lock-upgrade';
import { ConfigProvider, Empty, Form, Layout, Modal, Tabs, theme } from 'antd';
import { HappyProvider } from '@ant-design/happy-work-theme';
import {
  DislikeOutlined,
  LikeOutlined,
  QuestionCircleOutlined,
  ReadFilled,
  StarFilled,
  StarOutlined,
} from '@ant-design/icons';
import { useCallback, useEffect, useState } from 'react';

import FormSearch from './components/FormSearch';
import ListSongs from './components/ListSongs';
import ModalRequest from './components/ModalRequest';

function App() {

  /**
   * Variables
   */
  const [accepting, setAccepting] = useState();
  const [formRequest] = Form.useForm();
  const [formSearch] = Form.useForm();
  const [modal, modalContext] = Modal.useModal();
  const [requestOpen, setRequestOpen] = useState();
  const [requestSuccess, setRequestSuccess] = useState();
  const [savedList, setSaveList] = useState();
  const [songList, setSongList] = useState();
  const [songSelected, setSongSelected] = useState();
  const [tab, setTab] = useState('tab_songs');
  const searchString = Form.useWatch('search', formSearch);

  /**
   * Shared properties
   */
  const emptyStyles = {
    fontSize: '64px',
    height: '100px',
  };
  
  const fetchOptions = {
    headers: {
      'Content-Type': 'application/json',
    },
    method: 'POST',
  };

  /**
   * Callbacks
   */
  const acceptingGet = useCallback(() => {
    fetch(
      '/api', {
        ...fetchOptions,
        body: JSON.stringify({
          'command': 'getAccepting',
        }),
      }
    ).then((_res) => (
      _res.json()
    ).then((data) => {
      setAccepting(data.accepting);
    }));
  });

  const requestHide = useCallback(() => {
    setRequestOpen(false);
    setSongSelected();
  }, []);

  const requestShow = useCallback((item) => {
    setRequestOpen(true);
    setSongSelected(item);
  }, []);

  const requestSubmit = useCallback((fields) => {
    fetch(
      '/api', {
        ...fetchOptions,
        body: JSON.stringify({
          'command': 'submitRequest',
          'singerName': fields.singer,
          'songId': fields.song_id,
        }),
      }
    ).then((_res) => (
      _res.json()
    ).then((data) => {
      setRequestOpen(false);
      setRequestSuccess(data.success);
    }));
  }, []);

  const resultsGet = useCallback(() => {
    fetch(
      '/api', {
        ...fetchOptions,
        body: JSON.stringify({
          'command': 'search',
          'searchString': searchString ?? '',
        }),
      }
    ).then((_res) => (
      _res.json()
    ).then((data) => {
      setSongList(data.songs);
      setTab('tab_songs');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }));
  }, [searchString]);

  const savedToggle = useCallback((item) => {
    const prev = savedList.some((obj) => obj.song_id === item.song_id);
    
    let data = [];

    // If previously added to saved list, remove from list...
    if (prev) {
      data = savedList.filter((obj) => obj !== item);
    
    // ...else, add to list and sort by artist.
    } else {
      data = [...savedList, item];

      data.sort((a, b) => (
        a.artist.localeCompare(b.artist) || a.title.localeCompare(b.title)
      ));
    }

    localStorage.setItem('okjs_saved', JSON.stringify(data));
    setSaveList(data);
  }, [savedList]);

  /**
   * Effects
   */
  useEffect(() => {
    switch (accepting) {
      case false:
        disableBodyScroll(modal);
        setRequestOpen(false);

        modal.info({
          footer: false,
          title: 'Sorry, requests are currently closed.',
        });
        break;
      case true:
        enableBodyScroll(modal);
        break;
    }

    return () => {
      Modal.destroyAll();
    };
  }, [accepting]);

  useEffect(() => {
    switch (requestOpen) {
      case false:
        enableBodyScroll(modal);
        break;
      case true:
        disableBodyScroll(modal);
        break;
    }
  }, [requestOpen]);

  useEffect(() => {
    const onOk = () => {
      enableBodyScroll(modal);
      setRequestSuccess();
    };

    if (requestSuccess !== undefined) {
      disableBodyScroll(modal);
    }

    switch (requestSuccess) {
      case false:
        modal.error({
          onOk: onOk,
          icon: <DislikeOutlined />,
          title: 'Something wnet wrong!',
        });
        break;
      case true:
        modal.success({
          onOk: onOk,
          icon: <LikeOutlined />,
          title: 'Request submitted successfully!',
        });
        break;
    }
  }, [requestSuccess]);

  useEffect(() => {
    const data = JSON.parse(localStorage.getItem('okjs_saved')) ?? [];

    // Get songbook data.
    resultsGet();
    setSaveList(data);

    // Check if venue is accepting requests.
    acceptingGet();
    setInterval(acceptingGet, 5000);

    return () => {
      clearAllBodyScrollLocks();
      Modal.destroyAll();
    };
  }, []);

  return (
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
          <Layout.Header className="
            backdrop-blur bg-transparent fixed flex flex-none items-center 
            justify-center grow-0 px-0 top-0 w-full z-10
          ">
            <FormSearch
              form={formSearch}
              onFinish={resultsGet}
            />
          </Layout.Header>
          <Layout.Content>

            {/* Notification modal context */}
            {modalContext}

            {/* Request modal */}
            <ModalRequest
              form={formRequest}
              onCancel={requestHide}
              onFinish={requestSubmit}
              open={requestOpen}
              song={songSelected}
            />

            {/* Application tab bar */}
            <Tabs
              activeKey={tab}
              centered
              items={[
                {
                  children: 
                    <>
                      <ListSongs
                        dataSource={accepting ? songList : []}
                        locale={{
                          emptyText:
                            <Empty
                              description="No songs found"
                              image={
                                <QuestionCircleOutlined style={emptyStyles} />
                              }
                            />
                          ,
                        }}
                        onRequest={requestShow}
                        onSave={savedToggle}
                        saved={savedList}
                      />
                    </>
                  ,
                  icon: <ReadFilled />,
                  key: 'tab_songs',
                  label: 'Songbook',
                },
                {
                  children:
                    <ListSongs
                      dataSource={accepting ? savedList : []}
                      locale={{
                        emptyText:
                          <Empty
                            description={
                              <>
                                Add or remove songs<br />with the star button
                              </>
                            }
                            image={
                              <StarOutlined style={emptyStyles} />
                            }
                          />
                        ,
                      }}
                      onRequest={requestShow}
                      onSave={savedToggle}
                      saved={savedList}
                    />
                  ,
                  icon: <StarFilled />,
                  key: 'tab_saved',
                  label: 'Favorites',
                },
              ]}
              onChange={setTab}
              renderTabBar={(props, DefaultTabBar) => (
                <DefaultTabBar
                  {...props}
                  className="bg-black bottom-0 w-full z-10 !fixed"
                />
              )}
              size="large"
              tabBarStyle={{
                marginTop: 0,
              }}
              tabPosition="bottom"
            />
          </Layout.Content>
        </Layout>
      </HappyProvider>
    </ConfigProvider>
  )
}

export default App;
