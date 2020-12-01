import React from 'react';
import {useDarkMode} from './darkmode/useDarkMode';
import {lightTheme, darkTheme} from './darkmode/theme';
import {GlobalStyles} from './darkmode/global';
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
                <button onClick={toggleTheme}>{theme === 'light' ? 'DarkMode' : 'LightMode'}</button>
                <p className="footer_left"> © 2020
                    <span className="link_color">{t("APP_TITLE")}</span>
                </p>
            </div>
        </ThemeProvider>
    );
};

export default Footer;
