import { useEffect, useState } from "react";
import "./EditProduct.css";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import Form from "react-bootstrap/Form";
import { Container, Button } from "react-bootstrap";
import MyNavbar from "../../components/MyNavbar/MyNavbar";
import Swal from "sweetalert2";

function EditProduct() {
  const productId = useParams().productId;
  const [productData, setProductData] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    axios
      .post("http://localhost:8000/Application/index.php" , {id: productId, PostAction: "GetProductByID"})
      .then((response) => {
        setProductData(response.data.Data);
        // console.log(response.data);
      });
  }, []);

  const editProductHandler = () => {
    // ${productId}
    axios.put(`http://localhost:8000/Application/index.php?id=${productId}`, productData);
    Swal.fire({
  
        icon: 'success',
        title: 'محصول باموفقیت تغیر کرد',
        showConfirmButton: false,
        timer: 1000
      })
      
    navigate(`/productPage/${productId}`)
  };

  const formHandler = (e) => {
    setProductData({
      ...productData,
      [e.target.name]: e.target.value,
    });
  };

  



  return (
    <>
      <MyNavbar />
      <Container>
        <h1 className="mt-5 pt-3">ویرایش محصول</h1>
        <Form style={{ maxWidth: "700px", margin: "auto" }}>
          <Form.Group className="mb-3 mt-5">
            <Form.Label>نام محصول</Form.Label>
            <Form.Control
              type="text"
              name="Name"
              value={`${productData.Name}`}
              onChange={formHandler}
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>
              قیمت محصل <i>(به تومان)</i>
            </Form.Label>
            <Form.Control
              type="Number"
              name="Price"
              value={`${productData.Price}`}
              onChange={formHandler}
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>تعداد</Form.Label>
            <Form.Control
              type="number"
              name="Inventory"
              value={`${productData.Inventory}`}
              onChange={formHandler}
            />
          </Form.Group>

          <Form.Group className="mb-3">
              <Form.Label>تعداد اعلان (تعدادی که میخواهید قبل اتمام محصول بهتون  پیغام داده بشه)</Form.Label>
              <Form.Control
                type="number"
                name="InventoryAlarm"
                value={`${productData.InventoryAlarm}`}
                onChange={formHandler}
              />
            </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>مکان محصول</Form.Label>
            <Form.Control
              type="text"
              name="ProductPosition"
              value={`${productData.ProductPosition}`}
              onChange={formHandler}
            />
          </Form.Group>

          <Button variant="primary" type="button" onClick={editProductHandler}>
            ویرایش
          </Button>
        </Form>
      </Container>
    </>
  );
}
export default EditProduct;
