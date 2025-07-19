import { Button } from '@/shadcn/ui/button';
import { Card, CardHeader } from '@/shadcn/ui/card';
import { Carousel, CarouselContent, CarouselItem } from '@/shadcn/ui/carousel';
import { Input } from '@/shadcn/ui/input';
import { Textarea } from '@/shadcn/ui/textarea';
import React from 'react';
import Autoplay from 'embla-carousel-autoplay';
import Header from '@/Components/Customer/Header';
import { router } from '@inertiajs/react';

export default function LandingPage({ auth, menus, appName }) {
  
  return (
    <div className="bg-red-50 text-gray-800">
      <Header appName={appName} auth={auth} />
      <section className="text-center py-16 bg-white px-4">
        <h2 className="text-4xl font-bold mb-4">Selamat datang di {appName}</h2>
        <p className="text-lg max-w-2xl mx-auto mb-8">
          Nikmati makanan khas Indonesia yang lezat dan menggugah selera. Dibuat dengan resep otentik dari seluruh penjuru negeri.
        </p>
        <Button 
          className="bg-red-500 hover:bg-red-600 text-white px-6 py-2 rounded-full"
          onClick={() => router.visit('/cart')}
        >
          Lihat Menu
        </Button>
      </section>
      <section id='resto' className="py-16 bg-gray-100 px-4">
        <div className="container mx-auto">
          <h3 className="text-3xl font-bold text-center mb-12 text-red-500">Restoran Kami</h3>
          <img src="/images/interior-resto.jpg" alt="" className='h-[500px] w-full object-cover rounded-lg' />
        </div>
      </section>
      <section id="menu" className="py-16 bg-gray-100 px-4">
        <div className="container mx-auto">
          <h3 className="text-3xl font-bold text-center mb-12 text-red-500">Menu Rekomendasi</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
            {menus.map((item, index) => (
              <Card key={index} className="bg-white shadow-md hover:shadow-lg transition-shadow duration-300">
                <Carousel
                  opts={
                    {
                      loop: true,
                      speed: 500,
                    }
                  }
                  plugins={[
                    Autoplay({
                      delay: 3000,
                      stopOnInteraction: false,
                      playOnInit: true
                    }),
                  ]}
                >
                  <CarouselContent>
                    {
                      item.images.map((image, imgIndex) => (
                        <CarouselItem key={imgIndex} className="w-full h-64">
                          <img 
                            src={`/storage/public/${image.image_path}`} 
                            alt={`${item.name} ${imgIndex + 1}`} 
                            className="w-full h-full rounded-b-none rounded-lg object-cover" 
                          />
                        </CarouselItem>
                      ))
                    }
                  </CarouselContent>
                </Carousel>
                <CardHeader className="p-4 mt-6">
                  <div className="flex .flex-col justify-between">
                    <h4 className="text-xl font-bold mb-2 text-red-500">
                      {item.name}
                    </h4>
                    <h3 className='text-lg font-semibold text-gray-700'>
                      {item.price ? `Rp ${item.price.toLocaleString()}` : 'Harga Tidak Tersedia'}
                    </h3>
                  </div>
                  <div className='h-40 w-full overflow-y-auto'>
                    <p>{item.description}</p>
                  </div>
                  <Button className="mt-4 bg-red-500 hover:bg-red-600 text-white w-full">Tambahkan Pesanan</Button>
                </CardHeader>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section id="location" className="py-16 bg-white px-4">
        <div className="container mx-auto text-center">
          <h3 className="text-3xl font-bold text-red-500 mb-6">Lokasi Kami</h3>
          <p className="mb-4">Jl. Makanan Enak No. 123, Jakarta</p>
          <div className="w-full h-64">
            <iframe
              title="Lokasi Warung Nusantara"
              src="https://maps.google.com/maps?q=jakarta&t=&z=13&ie=UTF8&iwloc=&output=embed"
              className="w-full h-full border-0 rounded-lg"
              allowFullScreen
              loading="lazy"
            ></iframe>
          </div>
        </div>
      </section>

      <section id="contact" className="py-16 bg-gray-100 px-4">
        <div className="container mx-auto max-w-xl">
          <h3 className="text-3xl font-bold text-red-500 mb-6 text-center">Hubungi Kami</h3>
          <form className="space-y-4">
            <Input placeholder="Nama Anda" />
            <Input type="email" placeholder="Email Anda" />
            <Textarea placeholder="Pesan Anda" />
            <Button className="bg-red-500 hover:bg-red-600 text-white w-full">Kirim Pesan</Button>
          </form>
        </div>
      </section>

      <footer className="bg-red-500 text-white text-center py-4 px-4">
        &copy; 2025 Warung Nusantara. All rights reserved.
      </footer>
    </div>
  );
}
