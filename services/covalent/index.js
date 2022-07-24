import React from "react";
import { StateContext } from "../../context/StateContext";

const COVALENT_API_KEY = "ckey_bd05b31f2ce64d8eb4eac37b376";
const CONTRACT_ADDRESS = "0x032FD6B1f03a4522e91E8daAC93121B1d22A7468";
export const getLatestGames = async (web3) => {
  const blockNumber = await web3.eth.getBlockNumber();
  const typesArray = [
    { type: "uint256", name: "id" },
    { type: "string", name: "cid" },
    { type: "string", name: "thumbnail" },
    { type: "string", name: "preview" },
    { type: "string", name: "title" },
    { type: "string", name: "description" },
    { type: "address", name: "creator" },
    { type: "uint256[]", name: "tags" },
    { type: "uint256", name: "timestamp" },
  ];
  const items = (
    await (
      await fetch(
        `https://api.covalenthq.com/v1/80001/events/address/${CONTRACT_ADDRESS}/?quote-currency=USD&format=JSON&starting-block=%20${blockNumber - 1000000
        }&ending-block=%20${blockNumber}&key=${COVALENT_API_KEY}`
      )
    ).json()
  ).data.items;

  const res = items.map((item) =>
    web3.eth.abi.decodeParameters(typesArray, item.raw_log_data)
  );

  console.log(res);
  return res;
};
