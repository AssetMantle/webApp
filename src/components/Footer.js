import React from 'react';
import {useDarkMode} from './darkmode/useDarkMode';
import {lightTheme, darkTheme} from './darkmode/theme';
import {GlobalStyles} from './darkmode/global';
import {Form} from "react-bootstrap";
import {ThemeProvider} from 'styled-components';
import {useTranslation} from "react-i18next";

const Footer = () => {
    const {t} = useTranslation();
    const [theme, toggleTheme, componentMounted] = useDarkMode();
    const themeMode = theme === 'light' ? lightTheme : darkTheme;
    return (
        <ThemeProvider theme={themeMode}>
            <GlobalStyles/>
            <div className="footer">
                {/*<Form.Check*/}
                {/*    custom*/}
                {/*    onChange={toggleTheme}*/}
                {/*    type="switch"*/}
                {/*    id="custom-switch"*/}
                {/*    checked={theme === 'light' ? true : false}*/}
                {/*    label={theme === 'light' ? 'LightMode' : 'DarkMode'}*/}
                {/*/>*/}
                <p className="footer_left"> © {new Date().getFullYear()}
                    <span className="link_color"> {t("APP_TITLE")}</span>
                </p>
            </div>
        </ThemeProvider>
    );
};

export default Footer;
