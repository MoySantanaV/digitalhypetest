import { ToastContainer } from "react-toastify";
import { Decoder } from "./Components/Decoder/Decoder";
import { Footer } from "./Components/Footer/Footer";
import "react-toastify/dist/ReactToastify.css";
import "./App.css";

const text: string = "Moises Santana Velasco";

function App() {
  return (
    <>
      <h1>Decoder</h1>
      <Decoder />
      <Footer text={text} />
      <ToastContainer theme="dark" />
    </>
  );
}

export default App;
