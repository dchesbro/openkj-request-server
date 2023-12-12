import { Button, Input, Form } from 'antd';
import { SearchOutlined } from '@ant-design/icons';

export default function FormSearch({ form, onFinish }) {
  return (
    <Form
      autoComplete="off"
      className="flex flex-nowrap max-w-screen-sm px-6 w-full"
      form={form}
      layout="inline"
      onFinish={onFinish}
      size="large"
    >
      <Form.Item
        className="mb-0 !flex-auto !me-2"
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
