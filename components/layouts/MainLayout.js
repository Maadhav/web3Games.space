import Navbar from "../Navbar/Navbar";
import Head from "next/head";
import styles from "../../styles/Home.module.css";
import React from "react";
import Web3 from "web3";
import ContractABI from "../../build/contracts/Web3GamesSpace.json";
import { StateContext } from "../../pages/StateContext";

const Main = ({ children }) => {
  const [state, setState] = React.useState({
    web3: null,
    contract: null,
    accounts: null,
  });



  React.useEffect(() => {
    const web3 = new Web3('https://rpc-mumbai.maticvigil.com');
    const contract = new web3.eth.Contract(
      ContractABI.abi,
      "0x032FD6B1f03a4522e91E8daAC93121B1d22A7468"
    );
    setState({
      web3: web3,
      contract: contract,
    });
  }, []);
  return (
    <StateContext.Provider value={[state, setState]}>
      <div>
        <Head>
          <meta name="viewport" content="width=device-width, initial-scale=1" />
          <title>Web3Games.Space</title>
          <link rel="preconnect" href="https://fonts.googleapis.com" />
          <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin />
          <link
            href="https://fonts.googleapis.com/css2?family=Fredoka+One&display=swap"
            rel="stylesheet"
          ></link>
          <link
            href="https://fonts.googleapis.com/css2?family=Montserrat:wght@300;400;500;600;700;800;900&display=swap"
            rel="stylesheet"
          ></link>
        </Head>
        <main className={styles.main}>
          <Navbar />
          {children}
        </main>
      </div>
    </StateContext.Provider>
  );
};

export default Main;
