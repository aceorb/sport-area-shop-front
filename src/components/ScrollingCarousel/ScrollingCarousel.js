import React, { useState, useRef, useEffect, useCallback } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import scroll from 'scroll';
import Scrollbars from 'react-custom-scrollbars';
import debounce from 'lodash/debounce';
import throttle from 'lodash/throttle';

import useEventCallback from '@components/hooks/useEventCallback';
import ScrollingControl from './ScrollingControl';

const ScrollingCarousel = ({ children, disableScrollbar, className }) => {
    const [displayControls, setDisplayControls] = useState({
        prev: false,
        next: false
    });
    const [scrollable, setScrollable] = useState(false);
    const scrollerContentNode = useRef(null);
    const scrollerNode = useRef(null);
    const isDraggableContent = useRef(false);
    const startScrollPositionX = useRef(0);

    const updateDisplayControlsState = useEventCallback(() => {
        const { clientWidth, scrollWidth, scrollLeft } = scrollerNode.current;
        const displayControlPrev = scrollLeft > 0;
        const displayControlNext = clientWidth + scrollLeft < scrollWidth;
        const hasScrolling = scrollWidth > clientWidth;

        setScrollable(hasScrolling);

        if (
            displayControlPrev !== displayControls.prev ||
            displayControlNext !== displayControls.next
        ) {
            setDisplayControls({
                prev: displayControlPrev,
                next: displayControlNext
            });
        }
    }, []);

    useEffect(() => {
        updateDisplayControlsState();
    }, [updateDisplayControlsState]);

    useEffect(() => {
        const handleResizeWindow = throttle(() => {
            updateDisplayControlsState();
        }, 166);

        window.addEventListener('resize', handleResizeWindow);

        return () => {
            window.removeEventListener('resize', handleResizeWindow);
        };
    }, [updateDisplayControlsState]);

    const handleScrollerContentMouseDown = (ev) => {
        ev.preventDefault();

        isDraggableContent.current = true;
        startScrollPositionX.current = ev.clientX + scrollerNode.current.scrollLeft;
    };

    const handleScrollerContentMouseUp = (ev) => {
        ev.preventDefault();

        isDraggableContent.current = false;
    };

    const handleScrollerContentMouseLeave = (ev) => {
        ev.preventDefault();

        isDraggableContent.current = false;
    };

    const handleScrollerContentMouseMove = (ev) => {
        ev.preventDefault();

        if (isDraggableContent.current === true) {
            scrollerNode.current.scrollLeft = startScrollPositionX.current - ev.clientX;
        }
    };

    const scrollContent = useCallback((direction = 'left') => {
        const nextScrollPosition =
            (direction === 'left' ? -1 : 1) * scrollerNode.current.clientWidth +
            scrollerNode.current.scrollLeft;

        scroll.left(scrollerNode.current, nextScrollPosition);
    }, []);

    const handleClickControlNext = useCallback(
        (ev) => {
            scrollContent('right');
        },
        [scrollContent]
    );

    const handleClickControlPrev = useCallback(
        (ev) => {
            scrollContent('left');
        },
        [scrollContent]
    );

    const handleScroll = debounce((ev) => {
        updateDisplayControlsState();
    }, 166);

    const items = React.Children.map(children, (item, i) => {
        return (
            <div key={i} className="scrolling-carousel__item">
                {item}
            </div>
        );
    });

    return (
        <div
            className={classNames('scrolling-carousel', className, {
                'scrolling-carousel--scrollable': scrollable && !disableScrollbar
            })}
        >
            {scrollable && (
                <ScrollingControl
                    type="prev"
                    disabled={!displayControls.prev}
                    onClick={handleClickControlPrev}
                />
            )}
            <div className="scrolling-carousel__body">
                <Scrollbars
                    autoHeight
                    ref={(node) => {
                        scrollerNode.current = (node && node.view) || null;
                    }}
                    {...(disableScrollbar && {
                        renderTrackHorizontal: () => <div />
                    })}
                    onScroll={handleScroll}
                >
                    <div
                        role="presentation"
                        className="scrolling-carousel__scroller-content"
                        ref={scrollerContentNode}
                        onMouseDown={handleScrollerContentMouseDown}
                        onMouseUp={handleScrollerContentMouseUp}
                        onMouseMove={handleScrollerContentMouseMove}
                        onMouseLeave={handleScrollerContentMouseLeave}
                    >
                        <div className="scrolling-carousel__items">{items}</div>
                    </div>
                </Scrollbars>
            </div>

            {scrollable && (
                <ScrollingControl
                    type="next"
                    disabled={!displayControls.next}
                    onClick={handleClickControlNext}
                />
            )}
        </div>
    );
};

ScrollingCarousel.propTypes = {
    children: PropTypes.node.isRequired,
    disableScrollbar: PropTypes.bool,
    className: PropTypes.string
};

export default ScrollingCarousel;
