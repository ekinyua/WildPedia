
const KnowledgeTest = () => {
  return (
    <section className="px-28 py-16 bg-white max-md:px-10 max-md:py-16">
      <div className="mx-auto my-0 max-w-[926px]">
        <div className="mb-12 text-center">
          <h2 className="mb-7 text-3xl font-bold text-black">Test Your Knowledge</h2>
          <p className="text-base text-black">
            Challenge yourself and earn badges while learning about biodiversity
          </p>
        </div>
        <div className="p-6 bg-white rounded-xl shadow-[0_4px_6px_rgba(0,0,0,0.1)]">
          <div className="flex justify-between items-center mb-6">
            <div className="flex gap-3 items-center">
              <span className="px-3 py-1.5 text-sm text-black bg-blue-100 rounded-full">Quiz</span>
              <span>Question 3/10</span>
            </div>
            <div>
              <img src="https://cdn.builder.io/api/v1/image/assets/TEMP/e5b71b90b5ddd0b132b543149d2b41c418f93e13a61afcab8ee6548163a6172b?apiKey=dbae431cfeff47348b69e0da28b2579d&" alt="Timer" />
              <span>1:45</span>
            </div>
          </div>
          <h3 className="mb-6 text-xl font-bold text-black">
            Which of these butterflies is known for its annual migration to Mexico?
          </h3>
          <div className="flex flex-col gap-3">
            <button className="px-4 py-6 text-base text-left text-black bg-white rounded-lg border border-solid cursor-pointer">
              Painted Lady
            </button>
            <button className="px-4 py-6 text-base text-left text-black bg-white rounded-lg border border-solid cursor-pointer">
              Monarch Butterfly
            </button>
            <button className="px-4 py-6 text-base text-left text-black bg-white rounded-lg border border-solid cursor-pointer">
              Swallowtail
            </button>
            <button className="px-4 py-6 text-base text-left text-black bg-white rounded-lg border border-solid cursor-pointer">
              Red Admiral
            </button>
          </div>
        </div>
        <div className="grid gap-5 mt-8 grid-cols-[repeat(4,1fr)] max-sm:grid-cols-[1fr]">
          <div className="p-4 text-center bg-gray-50 rounded-lg">
            <img
              src="https://cdn.builder.io/api/v1/image/assets/TEMP/7ae3787ed6f47a137914cdef2816551e8ae4e6c28b587f11c4c24071777d3163?apiKey=dbae431cfeff47348b69e0da28b2579d&"
              alt="Explorer"
              className="mx-auto mt-0 mb-2 w-16 h-16 rounded-full"
            />
            <h4 className="mb-1 text-base font-bold text-black">Explorer</h4>
            <p className="text-sm text-black">100 Species Found</p>
          </div>
          <div className="p-4 text-center bg-gray-50 rounded-lg">
            <img
              src="https://cdn.builder.io/api/v1/image/assets/TEMP/bcb566c0b47429531141d9f61d60519196ee379bc8e20feb27734655f75156f3?apiKey=dbae431cfeff47348b69e0da28b2579d&"
              alt="Naturalist"
              className="mx-auto mt-0 mb-2 w-16 h-16 rounded-full"
            />
            <h4 className="mb-1 text-base font-bold text-black">Naturalist</h4>
            <p className="text-sm text-black">50 Quizzes Complete</p>
          </div>
          <div className="p-4 text-center bg-gray-50 rounded-lg">
            <img
              src="https://cdn.builder.io/api/v1/image/assets/TEMP/1470245dc24d7923ce06367dc14d7f60215c989e689324d10ec7b63265cbe10b?apiKey=dbae431cfeff47348b69e0da28b2579d&"
              alt="Photographer"
              className="mx-auto mt-0 mb-2 w-16 h-16 rounded-full"
            />
            <h4 className="mb-1 text-base font-bold text-black">Photographer</h4>
            <p className="text-sm text-black">25 Photos Shared</p>
          </div>
          <div className="p-4 text-center bg-gray-50 rounded-lg">
            <img
              src="https://cdn.builder.io/api/v1/image/assets/TEMP/596aad60ff626e7b348a9cd5728120e2c0ae16482a2b0e5342e0d91a06b386ba?apiKey=dbae431cfeff47348b69e0da28b2579d&"
              alt="Expert"
              className="mx-auto mt-0 mb-2 w-16 h-16 rounded-full"
            />
            <h4 className="mb-1 text-base font-bold text-black">Expert</h4>
            <p className="text-sm text-black">1000 Points Earned</p>
          </div>
        </div>
      </div>
    </section>
  )
}

export default KnowledgeTest