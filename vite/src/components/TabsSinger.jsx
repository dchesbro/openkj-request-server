import { Empty, Tabs } from 'antd';
import {
  QuestionCircleOutlined,
  ReadFilled,
  StarFilled,
  StarOutlined,
} from '@ant-design/icons';
import { useContext } from 'react';

import { ContextApp } from '../context/App';
import ListSongs from './ListSongs';

export default function TabsSinger() {

  // variables
  const {
    activeTab,
    favorites,
    loading,
    pageFavorites,
    pageSongs,
    setActiveTab,
    setPageFavorites,
    setPageSongs,
    songs,
  } = useContext(ContextApp);
  const emptyStyles = {
    fontSize: '64px',
    height: '100px',
  };

  return (
    <Tabs
      activeKey={activeTab}
      centered
      items={[
        {
          children:
            <ListSongs
              dataSource={songs}
              locale={{
                emptyText:
                  <Empty
                    description="No songs found"
                    image={<QuestionCircleOutlined style={emptyStyles} />}
                  />
                ,
              }}
              loading={{
                size: 'large',
                spinning: loading,
              }}
              onPageChange={setPageSongs}
              pageCurrent={pageSongs}
            />
          ,
          icon: <ReadFilled />,
          key: 'tab_songbook',
          label: 'Songbook',
        },
        {
          children:
            <ListSongs
              dataSource={favorites}
              locale={{
                emptyText:
                  <Empty
                    description="Add or remove songs with the star button"
                    image={<StarOutlined style={emptyStyles} />}
                  />
                ,
              }}
              loading={{
                size: 'large',
                spinning: loading,
              }}
              onPageChange={setPageFavorites}
              pageCurrent={pageFavorites}
            />
          ,
          icon: <StarFilled />,
          key: 'tab_favorites',
          label: 'Favorites',
        }
      ]}
      onChange={setActiveTab}
      renderTabBar={(props, DefaultTabBar) => (
        <DefaultTabBar
          {...props}
          className="bg-black bottom-0 w-full z-10 !fixed"
        />
      )}
      size="large"
      tabBarStyle={{ marginTop: 0 }}
      tabPosition="bottom"
    />
  );
}
