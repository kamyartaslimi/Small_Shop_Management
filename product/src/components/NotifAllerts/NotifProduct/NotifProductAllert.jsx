import { useEffect, useState } from "react";
import "./NotifProductAllert.css";
import axios from "axios";
import ProductItem from "../../ProductItem/ProductItem";

function NotifProduct() {
  const [productData, setProductData] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    axios
      .post("http://localhost:8000/Application/index.php", {
        PostAction: "GetHomeProductAlarm",
      })
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

  const showAllertProduct = () => {
    
    if (error === null) {
      return productData.map((item) => {
        // <div className="container-parent-product">
        return (
          <div key={item.id} className="container-product-item my-2">
            <ProductItem {...item} />
          </div>
        );
        // </div>

      });
    } else {
      return null;
    }

  };

  return (
    <div className="container-parent-product">
      <h1>notiv product</h1>
      {showAllertProduct()}
    </div>
  );
}

export default NotifProduct;
