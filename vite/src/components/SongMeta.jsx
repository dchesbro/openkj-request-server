import { AudioOutlined } from '@ant-design/icons';
import { Avatar, List } from 'antd';

export default function SongMeta({ showIcon = false, song }) {
  return (
    <List.Item.Meta
      avatar={showIcon && (
        <Avatar
          icon={<AudioOutlined />}
          size={48}
        />
      )}
      description={
        showIcon
          ?
            <span className="leading-none text-lg">
              {song?.artist}
            </span>
          : song?.artist
      }
      title={
        showIcon
          ?
            <span className="leading-none text-lg">
              {song?.title}
            </span>
          : song?.title
      }
    />
  );
}
