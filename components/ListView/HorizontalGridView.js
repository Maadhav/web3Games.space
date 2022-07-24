import React, { useEffect } from 'react'
import PropTypes from 'prop-types';
import styles from "../../styles/HorizontalListView.module.css";
import ListItem from './ListItem';

const HorizontalGridView = ({ list, index }) => {
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
        <div className={styles["list-view-container"] + ` ${styles.grid} prime-carousel`}>
            {showArrow && <button className={styles['left-arrow-container']} style={{ height: '210px' }} onClick={(e) => {
                ref.current.scrollTo({
                    left: ref.current.scrollLeft - ref.current.clientWidth,
                    behavior: 'smooth'
                })
            }}></button>}
            <ul className={styles["list-view"] + ` ${styles.grid} prime-carousel-container`} ref={ref}>
                {Object.values(list).map((item, index) => {
                    if (item instanceof Array) {
                        return <div style={{ display: "inline-block" }}>
                            <div style={{ display: "grid", gridTemplateColumns: "auto auto", gap: "10px 0px" }}>
                                {item.map((i, index) => {
                                    return <ListItem key={index} game={i} />
                                })}
                            </div>
                        </div>
                    }
                    return (
                        <ListItem key={index} game={item} isScaled={true} />
                    );
                })}
            </ul>
            {<button className={styles['right-arrow-container']} style={{ height: '210px' }} onClick={(e) => {
                ref.current.scrollTo({
                    left: ref.current.scrollLeft + ref.current.clientWidth,
                    behavior: 'smooth'
                })
            }}></button>}
        </div>
    )
}

HorizontalGridView.prototype = {
    list: PropTypes.array
}

export default HorizontalGridView