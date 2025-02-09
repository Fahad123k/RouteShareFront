

// import './App.css'
import Home from './components/Home'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import Search from './Pages/Search'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import About from './Pages/About'
import SignUp from './Pages/SignUp'
import Login from './Pages/Login'
import Publish from './Pages/Publish'
import Profile from './Pages/Profile';

function App() {


  return (
    <>
      <Navbar />
      <Routes>


        <Route path="/" element={<Home />} />
        <Route path="/search" element={<Search />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/about" element={<About />} />
        <Route path="/sign-up" element={<SignUp />} />
        <Route path="/login" element={<Login />} />
        <Route path="/publish" element={<Publish />} />

      </Routes>
      <Footer />

    </>
  )
}

export default App
