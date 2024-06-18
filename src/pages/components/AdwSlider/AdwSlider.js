import React from 'react';
import PropTypes from 'prop-types';
import Carousel from '@components/Carousel';

const AdwSlider = ({ data, className }) => {
    if (!data || data.length === 0) {
        return null;
    }

    return (
        <Carousel autoPlay interval={10000} control="hover" className={className}>
            {data.map(({ id, image }, i) => (
                <img key={id} src={image} alt="" />
            ))}
        </Carousel>
    );
};

AdwSlider.propTypes = {
    data: PropTypes.arrayOf(
        PropTypes.shape({
            id: PropTypes.number.isRequired,
            image: PropTypes.string.isRequired
        })
    ),
    className: PropTypes.string
};

export default AdwSlider;
