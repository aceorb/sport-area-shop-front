import React, { useCallback, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

const MenuItem = (props) => {
    const { children, selected, disabled, onClick = () => {}, ...other } = props;
    const itemRef = useRef(null);

    const handleItemClick = useCallback(
        (ev) => {
            ev.preventDefault();

            if (disabled) {
                return;
            }

            onClick(ev);
        },
        [onClick, disabled]
    );

    const handleItemKeyDown = useCallback(
        (ev) => {
            if (ev.key === 'Enter') {
                handleItemClick(ev);
            }
        },
        [handleItemClick]
    );

    useEffect(() => {
        if (selected && itemRef.current) {
            itemRef.current.focus();
        }
    }, [selected]);

    return (
        <div
            role="menuitem"
            className={classNames('menu__item u-focus-outline-0', {
                'menu__item--selected': selected,
                'menu__item--disabled': disabled
            })}
            tabIndex="-1"
            aria-disabled={disabled}
            ref={itemRef}
            onClick={handleItemClick}
            onKeyDown={handleItemKeyDown}
            {...other}
        >
            {children}
        </div>
    );
};

MenuItem.propTypes = {
    children: PropTypes.node.isRequired,
    selected: PropTypes.bool,
    disabled: PropTypes.bool,
    onClick: PropTypes.func
};

export default MenuItem;
