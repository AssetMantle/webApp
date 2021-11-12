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
    background: ${({theme}) => theme.backgroundColor};
    font-family: ${({theme}) => theme.fontFamily}
  }

  .bg-dark, .app-nav {
    background: ${({theme}) => theme.backgroundColor} !important;
    box-shadow: ${({theme}) => theme.navigationShadow} !important;
  }

  .modal-content {
    background-color: ${({theme}) => theme.signupBackground};
    color: ${({theme}) => theme.textContentColor};
  }

  .modal-header {
    border-bottom: 1px solid ${({theme}) => theme.modalHeaderBorderColor} !important;
  }
  .modal-footer{
    border-top: 1px solid ${({theme}) => theme.modalHeaderBorderColor} !important;
  }
  
  .navbar-brand a {
    color: ${({theme}) => theme.textSecondaryColor};
  }

  .navbar-dark .navbar-nav .nav-link {
    color: ${({theme}) => theme.textSecondaryColor};
  }

.navbar-dark .navbar-nav .active>.nav-link, .navbar-dark .navbar-nav .nav-link.active, .navbar-dark .navbar-nav .nav-link.show, .navbar-dark .navbar-nav .show>.nav-link,
.navbar-dark .navbar-nav .nav-link:focus, .navbar-dark .navbar-nav .nav-link:hover{
  color: ${({theme}) => theme.textPrimaryColor};
    }
  label, .page-title, .title {
    color: ${({theme}) => theme.textSecondaryColor};
  }

  .card {
    background-color: ${({theme}) => theme.signupBackground};
    color: ${({theme}) => theme.textContentColor};
  }

  .footer {
    background-color: ${({theme}) => theme.footerBg};
    color: ${({theme}) => theme.textContentColor};
  }

  .footer label{
    color: ${({theme}) => theme.textContentColor};
  }
  
  .form-control {
    background-color: ${({theme}) => theme.inputFieldBackground} !important;
    border: 1px solid ${({theme}) => theme.inputFieldBorderColor} !important;
    color: ${({theme}) => theme.inputFieldTextColor};
  }

  .form-control:focus {
    background-color: ${({theme}) => theme.inputFieldBackground} !important;
    border: 1px solid ${({theme}) => theme.inputFieldBorderColor} !important;
    box-shadow: 0 0 0 0.2rem ${({theme}) => theme.formControlShadow};
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
    color: ${({theme}) => theme.textPrimaryColor};
  }

  .banner-content {
    color: ${({theme}) => theme.textContentColor};
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
 
  .content-section .accountInfo .col-md-9.card-deck {
    background: ${({theme}) => theme.cardSectionBg};
  }
  .list-item .list-item-label, .list-item-value{
    color: ${({theme}) => theme.textContentColor};
  }
  .dropdown-menu{
    background-color: ${({theme}) => theme.navDropdownMenuBg};
  }
  .dropdown-item{
    color: ${({theme}) => theme.navDropdownColor};
  }
  .sub-title{
    color: ${({theme}) => theme.textSecondaryColor};
  }
  .provision-address{
    color: ${({theme}) => theme.provisionAddressColor};
  }
  .btn-secondary{
    background: ${({theme}) => theme.buttonSecondaryBg};
    color: ${({theme}) => theme.buttonSecondaryColor};
  }
  .button-view{
   background: ${({theme}) => theme.primaryButtonBackground};
    border: 1px solid ${({theme}) => theme.buttonViewSecondBorder};
  }
  .mnemonic-login-section.login-section .button-view{
    background: ${({theme}) => theme.primaryButtonBackground};
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
    color: ${({theme}) => theme.textSecondaryColor};
  }
  // .copy-section p{
  //   background: ${({theme}) => theme.copyBackground};
  // }
  .profile-dropdown-menu{
  color: ${({theme}) => theme.listItemColor};
  }
  .profile-dropdown-menu .add-id, .profile-dropdown-menu .logout{
   border-top: 1px solid ${({theme}) => theme.modalHeaderBorderColor} !important;
  }
  .option-box{
  background: ${({theme}) => theme.signupBackground};
   border: 1px solid ${({theme}) => theme.modalHeaderBorderColor}
  }
  .view-container .asset-category{
    color:${({theme}) => theme.textContentColor};
  }
  .view-container .asset-name{
    color:${({theme}) => theme.textPrimaryColor};
  }
   .view-container .asset-description{
    color:${({theme}) => theme.textContentColor};
  }
  .view-container .asset-price{
    color:${({theme}) => theme.textContentColor};
  }
  
  .properties-container{
    background: ${({theme}) => theme.signupBackground};
    border-right: 1px solid ${({theme}) => theme.modalHeaderBorderColor};
    border-bottom: 1px solid ${({theme}) => theme.modalHeaderBorderColor};
    border-left: 1px solid ${({theme}) => theme.modalHeaderBorderColor};
  }
  .properties-container .header{
   background: ${({theme}) => theme.signupBackground};
   border-top: 1px solid ${({theme}) => theme.modalHeaderBorderColor} !important;
  }
  .properties-container .body{
    background: ${({theme}) => theme.signupBackground};
     border-top: 1px solid ${({theme}) => theme.modalHeaderBorderColor} !important;
  }
  .mint-page-body .right-content .preview-container{
    background: ${({theme}) => theme.signupBackground};
    border: 1px solid ${({theme}) => theme.modalHeaderBorderColor} !important;
  }
  .preview-content{
   color:${({theme}) => theme.textContentColor};
  }
  .accountInfo .assets-tab.nav-tabs .nav-link{
     color:${({theme}) => theme.tabItemColor};
     background: ${({theme}) => theme.tabItemBackground};
  }
  .accountInfo .assets-tab.nav-tabs .nav-link.nav-link.active{
    color:${({theme}) => theme.tabItemActiveColor};
     background: ${({theme}) => theme.tabItemActiveBackground};
  }
  .form-control:disabled, .form-control[readonly]{
    color:${({theme}) => theme.disabledInputColor} !important;
     background: ${({theme}) => theme.disabledInputBg} !important;
  }
  .view-container .image-section{
   background: ${({theme}) => theme.imageSectionBg};
  }
  .navbar-dark .nav-link.active::after, .navbar-dark .navbar-nav .nav-link:hover::after{
  background: ${({theme}) => theme.primaryButtonBackground};
  }
 .profile-dropdown-menu .address-list .address-item.active, 
 .dropdown-item.active, .dropdown-item:active
 {
      color:${({theme}) => theme.activeDropDownColor} !important;
       background: ${({theme}) => theme.activeDropDownBg} !important;
 }
 ::-webkit-scrollbar-thumb {
   background: ${({theme}) => theme.scrollBarBg};
}
.signup-section .button-signup:hover{
  border: 1px solid ${({theme}) => theme.inputFieldBorderColor} !important;
box-shadow: 0 0 0 0.2rem ${({theme}) => theme.formControlShadow};
}
`;

