import React from 'react'
import styles from "../../styles/HorizontalListView.module.css";
import useIPFS from "../../services/ipfs";

const ListItem = ({ game, isScaled }) => {
    const { get } = useIPFS()
    return (
        <a href={game ? `/game/${game.id}` : ''}>
            <li className={styles["list-item-container"] + (isScaled ? ` ${styles['grid']}` : "")}>
                <img
                    src={game.thumbnail ? get(game.thumbnail) : 'https://c4.wallpaperflare.com/wallpaper/687/871/639/video-game-sekiro-shadows-die-twice-hd-wallpaper-preview.jpg'}
                    className={styles["list-item"] + (isScaled ? ` ${styles['grid']}` : "")}
                    onMouseOver={(e) => {
                        e.currentTarget.src = game.preview ? get(game.preview) : `${window.origin}/sample.gif`;
                    }}
                    onMouseLeave={(e) => {
                        e.currentTarget.src =
                            game.thumbnail ? get(game.thumbnail) : 'https://c4.wallpaperflare.com/wallpaper/687/871/639/video-game-sekiro-shadows-die-twice-hd-wallpaper-preview.jpg';
                    }}
                />
            </li>
        </a>
    )
}

export default ListItem