import { Link } from "react-router-dom"
import './RealTimeProductsWidget.css'

export const RealTimeProductsWidget = () => {
    return (
        <Link to="/realtimeproducts">
            <button className="realTime">
                Gestionar productos
            </button>
        </Link>
    )
}
