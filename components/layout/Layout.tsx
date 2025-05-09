import Header from "./Header"

const CommonLayout = ({children}: Readonly<{
    children: React.ReactNode
}>) => {
  return (
    <div className="min-h-screen bg-white">
        <Header />
        {children}
    </div>
  )
}

export default CommonLayout