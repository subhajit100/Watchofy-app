/** @type {import('next').NextConfig} */
const nextConfig = {
  env: {
    TMDB_APIKEY: process.env.TMDB_APIKEY,
  },
  images: {
    domains: ["image.tmdb.org"],
  },
};

module.exports = nextConfig;
