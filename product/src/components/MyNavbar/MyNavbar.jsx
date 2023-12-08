import './MyNavbar.css';
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import Offcanvas from 'react-bootstrap/Offcanvas';
import { NavLink } from 'react-router-dom';



function MyNavbar(){
    const expand = 'md'
    return(
        <>
        <Navbar key={expand} expand={expand} className="bg-body-tertiary mb-3">
          <Container className='nav-container' fluid>
            <Navbar.Brand className='fs-4 lalezar'> ابراهیمی </Navbar.Brand>
            <Navbar.Toggle aria-controls={`offcanvasNavbar-expand-${expand}`} />
            <Navbar.Offcanvas
              id={`offcanvasNavbar-expand-${expand}`}
              aria-labelledby={`offcanvasNavbarLabel-expand-${expand}`}
              placement="start"
              >
              <Offcanvas.Header closeButton>
                <Offcanvas.Title id={`offcanvasNavbarLabel-expand-${expand}`}>
                  فروشگاه لوازم ابراهیمی
                </Offcanvas.Title>
              </Offcanvas.Header>
              <Offcanvas.Body>
                <Nav className="justify-content-end flex-grow-1 pe-3" style={{alignItems : "center"}}>
                  <NavLink className='nav-link' to={'/addProduct'}>خرید</NavLink>
                  <NavLink className='nav-link' to={'/notificationBox'}>باکس اعلان ها</NavLink>
                  <NavLink className='nav-link' to={'/'}>صفحه اصلی</NavLink>
      
                </Nav>
              </Offcanvas.Body>
            </Navbar.Offcanvas>
          </Container>
        </Navbar>
        </>
    )
}
export default MyNavbar;