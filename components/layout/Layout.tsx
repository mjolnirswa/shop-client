import { ILayoutProps } from '@/types/common'
import Header from '../modules/Header/Header'
import Footer from '../modules/Footer/Footer'

const Layout = ({ children }: ILayoutProps) => {
  return (
    <>
      <Header />
      {children}
      <Footer />
    </>
  )
}

export default Layout
