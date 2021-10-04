import "../styles/tailwind.css";
import Layout from "../components/Layout";
import { ApolloProvider } from "@apollo/client";
import apolloClient from "../lib/apollo";
import { UserProvider } from "@auth0/nextjs-auth0";

function MyApp({ Component, pageProps }) {
  return (
    <ApolloProvider client={apolloClient}>
      <UserProvider>
        <Layout>
          <Component {...pageProps} />
        </Layout>
      </UserProvider>
    </ApolloProvider>
  );
}

export default MyApp;
