import React from 'react';
import { useDarkMode } from './darkmode/useDarkMode';
import { lightTheme, darkTheme } from './darkmode/theme';
import { GlobalStyles } from './darkmode/global';
import { ThemeProvider } from 'styled-components';
const Footer = () => {
    const [theme, toggleTheme, componentMounted] = useDarkMode();
    const themeMode = theme === 'light' ? lightTheme : darkTheme;
    return (
        <ThemeProvider theme={themeMode}>
                <GlobalStyles />
        <div className="footer">
             <button onClick={toggleTheme}>{theme === 'light' ? 'DarkMode' :'LightMode'}</button>
            <p className="footer_left"> © 2020
                <span className="link_color"> AssetDapp</span>
            </p>
        </div>
        </ThemeProvider>
    );
};

export default Footer;
