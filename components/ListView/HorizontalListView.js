import React, { useEffect } from 'react'
import PropTypes from 'prop-types';
import styles from "../../styles/HorizontalListView.module.css";
import ListItem from './ListItem';

const HorizontalListView = ({ list, index }) => {
    const [showArrow, setShowArrow] = React.useState(false);
    const ref = React.useRef();

    useEffect(() => {
        const handleScroll = () => {
            if (ref.current.scrollLeft > 0) {
                setShowArrow(() => true);
            } else {
                setShowArrow(() => false);
            }
        }
        ref.current.addEventListener('scroll', handleScroll);
    }, [])

    return (
        <div className={styles["list-view-container"] + " prime-carousel"}>
            {showArrow && <button className={styles['left-arrow-container']} onClick={(e) => {
                ref.current.scrollTo({
                    left: ref.current.scrollLeft - ref.current.clientWidth,
                    behavior: 'smooth'
                })
            }}></button>}
            <ul className={styles["list-view"] + " prime-carousel-container"} ref={ref}>
                {Object.values(list).map((item, index) => {
                    return (
                        <ListItem key={index} game={item} />
                    );
                })}
            </ul>
            {<button className={styles['right-arrow-container']} onClick={(e) => {
                ref.current.scrollTo({
                    left: ref.current.scrollLeft + ref.current.clientWidth,
                    behavior: 'smooth'
                })
            }}></button>}
        </div>
    )
}

HorizontalListView.prototype = {
    list: PropTypes.array
}

export default HorizontalListView