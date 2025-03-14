import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { FiInfo } from "react-icons/fi";

export const InputField = ({
  icon,
  endIcon,
  error,
  toolTip,
  requirements,
  enableEmailSuggestions = false,
  ...props
}) => {
  const [inputValue, setInputValue] = useState(props.value || '');
  
  useEffect(() => {
    setInputValue(props.value || '');
  }, [props.value]);
  
  const handleEmailInput = (e) => {
    let value = e.target.value;
    
    if (enableEmailSuggestions && !value.endsWith('@gmail.com') && !value.includes('@gmail.com')) {
      if (!value.includes('@') && value.length > 0) {
        value = value + '@gmail.com';
      }
    }
    
    setInputValue(value);
    
    const syntheticEvent = {
      target: {
        name: e.target.name,
        value: value,
      }
    };
    
    props.onChange(syntheticEvent);
  };
  
  const handleKeyDown = (e) => {
    if (e.key === '@' && enableEmailSuggestions) {
      e.preventDefault();
      const cursorPosition = e.target.selectionStart;
      const valueBeforeCursor = e.target.value.substring(0, cursorPosition);
      const valueAfterCursor = e.target.value.substring(cursorPosition);
      
      if (!valueBeforeCursor.includes('@gmail.com') && !valueAfterCursor.includes('@gmail.com')) {
        const newValue = valueBeforeCursor + '@gmail.com' + valueAfterCursor;
        setInputValue(newValue);
        
        const syntheticEvent = {
          target: {
            name: e.target.name,
            value: newValue,
          }
        };
        props.onChange(syntheticEvent);
        
        setTimeout(() => {
          e.target.setSelectionRange(cursorPosition + '@gmail.com'.length, cursorPosition + '@gmail.com'.length);
        }, 0);
      }
    }
  };
  
  const handleFocus = (e) => {
    if (enableEmailSuggestions && e.target.value === '') {
      setInputValue('@gmail.com');
      
      const syntheticEvent = {
        target: {
          name: e.target.name,
          value: '@gmail.com',
        }
      };
      
      props.onChange(syntheticEvent);
      
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
          placeholder={enableEmailSuggestions ? (props.placeholder || "") + " (@gmail.com sẽ được thêm tự động)" : props.placeholder}
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

export const EmailField = ({
  icon,
  error,
  toolTip,
  value,
  onChange,
  name,
  placeholder,
  ...props
}) => {
  // Extract username part from email (before @gmail.com)
  const [username, setUsername] = useState(
    value?.includes('@') ? value.split('@')[0] : value || ''
  );

  // Update parent component when username changes
  useEffect(() => {
    // Only extract username if value contains @ (full email format)
    if (value && value.includes('@')) {
      setUsername(value.split('@')[0]);
    }
  }, [value]);

  // Handle username input changes
  const handleUsernameChange = (e) => {
    const newUsername = e.target.value;
    setUsername(newUsername);
    
    // Construct the full email and pass to parent's onChange
    const fullEmail = newUsername + '@gmail.com';
    const syntheticEvent = {
      target: {
        name: name,
        value: fullEmail
      }
    };
    
    onChange(syntheticEvent);
  };

  return (
    <motion.div className="form-group">
      {(toolTip || placeholder) && (
        <div className={`input-label ${toolTip ? "with-tooltip" : ""}`}>
          <span>{placeholder}</span>
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
      <div className={`input-field email-field ${error ? "error" : ""}`}>
        <motion.span
          className="field-icon"
          initial={{ opacity: 0.5 }}
          whileHover={{ opacity: 1 }}
        >
          {icon}
        </motion.span>
        <div className="email-input-container">
          <input
            type="text"
            value={username}
            onChange={handleUsernameChange}
            placeholder={placeholder ? placeholder.replace("Email", "Tên email") : ""}
            className="email-prefix"
            autoComplete="off"
            {...props}
          />
          <div className="email-domain">@gmail.com</div>
        </div>
      </div>
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

export const CustomCheckbox = ({ label, ...props }) => (
  <label className="custom-checkbox">
    <input type="checkbox" {...props} />
    <span className="checkmark" />
    <span>{label}</span>
  </label>
);

export const SocialButton = ({ icon, label, color, onClick }) => (
  <motion.button
    type="button"
    className={`social-button ${label.toLowerCase()}`}
    style={{ "--button-color": color }}
    onClick={onClick}
    whileHover={{ scale: 1.05 }}
    whileTap={{ scale: 0.95 }}
  >
    <motion.span className="icon">{icon}</motion.span>
    <span className="label">{label}</span>
  </motion.button>
);
