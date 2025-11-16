import React from 'react'
import Nav from "../../client/components/Navbar"
export default function Layout({ children }) {
  return (
    <html lang="en">
      <body>
         <Nav/>
        {children}
      </body>
    </html>
  );
}
