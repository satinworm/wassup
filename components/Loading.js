import { Circle } from "better-react-spinkit";
import { PulseLoader } from "react-spinners";

export default function Loading() {
  return (
     <center
        style={{
           display: "grid",
           placeItems: "center",
           justifyItems: "center",
           height: "100vh",
        }}
     >
        <div>
           <img
              src="https://freesvg.org/img/1534129544.png"
              alt=""
              height={200}
              style={{ marginBottom: 10 }}
           />
           <PulseLoader color="#46864A" />
           {/* <Circle color="#3cbc2b" size={60} /> */}
        </div>
     </center>
  );
}
