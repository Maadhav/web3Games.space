import "../styles/globals.css";
import Main from "../components/layouts/MainLayout"

function MyApp({ Component, pageProps }) {
  const getLayout = Component.getLayout
  return (getLayout ? getLayout(

    <Component {...pageProps} />) :
    <Main >
      <Component {...pageProps} />
    </Main >)
}

export default MyApp;