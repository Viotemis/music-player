import { GlobalContextWrapper } from "../context";
import Layout from "../components/Layout";
import "../styles/globals.css";
import { process_api_data } from "../util";
import useSWR, { SWRConfig } from "swr";
import { QueryClientProvider, QueryClient } from "react-query";

const queryClient = new QueryClient();

function MyApp({ Component, pageProps }) {
  return (
    <QueryClientProvider client={queryClient}>
      <SWRConfig
        value={{
          fetcher: (...args) => fetch(...args).then((res) => res.json()),
          // .then(
          //   (res) =>
          //     new Promise((resolve, reject) => {
          //       try {
          //         const processe_data = process_api_data(res);
          //         resolve(processe_data);
          //       } catch (e) {
          //         reject(e);
          //       }
          //     })
          // ),
        }}
      >
        <GlobalContextWrapper>
          <Layout>
            <Component {...pageProps} />
          </Layout>
          {/* <Component {...pageProps} /> */}
        </GlobalContextWrapper>
      </SWRConfig>
    </QueryClientProvider>
  );
}

export default MyApp;
