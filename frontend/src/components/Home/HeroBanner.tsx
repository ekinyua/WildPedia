import React from 'react'

interface HeroBannerProps {
    onSearch: (query: string) => void;
  }

const HeroBanner = ({ onSearch }: HeroBannerProps) => {
    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const formData = new FormData(event.currentTarget);
        const query = formData.get('search') as string;
        onSearch(query);
      };
  return (
    <div className="overflow-hidden relative w-full h-[500px]">
      <img
        src="https://cdn.builder.io/api/v1/image/assets/TEMP/1244ea5e59dca568c0b519c7ae4c159ff884f931b653d610d485c70cfd4dae27?apiKey=dbae431cfeff47348b69e0da28b2579d&"
        alt="Nature background"
        className="object-cover bg-gray-700 size-full"
      />
      <div className="absolute top-2/4 left-2/4 px-5 py-0 w-full max-w-2xl text-center -translate-x-2/4 -translate-y-2/4">
        <h1 className="mb-8 text-5xl font-bold text-white max-sm:text-4xl">
          Discover Local Biodiversity
        </h1>
        <form onSubmit={handleSubmit} className="flex justify-between items-center py-2 pr-2 pl-6 bg-white rounded-full">
          <label htmlFor="search-input" className="sr-only">Search for species</label>
          <input
            id="search-input"
            name="search"
            type="text"
            placeholder="Search for species..."
            className="w-full text-lg border-[none]"
          />
          <button type="submit" className="flex justify-center items-center bg-green-600 rounded-full border-[none] h-[52px] w-[52px]">
            <img src="https://cdn.builder.io/api/v1/image/assets/TEMP/09045758ab08247d1c49ef972b0c775bd5415acf1cfda1609dc0d5698d9daa3c?apiKey=dbae431cfeff47348b69e0da28b2579d&" alt="Search" />
          </button>
        </form>
      </div>
    </div>
  )
}

export default HeroBanner