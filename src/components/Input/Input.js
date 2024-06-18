import React, { useState, useEffect, useCallback, useRef, forwardRef } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import useForkRef from '@components/hooks/useForkRef';
import InputAdornment from './InputAdornment';

const Input = forwardRef(function Input(props, ref) {
    const {
        type = 'text',
        id,
        name,
        defaultValue,
        value,
        placeholder,
        disabled,
        required,
        readOnly,
        autoFocus,
        autoComplete,
        fullWidth,
        className,
        style,
        inputProps,
        prependAdornment,
        appendAdornment,
        onBlur,
        onFocus,
        onChange,
        onClick,
        onKeyDown,
        onKeyUp,
        ...other
    } = props;

    const [focused, setFocused] = useState(false);

    const inputRef = useRef(null);
    const handleInputRef = useForkRef(inputRef, ref);

    useEffect(() => {
        if (autoFocus) {
            inputRef.current.focus();
        }
    }, [autoFocus]);

    const handleFocus = (ev) => {
        if (onFocus) {
            onFocus(ev);
        }

        setFocused(true);
    };

    const handleBlur = (ev) => {
        if (onBlur) {
            onBlur(ev);
        }

        setFocused(false);
    };

    const handleClick = useCallback((ev) => {
        if (inputRef.current && ev.target === ev.currentTarget) {
            inputRef.current.focus();
        }
    }, []);

    const InputComponent = type === 'textarea' ? 'textarea' : 'input';

    const inputEl = (
        <InputComponent
            type={type}
            ref={handleInputRef}
            className="input__el"
            onFocus={handleFocus}
            onBlur={handleBlur}
            {...{
                disabled,
                id,
                name,
                defaultValue,
                value,
                placeholder,
                required,
                readOnly,
                autoComplete,
                onChange,
                onClick,
                onKeyDown,
                onKeyUp
            }}
            {...inputProps}
        />
    );

    return (
        <div
            role="presentation"
            className={classNames('input', className, {
                'input--disabled': disabled,
                'input--focused': focused,
                'input--full-width': fullWidth
            })}
            style={style}
            tabIndex={-1}
            onClick={handleClick}
        >
            {prependAdornment && (
                <InputAdornment start disabled={disabled}>
                    {prependAdornment(props)}
                </InputAdornment>
            )}
            {inputEl}
            {appendAdornment && (
                <InputAdornment end disabled={disabled}>
                    {appendAdornment(props)}
                </InputAdornment>
            )}
        </div>
    );
});

Input.propTypes = {
    name: PropTypes.string,
    type: PropTypes.string,
    id: PropTypes.string,
    defaultValue: PropTypes.any,
    value: PropTypes.any,
    placeholder: PropTypes.string,
    disabled: PropTypes.bool,
    required: PropTypes.bool,
    readOnly: PropTypes.bool,
    autoFocus: PropTypes.bool,
    autoComplete: PropTypes.bool,
    fullWidth: PropTypes.bool,
    className: PropTypes.string,
    style: PropTypes.object,
    inputProps: PropTypes.object,
    prependAdornment: PropTypes.func,
    appendAdornment: PropTypes.func,
    onBlur: PropTypes.func,
    onFocus: PropTypes.func,
    onChange: PropTypes.func,
    onClick: PropTypes.func,
    onKeyDown: PropTypes.func,
    onKeyUp: PropTypes.func
};

Input.defaultProps = {
    type: 'text'
};

export default Input;
