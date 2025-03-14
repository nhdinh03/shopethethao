import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { FiInfo } from "react-icons/fi";
const InputField = ({
  icon,
  endIcon,
  error,
  toolTip,
  requirements,
  enableEmailSuggestions = false,
  ...props
}) => {
  const { useState, useEffect } = require("react");
  const [inputValue, setInputValue] = useState(props.value || "");

  useEffect(() => {
    setInputValue(props.value || "");
  }, [props.value]);

  const handleEmailInput = (e) => {
    let value = e.target.value;

    // Remove any existing email domain to prevent duplications
    if (
      enableEmailSuggestions &&
      !value.endsWith("@gmail.com") &&
      !value.includes("@gmail.com")
    ) {
      // If the user just started typing and hasn't entered @ yet
      if (!value.includes("@") && value.length > 0) {
        // Auto-append @gmail.com to the end of the input
        value = value + "@gmail.com";
      }
    }

    setInputValue(value);

    // Create a synthetic event object with the modified value
    const syntheticEvent = {
      target: {
        name: e.target.name,
        value: value,
      },
    };

    props.onChange(syntheticEvent);
  };

  const handleKeyDown = (e) => {
    // If user presses @ manually, replace with @gmail.com
    if (e.key === "@" && enableEmailSuggestions) {
      e.preventDefault();
      const cursorPosition = e.target.selectionStart;
      const valueBeforeCursor = e.target.value.substring(0, cursorPosition);
      const valueAfterCursor = e.target.value.substring(cursorPosition);

      // Only add @gmail.com if it doesn't already exist
      if (
        !valueBeforeCursor.includes("@gmail.com") &&
        !valueAfterCursor.includes("@gmail.com")
      ) {
        const newValue = valueBeforeCursor + "@gmail.com" + valueAfterCursor;
        setInputValue(newValue);

        const syntheticEvent = {
          target: {
            name: e.target.name,
            value: newValue,
          },
        };
        props.onChange(syntheticEvent);

        // Set cursor position after @gmail.com
        setTimeout(() => {
          e.target.setSelectionRange(
            cursorPosition + "@gmail.com".length,
            cursorPosition + "@gmail.com".length
          );
        }, 0);
      }
    }
  };

  const handleFocus = (e) => {
    // When field gets focus and it's empty, add @gmail.com if it's an email field
    if (enableEmailSuggestions && e.target.value === "") {
      setInputValue("@gmail.com");

      const syntheticEvent = {
        target: {
          name: e.target.name,
          value: "@gmail.com",
        },
      };

      props.onChange(syntheticEvent);

      // Place cursor at beginning of input field
      setTimeout(() => {
        e.target.setSelectionRange(0, 0);
      }, 0);
    }

    if (props.onFocus) {
      props.onFocus(e);
    }
  };

  return (
    <motion.div className="form-group">
      {(toolTip || props.placeholder) && (
        <div className={`input-label ${toolTip ? "with-tooltip" : ""}`}>
          <span>{props.placeholder}</span>
          {toolTip && (
            <motion.span
              className="tooltip-icon"
              title={toolTip}
              whileHover={{ scale: 1.2 }}
            >
              <FiInfo size={12} />
            </motion.span>
          )}
        </div>
      )}
      <div className={`input-field ${error ? "error" : ""}`}>
        <motion.span
          className="field-icon"
          initial={{ opacity: 0.5 }}
          whileHover={{ opacity: 1 }}
        >
          {icon}
        </motion.span>
        <input
          {...props}
          value={inputValue}
          onChange={enableEmailSuggestions ? handleEmailInput : props.onChange}
          onKeyDown={enableEmailSuggestions ? handleKeyDown : props.onKeyDown}
          onFocus={enableEmailSuggestions ? handleFocus : props.onFocus}
          autoComplete={enableEmailSuggestions ? "off" : props.autoComplete}
          placeholder={
            enableEmailSuggestions
              ? (props.placeholder || "") + " (@gmail.com sẽ được thêm tự động)"
              : props.placeholder
          }
        />
        {endIcon}
      </div>

      {requirements && !error && (
        <div className="field-requirements">{requirements}</div>
      )}
      {error && (
        <motion.div
          className="error-message"
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          transition={{ duration: 0.2 }}
        >
          {error}
        </motion.div>
      )}
    </motion.div>
  );
};
