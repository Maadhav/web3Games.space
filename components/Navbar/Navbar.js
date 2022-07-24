import React from 'react'
import styles from '../../styles/Navbar.module.css';
import { FaSearch } from 'react-icons/fa';
import { FiPlusCircle } from 'react-icons/fi';
import Link from 'next/link';
import Web3 from 'web3';
import Web3Modal from "web3modal";
import { StateContext } from '../../pages/StateContext';
import ContractABI from '../../build/contracts/Web3GamesSpace.json'
import { providerOptions } from "../../services/providerOptions";

const Navbar = () => {
    const [active, setActive] = React.useState(false);
    const [state, setState] = React.useContext(StateContext)
    const [web3Modal, setWeb3Modal] = React.useState(null)

    const switchNetwork = async (web3) => {
        const chainId = await web3.eth.getChainId();
        console.log(web3);
        if (chainId != 80001)
            try {
                await web3.currentProvider.request({
                    method: "wallet_switchEthereumChain",
                    params: [{ chainId: toHex(80001) }],
                });
            } catch (switchError) {
                console.log(switchError);
                if (switchError.code === 4902) {
                    try {
                        await web3.currentProvider.request({
                            method: "wallet_addEthereumChain",
                            params: [
                                {
                                    chainId: `${toHex(80001)}`,
                                    rpcUrls: ["https://rpc-mumbai.maticvigil.com"],
                                    chainName: "Celo Mainnet",
                                    nativeCurrency: {
                                        name: "POLYGON Mumbai",
                                        decimals: 18,
                                        symbol: "MATIC",
                                    },
                                    blockExplorerUrl: ["https://mumbai.polygonscan.com/"],
                                    iconUrls: [
                                        "https://cryptocompare.com/media/37746047/matic.png",
                                    ],
                                },
                            ],
                        });
                    } catch (error) {
                        console.log(error);
                    }
                }
            }
    };

    React.useEffect(() => {
        setWeb3Modal(new Web3Modal({
            network: "mumbai",
            cacheProvider: true,
            providerOptions: providerOptions,
        }));
        // disconnectWallet();
    }, [])

    React.useEffect(() => {
        if (web3Modal && web3Modal.cachedProvider) {
            connectWallet()
        }
    }, [web3Modal])

    const connectWallet = async () => {
        var result = await web3Modal.connect();
        const web3 = new Web3(result);
        await switchNetwork(web3);
        web3.givenProvider = web3.currentProvider;
        web3.eth.givenProvider = web3.currentProvider;
        web3.eth.accounts.givenProvider = web3.currentProvider;
        web3.eth.setProvider(Web3.givenProvider);
        web3.eth.transactionBlockTimeout = 100;
        const contract = new web3.eth.Contract(
            ContractABI.abi,
            "0x032FD6B1f03a4522e91E8daAC93121B1d22A7468"
        );
        const accounts = await web3.eth.getAccounts();
        setState(val => ({ contract: contract, web3: web3, accounts: accounts }))

    }

    const disconnectWallet = () => {
        web3Modal = new Web3Modal({
            network: "mumbai",
            cacheProvider: true,
            providerOptions: providerOptions,
        });
        web3Modal.clearCachedProvider();
        setState(val => ({ ...val, accounts: null }))
    }

    const toHex = (num) => {
        const val = Number(num);
        return "0x" + val.toString(16);
    };
    return (
        <div className={styles['nav-container']}>
            <div className={styles['logo-container']}>Web3Games.Space
                <div className={styles['drop-down-button']} onClick={(e) => {
                    setActive((val) => !val);
                }}>
                    <svg className={styles['arrow-button'] + (active ? ` ${styles.active}` : "")} focusable="false" viewBox="0 0 24 24" aria-hidden="true"><path fillRule="evenodd" clipRule="evenodd" d="M21.6699 7.25758C22.08 7.62758 22.1124 8.25991 21.7424 8.66994L14.2424 16.9814C13.0169 18.3395 10.9831 18.3395 9.75757 16.9814L2.25757 8.66994C1.88757 8.25991 1.92002 7.62758 2.33005 7.25758C2.74008 6.88759 3.37241 6.92004 3.74241 7.33006L11.2424 15.6415C11.6737 16.1195 12.3263 16.1195 12.7576 15.6415L20.2576 7.33006C20.6276 6.92004 21.2599 6.88759 21.6699 7.25758Z"></path></svg>
                    {/* <div className={styles['menubar'] + (active ? ` ${styles.active}` : "")}>
                        <ul className={styles['menu-list']}>
                            <li className={styles['menu-item']} role="menuitem">
                                Home<span class={styles['css-w0pj6f']}></span>
                            </li>
                            <li className={styles['menu-item']} role="menuitem">
                                About<span class={styles['css-w0pj6f']}></span>
                            </li>
                            <li className={styles['menu-item']} role="menuitem">
                                Contact<span class={styles['css-w0pj6f']}></span>
                            </li>
                        </ul>
                    </div> */}
                </div>
            </div>
            <div style={{ flex: 1 }} />
            {/* <div className={styles['search-container']}>
                <input type='text' placeholder='Search Games' className={styles['search-input']} />
                <FaSearch />
            </div> */}
            <a href={'/create'}>
                <FiPlusCircle color='fff' size={26} />
            </a>
            {<div style={{ backgroundColor: "rgb(105, 55, 185)", cursor: "pointer", padding: "5px 10px", fontSize: "0.7em", borderRadius: "5px", marginRight: "10px" }} onClick={() => {
                if (!state.accounts)
                    connectWallet()
                else
                    disconnectWallet()
            }}>{state.accounts ? `${state.accounts[0].slice(0, 10)}...${state.accounts[0].slice(state.accounts[0].length - 5)}` : `Connect`}</div>}
        </div>
    )
}

export default Navbar