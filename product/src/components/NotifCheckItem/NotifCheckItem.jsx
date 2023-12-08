import "./NotifCheckItem.css";
import Toast from "react-bootstrap/Toast";
import Table from "react-bootstrap/Table";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { Button } from "react-bootstrap";
import { useEffect, useState } from "react";

function NotifChickItem(props) {
  // console.log(props);
  const navigate = useNavigate();
  const [colorBtn , setColorBtn] = useState('secondary')

  useEffect(()=>{
    console.log(colorBtn);
    
  } ,[colorBtn])
  
  const [checkStatus, setCheckStatus] = useState(props.CheckStatus);
  
  const updateCheckStatus = (newCheckStatus) => {
    setCheckStatus(newCheckStatus);
  };


  const removeBtnHandler = () => {
    Swal.fire({
      title: `چک ${props.OwnerName} رو حذف میکنی؟`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "بله مطمنم",
      cancelButtonText: "منصرف شدم",
    }).then((result) => {
      if (result.isConfirmed) {
        Swal.fire({
          title: "چک باموفیت حدف شد",
          icon: "success",
        });

        axios.delete("http://localhost:8000/Application/index.php ", {
          data: { id: props.id, DeleteAction: "DeleteCheck" },
        });
        navigate("/notificationBox/");
        setTimeout(() => {
          navigate("/notificationBox/check");
        }, 800);
      }
    });
  };

  const pardakhtIS = () => {
    axios
      .post("http://localhost:8000/Application/index.php", {
        id: props.id,
        PostAction: "CheckChangeStatus",
        CheckStatus: checkStatus,
      })
      .then((response) => {
        updateCheckStatus(response.data.Data.CheckStatus);
        props.updateCheckStatus(props.id, response.data.Data.CheckStatus);
        // console.log(response.data.Data.CheckStatus);
        if(response.data.Data.CheckStatus === 1){
         setColorBtn('success')
        }else{
          setColorBtn('secondary')
        }
        
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  };

  return (
    <>
      <Toast style={{ width: "auto" }} className="my-3">
        <Toast.Header className="header-box-title">
          {/* <img src="holder.js/20x20?text=%20" className="rounded me-2" alt="" /> */}
          <strong className="me-auto">چک</strong>

          <small>روز باقی مانده : {props.RemainTime}</small>
          <span
            className="closeBtn-close btn-close"
            style={{ backgroundColor: "red" }}
            onClick={removeBtnHandler}
          ></span>
        </Toast.Header>
        <Toast.Body>
          <Table striped bordered hover>
            <thead>
              <tr>
                <th>#</th>
                <th>نام و نام خانوادگی صاحب چک</th>
                <th>نام و نام خانوادگی دریافت کننده</th>
                <th>نوع پرداختی</th>
                <th>مبلغ چک</th>
                <th>تاریخ پرداخت</th>
                <th>شماره طرف</th>
                <th>متن کوتاه</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>1</td>
                <td>{props.OwnerName}</td>
                <td>{props.ReceiverName}</td>
                <td>{props.PaymentType}</td>
                <td>{props.CheckPrice}</td>
                <td>{props.CheckDate}</td>
                <td>{props.ReceiverName}</td>
                <td>{props.CheckDescription}</td>
              </tr>
            </tbody>
          </Table>
          <div className="checkbox-wdrapper-19 me-5">
             <small>
             <Button variant={`${colorBtn}`} size="sm" type="submit" onClick={pardakhtIS}>
            {checkStatus === 0 ? 'پرداخت نشده' : 'چک پرداخت شده'}
            </Button>
             </small>
             
          </div>
        </Toast.Body>
      </Toast>
    </>
  );
}
export default NotifChickItem;
