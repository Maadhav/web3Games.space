import React from 'react'
import { Router, useRouter } from 'next/router'
import styles from '../../styles/Game.module.css'
import { FiShare2, FiHeart } from 'react-icons/fi';
import HorizontalListView from '../../components/ListView/HorizontalListView';
import { StateContext } from '../StateContext';
import useIPFS from "../../services/ipfs";
import Tags from '../../public/data/tags.json'

const Game = () => {
    const id = useRouter().query.game
    const { get } = useIPFS()
    const ref = React.useRef()
    const [state, setState] = React.useState(null);
    const [globalState,] = React.useContext(StateContext)
    const loadingRef = React.useRef()

    const getData = async () => {
        console.log(globalState)
        if (globalState.contract && globalState.accounts && !state) {
            console.log("Getting data");
            globalState.contract.methods.getFromId(id).call().then(game => {
                var date = new Date(parseInt(game.timestamp));
                setState({
                    cid: game.cid,
                    title: game.title,
                    description: game.description,
                    tags: game.tags,
                    creator: game.creator,
                    id: game.id,
                    date: date,
                    timestamp: game.timestamp,
                })
            })
        }
    }

    function convertMonth(month) {
        switch (month) {
            case 1:
                return "January"
            case 2:
                return "February"
            case 3:
                return "March"
            case 4:
                return "April"
            case 5:
                return "May"
            case 6:
                return "June"
            case 7:
                return "July"
            case 8:
                return "August"
            case 9:
                return "September"
            case 10:
                return "October"
            case 11:
                return "November"
            case 12:
                return "December"
            default:
                return "Unknown"
        }
    }

    React.useEffect(() => {
        getData()
    }, [globalState])


    React.useEffect(() => {
        

        if (state) {
            ref.current.addEventListener('load', function () {
                // Hide the loading indicator
                loadingRef.current.style.display = 'none';
                // Bring the iframe back
                ref.current.style.opacity = 1;
            });
        }
    }, [state])

    if (!state) {
        return <div>Loading...</div>
    }
    return (
        <div style={{ margin: "8px 20px" }}>
            <div className={styles['frame-container']}>
                <div className={styles['frame-loading']} ref={loadingRef}>
                    <div className={styles["pl"]}>
                        <div className={styles["pl__dot"]}></div>
                        <div className={styles["pl__dot"]}></div>
                        <div className={styles["pl__dot"]}></div>
                        <div className={styles["pl__dot"]}></div>
                        <div className={styles["pl__dot"]}></div>
                        <div className={styles["pl__dot"]}></div>
                        <div className={styles["pl__dot"]}></div>
                        <div className={styles["pl__dot"]}></div>
                        <div className={styles["pl__dot"]}></div>
                        <div className={styles["pl__dot"]}></div>
                        <div className={styles["pl__dot"]}></div>
                        <div className={styles["pl__dot"]}></div>
                        <div className={styles["pl__text"]}>Loading…</div>
                    </div>
                </div>
                <iframe className={styles['game-iframe']} src={state.cid.includes("https") ? state.cid : get(state.cid)} ref={ref} style={{ opacity: 0 }} />
            </div>
            <div className={styles['game-details']}>
                <div className={styles['game-header']}>
                    <div className={styles['game-tile']}>
                        <h1 className={styles['game-title']}>{state.title}</h1>
                        <div className={styles['game-tags']}>
                            <a className={styles['game-tag']}>{state.tags.length > 1 ? Tags.find((e) => e.id.toString() === state.tags[0]).name : ""}</a>
                            {
                                state.tags.map((tag, index) => {
                                    if (index > 0)
                                        return <span key={index} style={{ display: "flex", gap: "0 10px" }} className={styles['game-tag']}>{'>> '}<a className={styles['game-tag']}>{Tags.find((e) => e.id.toString() === tag).name}</a></span>
                                })
                            }
                        </div>
                    </div>
                    <div className={styles['share-button']}>
                        <FiShare2 />
                    </div>
                    <div className={styles['share-button']}>
                        <FiHeart />
                    </div>
                </div>
                <p>{state.description}</p>
                <h3>Release Date</h3>
                <p>{convertMonth(state.date.getMonth()) + " " + state.date.getFullYear()}</p>
                <h3>Developer</h3>
                <p>{state.title} is developed by {state.creator}</p>
                <h3>Platform</h3>
                <p>Web browser</p>
                <div className={styles['tags-grid']}>
                    {state.tags.map((tag, i) => {
                        return <div key={i} className={styles['tag-tile']}>
                            <img className={styles['tag-icon']} src={'https://images.crazygames.com/slitherio.png'} />
                            {Tags.find((e) => e.id.toString() === tag).name}
                        </div>
                    })}
                </div>
                <h3>Recommended Games</h3>
                <HorizontalListView list={[1, 2, 3, 4]} />
            </div>
        </div>
    )
}

export default Game