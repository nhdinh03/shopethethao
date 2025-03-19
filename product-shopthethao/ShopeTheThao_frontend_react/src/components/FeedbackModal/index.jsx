import React, { useState, useCallback, useEffect } from 'react';
import { Modal, Form, Input, Button, message, Space, Typography, Spin, Tooltip } from 'antd';
import { MessageOutlined, SendOutlined, MailOutlined, CommentOutlined, QuestionCircleOutlined } from '@ant-design/icons';
import './style.scss';

const { Text } = Typography;

const FeedbackModal = () => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [screenSize, setScreenSize] = useState('large');
  const [form] = Form.useForm();

  // Improved screen size detection with finer breakpoints
  useEffect(() => {
    const updateScreenSize = () => {
      const width = window.innerWidth;
      if (width <= 320) {
        setScreenSize('xxsmall');
      } else if (width <= 480) {
        setScreenSize('xsmall');
      } else if (width <= 760) {
        setScreenSize('small');
      } else if (width <= 960) {
        setScreenSize('medium');
      } else if (width <= 1200) {
        setScreenSize('large');
      } else if (width <= 1600) {
        setScreenSize('xlarge');
      } else {
        setScreenSize('xxlarge');
      }
    };
    
    updateScreenSize();
    window.addEventListener('resize', updateScreenSize);
    
    return () => window.removeEventListener('resize', updateScreenSize);
  }, []);

  const showModal = () => setIsModalVisible(true);

  const handleCancel = useCallback(() => {
    if (!isSubmitting) {
      Modal.confirm({
        title: 'Xác nhận',
        content: 'Bạn có chắc muốn đóng form góp ý không?',
        onOk: () => {
          setIsModalVisible(false);
          form.resetFields();
        },
        okText: 'Đóng',
        cancelText: 'Tiếp tục',
      });
    }
  }, [isSubmitting, form]);

  const validateMessages = {
    required: '${label} là bắt buộc!',
    types: {
      email: '${label} không hợp lệ!',
    },
    string: {
      min: '${label} phải có ít nhất ${min} ký tự',
    }
  };

  const handleSubmit = async (values) => {
    if (isSubmitting) return;
    
    setIsSubmitting(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 800));
      message.success({
        content: 'Cảm ơn bạn đã gửi góp ý!',
        duration: 3,
        className: 'custom-message'
      });
      setIsModalVisible(false);
      form.resetFields();
    } catch (error) {
      message.error({
        content: 'Có lỗi xảy ra, vui lòng thử lại!',
        duration: 3,
        className: 'custom-message'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleKeyPress = useCallback((e) => {
    if (e.key === 'Escape' && !isSubmitting) {
      handleCancel();
    }
  }, [handleCancel, isSubmitting]);

  // Enhanced textarea rows calculation
  const getTextAreaRows = () => {
    if (['xxsmall', 'xsmall'].includes(screenSize)) return { minRows: 3, maxRows: 5 };
    if (screenSize === 'small') return { minRows: 3, maxRows: 6 };
    if (screenSize === 'medium') return { minRows: 4, maxRows: 7 };
    if (screenSize === 'large') return { minRows: 4, maxRows: 8 };
    return { minRows: 5, maxRows: 10 }; // xlarge and xxlarge
  };

  // Enhanced modal width calculation for better responsiveness
  const getModalWidth = () => {
    if (screenSize === 'xxsmall') return '95%';
    if (screenSize === 'xsmall') return '92%';
    if (screenSize === 'small') return '85%';
    if (screenSize === 'medium') return '75%';
    if (screenSize === 'large') return 600;
    if (screenSize === 'xlarge') return 650;
    return 700; // xxlarge
  };

  // Button sizes based on screen size
  const getButtonSize = () => {
    if (['xxsmall', 'xsmall'].includes(screenSize)) return 'small';
    return 'middle';
  };

  // Enhanced UI with conditional help text
  const getHelpText = () => {
    if (['xxsmall', 'xsmall', 'small'].includes(screenSize)) {
      return <Text type="secondary" style={{ fontSize: '12px' }}>10-500 ký tự</Text>;
    }
    return <Text type="secondary">Tối thiểu 10 ký tự, tối đa 500 ký tự</Text>;
  };

  return (
    <>
      <div className="feedback-trigger" onClick={showModal} role="button" tabIndex={0}>
        <MessageOutlined style={{ fontSize: ['xxsmall', 'xsmall'].includes(screenSize) ? '14px' : '16px' }} />
        <span>Góp ý</span>
      </div>
      <Modal
        title={
          <Space align="center">
            <MessageOutlined />
            <span>Góp ý của bạn</span>
          </Space>
        }
        open={isModalVisible}
        onCancel={handleCancel}
        footer={null}
        centered
        maskClosable={false}
        destroyOnClose
        className="feedback-modal"
        keyboard={!isSubmitting}
        closable={!isSubmitting}
        width={getModalWidth()}
      >
        <Form 
          form={form} 
          onFinish={handleSubmit}
          layout="vertical"
          validateMessages={validateMessages}
          className="feedback-form"
          requiredMark={false}
          onKeyPress={handleKeyPress}
        >
          <Form.Item
            name="email"
            label="Email"
            rules={[
              { required: true },
              { type: 'email' },
              { max: 50, message: 'Email không được vượt quá 50 ký tự' }
            ]}
          >
            <Input
              prefix={<MailOutlined className="field-icon" />}
              placeholder="Nhập email của bạn"
              disabled={isSubmitting}
              autoComplete="email"
              size={['xxsmall', 'xsmall'].includes(screenSize) ? 'small' : 'middle'}
            />
          </Form.Item>
          <Form.Item
            name="feedback"
            label={
              <Space>
                <span>Nội dung góp ý</span>
                {['medium', 'large', 'xlarge', 'xxlarge'].includes(screenSize) && (
                  <Tooltip title="Hãy chia sẻ ý kiến của bạn để chúng tôi cải thiện dịch vụ">
                    <QuestionCircleOutlined style={{ color: '#8c8c8c' }} />
                  </Tooltip>
                )}
              </Space>
            }
            rules={[
              { required: true },
              { min: 10 },
              { max: 500 }
            ]}
            help={getHelpText()}
          >
            <Input.TextArea
              prefix={<CommentOutlined className="field-icon" />}
              placeholder="Nhập nội dung góp ý của bạn"
              disabled={isSubmitting}
              showCount
              autoSize={getTextAreaRows()}
            />
          </Form.Item>
          <Form.Item className="form-actions">
            <Space>
              <Button
                onClick={handleCancel}
                disabled={isSubmitting}
                size={getButtonSize()}
              >
                Hủy
              </Button>
              <Button
                type="primary"
                htmlType="submit"
                icon={<SendOutlined />}
                loading={isSubmitting}
                size={getButtonSize()}
              >
                {isSubmitting ? 
                  (['xxsmall', 'xsmall'].includes(screenSize) ? '' : 'Đang gửi...') 
                  : 'Gửi góp ý'
                }
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};

export default FeedbackModal;
