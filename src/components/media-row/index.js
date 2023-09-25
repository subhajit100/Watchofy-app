"use client";

import React from "react";
import MediaItem from "../media-item";

const MediaRow = ({ title, medias }) => {
  return (
    medias &&
    medias.length > 0 && (
      <div className="h-40 space-y-0.5 md:space-y-2 px-4">
        <h2 className="cursor-pointer text-sm font-semibold text-[#e5e5e5] transition-colors duration-200 hover:text-white md:text-2xl">
          {title}
        </h2>
        <div className="group relative md:-ml-2">
          <div className="flex items-center scrollbar-hide space-x-0.5 overflow-x-scroll md:space-x-2.5 md:p-2">
            {medias && medias.length > 0
              ? medias
                  .filter((item) => item.backdrop_path && item.poster_path)
                  .map((mediaItem) => (
                    <MediaItem
                      title={title}
                      key={mediaItem.id}
                      media={mediaItem}
                    />
                  ))
              : null}
          </div>
        </div>
      </div>
    )
  );
};

export default MediaRow;
