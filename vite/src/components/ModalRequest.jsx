import { Form, Input, List, Modal } from 'antd';
import { useCallback, useContext, useEffect, useState } from 'react';

import { ContextApp } from '../context/App';
import SongMeta from './SongMeta';

export default function ModalRequest() {

  // variables
  const [error, setError] = useState();
  const [fieldsEmpty, setFieldsEmpty] = useState();
  const [form] = Form.useForm();
  const {
    api,
    disableBodyScroll,
    enableBodyScroll,
    modalOpen,
    popup,
    requestSong,
    setModalOpen,
    setRequestSong,
  } = useContext(ContextApp);

  // callbacks
  const isEmpty = useCallback(() => {
    const fields = form.getFieldsValue();

    setFieldsEmpty(Object.values(fields).some((value) => (
      value === undefined || value === ''
    )));
  }, []);

  const requestHide = useCallback(() => {
    setModalOpen(false);
    setRequestSong();
  }, []);

  const requestSubmit = useCallback((fields) => {
    fetch(
      api.endpoint, {
        ...api.options,
        body: JSON.stringify({
          'command': 'submitRequest',
          'singerName': fields.singer,
          'songId': fields.song_id,
        }),
      }
    ).then((_res) => (
      _res.json()
    ).then((json) => {
      requestHide();
      setError(json.error);
    }));
  }, []);

  // effects
  useEffect(() => {
    const errorHide = () => {
      enableBodyScroll(popup);
      setError();
    };

    if (error !== undefined) {
      disableBodyScroll(popup);
    }

    switch (error) {
      case false:
        popup.success({
          okText: 'Heck yeah',
          onOk: errorHide,
          title: 'Request submitted successfully!',
        });
        break;
      case true:
        popup.error({
          okText: 'Uh oh',
          onOk: errorHide,
          title: 'Smoething wnet worng!',
        });
        break;
    }
  }, [error]);

  useEffect(isEmpty, []);

  return (
    <Modal
      cancelText="Hold up"
      closeIcon={false}
      forceRender
      maskClosable={false}
      okButtonProps={{ disabled: fieldsEmpty }}
      okText="Send it"
      onCancel={requestHide}
      onOk={form.submit}
      open={modalOpen}
      width={480}
    >
      <List>
        <List.Item>
          <SongMeta
            showIcon
            song={requestSong}
          />
        </List.Item>
      </List>
      <Form
        autoComplete="off"
        fields={[
          {
            name: 'song_id',
            value: requestSong?.song_id,
          }
        ]}
        form={form}
        layout="vertical"
        onChange={isEmpty}
        size="large"
        onFinish={requestSubmit}
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

