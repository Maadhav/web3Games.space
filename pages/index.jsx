import React, { useEffect, useContext, useState } from "react";
import styles from "../styles/Home.module.css";
import HorizontalListView from "../components/ListView/HorizontalListView";
import HorizontalGridView from "../components/ListView/HorizontalGridView";
import Header from "../components/Header";
import { StateContext } from "./StateContext";
import { useRouter } from "next/router";
import Tags from "../public/data/tags.json"
import { getLatestGames } from "../services/covalent";



export default function Home({ }) {
  const [state,] = useContext(StateContext)
  const router = useRouter()
  const [games, setGames] = useState([])
  const [recommended, setRecommended] = useState([])

  const getData = async () => {
    var data = await state.contract.methods.getAll().call();
    var _games = [];
    for (const key in data) {
      const element = data[key];
      console.log(element)
      const game = {
        cid: element.cid,
        thumbnail: element.thumbnail,
        preview: element.preview,
        title: element.title,
        description: element.description,
        tags: element.tags,
        creator: element.creator,
        id: element.id,
        timestamp: element.timestamp,
      }
      _games.push(game)
    }
    setGames(_games)
  }

  React.useEffect(() => {
    // getFileUpload();
    if (state.web3)
      getLatestGames(state.web3).then(res => {
        var _games = [];
        for (const key in res) {
          const element = res[key];
          console.log(element)
          const game = {
            cid: element.cid,
            thumbnail: element.thumbnail,
            preview: element.preview,
            title: element.title,
            description: element.description,
            tags: element.tags,
            creator: element.creator,
            id: element.id,
            timestamp: element.timestamp,
          }
          _games.push(game)
        }
        setRecommended(sortGames(_games))
      });
  }, [state.web3]);

  const sortGames = (games) => {
    let rs = [];
    let temp = [];
    for (let i = 0; i < games.length; i++) {
      let item = games[i];
      const mod = i % 5
      if (mod == 0) {
        if (temp.length != 0)
          rs.push(temp);
        rs.push(item);
        temp = [];
      } else {
        temp.push(item);
      }
    }
    if (temp.length != 0)
      rs.push(temp);
    return rs;
  }


  useEffect(() => {
    if (state.web3) {
      getData()
    }
  }, [state]);

  return (

    <div className={styles.container}>

      <div style={{ paddingTop: "24px" }} />
      <Header title={"Recommended game for You"} key="-1" onTap={() => { }} />
      <HorizontalGridView index={-1} key={-1 + " list"} list={recommended} />
      {
        Tags.map((tag, index) => {
          if (
            games.map(e => e.tags.includes(tag.id.toString()) ? e : null).filter(e => e !== null).length === 0) {
            return <div />
          }
          return <>

            <Header title={tag.name + " game"} key={index + " header"} onTap={() => { }} />
            <HorizontalListView index={index} key={index + " list"} list={games.map(e => e.tags.includes(tag.id.toString()) ? e : null).filter(e => e !== null)} />
          </>
        })
      }
    </div>
  );
}