import Image from "next/image";

import HeroSlider from "@/components/home/hero-slider";
import FeaturedListings from "@/components/home/featured-listings";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function Home() {
  return (
    <div className="font-sans grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen py-6 gap-16 sm:py-10">
      <main className="flex flex-col gap-[32px] row-start-2 items-center sm:items-start max-w-[1600px] w-full">

        <div className="w-full">
          <HeroSlider/>
        </div>

        <div className="all-listings">
            <FeaturedListings />
        </div>

        <div className="homepage-tabs">
          <Tabs defaultValue="city" className="w-[400px]">
            <TabsList>
              <TabsTrigger value="city">City properties</TabsTrigger>
              <TabsTrigger value="quiet">Quiet Properties</TabsTrigger>
            </TabsList>
            <TabsContent value="city">Todo: fill with swiper content</TabsContent>
            <TabsContent value="quiet">Todo: fill with different swiper content</TabsContent>
          </Tabs>
          
        </div>
      </main>
    </div>
  );
}
