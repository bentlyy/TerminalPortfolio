import TerminalPortfolio from './components/TerminalPortfolio/TerminalPortfolio';
import AnimatedBackground from './components/UI/AnimatedBackground/AnimatedBackground';
import './App.css';

function App() {
  return (
    <div className="app">
      <AnimatedBackground isVisible={true} />
      <TerminalPortfolio />
    </div>
  );
}

export default App;