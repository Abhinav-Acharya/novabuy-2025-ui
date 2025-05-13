import { createRoot } from "react-dom/client";
import { Provider } from "react-redux";
import { BrowserRouter } from "react-router-dom";
import App from "./App.tsx";
import ShopContextProvider from "./context/ShopContext.tsx";
import "./index.css";
import { store } from "./redux/store.ts";

const rootElement = document.getElementById("root");

if (rootElement) {
  createRoot(rootElement).render(
    <BrowserRouter>
      <Provider store={store}>
        <ShopContextProvider>
          <App />
        </ShopContextProvider>
      </Provider>
    </BrowserRouter>
  );
} else {
  console.error("Root element not found. Application failed to mount.");
}
