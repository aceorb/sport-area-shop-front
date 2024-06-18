import React, {
    useState,
    useEffect,
    useCallback,
    useRef,
    useImperativeHandle,
    forwardRef
} from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

const Input = forwardRef(function Input({ type, disabled, autoFocus, fullWidth, ...props }, ref) {
    const [focused, setFocused] = useState(false);
    const inputRef = useRef(null);

    useEffect(() => {
        if (autoFocus) {
            inputRef.current.focus();
        }
    }, [autoFocus]);

    useImperativeHandle(
        ref,
        () => ({
            focus: () => {
                inputRef.current.focus();
            },
            el: inputRef
        }),
        []
    );

    const handleFocus = useCallback((ev) => {
        setFocused(true);
    }, []);

    const handleBlur = useCallback((ev) => {
        setFocused(false);
    }, []);

    const inputEl = (
        <input type={type} ref={inputRef} className="input__el" {...{ disabled }} {...props} />
    );

    return (
        <div
            role="presentation"
            className={classNames('input', {
                'input--disabled': disabled,
                'input--focused': focused,
                'input--full-width': fullWidth
            })}
            tabIndex={-1}
            onFocus={handleFocus}
            onBlur={handleBlur}
        >
            {inputEl}
        </div>
    );
});

Input.propTypes = {
    type: PropTypes.string,
    disabled: PropTypes.bool,
    autoFocus: PropTypes.bool,
    fullWidth: PropTypes.bool
};

Input.defaultProps = {
    type: 'text'
};

export default Input;
