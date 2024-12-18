import DeletedCoupon from "../components/DeletedCoupon";
import NavigationBar from "../components/NavigationBar"
import { useLocation } from "react-router-dom";

const Bin = () => {
    const location = useLocation();
    const userId = location.state?.userId; 
    const email = location.state?.email;
    return (
        <div>
            <NavigationBar email ={email} userId={userId}/>
           <DeletedCoupon userId={userId} />
        </div>
    )
}
export default Bin 

