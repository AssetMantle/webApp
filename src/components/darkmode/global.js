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
    font-family: ${({theme}) => theme.fontFamily}
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
  .modal-footer{
    border-top: 1px solid ${({theme}) => theme.modalHeaderBorderColor} !important;
  }
  .navbar-brand a {
    color: ${({theme}) => theme.navLinkColor};
  }

  .navbar-dark .navbar-nav .nav-link {
    color: ${({theme}) => theme.navLinkColor};
  }

  label {
    color: ${({theme}) => theme.labelColor};
  }

  .card {
    background-color: ${({theme}) => theme.CardBgColor};
    color: ${({theme}) => theme.cardTextColor};
  }

  .footer {
    background-color: ${({theme}) => theme.navigationBackground};
    color: ${({theme}) => theme.ActiveNavLinkColor};
  }

  .footer label{
    color: ${({theme}) => theme.ActiveNavLinkColor};
  }
  .form-control {
    background-color: ${({theme}) => theme.inputFieldBackground} !important;
    border: 1px solid ${({theme}) => theme.inputFieldBorderColor} !important;
    color: ${({theme}) => theme.inputFieldTextColor};
  }

  .form-control:focus {
    background-color: ${({theme}) => theme.inputFieldBackground} !important;
    border: 1px solid ${({theme}) => theme.inputFieldBorderColor} !important;
    box-shadow: 0 0 0 0.2rem #efcb3057;
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
  .dropdown-section{
    background-color: ${({theme}) => theme.dropDownSectionBgColor};
  }
  .dropdown-section h4{
    color: ${({theme}) => theme.modalHeaderColor};
  }
  .side-bar{
    background-color: ${({theme}) => theme.sideBarBackgroundColor};
  }
  .content-section .accountInfo .col-md-9.card-deck {
    background: ${({theme}) => theme.cardSectionBg};
  }
  .list-item .list-item-label, .list-item-value{
    color: ${({theme}) => theme.listItemColor};
  }
  .dropdown-menu{
    background-color: ${({theme}) => theme.navDropdownMenuBg};
  }
  .dropdown-item{
    color: ${({theme}) => theme.navDropdownColor};
  }
  .sub-title{
    color: ${({theme}) => theme.subTitleColor};
  }
  .provision-address{
    color: ${({theme}) => theme.provisionAddressColor};
  }
  .btn-secondary{
    background: ${({theme}) => theme.buttonSecondaryBg};
    color: ${({theme}) => theme.buttonSecondaryColor};
  }
  .button-view{
    background: ${({theme}) => theme.buttonViewBg};
    border: 1px solid ${({theme}) => theme.buttonViewBorder};
  }
  .mnemonic-login-section.login-section .button-view{
    background: ${({theme}) => theme.buttonViewSecondBg};
    border: 1px solid ${({theme}) => theme.buttonViewSecondBorder};
  }
  .btn-primary:not(:disabled):not(.disabled).active,
  .btn-primary:not(:disabled):not(.disabled):active,
  .show > .btn-primary.dropdown-toggle,
  .btn-primary, .btn-primary:hover {
    border-color: ${({theme}) => theme.primaryButtonBorderColor};
  }
  .button-double-border{
    box-shadow: ${({theme}) => theme.buttonDoubleBorderColor};
  }

  .signup-section .private-key .key-download a{
    color: ${({theme}) => theme.downloadKeyColor};
  }
  .mnemonic-text{
    color: ${({theme}) => theme.mnemonicTextColor};
  }
  .dropdown-section .dropdown button, .dropdown-section .dropdown .show > .btn-success.dropdown-toggle{
    background: ${({theme}) => theme.dropDownButtonbg};
    color: ${({theme}) => theme.mnemonicTextColor};
    border-color: ${({theme}) => theme.dropDownButtonColor};
  }
  .copy-section .copy-result span{
    color: ${({theme}) => theme.copyResult};
  }
  .profile-section .card{
    background: ${({theme}) => theme.profileCardsBg};
  }
  .profile-section .ledger-box{
    background: ${({theme}) => theme.profileCardsBg};
    border-color: ${({theme}) => theme.ledgerBoxBorder};
  }
  .profile-section .card .card-heading{
    color: ${({theme}) => theme.ledgerBoxHeadingColor};
  }
  .profile-section .ledger-box .heading{
    color: ${({theme}) => theme.ledgerBoxHeadingColor};
  }
  .back-arrow{
    color: ${({theme}) => theme.mnemonicTextColor};
  }
  .icon-copy-icon, .icon-arrow-icon{
    fill: ${({theme}) => theme.copyIconColor};;
  }
  .sub-title {
    border-color: ${({theme}) => theme.subTitleBorderColor} !important;
    color: ${({theme}) => theme.subTitleColor};
  }
  .copy-section p{
    background: ${({theme}) => theme.copyBackground};
  }
  .profile-dropdown-menu{
  color: ${({theme}) => theme.listItemColor};
  }
  .profile-dropdown-menu .add-id, .profile-dropdown-menu .logout{
   border-top: 1px solid ${({theme}) => theme.modalHeaderBorderColor} !important;
  }
`;

