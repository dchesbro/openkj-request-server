import { AudioOutlined } from '@ant-design/icons';
import { Avatar, List, Typography } from 'antd';

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
    <List.Item.Meta className="uppercase"
      avatar={showIcon && (
        <Avatar
          icon={<AudioOutlined />}
          size={48}
        />
      )}
      description={
        showIcon
          ?
            <span className="leading-tight text-lg">
              {song?.artist}
            </span>
          : song?.artist
      }
      title={
        <>
          {
            showIcon
            ?
              <span className="leading-tight mr-1 text-lg">
                {title}
              </span>
            : 
              <spac className="mr-1">
                {title}
              </spac>
          }
          {
            tag &&
              <Typography.Text
                className="font-normal inline-block text-xs !cursor-default"
                code
                disabled
              >
                {tag}
              </Typography.Text>
          }
        </>
      }
    />
  );
}
