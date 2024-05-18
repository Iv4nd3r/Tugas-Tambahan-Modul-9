import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import CreateEvent from "./create-event";
import ScanTicket from "./scan-ticket";
import Navbar from "./navbar";
import EventTable from "./EventTable";

function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<EventTable />} />
        <Route path="/create-event" element={<CreateEvent />} />
        <Route path="/scan-ticket" element={<ScanTicket />} />
      </Routes>
    </Router>
  );
}

export default App;
