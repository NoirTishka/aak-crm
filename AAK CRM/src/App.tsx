import './App.css';
import { DraggableBar } from './components/DraggableBar';
import { KursantProvider } from './context/KursantContext';
import { MainWindow } from './components/MainWindow';

export default function App() {
  return (
    <KursantProvider>
      <div className="h-screen w-screen flex flex-col">
        <DraggableBar />
        <MainWindow />
      </div>
    </KursantProvider>
  );
}
