"use client";

import CircleLoader from "@/components/circle-loader";
import CommonLayout from "@/components/common-layout";
import ManageAccounts from "@/components/manage-accounts";
import UnAuthPage from "@/components/unauth-page";
import { defaultTvBanner } from "@/constants";
import { GlobalContext } from "@/context";
import { getAllFavorites, getTvOrMoviesByGenre } from "@/utils";
import { useSession } from "next-auth/react";
import { useContext, useEffect, useState } from "react";

export default function TV() {
  const { loggedInAccount, mediaData, setMediaData } =
    useContext(GlobalContext);
  const { data: session } = useSession();
  const [pageLoader, setPageLoader] = useState(false);

  useEffect(() => {
    async function getAllMedias() {
      try {
        setPageLoader(true);
        const actionAdventure = await getTvOrMoviesByGenre("tv", 10759);
        const crime = await getTvOrMoviesByGenre("tv", 80);
        const comedy = await getTvOrMoviesByGenre("tv", 35);
        const family = await getTvOrMoviesByGenre("tv", 10751);
        const mystery = await getTvOrMoviesByGenre("tv", 9648);
        const reality = await getTvOrMoviesByGenre("tv", 10764);
        const scifiAndFantasy = await getTvOrMoviesByGenre("tv", 10765);
        const war = await getTvOrMoviesByGenre("tv", 10768);
        const western = await getTvOrMoviesByGenre("tv", 37);
        const dramaMovies = await getTvOrMoviesByGenre("tv", 18);
        const allFavorites = await getAllFavorites(
          session?.user?.uid,
          loggedInAccount?._id
        );

        setMediaData(
          [
            {
              title: "Action and adventure",
              medias: actionAdventure,
            },
            {
              title: "Crime",
              medias: crime,
            },
            {
              title: "Comedy",
              medias: comedy,
            },
            {
              title: "Family",
              medias: family,
            },
            {
              title: "Mystery",
              medias: mystery,
            },
            {
              title: "Reality",
              medias: reality,
            },
            {
              title: "Sci-Fi and Fantasy",
              medias: scifiAndFantasy,
            },
            {
              title: "Western",
              medias: western,
            },
            {
              title: "War",
              medias: war,
            },
            {
              title: "Dramas",
              medias: dramaMovies,
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
          }))
        );
        setPageLoader(false);
      } catch (err) {
        console.log(err);
        setPageLoader(false);
      }
    }

    getAllMedias();
  }, [loggedInAccount]);

  if (!session) {
    return <UnAuthPage />;
  }
  if (!loggedInAccount) {
    return <ManageAccounts />;
  }

  return (
    <>
      {pageLoader ? (
        <CircleLoader />
      ) : (
        <main className="flex min-h-screen flex-col">
          <CommonLayout mediaData={mediaData} defaultBanner={defaultTvBanner} />
        </main>
      )}
    </>
  );
}
