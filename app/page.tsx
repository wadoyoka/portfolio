import About from '@/components/layouts/About/About'
import Footer from '@/components/layouts/Footer/Footer'
import Header from '@/components/layouts/Header/Header'
import Top from '@/components/layouts/Top/top'
import Works from '@/components/layouts/Works/Works'

// This function would typically fetch data from an API or read from a file
async function getWorksData() {
  // For now, we'll return mock data
  return {
    contents: [
      {
        id: "y4alrxiqiv7",
        title: "UmiSiozaki.com",
        summary: "A website for UmiSiozaki",
        thumbnail: {
          url: "https://images.microcms-assets.io/assets/2f8c420c6fb445c4baa4e7b57a40133b/ddaae6d253bf4f299d0402449e6597f9/4fftnweuaig.jpg",
          height: 630,
          width: 1200
        },
        tags: [
          {
            id: "yu2c7n8ocwr",
            tag: "Next.js"
          }
        ]
      },
      // Add more mock data as needed
    ]
  }
}

export default async function Home() {
  const worksData = await getWorksData()

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main>
        <Top></Top>
        <Works works={worksData.contents} />
        <About />
      </main>
      <Footer />
    </div>
  )
}