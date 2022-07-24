/* eslint-disable import/no-anonymous-default-export */
import { create as ipfsHttpClient } from 'ipfs-http-client'

import all from "it-all";

const ipfs = ipfsHttpClient("https://ipfs.infura.io:5001/api/v0");

export default () => {
  const uploadFile = async (file) => {
    const added = await ipfs.add(file)
    return added.path
  }
  const uploadFolder = async (files) => {
    try {
      let fileObjectsArray = Array.from(files).map((file) => {
        return {
          path: file.webkitRelativePath.split("/").slice(1).join("/"),
          content: file,
        };
      });

      const results = await all(
        ipfs.addAll(fileObjectsArray, { wrapWithDirectory: true })
      );
      console.log(results);
      const length = results.length;
      const FilesHash = results[length - 1].cid._baseCache.get("z");
      console.log(FilesHash)
      return FilesHash;
    } catch (error) {
      window.alert("Unknown error ocurred");
      console.error(error);
    }
  };

  const get = (cid) => "https://ipfs.infura.io/ipfs/" + cid;

  return {
    uploadFolder,
    get,
    uploadFile
  };
};
