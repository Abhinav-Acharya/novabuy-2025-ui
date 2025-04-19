import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App.tsx";
import "./index.css";
import ShopContextProvider from "./context/ShopContext.tsx";
import { store } from "./redux/store.ts";
import { Provider } from "react-redux";

createRoot(document.getElementById("root")!).render(
  <BrowserRouter>
    <Provider store={store}>
      <ShopContextProvider>
        <App />
      </ShopContextProvider>
    </Provider>
  </BrowserRouter>
);
