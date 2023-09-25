"use client";

import { GlobalContext } from "@/context";
import { getAllFavorites } from "@/utils";
import { useSession } from "next-auth/react";
import React, { useContext, useEffect, useState } from "react";
import { motion } from "framer-motion";
import Navbar from "@/components/navbar";
import MediaItem from "@/components/media-item";
import ManageAccounts from "@/components/manage-accounts";
import UnAuthPage from "@/components/unauth-page";
import CircleLoader from "@/components/circle-loader";

const MyList = ({ params }) => {
  const { data: session } = useSession();
  const { loggedInAccount, favorites, setFavorites } =
    useContext(GlobalContext);
  const [pageLoader, setPageLoader] = useState(false);

  useEffect(() => {
    async function extractFavorites() {
      try {
        setPageLoader(true);
        const data = await getAllFavorites(params?.id[0], params?.id[1]);

        if (data) {
          setFavorites(
            data.map((item) => ({
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

    extractFavorites();
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
              My List
            </h2>
            <div className="grid custom-grid-watch-list gap-3 items-center scrollbar-hide md:p-2">
              {favorites && favorites.length > 0
                ? favorites.map((searchItem) => (
                    <MediaItem
                      key={searchItem.id}
                      media={searchItem}
                      listView={true}
                    />
                  ))
                : "No favorites added!"}
            </div>
          </div>
        </motion.div>
      )}
    </>
  );
};

export default MyList;
