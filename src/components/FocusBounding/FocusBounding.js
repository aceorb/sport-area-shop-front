import React, { useRef, useCallback, useEffect } from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';

const FocusBounding = (props) => {
    const { children, disabled } = props;

    const childRef = useRef(null);
    const childNodeRef = useRef(null);
    const startingBoundRef = useRef(null);
    const endingBoundRef = useRef(null);

    const handleDocumentKeyDown = useCallback(
        (ev) => {
            if (ev.key !== 'Tab' || disabled) {
                return;
            }

            let backward = false;

            if (ev.shiftKey) {
                backward = true;
            }

            if (!childNodeRef.current.contains(ev.target)) {
                if (ev.target.isEqualNode(endingBoundRef.current) && !backward) {
                    startingBoundRef.current.focus();
                } else if (ev.target.isEqualNode(startingBoundRef.current) && backward) {
                    endingBoundRef.current.focus();
                }
            }
        },
        [disabled]
    );

    useEffect(() => {
        // This is required for compatibility with react-transition-group which don't apply React.forwardRef
        childNodeRef.current = ReactDOM.findDOMNode(childRef.current);

        startingBoundRef.current.focus();
    }, []);

    useEffect(() => {
        document.addEventListener('keydown', handleDocumentKeyDown, true);

        return () => {
            document.removeEventListener('keydown', handleDocumentKeyDown, true);
        };
    }, [handleDocumentKeyDown]);

    return (
        <>
            <div
                role="presentation"
                tabIndex="0"
                ref={startingBoundRef}
                data-test="starting-bound"
            />
            {React.cloneElement(children, { ref: childRef, tabIndex: '-1' })}
            <div role="presentation" tabIndex="0" ref={endingBoundRef} data-test="ending-bound" />
        </>
    );
};

FocusBounding.propTypes = {
    children: PropTypes.node.isRequired,
    disabled: PropTypes.bool
};

export default FocusBounding;
