import Coupon from "../components/Coupon";
import NavigationBar from "../components/NavigationBar"
import { useLocation } from "react-router-dom";

const Coupons = () => {
    const location = useLocation();
    const userId = location.state?.userId; 
    const email = location.state?.email;
    return (
        <div>
            <NavigationBar email ={email}/>
           <Coupon userId={userId} />
        </div>
    )
}
export default Coupons 

