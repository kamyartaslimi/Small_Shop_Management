import { useEffect, useState } from "react";
import "./HoePage.css";
import axios from "axios";
import ProductItem from "../../components/ProductItem/ProductItem";
import { Alert, Col, Container, Row } from "react-bootstrap";
import MyNavbar from "../../components/MyNavbar/MyNavbar";
import NotifAllert from "../../components/NotifAllerts/NotifAllert";
import storicon  from '../../assets/image/icons8-online-store-48.png'
import NotifProduct from "../../components/NotifAllerts/NotifProduct/NotifProductAllert";
import ShoppingCalculator from "../../components/ShoppingCalculator/ShoppingCalculator";

function HomePage() {
  const [productData, setProductData] = useState([]);
  const [textInput, setTextInput] = useState("");
  const [resultSearch , setResultSearch ] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    axios.post("http://localhost:8000/Application/index.php", { PostAction: "GetHomeProduct" })
      .then((response) => {
        if (response.data.Status === 203) {
          setError(response.data.Message);
        } else {
          setProductData(response.data.Data);
          setError(null);
        }
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  }, []);


  const searchHandler = (e) => {
    // setTextInput(e.target.value);
    axios.post("http://localhost:8000/Application/index.php" , {PostAction : "SearchingHomePage" , SearchBy :e.target.value})
    .then((response) => {
      setProductData(response.data.Data);
    });
  };
  const clickSearchIcon = ()=>{


    productData.map((product)=>{
      if (product.name.includes(`${textInput}`)) {
  
        axios.post("http://localhost:8000/Application/index.php" , {PostAction : "SearchingHomePage" , SearchBy :e.target.value})
        .then((response) => {
          setProductData(response.data.Data);
          setResultSearch(resultSearch.push(product));
        });

          }
          
        })

        if(resultSearch.length < 1){
          alert('محصولی یافت نشد');        
        }

  }

  return (
    <>
    <MyNavbar/>
      <Container>
        <div className="containderAllerts">
        <NotifAllert/>
        <NotifProduct/>
        </div>
    <ShoppingCalculator />
        <div className="contaienr-header-homePage">
          <h1 style={{ marginTop: "15px" }} className="text-primary"> <b> <img src={storicon} alt="" />محصولات ابراهیمی</b></h1>
          <div className="container-search">
            <input
              type="search"
              className="input-search"
              onChange={searchHandler}
            />
            <span onClick={clickSearchIcon}>جستجو</span>
          </div>
        </div>
{error ? (
  <Alert variant="danger">
    {"هنوز هیج دیتایی ثبت نشده است"}
  </Alert>
) : (
  <Row className="row-cols-1 row-cols-md-2 row-cols-lg-3 row-cols-xl-4 gy-3 py-3">
    {productData.map((product) => (
      <Col key={product.id}>
        <ProductItem {...product} />
      </Col>
    ))}
  </Row>
)}
        
      </Container>
      
    </>
  );
}
export default HomePage;
