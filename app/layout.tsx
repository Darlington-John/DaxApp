'use client'
import localFont from "next/font/local";
import "./globals.css";
import Header from "./components/header";
import Footer from "./components/footer";
import { UserProvider } from "./context/auth-context";
import { Provider } from 'react-redux';
import store from '~/store';
import { DashboardProvider } from "./context/dashboard-context";
import { StatusProvider } from "./context/status-context";


const mulish = localFont({
  src: "./fonts/mulish.ttf",
  variable: "--font-mulish",
  weight: "400",
});
const mulishSemi = localFont({
  src: "./fonts/Mulish-SemiBold.ttf",
  variable: "--font-mulish-semi",
  weight: "600",
});
const mulishBold = localFont({
  src: "./fonts/Mulish-Black.ttf",
  variable: "--font-mulish-bold",
  weight: "800",
});


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  
  return (
    <html lang="en">
       <head>
        <title>DaxApp</title>
        
        <meta name='description' content='Chat App by Dax' />
      </head>
      <body
        className={`${mulish.variable} ${mulishSemi.variable}  ${mulishBold.variable} antialiased font-[family-name:var(--font-mulish-semi)]`}
      >
<Provider store={store}>
        <UserProvider>
          <StatusProvider>
          <DashboardProvider>
        <Header/>
        {children}
        <Footer/>
        </DashboardProvider>
        </StatusProvider>
        </UserProvider>
        </Provider>
      </body>
    </html>
  );
}
