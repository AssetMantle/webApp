import { createGlobalStyle } from 'styled-components';

export const GlobalStyles = createGlobalStyle`
  *,
  *::after,
  *::before {
    box-sizing: border-box;
  }
html{
  height:100%;
}
  body {
    align-items: center;
    background: ${({ theme }) => theme.body};
    color: ${({ theme }) => theme.text};
    font-family: 'Montserrat', sans-serif;
    height: 100%;
  }
  .bg-dark, .app-nav {
    background-color: ${({ theme }) => theme.navbg} !important;
}
.signup-box{
background-color:${({ theme }) => theme.signupbg}
}
.modal-content{
  background-color:${({ theme }) => theme.signupbg}
}
.modal-header{
  border-bottom:1px solid ${({ theme }) => theme.modalHeaderBorderColor} !important;
}
.navbar-brand a{
      color:#fff;
}
.navbar-dark .navbar-nav .nav-link {
  color:${({ theme }) => theme.navLinkColor};
}
.card{
  background-color:${({ theme }) => theme.signupbg}
}
.footer{
  background-color: ${({ theme }) => theme.navbg};
  color:${({ theme }) => theme.navLinkColor};
}
  `;

