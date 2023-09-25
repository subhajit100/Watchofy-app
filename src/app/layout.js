import GlobalState from "@/context";
import "./globals.css";
import { Inter } from "next/font/google";
import NextAuthProvider from "@/auth-provider";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title:
    "Netflix: The one and only stop for binge watching your favourite shows",
  description:
    "Our Netflix-inspired web app offers an immersive streaming experience with a rich array of features. Explore a vast library of movies, TV shows, and documentaries across multiple genres, all in stunning HD and 4K quality. Personalize your viewing with customizable profiles for each family member, complete with individualized watchlists and recommendations based on viewing history.Enjoy seamless streaming on any device, from laptops to smart TVs, and take advantage of offline downloads for on-the-go entertainment. Dive into an intuitive search and discovery system, with detailed categorization, trailers, and user reviews. Plus, our advanced recommendation algorithm ensures you never miss a show you'll love. With cross-device sync and no ads, your Netflix clone experience is designed to deliver endless entertainment at your fingertips.",
};


export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <NextAuthProvider>
          <GlobalState>{children}</GlobalState>
        </NextAuthProvider>
      </body>
    </html>
  );
}

