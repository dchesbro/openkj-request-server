import { Button, List, Space } from 'antd';
import { StarFilled, StarOutlined } from '@ant-design/icons';
import { useCallback, useContext } from 'react';

import { ContextApp } from '../context/App';
import SongMeta from './SongMeta';

export default function ListSongs({ onPageChange, pageCurrent, ...props }) {

  // variables
  const {
    favorites,
    setFavorites,
    setModalOpen,
    setRequestSong,
  } = useContext(ContextApp);

  // callbacks
  const favoritesGet = useCallback((item) => (
    favorites.some((obj) => obj.song_id === item.song_id)
  ), [favorites]);

  const favoritesToggle = useCallback((item) => {    
    let data = [];

    // If previously added to saved list, remove from list...
    if (favoritesGet(item)) {
      data = favorites.filter((obj) => obj !== item);
    
    // ...else, add to list and sort by artist.
    } else {
      data = [...favorites, item];

      data.sort((a, b) => (
        a.artist.localeCompare(b.artist) || a.title.localeCompare(b.title)
      ));
    }

    localStorage.setItem('okjrs_favorites', JSON.stringify(data));
    setFavorites(data);
  }, [favorites]);

  const requestShow = useCallback((item) => {
    setModalOpen(true);
    setRequestSong(item);
  }, []);

  return (
    <List
      {...props}
      className="max-w-screen-sm mx-auto pb-20 pt-16"
      pagination={{
        align: 'center',
        className: 'inline-flex items-center',
        current: pageCurrent,
        hideOnSinglePage: !props?.dataSource.length,
        onChange: (page, pageSize) => {
          onPageChange(page);
        },
        pageSize: 100,
        showSizeChanger: false,
        showTotal: (total, range) => (
          `${range[0]}-${range[1]} of ${total} songs`
        ),
        simple: true,
      }}
      renderItem={(item, index) => (
        <List.Item
          className="!px-3"
          extra={
            <Space.Compact className="ml-4">
              <Button onClick={() => requestShow(item)}>
                Request
              </Button>
              <Button
                icon={favoritesGet(item) ? <StarFilled /> : <StarOutlined />}
                onClick={() => favoritesToggle(item)}
              />
            </Space.Compact>
          }
        >
          <SongMeta song={item} />
        </List.Item>
      )}
    />
  );
}
