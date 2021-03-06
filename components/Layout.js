import Header from "./Navbar"

const Layout = ({ children, volunteers }) => {
  return (
    <div className="content">
      <Header />
      <div className="padding-top">
        { children }
      </div>
    </div>
  );
}

export default Layout;