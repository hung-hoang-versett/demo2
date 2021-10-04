// /pages/index.tsx
import Head from "next/head";
import { gql, useQuery, useMutation } from "@apollo/client";
import { AwesomeLink } from "../components/AwesomeLink";
import { useUser } from "@auth0/nextjs-auth0";

const AllLinksQuery = gql`
  query allLinksQuery($first: Int, $after: String) {
    links(first: $first, after: $after) {
      pageInfo {
        endCursor
        hasNextPage
      }
      edges {
        cursor
        node {
          imageUrl
          url
          title
          category
          description
          id
        }
      }
    }
  }
`;
const getUser = gql`
  query GetUser($email: String) {
    user(email: $email) {
      email
      id
      bookmarks {
        id
      }
    }
  }
`;
const toggleLikeMutation = gql`
  mutation ToggleLike($linkId: String, $userId: String, $isLiked: Boolean) {
    toggleLike(linkId: $linkId, userId: $userId, isLiked: $isLiked) {
      bookmarks {
        category
        id
      }
    }
  }
`;

function Home() {
  const { data, loading, error, fetchMore } = useQuery(AllLinksQuery, {
    variables: { first: 2 },
  });
  const { user } = useUser();
  const userData = useQuery(getUser, {
    variables: {
      email: user?.email,
    },
  });
  const [toggleLike] = useMutation(toggleLikeMutation, {
    refetchQueries: [getUser],
  });
  const bookmarks = userData?.data?.user?.bookmarks;

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Oh no... {error.message}</p>;

  const { endCursor, hasNextPage } = data.links.pageInfo;
  return (
    <div>
      <Head>
        <title>Awesome Links</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      {user ? (
        <a
          href="/api/auth/logout"
          className="px-4 py-2 bg-blue-500 text-white rounded my-10"
        >
          Logout
        </a>
      ) : (
        <a
          href="/api/auth/login"
          className="px-4 py-2 bg-blue-500 text-white rounded my-10"
        >
          Login
        </a>
      )}

      <div className="container mx-auto max-w-5xl my-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {data?.links.edges.map(({ node }) => {
            const isLiked =
              bookmarks && !!bookmarks.find((item) => item.id === node.id);
            return (
              <AwesomeLink
                title={node.title}
                category={node.category}
                url={node.url}
                id={node.id}
                description={node.description}
                imageUrl={node.imageUrl}
                key={node.id}
                isLiked={isLiked}
                isLogin={!!user}
                onClick={() =>
                  toggleLike({
                    variables: {
                      linkId: node.id,
                      userId: userData?.data?.user?.id,
                      isLiked,
                    },
                  })
                }
              />
            );
          })}
        </div>
        {hasNextPage ? (
          <button
            className="px-4 py-2 bg-blue-500 text-white rounded my-10"
            onClick={() => {
              fetchMore({
                variables: { after: endCursor },
                updateQuery: (prevResult: any, { fetchMoreResult }: any) => {
                  fetchMoreResult.links.edges = [
                    ...prevResult.links.edges,
                    ...fetchMoreResult.links.edges,
                  ];
                  return fetchMoreResult;
                },
              });
            }}
          >
            more
          </button>
        ) : (
          <p className="my-10 text-center font-medium">
            You've reached the end!{" "}
          </p>
        )}
      </div>
    </div>
  );
}

export default Home;
