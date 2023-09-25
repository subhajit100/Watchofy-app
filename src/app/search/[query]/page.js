"use client";

import ManageAccounts from "@/components/manage-accounts";
import UnAuthPage from "@/components/unauth-page";
import { GlobalContext } from "@/context";
import { getAllFavorites, getTvorMovieSearchResults } from "@/utils";
import { useSession } from "next-auth/react";
import { useParams } from "next/navigation";
import { useContext, useEffect, useState } from "react";
import { motion } from "framer-motion";
import Navbar from "@/components/navbar";
import MediaItem from "@/components/media-item";
import CircleLoader from "@/components/circle-loader";

export default function Search() {
  const { loggedInAccount, searchResults, setSearchResults } =
    useContext(GlobalContext);
  const [pageLoader, setPageLoader] = useState(false);
  const { data: session } = useSession();
  const params = useParams();
  useEffect(() => {
    async function getSearchResults() {
      try {
        setPageLoader(true);
        const tvShows = await getTvorMovieSearchResults("tv", params.query);
        const movies = await getTvorMovieSearchResults("movie", params.query);
        const allFavorites = await getAllFavorites(
          session?.user?.uid,
          loggedInAccount?._id
        );
        setSearchResults([
          ...tvShows
            .filter((item) => item.backdrop_path && item.poster_path)
            .map((tvShowItem) => ({
              ...tvShowItem,
              type: "tv",
              addedToFavorites:
                allFavorites && allFavorites.length > 0
                  ? allFavorites
                      .map((fav) => fav.movieId)
                      .indexOf(tvShowItem.id.toString()) > -1
                  : false,
            })),
          ...movies
            .filter((item) => item.backdrop_path && item.poster_path)
            .map((movieItem) => ({
              ...movieItem,
              type: "movie",
              addedToFavorites:
                allFavorites && allFavorites.length > 0
                  ? allFavorites
                      .map((fav) => fav.movieId)
                      .indexOf(movieItem.id.toString()) > -1
                  : false,
            })),
        ]);
        setPageLoader(false);
      } catch (err) {
        console.log(err);
        setPageLoader(false);
      }
    }

    getSearchResults();
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
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
        >
          <Navbar />
          <div className="mt-[100px] space-y-0.5 md:space-y-2 px-4">
            <h2 className="cursor-pointer text-sm font-semibold text-[#e5e5e5] transition-colors duration-200 hover:text-white md:text-2xl">
              Showing Results for {decodeURI(params.query)}
            </h2>
            <div className="grid grid-cols-5 gap-3 items-center scrollbar-hide md:p-2">
              {searchResults && searchResults.length > 0
                ? searchResults.map((searchItem) => (
                    <MediaItem
                      key={searchItem.id}
                      media={searchItem}
                      searchView={true}
                    />
                  ))
                : null}
            </div>
          </div>
        </motion.div>
      )}
    </>
  );
}
