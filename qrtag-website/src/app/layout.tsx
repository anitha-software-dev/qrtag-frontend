import { Public_Sans, Inter } from "next/font/google";
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import "slick-carousel/slick/slick.css";
import "./assets/main.css";
import "react-toastify/dist/ReactToastify.css";

import { ToastContainer } from "react-toastify";

const public_sans = Inter({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800'],
  variable: '--body-color-font',
});


export const metadata = {
  title: {
    absolute: '',
    default: 'QRTag.it - Tag it, Scan it, Get it Back!',
    template: '%s | QRTag.it - Tag it, Scan it, Get it Back!',
  },
  description: 'QRTag.it - Tag it, Scan it, Get it Back!',
  openGraph: {
    title: 'QRTag.it - Tag it, Scan it, Get it Back!',
    description: 'QRTag.it - Tag it, Scan it, Get it Back!',
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <meta name="author" content="Themeservices" />
        <link rel="icon" href="/favicon.ico" sizes="any" />
      </head>
      <body className={`${public_sans.variable}`} suppressHydrationWarning>
        {children}
        
        <ToastContainer
          position="top-right"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
        />
      </body>
    </html>
  );
}
