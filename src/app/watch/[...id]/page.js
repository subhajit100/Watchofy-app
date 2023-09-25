"use client";

import { motion } from "framer-motion";
import { GlobalContext } from "@/context";
import { getTvOrMovieVideosById } from "@/utils";
import { useParams } from "next/navigation";
import React, { useContext, useEffect, useState } from "react";
import ReactPlayer from "react-player";
import CircleLoader from "@/components/circle-loader";

const Watch = () => {
  const [mediaDetails, setMediaDetails] = useState(null);
  const [key, setKey] = useState(null);

  const params = useParams();
  const [pageLoader, setPageLoader] = useState(false);

  useEffect(() => {
    async function getMediaDetails() {
      try {
        setPageLoader(true);
        const extractedmediaDetails = await getTvOrMovieVideosById(
          params.id[0],
          params.id[1]
        );
        if (extractedmediaDetails) {
          const trailerIndex = extractedmediaDetails.results
            ? extractedmediaDetails.results.findIndex(
                (item) => item.type === "Trailer"
              )
            : -1;
          const clipIndex = extractedmediaDetails.results
            ? extractedmediaDetails.results.findIndex(
                (item) => item.type === "Clip"
              )
            : -1;

          setMediaDetails(extractedmediaDetails);
          setKey(
            trailerIndex !== -1
              ? extractedmediaDetails.results[trailerIndex]?.key
              : clipIndex !== -1
              ? extractedmediaDetails.results[clipIndex]?.key
              : "XuDwndGaCFo"
          );
        }

        setPageLoader(false);
      } catch (err) {
        console.log(err);
        setPageLoader(false);
      }
    }

    getMediaDetails();
  }, []);

  return (
    <>
      {pageLoader || mediaDetails == null ? (
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
          <ReactPlayer
            url={`https://www.youtube.com/watch?v=${key}`}
            width={"100%"}
            height={"100%"}
            style={{ position: "absolute", top: "0", left: "0" }}
            playing
            controls
          />
        </motion.div>
      )}
    </>
  );
};

export default Watch;
