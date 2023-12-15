import { Button, Input, Form } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import { useCallback, useContext, useEffect } from 'react';

import { ContextApp } from '../context/App';

export default function FormSearch() {

  // variables
  const [form] = Form.useForm();
  const {
    api,
    loading,
    setActiveTab,
    setLoading,
    setPageSongs,
    setSongs,
  } = useContext(ContextApp);
  const search = Form.useWatch('search', form);

  // callbacks
  const searchGet = useCallback(() => {
    setLoading(true);

    fetch(
      api.endpoint, {
        ...api.options,
        body: JSON.stringify({
          'command': 'search',
          'searchString': search ?? '',
        }),
      }
    ).then((_res) => (
      _res.json()
    ).then((json) => {
      setActiveTab('tab_songbook');
      setLoading(false);
      setPageSongs(1);
      setSongs(json.songs);
    }));
  }, [search]);

  // effects
  useEffect(searchGet, []);

  return (
    <Form
      autoComplete="off"
      className="flex flex-auto max-w-screen-sm px-6"
      disabled={loading}
      form={form}
      layout="inline"
      onFinish={searchGet}
      size="large"
    >
      <Form.Item
        className="mb-0 !flex-auto !mr-3"
        name="search"
      >
        <Input
          allowClear
          maxLength={64}
          placeholder="Search by artist or song title..."
          type="search"
        />
      </Form.Item>
      <Button
        htmlType="submit"
        icon={<SearchOutlined />}
        type="primary"
      />
    </Form>
  );
}
