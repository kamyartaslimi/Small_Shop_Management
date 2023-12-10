import { Button } from "react-bootstrap";
import "./AddNotifCheck.css";
import Table from "react-bootstrap/Table";
import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import MyNavbar from "../../../components/MyNavbar/MyNavbar";




function AddNotifCheck(e) {
  const [checkData, setCheckData] = useState({});

  const navigate = useNavigate();
  const [texts , setTexts] =useState('')

  useEffect(() => {
    setCheckData({
      ...checkData,
      CheckPrice: Number(texts),
    });
  }, [texts]);


  const chaneInputHandler = (e) => {

    setCheckData({
      ...checkData,
      [e.target.name]: e.target.value,
    });
    
  };
  const chaneInputHandlerPrice = (e)=>{
    setTexts(e.target.value)
    setCheckData({
      ...checkData,
      [e.target.name]:  Number(texts),
    });
    // console.log(texts);
    // console.log(e.target.value);
    // console.log(checkData);
  }

  const addCheckHandler = () => {
  
    axios
      .post("http://localhost:8000/Application/index.php", { ...checkData  ,PostAction : "CreateCheck" })
      .then((response) => {
        // console.log(response.data);
        if (response.data.Status === 201) {
          Swal.fire({
            // icon: 'tue',
            text: "چک ایجاد شد",
            timer: 1500,
            timerProgressBar: true,
            icon: "success",
            showConfirmButton: false,
          });
        }
        //   go to home page navigate
        navigate("/notificationBox/check");
      });
  };



function numberWithCommas(x) {
  return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}
numberWithCommas(texts)

  const datePe = ()=>{
    let nowDate =  new Date().toLocaleDateString('fa-IR-u-nu-latn')
    let newNowDate = nowDate.split('/').reverse().join('/');

  
    return newNowDate;
  }



  return (
    <>
      <MyNavbar />
      <h3 className="mt-5 py-3"> اضافه کردن چک</h3>
      {datePe()}
     

      <hr />
      {/* #1 */}
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>#</th>
            <th>نام و نام خانوادگی صاحب چک </th>
            <th>نام و نام خانوادگی دریافت کننده </th>
            <th>نوع پرداختی </th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>1</td>
            <td>
              {" "}
              <input
                type="text"
                name="OwnerName"
                id=""
                placeholder="برای مثال  کیان پیرفلک"
                onChange={chaneInputHandler}
              />
            </td>
            <td>
              {" "}
              <input
                type="text"
                name="ReceiverName"
                id=""
                placeholder="برای مثال فروشگاه ابراهیمی"
                onChange={chaneInputHandler}
              />
            </td>
            <td>
              {" "}
              <input
                type="text"
                name="PaymentType"
                id=""
                placeholder="برای مثال اوپرداخت میکند"
                onChange={chaneInputHandler}
              />
            </td>
          </tr>
        </tbody>
      </Table>
      {/* #2 */}
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>#</th>
            <th>مبلغ چک </th>
            <th>تاریخ پرداخت</th>
            <th>شماره طرف</th>
            <th>متن کوتاه</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>2</td>
            <td>
              {" "}
              <p>{numberWithCommas(texts)} {texts.length >= 7 && <i>میلون</i>} {texts.length >= 4 && <i>تومان</i>}</p>
              
              <input
                type="number"
                name="CheckPrice"
                value={texts}
                placeholder="2.300.000"
                onChange={chaneInputHandlerPrice}
              />
            </td>
            <td>
              {" "}
              <p>به ترتیب از چپ به راست (سال/ماه/روز)</p>
              <b>مثال</b>
              <span>24/8/1402</span>
              <input
                className="p-1 mx-1"
                type="text"
                name="CheckDate"
                id=""
                placeholder=""
                onChange={chaneInputHandler}
              />
            </td>
            <td>
              {" "}
              <input
                type="number"
                name="ReceiverNumber"
                id=""
                placeholder="09302695785"
                onChange={chaneInputHandler}
              />
            </td>
            <td>
              {" "}
              <textarea
                id=""
                name="CheckDescription"
                rows="3"
                cols="50"
                placeholder="برای مثال :شماره چک"
                onChange={chaneInputHandler}
              ></textarea>
            </td>
          </tr>
        </tbody>
      </Table>
      <Button
        variant="primary"
        type="button"
        className="mx-3"
        onClick={addCheckHandler}
      >
        ایجاد چک
      </Button>
    </>
  );
}
export default AddNotifCheck;