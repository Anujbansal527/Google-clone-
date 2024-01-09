import './App.css';
import Edditor from './components/Edditor';
import {BrowserRouter as Router ,Routes,Route, Navigate } from "react-router-dom";
import {v4 as uuid} from "uuid";

function App() {
  return (
    <Router>
      <Routes>                                                   {/*uuid creates new id*/}
          <Route path="/" element={<Navigate replace to={`/docs/${uuid()}`}/>}/>
          <Route path='/docs/:id' element= {<Edditor/>}/>
       </Routes>
    </Router>
  );
}

export default App;
