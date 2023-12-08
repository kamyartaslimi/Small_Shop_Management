import "./NotivCheck.css";
import NotifChickItem from "../../../components/NotifCheckItem/NotifCheckItem";
import { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import checkicon from '../../../assets/image/icons8-timesheet.gif'

function NotivCheck() {
  const [notifData, setNotifData] = useState([]);
  const [massageNun , setMassageNun] = useState()

  useEffect(() => {
    axios.post("http://localhost:8000/Application/index.php" , {PostAction : "GetChecks"}).then((response) => {
      // console.log(response.data);
      if(response.data.Status !== 203){

        setNotifData(response.data.Data);
      }else{
        
        return  setMassageNun(<p>چکی یافت نشد</p>)
      }
      
      // console.log(response.data);
      // if(notifData.length === 0){
      // }
    });
  }, []);

  return (
    <>
      <h3>یاداور های چک <img src={checkicon} alt="" /></h3>
      <hr />
      {
        massageNun
      }
      {notifData.map((item) => (
        <NotifChickItem key={item.id} {...item} />
      ))}

      {/* btn add check */}
      <h4 className="add-notiv-check m-5">
        <Link to={'/addNotifCheck'} style={{textDecoration: 'none' ,color : "#ffff"}}>
          +
        </Link>
      </h4>
    </>
  );
}
export default NotivCheck;
