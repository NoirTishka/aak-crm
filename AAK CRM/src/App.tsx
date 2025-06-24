import './App.css';
import { DraggableBar } from './components/DraggableBar';
import { KursantDetails } from './components/KursantDetails';
import { SideBar } from './components/Sidebar';
import { KursantProvider } from './context/KursantContext';

export default function App() {
  return (
    <KursantProvider>
      <div className="h-screen w-screen flex flex-col">
        <DraggableBar />
        <div className="flex flex-1 w-full">
          <SideBar />
          <KursantDetails />
        </div>
      </div>
    </KursantProvider>
  );
}
