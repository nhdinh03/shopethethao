import React, { useState, useCallback, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion"; // Thêm import này
import {
  Modal,
  Form,
  Input,
  Button,
  message,
  Space,
  Typography,
  Spin,
  Tooltip,
} from "antd";
import {
  MessageOutlined,
  SendOutlined,
  MailOutlined,
  CommentOutlined,
  QuestionCircleOutlined,
  CloseOutlined,
} from "@ant-design/icons";
import { feedbackApi } from "api/User";
import "./style.scss";
import img from "assets/Img";

const { Text } = Typography;

const FeedbackModal = () => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [screenSize, setScreenSize] = useState("large");
  const [form] = Form.useForm();

  // Improved screen size detection with finer breakpoints
  useEffect(() => {
    const updateScreenSize = () => {
      const width = window.innerWidth;
      if (width <= 320) {
        setScreenSize("xxsmall");
      } else if (width <= 480) {
        setScreenSize("xsmall");
      } else if (width <= 760) {
        setScreenSize("small");
      } else if (width <= 960) {
        setScreenSize("medium");
      } else if (width <= 1200) {
        setScreenSize("large");
      } else if (width <= 1600) {
        setScreenSize("xlarge");
      } else {
        setScreenSize("xxlarge");
      }
    };

    updateScreenSize();
    window.addEventListener("resize", updateScreenSize);

    return () => window.removeEventListener("resize", updateScreenSize);
  }, []);

  const showModal = () => setIsModalVisible(true);

  const handleCancel = useCallback(() => {
    if (!isSubmitting) {
      setIsModalVisible(false);
      form.resetFields();
    }
  }, [isSubmitting, form]);

  const validateMessages = {
    required: "Email này là bắt buộc!", // Specific message for required fields
    types: {
      email: "Email không hợp lệ! Vui lòng nhập đúng định dạng email.",
    },
    string: {
      min: "Nội dung phải có ít nhất 10 ký tự.",
      max: "Nội dung không được vượt quá 500 ký tự.",
    },
  };

  const handleSubmit = async (values) => {
    if (isSubmitting) return;

    // Validate email format
    if (!values.email.endsWith("@gmail.com")) {
      message.error({
        content: "Email phải có đuôi @gmail.com",
        key: "feedback-error",
        duration: 2,
        className: "custom-message",
      });
      return;
    }

    setIsSubmitting(true);
    setIsModalVisible(false);
    message.success({
      content: "Cảm ơn bạn đã gửi góp ý!",
      key: "feedback",
      duration: 2,
      className: "custom-message",
    });
    form.resetFields();

    try {
      await feedbackApi.create(values);
    } catch (error) {
      console.error("Feedback error:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleKeyPress = useCallback(
    (e) => {
      if (e.key === "Escape" && !isSubmitting) {
        handleCancel();
      }
    },
    [handleCancel, isSubmitting]
  );

  // Enhanced textarea rows calculation
  const getTextAreaRows = () => {
    if (["xxsmall", "xsmall"].includes(screenSize))
      return { minRows: 3, maxRows: 5 };
    if (screenSize === "small") return { minRows: 3, maxRows: 6 };
    if (screenSize === "medium") return { minRows: 4, maxRows: 7 };
    if (screenSize === "large") return { minRows: 4, maxRows: 8 };
    return { minRows: 5, maxRows: 10 }; // xlarge and xxlarge
  };

  // Enhanced modal width calculation for better responsiveness
  const getModalWidth = () => {
    if (screenSize === "xxsmall") return "95%";
    if (screenSize === "xsmall") return "92%";
    if (screenSize === "small") return "85%";
    if (screenSize === "medium") return "75%";
    if (screenSize === "large") return 600;
    if (screenSize === "xlarge") return 650;
    return 700; // xxlarge
  };

  // Button sizes based on screen size
  const getButtonSize = () => {
    if (["xxsmall", "xsmall"].includes(screenSize)) return "small";
    return "middle";
  };

  // Enhanced UI with conditional help text
  const getHelpText = () => {
    if (["xxsmall", "xsmall", "small"].includes(screenSize)) {
      return (
        <Text type="secondary" style={{ fontSize: "12px" }}>
          10-500 ký tự
        </Text>
      );
    }
    return <Text type="secondary">Tối thiểu 10 ký tự, tối đa 500 ký tự</Text>;
  };

  // Simplified modal variants without spring animation
  const modalVariants = {
    hidden: { x: "100%" },
    visible: { 
      x: 0,
      transition: {
        duration: 0.15
      }
    },
    exit: { 
      x: "100%",
      transition: {
        duration: 0.1
      }
    }
  };

  return (
    <>
      <div
        className="feedback-trigger header-menu-item"
        onClick={showModal}
        role="button"
        tabIndex={0}
      >
        <MessageOutlined className="menu-icon" />
        <span className="menu-text">Góp ý</span>
      </div>

      <AnimatePresence>
        {isModalVisible && (
          <>
            <motion.div
              className="feedback-modal-backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={handleCancel}
            />
            <motion.div
              className="feedback-modal modern black-orange-theme"
              variants={modalVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
            >
              {/* Chuyển nội dung từ Modal sang đây */}
              <div className="modal-header">
                <div className="feedback-header">
                  <div className="flag-container">
                    <img
                      src={img.Co_VN}
                      alt="Vietnam Flag"
                      className="vietnam-flag"
                    />
                    <p className="flag-caption">
                      Hoang Sa and Truong Sa belong to Vietnam.
                    </p>
                  </div>

                  <div className="feedback-title">
                    <h3>Góp ý của bạn</h3>
                    <p className="subtitle">
                      Rất quan trọng đối với chúng tôi. Mỗi đóng góp giúp chúng tôi
                      cải thiện và mang đến dịch vụ tốt nhất.
                    </p>
                  </div>
                </div>
                <button className="feedback-close-button" onClick={handleCancel}>
                  <CloseOutlined />
                </button>
              </div>

              <div className="modal-body">
                <Form
                  form={form}
                  onFinish={handleSubmit}
                  layout="vertical"
                  validateMessages={validateMessages}
                  className="feedback-form modern"
                  requiredMark={false}
                  onKeyPress={handleKeyPress}
                >
                  <div className="form-container">
                    <Form.Item
                      name="email"
                      label={<span className="form-label">Email của bạn</span>}
                      rules={[
                        { required: true },
                        { type: "email" },
                        { max: 50, message: "Email không được vượt quá 50 ký tự" },
                      ]}
                    >
                      <Input
                        className="modern-input"
                        prefix={<MailOutlined className="field-icon" />}
                        placeholder="Nhập email của bạn"
                        disabled={isSubmitting}
                        autoComplete="email"
                        size={
                          ["xxsmall", "xsmall"].includes(screenSize)
                            ? "small"
                            : "middle"
                        }
                      />
                    </Form.Item>

                    <Form.Item
                      name="message"
                      label={
                        <div className="form-label-wrapper">
                          <span className="form-label">Nội dung góp ý</span>
                          {["medium", "large", "xlarge", "xxlarge"].includes(
                            screenSize
                          ) && (
                            <Tooltip
                              title="Hãy chia sẻ ý kiến của bạn để chúng tôi cải thiện dịch vụ"
                              overlayClassName="modern-tooltip"
                            >
                              <QuestionCircleOutlined style={{ color: "#757575" }} />
                            </Tooltip>
                          )}
                        </div>
                      }
                      rules={[{ required: true }, { min: 10 }, { max: 500 }]}
                      help={getHelpText()}
                    >
                      <Input.TextArea
                        className="modern-textarea"
                        placeholder="Nhập nội dung góp ý của bạn"
                        disabled={isSubmitting}
                        showCount
                        autoSize={getTextAreaRows()}
                      />
                    </Form.Item>

                    <Form.Item className="form-actions modern">
                      <Space size="middle">
                        <Button
                          className="cancel-button"
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
                          className="submit-button"
                        >
                          {isSubmitting
                            ? ["xxsmall", "xsmall"].includes(screenSize)
                              ? ""
                              : "Đang gửi..."
                            : "Gửi góp ý"}
                        </Button>
                      </Space>
                    </Form.Item>
                  </div>
                </Form>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default FeedbackModal;
