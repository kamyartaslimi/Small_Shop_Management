import { useEffect, useState } from "react";
import "./ProductPage.css";
import Button from 'react-bootstrap/Button';
import axios from "axios";
import { Link, useNavigate, useParams } from "react-router-dom";
import { Container } from "react-bootstrap";
import Swal from "sweetalert2";
import MyNavbar from "../../components/MyNavbar/MyNavbar";
import producticon from '../../assets/image/icons8-product-64 (1).png'
// import producticon from '../../assets/image/icons8-supplies (1).gif'
import locationicon from '../../assets/image/icons8-place-marker (1).gif'

function ProductPage() {
  const productid = useParams().productId;
  const [productData, setProductData] = useState({});
  const navigate = useNavigate();
  const [classSircle , setClassSircle] = useState('widget-49-date-primary');
  const [shopData , setShpData] = useState({});
  const [backInventory , setBackInventory] = useState()
  

  useEffect(() => {
    axios
    .post("http://localhost:8000/Application/index.php", {id: productid, PostAction: "GetProductByID"})
  .then((response) => {
    setProductData(response.data.Data);
    // setInventory(response.data.Data.Inventory);
    // console.log(response.data.Data.Inventory);
    setBackInventory(response.data.Data.Inventory);
  });
  

  // console.log(productData.data.Data);
  
} , []);
console.log(backInventory);
  
  const decreseHandler = () => {
    Swal.fire({
      text: "چنتا فروختی؟",
      icon: "info",
      input: "number",
    }).then(function (result) {

      if (productData.Inventory >= result.value) {
        // console.log('تعداد باقی مانده از تعداد وارد شده بیشتر هست میتونی');
        if (result.value) {
          const amount = result.value;
          Swal.fire(amount + "عدد کم شد");
          const numberAmount = Number(amount);
          // const numberInventory = Number(productData.Inventory);
          // setInventory(Inventory - numberAmount)
  
          // productData.Inventory = Inventory;
  
          // axios.patch(`http://localhost:3000/products/${productid}` , productData)
          axios.patch(`http://localhost:8000/Application/index.php` , {id: productid, Inventory: numberAmount , PatchAction: "ProductSell"}).then(response =>{
            console.log(response.data.Data.Inventory);
            setBackInventory(response.data.Data.Inventory)
          })
      
          axios.post('http://localhost:8000/Application/index.php' , {id : productid , InventorySell : numberAmount , PostAction : "SetDataToCalculate"}).then(response =>{
             
          })


          setClassSircle('action-widget-49-date-primary')
          setTimeout(() => {
            
            setClassSircle('widget-49-date-primary')
            
          }, 1000);
          
          // window.location.reload();
        }
      }else{
        // console.log('تعداد وارد شده بیشتر از تعداد باقی مانده است');
        const Toast = Swal.mixin({
          toast: true,
          position: "top-end",
          showConfirmButton: false,
          timer: 3000,
          timerProgressBar: true,
          didOpen: (toast) => {
            toast.onmouseenter = Swal.stopTimer;
            toast.onmouseleave = Swal.resumeTimer;
          }
        });
        Toast.fire({
          icon: "error",
          title: "تعدادی که میخواهید بفروشید از تعداد باقی مانده بیشتر است"
        });
      }
      
    });
    
  };
  const increseHandler = () => {
    Swal.fire({
      text: "چنتا  برگشتی داری؟",
      icon: "warning",
      input: "number",
    }).then(function (result) {
      if (result.value) {
        const amount = result.value;
        Swal.fire(amount + "عدد به انبار اضافه شد");
        const numberAmount = Number(amount)
        const numberInventory = Number(productData.Inventory)
        // setInventory(Inventory +  numberAmount)
        // productData.Inventory = Inventory ;

        axios.patch(`http://localhost:8000/Application/index.php` ,{id: productid, Inventory: numberAmount , PatchAction: "ProductReturn"}).then(response =>{
          setBackInventory(response.data.Data.Inventory)
        })
        setClassSircle('action-widget-49-date-primary')
        setTimeout(() => {
      
          setClassSircle('widget-49-date-primary')
    
        }, 1000);
      }
    });
  };


  //delet product
  const removeProductHandler = () => {
    Swal.fire({
      title: "آیا مطنی محصول رو حذف میکنی?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "بله مطمنم",
      cancelButtonText: "منصرف شدم",
    }).then((result) => {
      if (result.isConfirmed) {
        Swal.fire({
          title: "محصول باموفیت حدف شد",
          icon : 'success'
        });
        axios.delete(`http://localhost:8000/Application/index.php` ,  {data : {id : productid , DeleteAction : "DeleteProduct"}})
        setTimeout(() => {
          
          navigate('/')
        }, 800);
      }
    });
  };


  return (
    <>
        <MyNavbar/>
    <Container>
      <br  />
      <hr />

      <div className="row" style={{marginTop: '2rem'}}>
        <div className="col-lg-7 card card-margin">
          <img src={producticon} alt="عکس محصول" className="imge-product" />
          <div className="card-header no-border">
            <h5 className="card-title"><b>{productData.Name}</b></h5>
          </div>
          <div className="card-body pt-0">
            <div className="widget-49">
              <div className="widget-49-title-wrapper">
                <div className={classSircle}>
                  {" "}
                  <span className="widget-49-date-day">
                    {backInventory}
                  </span>{" "}
                  <span className="widget-49-date-month">موجودی</span>
                </div>
                <div className="widget-49-meeting-info">
                  {" "}
                  <span className="widget-49-pro-title">محصول</span>{" "}
                  <span className="widget-49-meeting-time">
                    12:00 to 13.30 Hrs
                  </span>
                  <b>قیمت ${productData.Price}</b>
                </div>
              </div>
              <ul className="widget-49-meeting-points mt-4">
              
                  <img src={locationicon} alt="مکان" />
                  <span>{productData.ProductPosition}</span>
              
              </ul>
            </div>
          </div>
        </div>

        <div className="col-lg-5 box-buttons">
              <Button variant="outline-success" className="mb-4 mx-2" onClick={decreseHandler}>فروش</Button>
              <Button variant="outline-warning" className="mb-4 mx-2" onClick={increseHandler}>بازگشتی</Button>
              <br />
              <Link to={`/editProduct/${productid}`}>
              <Button variant="outline-secondary" className="m-2">ویرایش محصول</Button>
              </Link>
              <Button variant="outline-danger" className="m-2" onClick={removeProductHandler}>حذف محصول</Button>
        </div>
      </div>
    </Container>
    </>

  );
}
export default ProductPage;
