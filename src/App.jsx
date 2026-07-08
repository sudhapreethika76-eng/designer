import React ,{useEffect}from 'react';
import './App.css';
import Home from './components/Home';




import { HashRouter,Routes,Route } from 'react-router-dom';

function App() {


  return (
    <>
      
       <HashRouter> <Routes>
        <Route path="/" element={<Home/>}/>
        
        
        
        </Routes></HashRouter>
    </>
  );
}

export default App;
