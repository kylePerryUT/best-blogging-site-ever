import { Outlet } from "react-router-dom";
import Header from "../header/Header";
import "./App.css";

function App() {
  return (
    <div className="App">
      {/* <div></div> */}
      <img
        className={"backgroundImage"}
        src="/images/background.jpg"
        alt="super cool background"
      />
      <Header />
      <Outlet />
    </div>
  );
}

export default App;
