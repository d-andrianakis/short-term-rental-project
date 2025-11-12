import {useTranslations} from 'next-intl';

import HeroSlider from "@/components/home/hero-slider";
import FeaturedListings from "@/components/home/featured-listings";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function Home() {
  const t = useTranslations('HomePage');
  
  return (
    <div className="font-sans grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen">
      <main className="flex flex-col gap-[32px] row-start-2 items-center sm:items-start max-w-[1660px] w-full overflow-x-hidden">

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
              <TabsTrigger value="city">{t('title')}</TabsTrigger>
              <TabsTrigger value="quiet">Quiet Properties</TabsTrigger>
            </TabsList>
            <TabsContent value="city">Todo: fill with swiper content</TabsContent>
            <TabsContent value="quiet">Todo: fill with different swiper content</TabsContent>
          </Tabs>
        </section>
      </main>
    </div>
  );
}