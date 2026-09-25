/* eslint-disable jsx-a11y/alt-text */
import React from "react";
import AppStore from "../../images/app-store.png";
import PlayStore from "../../images/play-store.png";

function DownloadLink() {
  return (
    <>
      <div className="DownloadLink_Container container mb-5">
        <h2>DOWNLOAD THE QRTag.it APP NOW</h2>
        <p>
          What are you waiting for? Download the QRTag.it App now! The user
          interface of QRTag.it is simple and easy to navigate
        </p>
        <div className="DownloadLink_StoreDiv">
          <a href="https://apps.apple.com/us/app/qrtag-it/id6444082603" target="_blank">
            <img style={{ width: "90%" }} src={AppStore} />
          </a>
          <a href="https://play.google.com/store/apps/details?id=com.withered_feather_36062" target="_blank">
            <img style={{ width: "90%" }} src={PlayStore} />
          </a>
        </div>
      </div>
    </>
  );
}

export default DownloadLink;
