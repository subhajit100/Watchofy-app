"use client";

import CircleLoader from "@/components/circle-loader";
import CommonLayout from "@/components/common-layout";
import ManageAccounts from "@/components/manage-accounts";
import UnAuthPage from "@/components/unauth-page";
import { defaultBrowseBanner } from "@/constants";
import { GlobalContext } from "@/context";
import {
  getAllFavorites,
  getPopularMedias,
  getTopRatedMedias,
  getTrendingMedias,
} from "@/utils";
import { useSession } from "next-auth/react";
import { useContext, useEffect, useState } from "react";

export default function Browse() {
  const { loggedInAccount, mediaData, setMediaData } =
    useContext(GlobalContext);
  const { data: session } = useSession();
  const [pageLoader, setPageLoader] = useState(false);

  useEffect(() => {
    async function getAllMedias() {
      try {
        setPageLoader(true);
        const trendingTVShows = await getTrendingMedias("tv");
        const topRatedTVShows = await getTopRatedMedias("tv");
        const popularTVShows = await getPopularMedias("tv");

        const trendingMovieShows = await getTrendingMedias("movie");
        const topRatedMovieShows = await getTopRatedMedias("movie");
        const popularMovieShows = await getPopularMedias("movie");

        const allFavorites = await getAllFavorites(
          session?.user?.uid,
          loggedInAccount?._id
        );

        setMediaData([
          ...[
            {
              title: "Trending TV Shows",
              medias: trendingTVShows,
            },
            {
              title: "Popular TV Shows",
              medias: popularTVShows,
            },
            {
              title: "Top Rated TV Shows",
              medias: topRatedTVShows,
            },
          ].map((item) => ({
            ...item,
            medias: item.medias.map((mediaItem) => ({
              ...mediaItem,
              type: "tv",
              addedToFavorites:
                allFavorites && allFavorites.length > 0
                  ? allFavorites
                      .map((fav) => fav.movieId)
                      .indexOf(mediaItem.id.toString()) > -1
                  : false,
            })),
          })),
          ...[
            {
              title: "Trending Movies",
              medias: trendingMovieShows,
            },
            {
              title: "Popular Movies",
              medias: popularMovieShows,
            },
            {
              title: "Top Rated Movies",
              medias: topRatedMovieShows,
            },
          ].map((item) => ({
            ...item,
            medias: item.medias.map((mediaItem) => ({
              ...mediaItem,
              type: "movie",
              addedToFavorites:
                allFavorites && allFavorites.length > 0
                  ? allFavorites
                      .map((fav) => fav.movieId)
                      .indexOf(mediaItem.id.toString()) > -1
                  : false,
            })),
          })),
        ]);
        setPageLoader(false);
      } catch (err) {
        console.log(err);
        setPageLoader(false);
      }
    }

    getAllMedias();
  }, []);

  if (!session) {
    return <UnAuthPage />;
  }
  if (!loggedInAccount) {
    return <ManageAccounts />;
  }

  if (pageLoader) {
    return <CircleLoader />;
  }

  return (
    <>
      <main className="flex min-h-screen flex-col">
        <CommonLayout
          mediaData={mediaData}
          defaultBanner={defaultBrowseBanner}
        />
      </main>
    </>
  );
}
