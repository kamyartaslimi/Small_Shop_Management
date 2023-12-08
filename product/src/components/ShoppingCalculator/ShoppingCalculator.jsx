import axios from 'axios';
import './ShoppingCalculator.css';
import { useEffect, useState } from 'react';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import calculatoricon from '../../assets/image/icons8-calculator-64.png';

function ShoppingCalculator() {
    const [shCData, setShCData] = useState({});
    const [show, setShow] = useState(false);
    const [updateTrigger, setUpdateTrigger] = useState(false); 

    useEffect(() => {
        axios.post(`http://localhost:8000/Application/index.php`, { PostAction: "GetDataCalculate" })
            .then((response) => {
                // console.log(response.data);
                if (response.data.Status !== 203) {
                    setShCData(response.data.Data);
                }
                // console.log(response.data);
            })
    }, [updateTrigger]); 

    const handleClose = () => setShow(false);

    const btnHandleClose = () => {
      axios.delete(`http://localhost:8000/Application/index.php`, { data: { id: shCData.id, DeleteAction: "DeleteAllSellCalculate" } })
          .then(() => {
              setShCData({});
              setUpdateTrigger(prev => !prev);
          })
          .catch(error => console.error('Error:', error));
      setShow(false);
    }


    return (
        <>
            <Button variant="primary" className='ms-4 btn-show-shoppingCalculater' onClick={() => setShow(true)}>
                <div>{shCData.AlarmNumber}</div>
                <img src={calculatoricon} alt="حساب مشتری" style={{ width: "40px" }} />
            </Button>

            <Modal show={show} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>فروشگاه لوازم ابراهیمی</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {shCData.SellProducts && shCData.SellProducts.map(item => (
                        <ul key={item.id} className='ul'>
                            <div className="div-item">
                            <li><span className='text-primary'>{item.Name}</span></li>
                            <li><span>{item.Price}</span></li>
                            <li><b> تعداد :{item.Inventory}</b> مجموع <span>{item.TotalPrice}هزار تومان</span></li>
                            </div>
                            <div className='div-button'>
                            <Button variant="outline-danger" className='btn-sm me-2' onClick={() => {
                                axios.delete(`http://localhost:8000/Application/index.php`, { data: { id: item.id, DeleteAction: "DeleteCellSellCalculate" } })
                                    .then(() => setUpdateTrigger(prev => !prev)) 
                                    .catch(error => console.error('Error:', error));
                                setShow(false);
                            }}>حذف</Button>
                            </div>
                        </ul>
                    ))}
                </Modal.Body>
                <Modal.Footer>
                    <b className='ms-2'> جمع کل حساب
                        <b className='text-primary ms-2'>{shCData.FinalPrice}هزار تومان</b>
                    </b>
                    <Button variant="danger" className="primary" onClick={btnHandleClose}>
                        پاک کردن همه
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    );
}

export default ShoppingCalculator;
