import { Button, List, Space } from 'antd';

import SongMeta from './SongMeta';
import { StarFilled, StarOutlined } from '@ant-design/icons';

export default function ListSongs({ accepting, pageCurrent, pageOnChange, onRequest, onSave, saved, ...props }) {
  return (
    <List
      {...props}
      className="max-w-screen-sm mx-auto pb-20 pt-16"
      pagination={{
        align: 'center',
        className: 'inline-flex items-center',
        current: pageCurrent,
        hideOnSinglePage: !props?.dataSource?.length,
        onChange: (page, pageSize) => {
          pageOnChange(page);
          window.scrollTo({ top: 0, behavior: 'smooth' });
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
          extra={
            <Space.Compact className="ml-4">
              <Button
                disabled={!accepting}
                onClick={() => onRequest(item)}
              >
                Request
              </Button>
              <Button
                icon={
                  saved.some(obj => obj.song_id === item.song_id)
                    ? <StarFilled />
                    : <StarOutlined />
                }
                onClick={() => onSave(item)}
              />
            </Space.Compact>
          }
          className="!px-3"
        >
          <SongMeta song={item} />
        </List.Item>
      )}
    />
  );
}
