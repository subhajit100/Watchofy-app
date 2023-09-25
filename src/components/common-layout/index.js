"use client";

import { motion } from "framer-motion";
import Head from "next/head";
import Navbar from "../navbar";
import MediaRow from "../media-row";
import Banner from "../banner";

const CommonLayout = ({ mediaData, defaultBanner }) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
    >
      <Head>
        <title>Netflix Clone</title>
      </Head>
      <>
        <Navbar />
        {/* main content in the middle after navbar */}
        <div className="relative pl-4 pb-24 lg:space-y-24">
          <Banner
            medias={
              mediaData &&
              mediaData.length > 0 &&
              mediaData[0].medias.length > 0
                ? mediaData[0].medias
                : [defaultBanner]
            }
          />
          <section className="md:space-y-16">
            {mediaData && mediaData.length > 0
              ? mediaData.map((item) => (
                  <MediaRow
                    title={item.title}
                    medias={item.medias}
                    key={item.title}
                  />
                ))
              : null}
          </section>
        </div>
      </>
    </motion.div>
  );
};

export default CommonLayout;
