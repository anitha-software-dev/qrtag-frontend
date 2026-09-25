import Navbar from "../common/Navbar";
import LostItem from "../common/LostItem";
import DownloadLink from "../common/DownloadLink";
import TopNavbar from "../common/TopNavContent";

// import {useParams} from "react-router-dom";

// get the uuid from the current url

//find by uuid from tagged_items

//display information to user

const Scanned = () =>{

    // let { uuid } = useParams();
    return(
        <>
            
            <div>
                <Navbar/>
                <TopNavbar />
                <LostItem/>
               <DownloadLink/>
            </div>
        </>
    )
}

export default Scanned