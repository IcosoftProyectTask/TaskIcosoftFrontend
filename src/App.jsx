//Libraries
import { useLocation } from "react-router-dom";
import { useEffect } from "react";

//Routes
import AppRouter from "./routes/AppRouter";

//CSS
import "./assets/css/style.css";
import "./components/charts/ChartjsConfig";

function App() {
  const location = useLocation();

  useEffect(() => {
    document.querySelector("html").style.scrollBehavior = "auto";
    window.scroll({ top: 0 });
    document.querySelector("html").style.scrollBehavior = "";
  }, [location.pathname]);

  return <AppRouter />;
}

export default App;
