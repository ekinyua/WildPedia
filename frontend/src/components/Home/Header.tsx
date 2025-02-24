
const Header = () => {
  return (
    <header className="flex justify-between items-center px-20 py-4 bg-white border-b border-solid max-md:px-10 max-md:py-4">
      <div className="flex gap-2 items-center">
        <img src="https://cdn.builder.io/api/v1/image/assets/TEMP/94ca266e9f447d40448d89179a5f5f55527d51793688c2f4b0f41a14cc2240e1?apiKey=dbae431cfeff47348b69e0da28b2579d&" alt="Logo" />
        <span className="text-xl font-bold text-black">WildPedia</span>
      </div>
      <nav className="flex gap-7 items-center max-sm:hidden">
        <a href="#" className="text-base text-black no-underline">Explore</a>
        <a href="#" className="text-base text-black no-underline">Learn</a>
        <a href="#" className="text-base text-black no-underline">Identify species</a>
        <a href="#" className="text-base text-black no-underline">Organizations</a>
      </nav>
      <button className="px-4 py-3.5 text-base text-white bg-green-600 rounded-lg cursor-pointer border-[none]">
        Sign In
      </button>
    </header>
  )
}

export default Header