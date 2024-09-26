import Coupon from "../components/Coupon";
import { useLocation } from "react-router-dom";

const Coupons = () => {
    const location = useLocation();
    const userId = location.state?.userId; 
    return (
        <div>
           <Coupon userId={userId} />
        </div>
    )
}
export default Coupons 

