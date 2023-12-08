import "./App.css";
import HomePage from "./pages/Home/HoePage";
import "bootstrap/dist/css/bootstrap.rtl.min.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import ProductPage from "./pages/ProductPage/ProductPage";
import EditProduct from "./pages/EditProduct/EditProduct";
import AddProduct from "./pages/AddProduct/AddProduct";
import NotificationBox from "./pages/NotificationBox/NotificationBox";
import NotivCheck from "./pages/NotificationBox/notiv-check/NotivCheck";
import NotivCustom from "./pages/NotificationBox/NotivCustom/NotivCustom";
import AddNotifCheck from "./pages/NotificationBox/AddNotif/AddNotifCheck";


function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/productPage/:productId" element={<ProductPage />} />
          <Route path="/editProduct/:productId" element={<EditProduct/>} />
          <Route path="/addProduct" element={<AddProduct/>} />
          <Route path="/notificationBox/*" element={<NotificationBox />} >
            <Route path="check" element={<NotivCheck/>} />
            <Route path="notif" element={<NotivCustom/>} />
          </Route>
          <Route path="addNotifCheck" element={<AddNotifCheck/>}/>
        </Routes>
      </BrowserRouter>
      {/* <HomePage/> */}
    </>
  );  
}

export default App;
