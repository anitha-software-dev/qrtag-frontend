import Navbar from "../common/Navbar";
import FindWidget from "../common/FindWidget";
import DownloadLink from "../common/DownloadLink";
import TopNavbar from "../common/TopNavContent";

const Widget = () => {
    return(
        <>
            <div>
                <Navbar/>
                <TopNavbar />
                <FindWidget/>
               <DownloadLink/>
            </div>
        </>
    )
}

export default Widget