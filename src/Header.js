import React from 'react'

//const Header = (props) => { // uvodi props
const Header = ({ title }) => {

  // const headerStyle = {
  //   backgroundColor: 'mediumblue',
  //   color: '#fff'
  // };

  return (
    // <header style={headerStyle}>
    // u h1 uvodimo title iz parent componente <Header /> koja se nalazi u props
    <header>
      {/* <h1>{props.title}</h1>  */}
      <h1>{title}</h1>
    </header>
  )
}

Header.defaultProps = {
  title: "Default Title"
}

export default Header;
