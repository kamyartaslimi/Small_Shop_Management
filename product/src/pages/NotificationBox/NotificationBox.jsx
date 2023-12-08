import "./NotificationBox.css";
import { Container } from "react-bootstrap";
import MyNavbar from "../../components/MyNavbar/MyNavbar";
import { Link, NavLink, Outlet } from "react-router-dom";

function NotificationBox() {
  return (
    <>
      <MyNavbar />
      <Container>
        <h1 className="my-5 py-3 text-primary">باکس اعلان ها</h1>
        <hr />
        {/* ... */}
        <NavLink className="link-button" to={'notif'}>متن</NavLink>
        <NavLink className="link-button" to={'check'}>چک</NavLink>
        <hr />
        <Outlet/>
      
      </Container>
    </>
  );
}
export default NotificationBox;
