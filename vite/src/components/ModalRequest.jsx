import { Form, Input, List, Modal } from 'antd';

import SongMeta from './SongMeta';

export default function ModalRequest({ form, onCancel, onFinish, open, song }) {
  return (
    <Modal
      closeIcon={false}
      maskClosable={false}
      onCancel={onCancel}
      onOk={form.submit}
      open={open}
      width={480}
    >
      <List>
        <List.Item>
          <SongMeta
            showIcon
            song={song}
          />
        </List.Item>
      </List>
      <Form
        autoComplete="off"
        fields={[
          {
            name: 'song_id',
            value: song?.song_id,
          }
        ]}
        form={form}
        layout="vertical"
        size="large"
        onFinish={onFinish}
      >
        <Form.Item
          hidden
          label={
            <span className="font-bold">
              Song ID:
            </span>
          }
          name="song_id"
        >
          <Input disabled />
        </Form.Item>
        <Form.Item
          label={
            <span className="font-bold">
              Your name:
            </span>
          }
          name="singer"
        >
          <Input maxLength={48} />
        </Form.Item>
      </Form>
    </Modal>
  );
}

