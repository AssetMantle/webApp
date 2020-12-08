import {createGlobalStyle} from 'styled-components';

export const GlobalStyles = createGlobalStyle`
  *,
  *::after,
  *::before {
    box-sizing: border-box;
  }

  html {
    height: 100%;
  }

  body {
    align-items: center;
    background: ${({theme}) => theme.body};
    color: ${({theme}) => theme.text};
    font-family: ${({theme}) => theme.fontFamily}
    height: 100%;
  }

  .bg-dark, .app-nav {
    background-color: ${({theme}) => theme.navigationBackground} !important;
  }

  .signup-box {
    background-color: ${({theme}) => theme.signupBackground}
  }

  .modal-content {
    background-color: ${({theme}) => theme.signupBackground};
    color: ${({theme}) => theme.cardTextColor};
  }

  .modal-header {
    border-bottom: 1px solid ${({theme}) => theme.modalHeaderBorderColor} !important;
  }

  .navbar-brand a {
    color: ${({theme}) => theme.navLinkColor};
  }

  .navbar-dark .navbar-nav .nav-link {
    color: ${({theme}) => theme.navLinkColor};
  }
  label{
    color: ${({theme}) => theme.cardTextColor};
  }
  .card {
    background-color: ${({theme}) => theme.signupBackground};
    color: ${({theme}) => theme.cardTextColor};
  }

  .footer {
    background-color: ${({theme}) => theme.navigationBackground};
    color: ${({theme}) => theme.navLinkColor};
  }

  .form-control {
    background-color: ${({theme}) => theme.inputFieldBackground};
    border: 1px solid ${({theme}) => theme.inputFieldBorderColor};
    color: ${({theme}) => theme.inputFieldTextColor};
  }

  .form-control:focus {
    background-color: ${({theme}) => theme.inputFieldBackground};
    border: 1px solid ${({theme}) => theme.inputFieldBorderColor};
  }

  .close {
    color: ${({theme}) => theme.modalCloseIconColor};
  }

  .Tabs {
    background: ${({theme}) => theme.tabBackground};
  }

  .nav-tabs {
    border-bottom: 1px solid ${({theme}) => theme.tabBackground};
  }

  .nav-tabs .nav-link:hover {
    border-color: ${({theme}) => theme.tabNavLinkBorderColor};
  }

  .nav-tabs .nav-link.active {
    color: ${({theme}) => theme.tabActiveNavLinkColor};
    background: ${({theme}) => theme.tabBackground};
  }

  .banner-heading {
    color: ${({theme}) => theme.bannerHeadingColor};
  }

  .banner-content {
    color: ${({theme}) => theme.bannerContentColor};
  }

  .modal-header {
    color: ${({theme}) => theme.modalHeaderColor};
  }

  .btn-primary:not(:disabled):not(.disabled).active:focus, 
  .btn-primary:not(:disabled):not(.disabled):active:focus, 
  .show > .btn-primary.dropdown-toggle:focus, 
  .btn-primary.focus, .btn-primary:focus,
  .btn-primary:not(:disabled):not(.disabled).active,
  .btn-primary:not(:disabled):not(.disabled):active,
  .show > .btn-primary.dropdown-toggle,
  .btn-primary, .btn-primary:hover,
  .signup-section .button-signup:hover {
    background-color: ${({theme}) => theme.primaryButtonBackground};
    color: ${({theme}) => theme.primaryButtonColor};
  }
`;

