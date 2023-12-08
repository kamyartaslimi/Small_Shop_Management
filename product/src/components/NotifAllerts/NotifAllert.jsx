import { useEffect, useState } from "react";
import "./NotifAllert.css";
import axios from "axios";
import NotifChickItem from "../NotifCheckItem/NotifCheckItem";
import { Alert } from "react-bootstrap";
import warningicongif from '../../assets/image/icons8-error.gif';
// import {persianDate} from 'persian-date'

// import favorite_calendar from "react-date-object/calendars/favorite_calendar"
// import DateObject from "react-date-object/calendars/gregorian";


function NotifAllert() {
  const [notifData, setNotifData] = useState([]);

  useEffect(() => {
    axios.post("http://localhost:8000/Application/index.php", {PostAction : "GetChecks"}).then((response) => {

      setNotifData(response.data.Data);
      console.log(response.data);
    });
  }, []);

  //persean date pacage
  // let nowDate = new persianDate().toLocale('en').format("DD/MM/YYYY");
  // var date = new DateObject();
  // console.log(date.format()); //2021/06/10


//get date now and revers date
// let nowDate =  new Date().toLocaleDateString('fa-IR-u-nu-latn')
// let newNowDate = nowDate.split('/').reverse().join('/');

// console.log(newNowDate);

  
const updateCheckStatusInData = (id, newCheckStatus) => {
  setNotifData((prevData) =>
    prevData.map((item) =>
      item.id === id ? { ...item, CheckStatus: newCheckStatus } : item
    )
  );
};

const conditionShowAllertCheck = () => {
  return notifData.map((item) => {
    if (item.RemainTime === 0 && item.CheckStatus === 0) {
      return (
        <Alert variant={"warning"} key={item.id}>
          <>
            <h3 className="text-warning">
              چک پرداختی <img src={warningicongif} alt="هشدار چک" />
            </h3>
            <NotifChickItem
              {...item}
              updateCheckStatus={updateCheckStatusInData}
            />
          </>
        </Alert>
      );
    }
  });
};
  return (
    <div className="mt-5 ">
      {
        conditionShowAllertCheck()
        
      }
    </div>
  );
}

export default NotifAllert;
