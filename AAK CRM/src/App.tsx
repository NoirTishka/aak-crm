import './App.css'
import { DraggableBar } from './components/Draggablebar';
import { KursantDetails } from './components/Kursantdetails';
import { SideBar } from './components/SideBar';

export default function App() {
  
 
  return (
    <div className="h-screen w-screen flex flex-col">
      <DraggableBar></DraggableBar>
      <div className="flex flex-1 w-full">
        <SideBar></SideBar>
        <KursantDetails></KursantDetails>
      </div>
    </div>
  );
}
