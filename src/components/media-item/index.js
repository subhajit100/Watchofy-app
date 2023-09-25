"use client";

import React, { useContext, useState } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import {
  PlusIcon,
  ChevronDownIcon,
  CheckIcon,
} from "@heroicons/react/24/outline";
import { usePathname, useRouter } from "next/navigation";
import { GlobalContext } from "@/context";
import { useSession } from "next-auth/react";
import { getAllFavorites } from "@/utils";
import CircleLoader from "../circle-loader";

const baseUrl = "https://image.tmdb.org/t/p/w500";

const MediaItem = ({
  media,
  searchView = false,
  title,
  similarMovieView = false,
  listView = false,
}) => {
  const {
    setCurrentMediaInfoIdAndType,
    setShowDetailsPopup,
    loggedInAccount,
    setFavorites,
    similarMedias,
    setSimilarMedias,
    mediaData,
    setMediaData,
    searchResults,
    setSearchResults,
  } = useContext(GlobalContext);
  const [pageLoader, setPageLoader] = useState(false);
  const router = useRouter();
  const { data: session } = useSession();
  const pathName = usePathname();

  async function updateFavorites() {
    try {
      setPageLoader(true);
      const res = await getAllFavorites(
        session?.user?.uid,
        loggedInAccount?._id
      );
      if (res) {
        setFavorites(
          res.map((item) => ({
            ...item,
            addedToFavorites: true,
          }))
        );
      }
      setPageLoader(false);
    } catch (err) {
      console.log(err);
      setPageLoader(false);
    }
  }

  const handleAddToFavorites = async (mediaItem) => {
    try {
      setPageLoader(true);
      const { backdrop_path, poster_path, type, id } = mediaItem;
      const res = await fetch(`/api/favorites/add-favorite`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          backdrop_path,
          poster_path,
          accountId: loggedInAccount?._id,
          type,
          movieId: id,
          uid: session?.user?.uid,
        }),
      });
      const data = await res.json();

      if (data && data.success) {
        if (pathName.includes("my-list")) {
          updateFavorites();
        }

        if (searchView) {
          const updatedSearchResults = [...searchResults];
          const indexOfCurrentAddedMedia = updatedSearchResults.findIndex(
            (item) => item.id === id
          );
          updatedSearchResults[indexOfCurrentAddedMedia] = {
            ...updatedSearchResults[indexOfCurrentAddedMedia],
            addedToFavorites: true,
          };
          setSearchResults(updatedSearchResults);
        } else if (similarMovieView) {
          const updatedSimilarMedias = [...similarMedias];
          const indexOfCurrentAddedMedia = updatedSimilarMedias.findIndex(
            (item) => item.id === id
          );
          updatedSimilarMedias[indexOfCurrentAddedMedia] = {
            ...updatedSimilarMedias[indexOfCurrentAddedMedia],
            addedToFavorites: true,
          };
          setSimilarMedias(updatedSimilarMedias);
        } else {
          let updatedMedia = [...mediaData];
          const indexOfRowItem = updatedMedia.findIndex(
            (item) => item.title === title
          );
          let currentMovieArrayFromRowItem =
            updatedMedia[indexOfRowItem].medias;
          const indexOfCurrentMovie = currentMovieArrayFromRowItem.findIndex(
            (item) => item.id === id
          );
          currentMovieArrayFromRowItem[indexOfCurrentMovie] = {
            ...currentMovieArrayFromRowItem[indexOfCurrentMovie],
            addedToFavorites: true,
          };

          setMediaData(updatedMedia);
        }
      }
      setPageLoader(false);
    } catch (err) {
      console.log(err);
      setPageLoader(false);
    }
  };

  const handleRemoveFromFavorites = async (mediaItem) => {
    // const mediaItemId = listView ? mediaItem._id : mediaItem.id;
    try {
      setPageLoader(true);
      const res = await fetch(
        `/api/favorites/remove-favorite/${mediaItem._id}`,
        {
          method: "DELETE",
        }
      );
      const data = await res.json();
      if (data.success) {
        updateFavorites();
      }
      setPageLoader(false);
    } catch (err) {
      console.log(err);
      setPageLoader(false);
    }
  };

  if (pageLoader) {
    return <CircleLoader />;
  }

  return (
    <>
      <motion.div
        initial={{ opacity: 0, scale: 0.5 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{
          duration: 0.8,
          delay: 0.5,
          ease: [0, 0.71, 0.2, 1.01],
        }}
      >
        <div className="relative cardWrapper h-28 min-w-[180px] cursor-pointer md:h-36 md:min-w-[260px] transform transition duration-500 hover:scale-110 hover:z-[999]">
          <Image
            src={`${baseUrl}${media?.backdrop_path || media?.poster_path}`}
            alt="Media"
            fill
            className="rounded sm object-cover md:rounded hover:rounded-sm"
            onClick={() =>
              router.push(
                `/watch/${media?.type}/${listView ? media?.movieId : media?.id}`
              )
            }
          />
          <div className="space-x-3 hidden absolute p-2 bottom-0 buttonWrapper">
            <button
              onClick={
                media?.addedToFavorites
                  ? listView
                    ? () => handleRemoveFromFavorites(media)
                    : null
                  : () => handleAddToFavorites(media)
              }
              className={`${
                media?.addedToFavorites && !listView && "cursor-not-allowed"
              } cursor-pointer border flex p-2 items-center gap-x-2 rounded-full  text-sm font-semibold transition hover:opacity-90 border-white bg-black opacity-75 text-black`}
            >
              {media?.addedToFavorites ? (
                <CheckIcon color="#ffffff" className="h-7 w-7" />
              ) : (
                <PlusIcon color="#ffffff" className="h-7 w-7" />
              )}
            </button>
            <button
              className="cursor-pointer p-2 border flex items-center gap-x-2 rounded-full  text-sm font-semibold transition hover:opacity-90  border-white  bg-black opacity-75 "
              onClick={() => {
                setShowDetailsPopup(true);
                setCurrentMediaInfoIdAndType({
                  type: media?.type,
                  id: listView ? media?.movieId : media?.id,
                });
              }}
            >
              <ChevronDownIcon color="#ffffff" className="h-7 w-7" />
            </button>
          </div>
        </div>
      </motion.div>
    </>
  );
};

export default MediaItem;
