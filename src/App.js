import logo from './logo.svg';
import './App.css';
import WordSearch from './components/WordSearch';
import VisualGenerator from './components/VisualGenerator';
import Report from './components/Report';
function App() {
  return (
  <>
  <div className="title">
    <p>Reddit Dataset Analysis</p>  
  </div>
  <WordSearch />
  <VisualGenerator />
  {/* <Report />*/ }
  </>
  );
}

export default App;
