'use client' ;

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Home, ShoppingCart, Star, Users, DollarSign } from "lucide-react";
import { TooltipProvider, Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";

const LandingPage = () => {
  return (
    <div className="flex flex-col min-h-[100dvh]">
      <main className="flex-1">
        <section className="w-full py-12 md:py-24 lg:py-32 xl:py-48 bg-gradient-to-r from-yellow-500 to-red-500">
          <div className="container px-4 md:px-6">
            <div className="grid gap-6 lg:grid-cols-[1fr_400px] lg:gap-12 xl:grid-cols-[1fr_600px]">
              <div className="flex flex-col justify-center space-y-4 text-white">
                <div className="space-y-2">
                  <h1 className="text-4xl font-bold tracking-tighter sm:text-6xl xl:text-7xl/none">
                    Discover the Art of Brewing
                  </h1>
                  <p className="max-w-[600px] text-white md:text-xl">
                    Experience the finest craft beers brewed with passion. Order online and enjoy the taste of perfection.
                  </p>
                </div>
                <div className="flex flex-col gap-2 min-[400px]:flex-row">
                  <Button className="inline-flex h-10 items-center justify-center rounded-md bg-white px-8 text-sm font-medium text-black shadow transition-colors hover:bg-gray-200">
                    Shop Now
                  </Button>
                  <Button className="inline-flex h-10 items-center justify-center rounded-md border border-white bg-transparent px-8 text-sm font-medium text-white shadow-sm transition-colors hover:bg-white hover:text-black">
                    Learn More
                  </Button>
                </div>
              </div>
              <img
                src="https://placehold.co/600x400.png"
                alt="Hero"
                className="mx-auto aspect-video overflow-hidden rounded-xl object-cover sm:w-full lg:order-last lg:aspect-square"
              />
            </div>
          </div>
        </section>
        <section className="w-full py-12 md:py-24 lg:py-32">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">Our Bestsellers</h2>
                <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  Explore our top-rated beers loved by our customers.
                </p>
              </div>
            </div>
            <Carousel>
              <CarouselContent>
                <CarouselItem>
                  <Card>
                    <CardHeader>
                      <CardTitle>Golden Ale</CardTitle>
                      <CardDescription>Rich and smooth with a hint of citrus.</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <AspectRatio ratio={16 / 9}>
                        <img
                          src="https://placehold.co/600x400.png"
                          alt="Golden Ale"
                          className="rounded-md object-cover"
                        />
                      </AspectRatio>
                    </CardContent>
                  </Card>
                </CarouselItem>
                <CarouselItem>
                  <Card>
                    <CardHeader>
                      <CardTitle>Dark Stout</CardTitle>
                      <CardDescription>A full-bodied stout with notes of chocolate.</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <AspectRatio ratio={16 / 9}>
                        <img
                          src="https://placehold.co/600x400.png"
                          alt="Dark Stout"
                          className="rounded-md object-cover"
                        />
                      </AspectRatio>
                    </CardContent>
                  </Card>
                </CarouselItem>
                <CarouselItem>
                  <Card>
                    <CardHeader>
                      <CardTitle>Classic Lager</CardTitle>
                      <CardDescription>Crisp and refreshing with a clean finish.</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <AspectRatio ratio={16 / 9}>
                        <img
                          src="https://placehold.co/600x400.png"
                          alt="Classic Lager"
                          className="rounded-md object-cover"
                        />
                      </AspectRatio>
                    </CardContent>
                  </Card>
                </CarouselItem>
              </CarouselContent>
              <CarouselPrevious />
              <CarouselNext />
            </Carousel>
          </div>
        </section>
        <section className="w-full py-12 md:py-24 lg:py-32 bg-gray-100">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">Why Choose Us</h2>
                <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  We are committed to delivering the best brewing experience.
                </p>
              </div>
              <div className="grid max-w-5xl grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3">
                <Card className="flex flex-col items-center space-y-4 p-6">
                  <Users className="h-12 w-12 text-yellow-500" />
                  <div className="space-y-1 text-center">
                    <h3 className="text-lg font-bold">Community Driven</h3>
                    <p className="text-muted-foreground">
                      We value our community and brew with passion and care.
                    </p>
                  </div>
                </Card>
                <Card className="flex flex-col items-center space-y-4 p-6">
                  <Star className="h-12 w-12 text-yellow-500" />
                  <div className="space-y-1 text-center">
                    <h3 className="text-lg font-bold">Award Winning</h3>
                    <p className="text-muted-foreground">
                      Our beers have won multiple awards for their unique taste.
                    </p>
                  </div>
                </Card>
                <Card className="flex flex-col items-center space-y-4 p-6">
                  <DollarSign className="h-12 w-12 text-yellow-500" />
                  <div className="space-y-1 text-center">
                    <h3 className="text-lg font-bold">Affordable Prices</h3>
                    <p className="text-muted-foreground">
                      Enjoy premium quality craft beers at competitive prices.
                    </p>
                  </div>
                </Card>
              </div>
            </div>
          </div>
        </section>
        <section className="w-full py-12 md:py-24 lg:py-32">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">Customer Testimonials</h2>
                <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  Hear what our customers have to say about our beers.
                </p>
              </div>
              <div className="grid max-w-5xl grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3">
                <Card className="flex flex-col items-start space-y-4 p-6">
                  <div className="flex items-center gap-4">
                    <Avatar>
                      <AvatarImage src="https://placehold.co/100x100.png" />
                      <AvatarFallback>JD</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="text-sm font-medium leading-none">John Doe</p>
                      <p className="text-xs text-muted-foreground">Beer Enthusiast</p>
                    </div>
                  </div>
                  <p className="text-muted-foreground">
                    "The best beer I've ever tasted! Highly recommend to all beer lovers."
                  </p>
                </Card>
                <Card className="flex flex-col items-start space-y-4 p-6">
                  <div className="flex items-center gap-4">
                    <Avatar>
                      <AvatarImage src="https://placehold.co/100x100.png" />
                      <AvatarFallback>SM</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="text-sm font-medium leading-none">Sarah Miller</p>
                      <p className="text-xs text-muted-foreground">Brewmaster</p>
                    </div>
                  </div>
                  <p className="text-muted-foreground">
                    "Amazing quality and variety. The brewing process is truly an art."
                  </p>
                </Card>
                <Card className="flex flex-col items-start space-y-4 p-6">
                  <div className="flex items-center gap-4">
                    <Avatar>
                      <AvatarImage src="https://placehold.co/100x100.png" />
                      <AvatarFallback>MJ</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="text-sm font-medium leading-none">Michael Johnson</p>
                      <p className="text-xs text-muted-foreground">Craft Beer Lover</p>
                    </div>
                  </div>
                  <p className="text-muted-foreground">
                    "A delightful experience with every sip. Can't get enough of it!"
                  </p>
                </Card>
              </div>
            </div>
          </div>
        </section>
      </main>
      <footer className="bg-gray-800 p-6 md:py-12 w-full">
        <div className="container max-w-7xl grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-8 text-sm text-white">
          <div className="grid gap-1">
            <h3 className="font-semibold">Products</h3>
            <a href="#" className="hover:underline">Craft Beers</a>
            <a href="#" className="hover:underline">Gift Packs</a>
            <a href="#" className="hover:underline">Merchandise</a>
          </div>
          <div className="grid gap-1">
            <h3 className="font-semibold">Company</h3>
            <a href="#" className="hover:underline">About Us</a>
            <a href="#" className="hover:underline">Our Story</a>
            <a href="#" className="hover:underline">Careers</a>
          </div>
          <div className="grid gap-1">
            <h3 className="font-semibold">Support</h3>
            <a href="#" className="hover:underline">Contact Us</a>
            <a href="#" className="hover:underline">FAQs</a>
            <a href="#" className="hover:underline">Shipping & Returns</a>
          </div>
          <div className="grid gap-1">
            <h3 className="font-semibold">Legal</h3>
            <a href="#" className="hover:underline">Privacy Policy</a>
            <a href="#" className="hover:underline">Terms of Service</a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;