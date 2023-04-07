import { BrowserRouter, Switch } from "react-router-dom";
import Routes from "./Routes";
import "./App.css";

const App = () => {
  return (
    <BrowserRouter>
      <Switch>
        <Routes />
      </Switch>
    </BrowserRouter>
  );
};

export default App;
