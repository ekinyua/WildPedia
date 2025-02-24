
const Footer = () => {
  return (
    <footer className="px-16 py-12 bg-gray-800 max-md:px-10 max-md:py-12">
      <div className="grid gap-5 grid-cols-[repeat(4,1fr)] max-sm:grid-cols-[1fr]">
        <div className="px-4 py-0">
          <div className="flex gap-2 items-center mb-6">
            <img src="https://cdn.builder.io/api/v1/image/assets/TEMP/7be48dec998afce48c27c066b68e757e1a5eda07f117e3f24b62ceff34162c1a?apiKey=dbae431cfeff47348b69e0da28b2579d&" alt="Logo" />
            <span className="text-xl font-bold text-white">WildPedia</span>
          </div>
          <p className="text-base leading-4 text-white">
            Discover and learn about the amazing biodiversity around you.
          </p>
        </div>
        <div className="px-4 py-0">
          <h3 className="mb-6 text-base font-bold text-white">Explore</h3>
          <div className="flex flex-col gap-2">
            <a href="#" className="text-base text-white no-underline">Species Database</a>
            <a href="#" className="text-base text-white no-underline">Local Wildlife</a>
            <a href="#" className="text-base text-white no-underline">Conservation</a>
          </div>
        </div>
        <div className="px-4 py-0">
          <h3 className="mb-6 text-base font-bold text-white">Community</h3>
          <div className="flex flex-col gap-2">
            <a href="#" className="text-base text-white no-underline">Forums</a>
            <a href="#" className="text-base text-white no-underline">Events</a>
            <a href="#" className="text-base text-white no-underline">Contributors</a>
          </div>
        </div>
        <div className="px-4 py-0">
          <h3 className="mb-6 text-base font-bold text-white">Follow Us</h3>
          <div className="flex gap-4">
            <img src="https://cdn.builder.io/api/v1/image/assets/TEMP/4d5b5616d0c6ead8a1156682d117de5d5266a3ed49991aed6e0db079e4eca604?apiKey=dbae431cfeff47348b69e0da28b2579d&" alt="Social" className="w-5 h-5" />
            <img src="https://cdn.builder.io/api/v1/image/assets/TEMP/5ff6bcf62e371412be038d768ee22bd75deac6e3ab5788454693237794eded4d?apiKey=dbae431cfeff47348b69e0da28b2579d&" alt="Social" className="w-5 h-5" />
            <img src="https://cdn.builder.io/api/v1/image/assets/TEMP/ecd91f5581dcf317d5f46fb3554c11c481c77767b21ad66d22109b317e7372c5?apiKey=dbae431cfeff47348b69e0da28b2579d&" alt="Social" className="w-5 h-5" />
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer