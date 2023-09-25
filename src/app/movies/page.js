"use client";

import CircleLoader from "@/components/circle-loader";
import CommonLayout from "@/components/common-layout";
import ManageAccounts from "@/components/manage-accounts";
import UnAuthPage from "@/components/unauth-page";
import { defaultMovieBanner } from "@/constants";
import { GlobalContext } from "@/context";
import { getAllFavorites, getTvOrMoviesByGenre } from "@/utils";
import { useSession } from "next-auth/react";
import { useContext, useEffect, useState } from "react";

export default function Movies() {
  const { loggedInAccount, mediaData, setMediaData } =
    useContext(GlobalContext);
  const { data: session } = useSession();
  const [pageLoader, setPageLoader] = useState(false);

  useEffect(() => {
    async function getAllMedias() {
      try {
        setPageLoader(true);
        const actionAdventure = await getTvOrMoviesByGenre("movie", 10759);
        const crime = await getTvOrMoviesByGenre("movie", 80);
        const comedy = await getTvOrMoviesByGenre("movie", 35);
        const family = await getTvOrMoviesByGenre("movie", 10751);
        const mystery = await getTvOrMoviesByGenre("movie", 9648);
        const reality = await getTvOrMoviesByGenre("movie", 10764);
        const scifiAndFantasy = await getTvOrMoviesByGenre("movie", 10765);
        const war = await getTvOrMoviesByGenre("movie", 10768);
        const western = await getTvOrMoviesByGenre("movie", 37);
        const dramaMovies = await getTvOrMoviesByGenre("movie", 18);
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
            medias: item.medias.map((mediaItem) => {
              return {
                ...mediaItem,
                type: "movie",
                addedToFavorites:
                  allFavorites && allFavorites.length > 0
                    ? allFavorites
                        .map((fav) => fav.movieId)
                        .indexOf(mediaItem.id.toString()) > -1
                    : false,
              };
            }),
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
          <CommonLayout
            mediaData={mediaData}
            defaultBanner={defaultMovieBanner}
          />
        </main>
      )}
    </>
  );
}
