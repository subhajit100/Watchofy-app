"use client";

import React, { useContext, useEffect, useState } from "react";
import { XMarkIcon } from "@heroicons/react/24/outline";
import { motion } from "framer-motion";
import MuiModal from "@mui/material/Modal";
import { GlobalContext } from "@/context";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import {
  getAllFavorites,
  getSimilarTvOrMovies,
  getTvOrMovieDetailsById,
} from "@/utils";
import MediaItem from "../media-item";
import ReactPlayer from "react-player";
import { AiFillPlayCircle } from "react-icons/ai";
import CircleLoader from "../circle-loader";

const DetailsPopup = ({ show, setShow }) => {
  const {
    mediaDetails,
    setMediaDetails,
    similarMedias,
    setSimilarMedias,
    currentMediaInfoIdAndType,
    setCurrentMediaInfoIdAndType,
    loggedInAccount,
  } = useContext(GlobalContext);
  const [pageLoader, setPageLoader] = useState(false);
  const handleClose = () => {
    setShow(false);
  };

  const [key, setKey] = useState("");
  const router = useRouter();
  const { data: session } = useSession();

  useEffect(() => {
    async function getMediaDetails() {
      try {
        setPageLoader(true);
        const extractMediaDetails = await getTvOrMovieDetailsById(
          currentMediaInfoIdAndType.type,
          currentMediaInfoIdAndType.id
        );

        const extractSimilarMovies = await getSimilarTvOrMovies(
          currentMediaInfoIdAndType.type,
          currentMediaInfoIdAndType.id
        );

        const allFavorites = await getAllFavorites(
          session?.user?.uid,
          loggedInAccount?._id
        );

        const findIndexOfTrailer =
          extractMediaDetails &&
          extractMediaDetails.videos &&
          extractMediaDetails.videos.results &&
          extractMediaDetails.videos.results.length > 0
            ? extractMediaDetails.videos.results.findIndex(
                (item) => item.type === "Trailer"
              )
            : -1;

        const findIndexOfClip =
          extractMediaDetails &&
          extractMediaDetails.videos &&
          extractMediaDetails.videos.results &&
          extractMediaDetails.videos.results.length > 0
            ? extractMediaDetails.videos.results.findIndex(
                (item) => item.type === "Clip"
              )
            : -1;
        setMediaDetails(extractMediaDetails);
        setKey(
          findIndexOfTrailer !== -1
            ? extractMediaDetails.videos?.results[findIndexOfTrailer]?.key
            : findIndexOfClip !== -1
            ? extractMediaDetails.videos?.results[findIndexOfClip]?.key
            : "XuDwndGaCFo"
        );
        setSimilarMedias(
          extractSimilarMovies.map((item) => ({
            ...item,
            type: currentMediaInfoIdAndType.type === "movie" ? "movie" : "tv",
            addedToFavorites:
              allFavorites && allFavorites.length > 0
                ? allFavorites
                    .map((fav) => fav.movieId)
                    .indexOf(item.id.toString()) > -1
                : false,
          }))
        );
        setPageLoader(false);
      } catch (err) {
        console.log(err);
        setPageLoader(false);
      }
    }
    if (currentMediaInfoIdAndType) {
      getMediaDetails();
    }
  }, [currentMediaInfoIdAndType, loggedInAccount]);

  return (
    <>
      {pageLoader ? (
        <CircleLoader />
      ) : (
        <motion.div
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{
            duration: 0.8,
            delay: 0.5,
            ease: [0, 0.71, 0.2, 1.01],
          }}
        >
          <MuiModal
            open={show}
            onClose={handleClose}
            className="fixed !top-7 left-0 right-0 z-50 w-full mx-auto max-w-5xl overflow-hidden overflow-y-scroll rounded-md scrollbar-hide"
          >
            <div>
              <button
                onClick={handleClose}
                className="modalButton flex items-center justify-center absolute top-5 right-5 bg-[#181818] hover:bg-[#181818] !z-40 border-none h-9 w-9"
              >
                <XMarkIcon className="h-6 w-6" />
              </button>
              <div className="relative pt-[56.25%]">
                <ReactPlayer
                  url={`https://www.youtube.com/watch?v=${key}`}
                  width={"100%"}
                  height={"100%"}
                  style={{ position: "absolute", top: "0", left: "0" }}
                  playing
                  controls
                />
                <div className="absolute bottom-[4.25rem] flex w-full items-center justify-between pl-[1.5rem]">
                  <div>
                    <button
                      onClick={() =>
                        router.push(
                          `/watch/${currentMediaInfoIdAndType?.type}/${currentMediaInfoIdAndType?.id}`
                        )
                      }
                      className="cursor-pointer flex items-center gap-x-2 rounded px-5 py-1.5 text-sm font-semibold transition hover:opacity-75 md:py-2.5 md:px-8 md:text-xl bg-white text-black"
                    >
                      <AiFillPlayCircle className="h-4 w-4 text-black md:h-7 md:w-7 cursor-pointer" />
                      Play
                    </button>
                  </div>
                </div>
              </div>
              <div className="rounded-b-md bg-[#181818] p-8">
                <div className="space-x-2 pb-4 flex gap-4">
                  <div className="text-green-400 font-semibold flex gap-2">
                    <span>
                      {mediaDetails?.first_air_date
                        ? mediaDetails?.first_air_date.split("-")[0]
                        : "2023"}
                    </span>
                    <div className="inline-flex border-2 border-white/40 rounded px-2">
                      HD
                    </div>
                  </div>
                </div>
                <h2 className="mt-10 mb-6 cursor-pointer text-sm font-semibold text-[#e5e5e5] transition-colors duration-200 hover:text-white md:text-2xl">
                  More Like This
                </h2>
                <div className="grid grid-cols-5 gap-3 items-center scrollbar-hide md:p-2">
                  {similarMedias && similarMedias.length > 0
                    ? similarMedias
                        .filter(
                          (item) =>
                            item.backdrop_path !== null &&
                            item.poster_path !== null
                        )
                        .map((mediaItem) => (
                          <MediaItem
                            key={mediaItem.id}
                            media={mediaItem}
                            similarMovieView={true}
                          />
                        ))
                    : null}
                </div>
              </div>
            </div>
          </MuiModal>
        </motion.div>
      )}
    </>
  );
};

export default DetailsPopup;
