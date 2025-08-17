import Image from "next/image";

import HeroSlider from "@/components/home/hero-slider";
import FeaturedListings from "@/components/home/featured-listings";

import HomepageGallery from "@/components/home/homepage-gallery"

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function Home() {
  return (
    <div className="font-sans grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen py-6 gap-16 sm:py-10">
      <main className="flex flex-col gap-[32px] row-start-2 items-center sm:items-start max-w-[1600px] w-full">

        <section className="w-full">
          <div className="w-full">
            <HeroSlider/>
          </div>  
        </section>

        <section className="all-listings">
            <FeaturedListings />
        </section>

        <section className="homepage-tabs mx-auto">
          <Tabs defaultValue="city" className="w-[400px]">
            <TabsList>
              <TabsTrigger value="city">City properties</TabsTrigger>
              <TabsTrigger value="quiet">Quiet Properties</TabsTrigger>
            </TabsList>
            <TabsContent value="city">Todo: fill with swiper content</TabsContent>
            <TabsContent value="quiet">Todo: fill with different swiper content</TabsContent>
          </Tabs>
        </section>

        <section className="py-20 mx-auto">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">Gallery Variations</h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                See different ways to display your gallery content
              </p>
            </div>

            <div className="space-y-16 max-w-4xl mx-auto">
              {/* Slide Effect Gallery */}
              <div>
                <h3 className="text-xl font-semibold mb-4">Slide Effect</h3>
                <HomepageGallery effect="slide" autoplay={false} showCaptions={false} className="rounded-xl" />
              </div>

              {/* Fade Effect Gallery */}
              <div>
                <h3 className="text-xl font-semibold mb-4">Fade Effect with Captions</h3>
                <HomepageGallery effect="fade" autoplay={true} showCaptions={true} className="rounded-xl" />
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
