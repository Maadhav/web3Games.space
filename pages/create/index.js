import React, { useContext, useState } from "react";
import styles from "../../styles/Create.module.css";
import { FiMinusCircle } from "react-icons/fi";
import { Form } from "react-bootstrap";
import useIPFS from "../../services/ipfs";
import "bootstrap/dist/css/bootstrap.min.css";
import { StateContext } from "../StateContext";
import { useRouter } from "next/router";
import Tags from "../../public/data/tags.json";
import { getLatestGames } from "../../services/covalent";

const Create = () => {
  const { get, uploadFolder, uploadFile } = useIPFS();
  const [loading, setLoading] = useState(false);
  const [state, setState] = useState({
    title: "",
    description: "",
    developer: "",
    platform: "",
    tags: [],
  });

  const router = useRouter();

  const [globalState] = useContext(StateContext);

  const [changeSystem, setChangeSystem] = useState(false);

  const ref = React.useRef();

  const [files, setFiles] = useState(null);

  const [thumbnail, setThumbnail] = useState(null);

  const [preview, setPreview] = useState(null);

  const handleChange = (e) => {
    setState((val) => {
      return {
        ...val,
        [e.target.name]: e.target.value,
      };
    });
  };

  const handleTags = (e) => {
    console.log(e.target.value);
    setState((val) => {
      return {
        ...val,
        tags: [...val.tags, Tags.find((tag) => tag.name === e.target.value).id],
      };
    });

    setTimeout(() => {
      e.target.value = "";
    }, 100);
  };



  React.useEffect(() => {
    ref.current.addEventListener("keypress", function (e) {
      if (e.key === "Enter") {
        if (e.target.value !== "") {
          handleTags(e);
          e.stopImmediatePropagation();
        }
      }
    });
  }, []);

  const handleSubmit = async () => {
    // signMessage()
    setLoading(true);
    if (!changeSystem) {
      var url = await uploadFolder(files);
      setState((val) => {
        return {
          ...val,
          url: url,
        };
      });
    }
    var thumbnailCid = await uploadFile(thumbnail);
    var previewCid = await uploadFile(preview);
    globalState.web3.eth.getAccounts().then(console.log)
    await globalState.contract.methods
      .set(
        changeSystem ? state.url : url,
        thumbnailCid,
        previewCid,
        state.title,
        state.description,
        state.tags,
        Date.now()
      )
      .send({
        from: globalState.accounts[0],
        maxPriorityFeePerGas: null,
        maxFeePerGas: null,
      });
    router.push("/");
    setLoading(false);
  };

  return (
    <div className={styles["create-container"]}>
      <h1>Create</h1>
      <input
        placeholder="Game Name"
        className={styles["create-input"]}
        required
        name="title"
        value={state.title}
        onChange={handleChange}
      />
      <input
        placeholder="Description"
        className={styles["create-input"]}
        name="description"
        value={state.description}
        onChange={handleChange}
        required
        minLength={100}
      />
      <input
        placeholder="Add Tags"
        className={styles["create-input"]}
        list="Tags"
        ref={ref}
      />
      <datalist id="Tags">
        {Tags.map((tag) => {
          return <option key={tag.id} value={tag.name} />;
        })}
      </datalist>
      <div className={styles["tags-grid"]}>
        {state.tags.map((e, i) => {
          return (
            <div key={i} className={styles["tag-tile"]}>
              <img
                className={styles["tag-icon"]}
                src={"https://images.crazygames.com/slitherio.png"}
              />
              {Tags.find((tag) => tag.id === e).name}
              <FiMinusCircle
                onClick={() => {
                  setState((val) => {
                    return {
                      ...val,
                      tags: val.tags.filter((tag) => tag !== e),
                    };
                  });
                }}
              />
            </div>
          );
        })}
      </div>
      <p style={{ fontSize: '0.5em' }}>Enter the <u onClick={() => {
        setChangeSystem(val => !val);
      }}>{!changeSystem ? `existing URL` : `build folder`}</u> instead?</p>
      {changeSystem ? <input
        placeholder="URL"
        className={styles["create-input"]}
        required
        name="url"
        value={state.url}
        onChange={handleChange}
      /> : <Form.Control
        required
        type="file"
        webkitdirectory="true"
        multiple
        onChange={(e) => {
          console.log(e.target.files);
          setFiles(e.target.files);
        }}
        className={styles["create-file-input"] + " mb-3"}
      />}
      <div style={{ display: "flex", gap: "0 30px", marginBottom: "10px" }}>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            flex: 1,
            justifyContent: "center",
          }}
        >
          <img
            src={thumbnail ? URL.createObjectURL(thumbnail) : null}
            style={{ maxHeight: "300px", objectFit: "cover" }}
          />
          <input
            type={"file"}
            id="thumbnail-input"
            onChange={(e) => setThumbnail(e.target.files[0])}
            accept={"image/*"}
            style={{ display: "none" }}
          />
          <label
            htmlFor="thumbnail-input"
            style={{
              textAlign: "center",
              backgroundColor: "#3c1e6e",
              padding: "4px 0px",
            }}
          >
            Upload Thumbnail
          </label>
        </div>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            flex: 1,
            justifyContent: "center",
          }}
        >
          <img
            src={preview ? URL.createObjectURL(preview) : null}
            style={{ maxHeight: "300px", objectFit: "cover" }}
          />
          <input
            type={"file"}
            id="preview-input"
            onChange={(e) => setPreview(e.target.files[0])}
            accept={".gif"}
            style={{ display: "none" }}
          />
          <label
            htmlFor="preview-input"
            style={{
              textAlign: "center",
              backgroundColor: "#3c1e6e",
              padding: "4px 0px",
            }}
          >
            Upload Preview (.gif)
          </label>
        </div>
      </div>
      <button
        className={styles["create-button"]}
        onClick={() => {
          handleSubmit()
        }}
        disabled={loading}
      >
        Create
      </button>
      {loading && <div style={{ position: "fixed", height: "100vh", width: "100vw", zIndex: "9999", top: 0, left: 0, background: "rgba(0,0,0,0.4)", display: "flex", justifyContent: "center", alignItems: "center" }}>
        Loading...
      </div>}
    </div>
  );
};

export default Create;
