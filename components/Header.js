import React from 'react'
import styles from '../styles/Header.module.css'

const Header = ({ title, onTap }) => {
    return (
        <div className={styles["header-container"]}>
            <div className={styles['header-title']}>{title}</div>
            <div className={styles['header-action']}>View more</div>
        </div>
    )
}

export default Header