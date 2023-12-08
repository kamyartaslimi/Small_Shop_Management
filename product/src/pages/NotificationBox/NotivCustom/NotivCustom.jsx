import "./NotivCustom";
import Toast from "react-bootstrap/Toast";

function NotivCustom() {
  return (
    <>
      <h3>یاداور ها</h3>
      <hr />
      <Toast>
        <Toast.Header>
          <img src="holder.js/20x20?text=%20" className="rounded me-2" alt="" />
          <strong className="me-auto">یاداور</strong>
          <small>11 mins ago</small>
        </Toast.Header>
        <Toast.Body>Hello, world! This is a toast message.</Toast.Body>
      </Toast>
    </>
  );
}
export default NotivCustom;
