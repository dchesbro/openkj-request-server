import { AudioOutlined } from '@ant-design/icons';
import { Avatar, List, Space, Typography } from 'antd';

export default function SongMeta({ showIcon = false, song }) {
  const regex = /\[([^)]+)\]/;
  const matches = regex.exec(song?.title);

  let tag = '';
  let title = song?.title;

  if (matches) {
    tag = matches[1];
    title = title.replace(matches[0], '').trim();
  }

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
        <Space>
          {
            showIcon
            ?
              <span className="leading-none text-lg">
                {title}
              </span>
            : title
          }
          {
            tag &&
              <Typography.Text
                className="font-normal uppercase !cursor-default"
                code
                disabled
              >
                {tag}
              </Typography.Text>
          }
        </Space>
      }
    />
  );
}
