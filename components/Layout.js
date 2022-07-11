import Header from "./Navbar"

const Layout = ({ children }) => {
  return (
    <div className="content">
      <Header />
      { children }
    </div>
  );
}

export default Layout;