import { Button, Container } from 'react-bootstrap';
import './AddProduct.css';
import Form from "react-bootstrap/Form";
import { useState } from 'react';
import MyNavbar from '../../components/MyNavbar/MyNavbar';
import Swal from 'sweetalert2'
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function AddProduct(){
    const [productData, setProductData] = useState({});
    const navigate = useNavigate();
    
//   const resetform = () => {
//     setProductData({
//       name: "",
//       price: "",
//       loc: "",
//       inventory: ""
//     });
//   };
    
  const chingeInput = (e) => {
    if(e.target.type === "number"){
      setProductData({
        ...productData,
          [e.target.name]: Number(e.target.value),
        });
        // console.log(e.target.value);

    }else{

      setProductData({
        ...productData,
          [e.target.name]: e.target.value,
        });
       
      }
 
  };

  const addProductHandler = () => {
    if(productData.Name){
      productData.PostAction = "PostProductToCreate";
        axios.post("http://localhost:8000/Application/index.php", productData)
        .then( response => {
          // console.log(response.data);
        
          if(response.data.Status === 201){
            Swal.fire({
              // icon: 'tue',
              text: 'محصول ایجاد شد',
              timer: 1500,
              timerProgressBar: true,
              icon : 'success',
              showConfirmButton : false
    
            })
          }
        //   go to home page navigate
          navigate('/')
        })
        .catch(error =>{
          Swal.fire({
            // icon: 'tue',
            text: 'محصول ایجاد نشد',
            timer: 1500,
            timerProgressBar: true,
            icon : 'error'
          })
        })
        // resetform();
    }else{
        Swal.fire({
            icon: "error",
            title: "اشتباهی شد...",
            text: "همه موارد را پر کنید یا حداقل نام محصول را پرکنید!",
          });
    }

  };

    return(
        <>
        <MyNavbar />
        <Container>
          <h1 className="mt-5 pt-3 text-primary">افزودن محصول</h1>
          <Form style={{ maxWidth: "700px", margin: "1rem auto" }}>
            <Form.Group className="mb-3 mt-5">
              <Form.Label>نام محصول</Form.Label>
              <Form.Control
                type="text"
                name="Name"
                className="input-styles"
                // value={`${productData.Name}`}
                onChange={chingeInput}
              />
            </Form.Group>
  
            <Form.Group className="mb-3">
              <Form.Label>
                قیمت محصول <i>(به تومان)</i>
              </Form.Label>
              <Form.Control
                type="number"
                name="Price"
                className="input-styles"
                // value={`${productData.Price}`}
                onChange={chingeInput}
              />
            </Form.Group>
  
            <Form.Group className="mb-3">
              <Form.Label>تعداد</Form.Label>
              <Form.Control
                type="number"
                className="input-styles"
                name="Inventory"
                // value={`${productData.Inventory}`}
                onChange={chingeInput}
              />
            </Form.Group>
  
            <Form.Group className="mb-3">
              <Form.Label>تعداد اعلان (تعدادی که میخواهید قبل اتمام محصول بهتون  پیغام داده بشه)</Form.Label>
              <Form.Control
                type="number"
                className="input-styles"
                name="InventoryAlarm"
                 // value={`${productData.InventoryAlarm}`}
                onChange={chingeInput}
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>مکان محصول</Form.Label>
              <Form.Control
                type="text"
                className="input-styles"
                name="ProductPosition"
                // value={`${productData.ProductPosition}`}
                onChange={chingeInput}
              />
            </Form.Group>
  
            <Button variant="primary" type="button" onClick={addProductHandler}>
              افزودن 
            </Button>
          </Form>
        </Container>
      </>
    )
}
export default AddProduct;