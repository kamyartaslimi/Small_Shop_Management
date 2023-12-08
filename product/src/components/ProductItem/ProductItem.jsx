import './ProductItem.css';
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import { Link } from "react-router-dom";
import producticon from '../../assets/image/icons8-product-64.png';

function ProductItem(props){

    return(
        <Card className='carditem'>
        <Card.Header>{props.id}<img src={producticon} style={{width:"28px"}}/></Card.Header>
        <Card.Body>
          <Card.Title>{props.Name}</Card.Title>
          <Card.Text>
            {props.Price}$ تومان
          </Card.Text>
          <p>موجودی : {props.Inventory}</p>

          <Link to={`/productPage/${props.id}`}>
          <Button variant="primary">نمایش</Button>
          </Link>
        </Card.Body>
      </Card>
    )
}
export default ProductItem;